import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar"; // تأكد من المسار الصحيح للسايدبار

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
const { items } = useSelector((state) => state.products);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ backgroundColor: "#1a202c", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container">
          {/* 1. اللوجو */}
          <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">
            SM<span className="text-white">STORE</span>
          </Link>

          {/* 2. روابط الشاشة الكبيرة (اختياري) */}
          <div className="collapse navbar-collapse d-none d-lg-block">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-4">
              <li className="nav-item">
                <Link className="nav-link text-white-50 hover-text-white" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white-50" to="/shop">Shop</Link>
              </li>
            </ul>
          </div>

          {/* 3. أيقونات التحكم (سلة + منيو) */}
          <div className="d-flex align-items-center gap-3">
            {/* أيقونة السلة */}
            <Link to="/cart" className="position-relative text-white border-0 bg-transparent">
              <i className="bi bi-cart3 fs-4"></i>
              {items?.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: "0.7rem" }}>
                  {items.length}
                </span>
              )}
            </Link>

            {/* أيقونة اليوزر (تظهر فقط لو مسجل دخول كاختصار سريع) */}
            {isAuthenticated && (
              <Link to="/profile" className="text-white d-none d-sm-block ms-2">
                <i className="bi bi-person-circle fs-4"></i>
              </Link>
            )}

            {/* زرار المنيو اللي بيفتح السايدبار */}
            <button 
              className="btn text-white p-2 ms-2 rounded-circle border-0" 
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              onClick={toggleSidebar}
            >
              <i className="bi bi-list fs-3"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* استدعاء السايدبار هنا عشان يكون موجود في كل الصفحات */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;