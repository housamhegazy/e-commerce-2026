import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// 👇 استيراد الـ action creators الخاصة بالسلة
import {
  addToCart,
  removeFromCart,
  deleteItem,
  clearCart,
} from "../../Redux/products/cartSlice";
// 👇 استيراد الـ hook الخاص بجلب بيانات السلة
import { useGetCartQuery,useUpdateCartMutation,useDeleteFromCartMutation } from "../../Redux/cart/cartApi.js";

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  // 1. جلب بيانات السلة من الـ API (لو المستخدم مش مسجل دخول)
  const { items = [], totalAmount = 0 } = useSelector((state) => state.products || {});

  // 1. جلب بيانات السلة من الـ API (لو المستخدم مسجل دخول)
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !user,
  });

  // 2. توحيد مصدر البيانات (Safe Access)
  // الـ API غالباً بترجع كائن جواه سلة: cartData.cart.items
  const apiItems = cartData?.items || [];
  const apiTotal = cartData?.totalPrice || 0;

  const itemsToDisplay = user ? apiItems : items;
  const totalAmountToDisplay = user ? apiTotal : totalAmount;

  // update cart mutation
  const [updateCart] = useUpdateCartMutation();

  const handleUpdateCart = (productId, quantity) => {
    if (user) {
      updateCart({ productId, quantity });
    } else {
      dispatch(addToCart({ productId, quantity }));
    }
  };

  // delete from cart mutation
  const [deleteFromCart] = useDeleteFromCartMutation();

  const handleDeleteFromCart = (productId) => {
    const idToSend = productId?._id || productId;
    if (user) {
      deleteFromCart(idToSend);
    } else {
      dispatch(deleteItem(idToSend));
    }
  };

  if (isCartLoading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-warning" role="status"></div>
        <h2 className="mt-4 fw-bold">Loading your cart...</h2>
      </div>
    );
  }

  if (itemsToDisplay.length === 0) {
    return (
      <div className="container py-5 text-center text-white">
        <i className="bi bi-cart-x display-1 opacity-25"></i>
        <h2 className="mt-4 fw-bold">Your cart is empty!</h2>
        <Link to="/" className="btn btn-warning mt-3">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-white">
      <h2 className="fw-bold mb-4">Shopping <span className="text-warning">Cart</span></h2>
      <div className="row g-4">
        <div className="col-lg-8">
          {itemsToDisplay.map((item, index) => {
            // 3. حل مشكلة الـ toFixed: بنجهز البيانات قبل الرندر
            const currentId = item.productId?._id || item.productId || item._id;
            const currentTitle = item.productId?.title || item.title || "Product";
            const currentImage = item.productId?.images?.[0]?.url || item.image;
            const currentPrice = item.price || 0;
            const currentQty = item.quantity || 0;
            const currentTotal = item.totalPrice || (currentPrice * currentQty);

            return (
              <div key={currentId || index} className="card mb-3 border-0" style={{ backgroundColor: "#2d3748" }}>
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img src={currentImage} className="img-fluid rounded" style={{ maxHeight: "80px" }} alt="" />
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-truncate">{currentTitle}</h6>
                      <span className="text-info">${currentPrice}</span>
                    </div>
                    <div className="col-md-3">
                      <div className="input-group input-group-sm">
                        <button className="btn btn-outline-light" onClick={() => handleUpdateCart(currentId, currentQty - 1)}>-</button>
                        <span className="form-control bg-transparent text-white text-center">{currentQty}</span>
                        <button className="btn btn-outline-light" onClick={() => handleUpdateCart(currentId, currentQty + 1)}>+</button>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      {/* 👇 هنا ضمنا إن الرقم موجود دائماً قبل الـ toFixed */}
                      <span className="fw-bold">${Number(currentTotal).toFixed(2)}</span>
                    </div>
                    <div className="col-md-1 text-end">
                      <button className="btn text-danger" onClick={() => handleDeleteFromCart(currentId)}>
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ملخص الدفع */}
        <div className="col-lg-4">
          <div className="card p-4" style={{ backgroundColor: "#1a202c" }}>
            <h5 className="border-bottom pb-3">Order Summary</h5>
            <div className="d-flex justify-content-between my-3">
              <span>Total</span>
              <span className="text-warning fs-5"> ${Number(totalAmountToDisplay).toFixed(2)} </span>
            </div>
            <button className="btn btn-warning w-100 fw-bold">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
