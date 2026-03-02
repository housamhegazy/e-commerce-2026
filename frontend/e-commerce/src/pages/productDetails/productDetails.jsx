import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useAddToWishlistMutation,
} from "../../Redux/products/productApi.js";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { id } = useParams();
  // هنا data هترجع هي الـ product مباشرة بسبب الـ transformResponse
  const { data: product, isLoading, isError } = useGetProductDetailsQuery(id);
  const [addToWishlist, { isLoading: isWishlisting }] =
    useAddToWishlistMutation();
const { user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  //=============================================
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  //=============================================
  // const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-white">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );

  // التحقق من وجود المنتج
  if (isError || !product)
    return (
      <div className="alert alert-danger m-5 text-center">
        Product not found!
      </div>
    );

  // add to wishlist
  const addToWishListFuc = async () => {
    try {
       await addToWishlist(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  const isInWishlist = user?.wishlist?.includes(id);
  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* الصور */}
        <div className="col-md-6">
          <div
            className="card border-0 shadow-lg p-3"
            style={{ backgroundColor: "#2d3748" }}
          >
            <img
              src={product.images[selectedImage]?.url}
              className="img-fluid rounded-3 mb-3 object-fit-contain"
              alt={product.title}
              style={{ height: "400px", width: "100%" }}
            />
            <div className="d-flex gap-2 overflow-auto pb-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  className={`img-thumbnail bg-transparent border-2 ${selectedImage === index ? "border-warning" : "border-secondary"}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* المعلومات */}
        <div className="col-md-6 text-white">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li
                style={{ cursor: "pointer" }}
                className="breadcrumb-item"
                onClick={() => {
                  navigate("/");
                }}
              >
                Home
              </li>
              <li className="breadcrumb-item active text-warning">
                {product.category}
              </li>
            </ol>
          </nav>

          <h1 className="display-5 fw-bold mb-3">{product.title}</h1>
          <h2 className="text-info fw-bold mb-4">${product.price}</h2>
          <p className="lead text-secondary mb-4">{product.description}</p>

          {/* قسم حالة المخزون (Stock Status) */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-uppercase small fw-bold text-secondary mb-0">
                Availability:
              </h6>
              <span
                className={`badge ${product.stock > 10 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} px-3 py-2`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div
                className="stock-info p-3 rounded-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-secondary">
                    {product.stock <= 5 ? (
                      <span className="text-danger fw-bold animate-pulse">
                        <i className="bi bi-exclamation-triangle-fill me-1"></i>
                        Only {product.stock} units left!
                      </span>
                    ) : (
                      <span>Hurry up! Stock is limited</span>
                    )}
                  </span>
                  <span className="small text-white fw-bold">
                    {product.stock} items remaining
                  </span>
                </div>

                {/* شريط الستوك البصري */}
                <div
                  className="progress bg-dark"
                  style={{ height: "6px", borderRadius: "10px" }}
                >
                  <div
                    className={`progress-bar ${product.stock <= 5 ? "bg-danger" : "bg-info"}`}
                    role="progressbar"
                    style={{
                      width: `${(product.stock / 50) * 100}%`, // نفترض أن أقصى ستوك للعرض هو 50
                      borderRadius: "10px",
                      boxShadow:
                        product.stock <= 5
                          ? "0 0 8px rgba(220, 53, 69, 0.5)"
                          : "none",
                    }}
                    aria-valuenow={product.stock}
                    aria-valuemin="0"
                    aria-valuemax="50"
                  ></div>
                </div>
              </div>
            )}
          </div>
          {product.stock > 0 && (
            <div className="d-flex gap-3 align-items-center">
              <div className="input-group" style={{ width: "130px" }}>
                <button
                  className="btn btn-outline-secondary text-white"
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control bg-transparent text-white text-center border-secondary"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary text-white"
                  onClick={() =>
                    setQuantity((q) => (q < product.stock ? q + 1 : q))
                  }
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-warning btn-lg px-5 fw-bold"
                style={{ backgroundColor: "#f6ad55" }}
              >
                Add to Cart
              </button>
              {/* add to wishlist */}
              <button
                onClick={() => addToWishListFuc()}
                disabled={isWishlisting} // امنع الضغط المتكرر أثناء التحميل
                className="btn shadow-sm d-flex align-items-center justify-content-center"
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "12px",
                  backgroundColor: isInWishlist
                    ? "rgba(229, 62, 62, 0.1)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${isInWishlist ? "#e53e3e" : "rgba(255, 255, 255, 0.1)"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className={`bi ${isInWishlist ? "bi-heart-fill text-danger" : "bi-heart text-white"} fs-4`}
                ></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================== review section ====================================================================== */}
      <hr className="border-secondary opacity-10 my-5" />

      {/* قسم المراجعات المطور للدارك مود */}
      <div className="row g-4 mt-2">
        {/* ملخص التقييمات الجانبي */}
        <div className="col-md-4">
          <div
            className="p-4 rounded-4 shadow-lg border border-secondary border-opacity-10 h-100"
            style={{
              backgroundColor: "rgba(45, 55, 72, 0.4)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h4 className="fw-bold mb-4 text-white">Customer Reviews</h4>

            <div className="d-flex align-items-baseline mb-1">
              <span className="display-4 fw-bold text-white me-2">
                {product.averageRating}
              </span>
              <span className="text-secondary">out of 5</span>
            </div>

            <div className="text-warning fs-5 mb-3">
              {"★".repeat(Math.floor(product.averageRating))}
              {"☆".repeat(5 - Math.floor(product.averageRating))}
            </div>

            <p className="text-secondary small mb-4">
              <i className="bi bi-people-fill me-2"></i>
              Based on {product.ratings?.length || 0} global ratings
            </p>

            {/* أشرطة التقدم بتصميم الدارك مود */}
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                product.ratings?.filter((r) => r.star === star).length || 0;
              const percentage =
                product.ratings?.length > 0
                  ? (count / product.ratings.length) * 100
                  : 0;

              return (
                <div key={star} className="d-flex align-items-center mb-3">
                  <span
                    className="text-secondary small me-3"
                    style={{ width: "45px" }}
                  >
                    {star} star
                  </span>
                  <div
                    className="progress flex-grow-1 border border-secondary border-opacity-10"
                    style={{
                      height: "10px",
                      backgroundColor: "#1a202c",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="progress-bar bg-warning shadow-sm"
                      style={{
                        width: `${percentage}%`,
                        transition: "width 1s ease-in-out",
                        boxShadow: "0 0 10px rgba(255, 193, 7, 0.3)",
                      }}
                    ></div>
                  </div>
                  <span
                    className="text-secondary small ms-3"
                    style={{ width: "35px" }}
                  >
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}

            {/* فورم إضافة تعليق بتصميم مدمج */}
            <div className="mt-5 pt-4 border-top border-secondary border-opacity-10">
              <h5 className="text-white mb-3 small fw-bold text-uppercase tracking-wider">
                Write a Review
              </h5>

              <div className="mb-3">
                <select
                  className="form-select form-select-sm bg-dark text-white border-secondary border-opacity-25 shadow-none p-2"
                  style={{ borderRadius: "8px" }}
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                >
                  <option value="5">★★★★★ (Excellent)</option>
                  <option value="4">★★★★☆ (Good)</option>
                  <option value="3">★★★☆☆ (Average)</option>
                  <option value="2">★★☆☆☆ (Fair)</option>
                  <option value="1">★☆☆☆☆ (Poor)</option>
                </select>
              </div>

              <textarea
                className="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none mb-3"
                rows="3"
                style={{ borderRadius: "8px", fontSize: "0.9rem" }}
                placeholder="What did you like or dislike?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              <button
                className="btn btn-warning w-100 fw-bold py-2 shadow-sm border-0"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#f6ad55",
                  color: "#1a202c",
                }}
              >
                Post Review
              </button>
            </div>
          </div>
        </div>

        {/* قائمة التعليقات - تصميم بطاقات شفافة */}
        <div className="col-md-8">
          <div className="ps-md-4">
            <h4 className="fw-bold mb-4 text-white d-flex align-items-center">
              Top Reviews
              <span className="badge bg-secondary bg-opacity-25 ms-3 fs-6 fw-normal text-secondary">
                Most Recent
              </span>
            </h4>

            {product.ratings?.length > 0 ? (
              product.ratings.map((rev, index) => (
                <div
                  key={index}
                  className="p-4 rounded-4 mb-3 border border-secondary border-opacity-10 shadow-sm"
                  style={{ backgroundColor: "rgba(45, 55, 72, 0.2)" }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="avatar-placeholder me-3 rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                        style={{
                          width: "40px",
                          height: "40px",
                          background:
                            "linear-gradient(45deg, #4a5568, #2d3748)",
                        }}
                      >
                        {rev.postedBy?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="fw-bold text-white">
                          {rev.postedBy?.name || "Verified Customer"}
                        </div>
                        <div
                          className="text-warning small"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {"★".repeat(rev.star)}
                          {"☆".repeat(5 - rev.star)}
                          <span className="ms-2 text-secondary fw-normal">
                            Verified Purchase
                          </span>
                        </div>
                      </div>
                    </div>
                    <small
                      className="text-secondary opacity-50"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                  </div>

                  <p
                    className="mb-0 lh-base"
                    style={{ color: "#cbd5e0", fontSize: "0.95rem" }}
                  >
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-5 rounded-4 border border-dashed border-secondary border-opacity-25 mt-4">
                <i className="bi bi-chat-square-quote text-secondary fs-1 opacity-25"></i>
                <p className="text-secondary mt-3">
                  Be the first person to share their experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
