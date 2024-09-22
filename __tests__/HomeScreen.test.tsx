import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {useDispatch, useSelector} from 'react-redux';
import HomeScreen from '../src/screens/HomeScreen';
import {addItem, markPurchased, deleteItem, editItem} from '../src/redux/shoppingListSlice';
import configureMockStore from 'redux-mock-store';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-native-animatable', () => ({
  View: jest.fn(({children}) => <>{children}</>),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({navigate: jest.fn()})),
}));

jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');


describe('HomeScreen Component', () => {
  let dispatch;
  let mockItems;

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    mockItems = [
      {id: 1, name: 'Milk', quantity: 2, unit: 'L', purchased: false},
      {id: 2, name: 'Bread', quantity: 1, unit: 'kg', purchased: false},
    ];
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        shoppingList: {
          list: mockItems,
        },
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the shopping list items', () => {
    const {getByText} = render(<HomeScreen />);

    expect(getByText('Name: Milk')).toBeTruthy();
    expect(getByText('Name: Bread')).toBeTruthy();
  });

  test('adds a new item to the list', () => {
    const {getByPlaceholderText, getByText, getByTestId} = render(<HomeScreen />);

    fireEvent.press(getByTestId('add-item-btn'));

    fireEvent.changeText(getByPlaceholderText('Item name'), 'Eggs');
    fireEvent.changeText(getByPlaceholderText('Quantity'), '12');
    fireEvent.changeText(getByPlaceholderText('Unit (e.g., kg, liters)'), 'pcs');

    fireEvent.press(getByText('Add Item'));

    expect(dispatch).toHaveBeenCalledWith(
      addItem({name: 'Eggs', quantity: 12, unit: 'pcs'}),
    );
  });

  test('edits an existing item', () => {
    const {getByText, getByPlaceholderText, getByTestId} = render(<HomeScreen />);

    fireEvent.press(getByTestId('edit-item-0'));

    fireEvent.changeText(getByPlaceholderText('Item name'), 'Milk Edited');
    fireEvent.changeText(getByPlaceholderText('Quantity'), '3');
    fireEvent.changeText(getByPlaceholderText('Unit (e.g., kg, liters)'), 'L');

    fireEvent.press(getByText('Save Changes'));

    expect(dispatch).toHaveBeenCalledWith(
      editItem({id: 1, name: 'Milk Edited', quantity: 3, unit: 'L'}),
    );
  });

  test('marks an item as purchased', () => {
    const {getByTestId} = render(<HomeScreen />);

    fireEvent.press(getByTestId('mark-purchased-0'));

    expect(dispatch).toHaveBeenCalledWith(markPurchased(1));
  });

  test('deletes an item from the list', async () => {
    const {getByTestId} = render(<HomeScreen />);

    fireEvent.press(getByTestId('delete-item-0'));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(deleteItem(1));
    });
  });

  test('displays modal when adding an item', () => {
    const {getByTestId, queryByText} = render(<HomeScreen />);

    expect(queryByText('Add New Item')).toBeNull();

    fireEvent.press(getByTestId('add-item-btn'));

    expect(queryByText('Add New Item')).toBeTruthy();
  });

  test('cancels adding an item', () => {
    const {getByText, getByTestId, queryByText} = render(<HomeScreen />);

    fireEvent.press(getByTestId('add-item-btn'));

    fireEvent.press(getByText('Cancel'));

    expect(queryByText('Add New Item')).toBeNull();
  });
});
