import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column text-center px-3" 
         style={{
           backgroundColor: "#1a202c",
           color: "white"
         }}>
      
      {/* رقم الخطأ بتصميم ضخم وجذاب */}
      <h1 className="display-1 fw-bold text-accent mb-0" style={{ fontSize: "clamp(6rem, 15vw, 10rem)", opacity: 0.8 }}>
        404
      </h1>
      
      {/* أيقونة تعبيرية */}
      <div className="mb-4">
        <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "3rem" }}></i>
      </div>

      <h2 className="fw-bold mb-3">Oops! Page Not Found</h2>
      
      <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: "500px" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* زرار العودة للمنزل */}
      <Link to="/" className="btn btn-accent btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg transition">
        <i className="bi bi-house-door-fill me-2"></i> Back to Home
      </Link>

      {/* لمسة جمالية خلفية */}
      <div className="position-absolute top-50 start-50 translate-middle w-100 h-100" 
           style={{ 
             background: "radial-gradient(circle, rgba(255,215,0,0.03) 0%, rgba(26,32,44,1) 70%)", 
             zIndex: -1 
           }}>
      </div>

      <style>
        {`
          .text-accent { color: #FFD700 !important; }
          .btn-accent { 
            background-color: #FFD700; 
            color: #1a202c; 
            border: none;
          }
          .btn-accent:hover { 
            background-color: #e6c200; 
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(255, 215, 0, 0.2);
          }
          .transition { transition: all 0.3s ease; }
        `}
      </style>
    </div>
  );
}

export default ErrorPage;