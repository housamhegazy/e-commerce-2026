import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart, deleteItem, clearCart } from "../../Redux/products/cartSlice";

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="py-5">
          <i className="bi bi-cart-x display-1 text-secondary opacity-25"></i>
          <h2 className="mt-4 fw-bold">Your cart is empty!</h2>
          <p className="text-secondary">Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-warning mt-3 px-4 fw-bold">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 text-white">
      <h2 className="fw-bold mb-4">Shopping <span className="text-warning">Cart</span></h2>
      
      <div className="row g-4">
        {/* قائمة المنتجات */}
        <div className="col-lg-8">
          {items.map((item,index) => (
            <div key={index} className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: "#2d3748" }}>
              <div className="card-body p-3">
                <div className="row align-items-center g-3">
                  <div className="col-4 col-md-2 text-center">
                    <img src={item.image} alt={item.title} className="img-fluid rounded-3" style={{ maxHeight: "80px" }} />
                  </div>
                  <div className="col-8 col-md-4">
                    <h6 className="mb-1 text-white text-truncate">{item.title}</h6>
                    <span className="text-info fw-bold">${item.price}</span>
                  </div>
                  <div className="col-6 col-md-3 d-flex justify-content-center">
                    <div className="input-group input-group-sm" style={{ width: "100px" }}>
                      <button className="btn btn-outline-secondary text-white" onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                      <span className="form-control bg-transparent text-white text-center border-secondary">{item.quantity}</span>
                      <button className="btn btn-outline-secondary text-white" onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}>+</button>
                    </div>
                  </div>
                  <div className="col-4 col-md-2 text-center">
                    <span className="fw-bold">${item.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="col-2 col-md-1 text-end">
                    <button className="btn btn-link text-danger p-0" onClick={() => dispatch(deleteItem(item.id))}>
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button className="btn btn-outline-danger btn-sm mt-3" onClick={() => dispatch(clearCart())}>
            <i className="bi bi-trash me-2"></i>Clear Cart
          </button>
        </div>

        {/* ملخص الدفع */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg p-4 h-100" style={{ backgroundColor: "#1a202c", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h5 className="fw-bold mb-4 border-bottom border-secondary pb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-3 text-secondary">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-secondary">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">Total</span>
              <span className="fs-5 fw-bold text-warning">${totalAmount.toFixed(2)}</span>
            </div>
            <button className="btn btn-warning btn-lg w-100 fw-bold py-3 shadow-sm">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;