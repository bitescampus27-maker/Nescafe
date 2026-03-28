import React, { useContext, useEffect } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url } = useContext(StoreContext);

  // ================= GOOGLE RESPONSE =================
  const handleGoogleResponse = async (response) => {
    const googleToken = response.credential;

    try {
      const res = await axios.post(`${url}/api/user/google-login`, {
        token: googleToken,
      });

      if (res.data.success) {
        const newToken = res.data.token;

        // Save token
        localStorage.setItem("token", newToken);
        setToken(newToken);

        // Merge guest cart if exists
        const guestCart =
          JSON.parse(localStorage.getItem("guestCart")) || {};

        if (Object.keys(guestCart).length > 0) {
          await axios.post(
            `${url}/api/cart/merge`,
            { guestCart },
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );

          localStorage.removeItem("guestCart");
        }

        toast.success("Login Successful 🎉");

        setShowLogin(false);

        // Refresh app state safely
        window.location.reload();

      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Google login failed");
    }
  };

  // ================= INITIALIZE GOOGLE =================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login"),
          {
            theme: "outline",
            size: "large",
            width: 300,
          }
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>Sign in</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div
          id="google-login"
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoginPopup;