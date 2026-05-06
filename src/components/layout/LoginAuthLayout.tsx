import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

/** styles */
import "./LoginAuthLayout.scss";

/** icons */
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  const navigate = useNavigate();

  // Save in local storage
  const saveLocalStorage = (accessToken: string, refreshToken: string) => {
    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const storedAccess = localStorage.getItem("accessToken");
      const storedRefresh = localStorage.getItem("refreshToken");

      return storedAccess === accessToken && storedRefresh === refreshToken;
    } catch (error) {
      console.error("LocalStorage Error:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "https://insurancecrm.quicktabhub.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await res.json();

      console.log("Response Data:", data);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      const { accessToken, refreshToken } = data.data;

      const saveData = saveLocalStorage(accessToken, refreshToken);

      setTimeout(() => {
        if (saveData) {
          navigate("/dashboard", { replace: true });
        }
      }, 1000);
    } catch (error) {
      console.error("Real Error:", error);
      throw new Error("Request failed", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_page">
      <div className="login_card">
        {/* --- LOGIN VIEW --- */}
        <div className="title_wrapper">
          <h2 className="card_title">Insurance CRM</h2>
          <p className="card_subtitle">Enter Credentials to Access Dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label>Email Address</label>
            <input
              type="email"
              className="input_field"
              placeholder="admin@mail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form_group">
            <label>Password</label>
            <input
              type={showLoginPass ? "text" : "password"}
              className="input_field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              className="toggle_password_btn"
              onClick={() => setShowLoginPass(!showLoginPass)}
            >
              {showLoginPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <button type="submit" className="submit_btn">
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
