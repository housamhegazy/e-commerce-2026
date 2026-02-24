import React from 'react';

const LoadingPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column" 
         style={{
           // استخدام نفس لون الخلفية العميق اللي في الـ Root والهوم
           backgroundColor: "#1a202c",
           position: "fixed",
           top: 0,
           left: 0,
           width: "100%",
           zIndex: 9999
         }}>
      
      {/* Container للـ Spinner عشان نتحكم في تأثير الـ Glow */}
      <div className="position-relative">
        <div 
          className="spinner-border" 
          role="status" 
          style={{ 
            width: '4rem', 
            height: '4rem', 
            color: '#FFD700', // اللون الذهبي (Accent)
            borderWidth: '0.25rem'
          }}
        >
        </div>
        {/* Spinner داخلي لإضافة حركة معقدة شوية */}
        <div 
          className="spinner-grow position-absolute top-50 start-50 translate-middle" 
          style={{ 
            width: '2rem', 
            height: '2rem', 
            backgroundColor: '#FFD700',
            opacity: 0.5
          }}
        >
        </div>
      </div>

      {/* نص التحميل بتنسيق متناسق */}
      <h4 className="mt-4 fw-bold text-white mb-1" style={{ letterSpacing: '2px' }}>
        Housam<span className="text-accent">.DEV</span>
      </h4>

      <div className="d-flex align-items-center gap-2">
        <p className="text-secondary small mb-0">Crafting your experience</p>
        {/* نقاط تحميل بسيطة بتتحرك */}
        <div className="d-flex gap-1">
            <span className="badge rounded-circle p-1 bg-accent animate__animated animate__bounceIn animate__infinite"></span>
            <span className="badge rounded-circle p-1 bg-accent animate__animated animate__bounceIn animate__infinite animate__delay-1s"></span>
            <span className="badge rounded-circle p-1 bg-accent animate__animated animate__bounceIn animate__infinite animate__delay-2s"></span>
        </div>
      </div>

      {/* ستايل إضافي عشان الـ text-accent يشتغل هنا برضه */}
      <style>
        {`
          .text-accent { color: #FFD700 !important; }
          .bg-accent { background-color: #FFD700 !important; }
        `}
      </style>
    </div>
  );
};

export default LoadingPage;