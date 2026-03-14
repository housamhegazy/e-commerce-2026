import { createSlice } from "@reduxjs/toolkit";

// فانكشن مساعدة لتحديث الـ LocalStorage
const updateLocalStorage = (items, totalAmount, totalQuantity) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
  totalAmount: Number(localStorage.getItem("totalAmount")) || 0,
  totalQuantity: Number(localStorage.getItem("totalQuantity")) || 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      // نضمن إننا بنتعامل مع ID صح سواء كان اسمه id أو _id
      const itemId = newItem.id || newItem._id;
      const amountToAdd = Number(newItem.quantity) || 1; 

      const existingItem = state.items.find((item) => item.id === itemId);
      
      state.totalQuantity += amountToAdd;
      state.totalAmount += newItem.price * amountToAdd;

      if (!existingItem) {
        // إضافة منتج جديد تماماً للمصفوفة
        state.items.push({
          id: itemId,
          price: newItem.price,
          quantity: amountToAdd,
          totalPrice: newItem.price * amountToAdd,
          title: newItem.title,
          // تأمين مسار الصورة
          image: newItem.images?.[0]?.url || newItem.image || "" 
        });
      } else {
        // تحديث المنتج الموجود فعلياً
        existingItem.quantity += amountToAdd;
        existingItem.totalPrice += newItem.price * amountToAdd;
      }
      
      updateLocalStorage(state.items, state.totalAmount, state.totalQuantity);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;

        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }
      
      updateLocalStorage(state.items, state.totalAmount, state.totalQuantity);
    },

    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter((item) => item.id !== id);
      }
      
      updateLocalStorage(state.items, state.totalAmount, state.totalQuantity);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("totalQuantity");
    },
  },
});

export const { addToCart, removeFromCart, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;