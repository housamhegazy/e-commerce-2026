import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const allowedBaseUrls = import.meta.env.VITE_API_URL;

export const cartApi = createApi({
  reducerPath: "cartApi",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({
    baseUrl: allowedBaseUrls,
    credentials: "include",
    // 👇 إضافة التوكن من الـ state في كل طلب
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // تأكد إن المسار ده صح حسب الـ authSlice عندك
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `/api/cart/my-cart`,
      providesTags: ["Cart"], // تبسيط الـ Tags هنا أفضل للسلة كاملة
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/api/cart/add-to-cart/${productId}`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/api/cart/update-quantity/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteFromCart: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/delete-product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteFromCartMutation,
} = cartApi;