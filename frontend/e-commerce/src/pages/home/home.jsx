import React from "react";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "../../Redux/products/productApi";
const HomeProducts = () => {
  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger text-center my-5" role="alert">
        {error?.data?.message ||
          "Failed to load products. Please try again later."}
      </div>
    );
  }
  console.log(products.products);
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-light text-uppercase tracking-wider">
        New Arrivals
      </h2>
      <div className="row">
        {products?.products &&
        Array.isArray(products.products) &&
        products.products.length > 0 ? (
          products.products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={(p) => console.log("Added:", p.title)}
            />
          ))
        ) : (
          <div className="text-center">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;
