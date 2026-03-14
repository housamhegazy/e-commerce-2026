import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./user/authSlice"; 
import { userApi } from "./user/userApi";
import { productApi } from "./products/productApi";
import { cartApi } from "./cart/cartApi";
// 👇 الخطأ كان هنا.. لازم تعمل Import للريديوسر بتاع الكارت
import cartReducer from "./products/cartSlice"; 

export const store = configureStore({
  reducer: {
    // 1. السلايس المسؤول عن الكارت والبيانات المحلية
    // تأكد إن الاسم 'products' هو اللي بتستخدمه في useSelector((state) => state.products)
    products: cartReducer, 

    // 2. الريديوسرز الخاصة بالـ APIs (للكاش)
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,

    // 3. السلايس الخاص بالملف الشخصي
    auth: authReducer, 
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware),
});

setupListeners(store.dispatch);