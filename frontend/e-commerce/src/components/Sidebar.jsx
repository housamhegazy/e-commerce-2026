import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSignOutMutation } from "../Redux/user/userApi";
import { clearAuthUser } from "../Redux/user/authSlice";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.products);
  const [signOut] = useSignOutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    dispatch(clearAuthUser());
    toggleSidebar();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay - خلفية شفافة عند فتح السايدبار */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" 
          style={{ zIndex: 1040 }}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <div 
        className={`position-fixed top-0 end-0 h-100 shadow-lg transition-all ${isOpen ? 'translate-middle-x' : ''}`}
        style={{
          width: "300px",
          backgroundColor: "#1a202c",
          zIndex: 1050,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "0.3s ease-in-out",
          color: "white"
        }}
      >
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h4 className="fw-bold mb-0 text-warning">Menu</h4>
            <button className="btn text-white p-0" onClick={toggleSidebar}>
              <i className="bi bi-x-lg fs-4"></i>
            </button>
          </div>

          <ul className="nav flex-column gap-3">
            {/* 1. الكارت (دائماً موجود) */}
            <li className="nav-item">
              <Link to="/cart" className="nav-link text-white d-flex justify-content-between align-items-center p-3 rounded bg-secondary bg-opacity-10" onClick={toggleSidebar}>
                <span><i className="bi bi-cart3 me-3"></i>My Cart</span>
                <span className="badge bg-warning text-dark">{items?.length || 0}</span>
              </Link>
            </li>

            <hr className="border-secondary opacity-25" />

            {/* 2. التحكم بناءً على حالة تسجيل الدخول */}
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-white p-3" onClick={toggleSidebar}>
                    <i className="bi bi-box-arrow-in-right me-3"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link btn btn-warning text-dark fw-bold mx-3 mt-2" onClick={toggleSidebar}>
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-white p-3" onClick={toggleSidebar}>
                    <i className="bi bi-person-circle me-3"></i>Profile ({isAuthenticated ? user?.name : ""})
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/wishlist" className="nav-link text-white p-3" onClick={toggleSidebar}>
                    <i className="bi bi-heart me-3"></i>Wishlist
                  </Link>
                </li>
                <li className="nav-item mt-5">
                  <button className="nav-link text-danger p-3 border-0 bg-transparent" onClick={handleLogout}>
                    <i className="bi bi-power me-3"></i>Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;