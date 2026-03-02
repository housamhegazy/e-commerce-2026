import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا هتربط مع الـ Redux Mutation اللي عملناه قبل كدة
    console.log("Registering User:", formData);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: '#1a202c' }}>
      
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          
          {/* كارد التسجيل بتصميم زجاجي */}
          <div className="p-5 rounded-4 shadow-lg border border-secondary border-opacity-10"
               style={{ backgroundColor: 'rgba(45, 55, 72, 0.4)', backdropFilter: 'blur(15px)' }}>
            
            <div className="text-center mb-4">
              <h2 className="fw-bold text-white mb-2">Create Account</h2>
              <p className="text-secondary small">Join our community today</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="text-secondary small mb-1">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0 text-secondary"><i className="bi bi-person"></i></span>
                  <input 
                    type="text" 
                    name="name"
                    className="form-control bg-dark text-white border-0 shadow-none" 
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="text-secondary small mb-1">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0 text-secondary"><i className="bi bi-envelope"></i></span>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control bg-dark text-white border-0 shadow-none" 
                    placeholder="name@example.com"
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="text-secondary small mb-1">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0 text-secondary"><i className="bi bi-lock"></i></span>
                  <input 
                    type="password" 
                    name="password"
                    className="form-control bg-dark text-white border-0 shadow-none" 
                    placeholder="••••••••"
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="text-secondary small mb-1">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0 text-secondary"><i className="bi bi-shield-check"></i></span>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="form-control bg-dark text-white border-0 shadow-none" 
                    placeholder="••••••••"
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-bold py-3 mb-3 border-0 shadow-sm"
                      style={{ backgroundColor: '#f6ad55', color: '#1a202c', borderRadius: '10px' }}>
                Sign Up
              </button>

              <div className="text-center">
                <span className="text-secondary small">Already have an account? </span>
                <Link to="/login" className="text-warning small fw-bold text-decoration-none">Login</Link>
              </div>
            </form>
          </div>

          {/* تلميح إضافي أسفل الكارد */}
          <p className="text-center text-secondary mt-4 mb-0" style={{ fontSize: '0.8rem' }}>
            By signing up, you agree to our <span className="text-white">Terms of Service</span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;