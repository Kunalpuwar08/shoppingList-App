import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

interface ShoppingState {
  list: ShoppingItem[];
}

const initialState: ShoppingState = {
  list: [],
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{name: string; quantity: number; unit: string}>,
    ) => {
      const {name, quantity, unit} = action.payload;
      state.list.push({
        id: Date.now(),
        name,
        quantity,
        unit,
        purchased: false,
      });
    },

    markPurchased: (state, action: PayloadAction<number>) => {
      const item = state.list.find(i => i.id === action.payload);
      if (item) item.purchased = !item.purchased;
    },

    editItem: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        quantity: number;
        unit: string;
      }>,
    ) => {
      const {id, name, quantity, unit} = action.payload;
      const item = state.list.find(i => i.id === id);
      if (item) {
        item.name = name;
        item.quantity = quantity;
        item.unit = unit;
      }
    },

    deleteItem: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(i => i.id !== action.payload);
    },
  },
});

export const {addItem, markPurchased, editItem, deleteItem} =
  shoppingListSlice.actions;
export default shoppingListSlice.reducer;
