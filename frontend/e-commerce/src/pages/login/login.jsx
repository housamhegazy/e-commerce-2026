import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useSigninMutation} from '../../Redux/user/userApi'

const Login = () => {
  const [login , {isLoading,isError}] = useSigninMutation()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({email,password}).unwrap()
      console.log("Logging in with:", { email, password });
      navigate("/"); 
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: '#1a202c' }}>
      
      <div className="row w-100 justify-content-center px-3">
        <div className="col-12 col-md-7 col-lg-6 col-xl-4">
          
          {/* كارد تسجيل الدخول الزجاجي */}
          <div className="p-4 p-md-5 rounded-4 shadow-lg border border-secondary border-opacity-10"
               style={{ backgroundColor: 'rgba(45, 55, 72, 0.4)', backdropFilter: 'blur(15px)' }}>
            
            <div className="text-center mb-5">
              <div className="d-inline-block p-3 rounded-circle mb-3 shadow-sm" 
                   style={{ backgroundColor: 'rgba(246, 173, 85, 0.1)' }}>
                <i className="bi bi-shield-lock text-warning fs-1"></i>
              </div>
              <h2 className="fw-bold text-white mb-2">Welcome Back</h2>
              <p className="text-secondary small">Please enter your details to login</p>
            </div>

            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="text-secondary small mb-2 fw-bold text-uppercase tracking-wider">Email Address</label>
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-dark border-0 text-secondary pe-0">
                    <i className="bi bi-envelope-at"></i>
                  </span>
                  <input 
                    type="email" 
                    className="form-control bg-dark text-white border-0 shadow-none py-2 px-3" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="text-secondary small mb-2 fw-bold text-uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" size="small" className="text-warning text-decoration-none small opacity-75">Forgot?</Link>
                </div>
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-dark border-0 text-secondary pe-0">
                    <i className="bi bi-key"></i>
                  </span>
                  <input 
                    type="password" 
                    className="form-control bg-dark text-white border-0 shadow-none py-2 px-3" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="mb-4 form-check">
                <input type="checkbox" className="form-check-input bg-dark border-secondary shadow-none" id="rememberMe" />
                <label className="form-check-label text-secondary small" htmlFor="rememberMe">Remember me for 30 days</label>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-warning w-100 fw-bold py-3 mb-4 border-0 shadow-sm"
                      style={{ backgroundColor: '#f6ad55', color: '#1a202c', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                Sign In
              </button>

              {/* Social Login Divider */}
              <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1 border-secondary opacity-25" />
                <span className="mx-3 text-secondary small opacity-50">OR</span>
                <hr className="flex-grow-1 border-secondary opacity-25" />
              </div>

              {/* Google Login Option */}
              <button type="button" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-2 mb-4 border-opacity-25" 
                      style={{ borderRadius: '12px' }}>
                <i className="bi bi-google me-2"></i>
                <span className="small fw-bold">Login with Google</span>
              </button>

              <div className="text-center">
                <span className="text-secondary small">New on our platform? </span>
                <Link to="/register" className="text-warning small fw-bold text-decoration-none">Create an account</Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;