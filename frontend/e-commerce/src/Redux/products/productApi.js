// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// @ts-ignore
const allowedBaseUrls = import.meta.env.VITE_API_URL;
// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Product"],
  baseQuery: fetchBaseQuery({
    baseUrl: allowedBaseUrls,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `/api/products/all-products`,
      providesTags: (result, error, productId) => [
        { type: "Product", productId },
      ],
    }),
    getProductDetails: builder.query({
      query: (productId) => `/api/products/product-details/${productId}`,
    providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/api/products/wishlist/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    //add review
    addReview:builder.mutation({
      query:({productId, star,comment})=>({
        url:`/api/products/rate-product/${productId}`,
        method:"PUT",
        body:{ star,comment}
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId }
      ],
    }),
  }),
});
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAddToWishlistMutation,
  useAddReviewMutation
} = productApi;
