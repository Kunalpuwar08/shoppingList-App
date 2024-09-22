import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: jest.fn(),
  };
});

jest.mock('react-native-animatable', () => ({
  View: jest.fn(({children}) => <>{children}</>),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');


jest.mock('redux-persist', () => ({
  persistStore: () => jest.fn(),
}));


describe('App component', () => {
  it('renders correctly', () => {
    const {getByText} = render(<App />);

    expect(getByText('List Of Data')).toBeTruthy();
  });
});
