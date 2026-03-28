import React, { useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { KitchenContext } from '../../context/KitchenContext';
import { toast } from "react-toastify";

const Navbar = () => {

  const { kitchenOpen, toggleKitchen } = useContext(KitchenContext);

  const handleToggle = async () => {
    try {
      // 🔥 get UPDATED value from backend
      const newStatus = await toggleKitchen();

      // ✅ correct toast based on new value
      toast.success(
        newStatus ? "Kitchen Opened ✅" : "Kitchen Closed ❌"
      );
    } catch (error) {
      toast.error("Something went wrong ❌");
      console.error(error);
    }
  };

  return (
    <header className='navbar'>
      <img className='logo' src={assets.logo} alt="logo" />

      <div className="navbar-right">

        {/* 🔥 TOGGLE BUTTON */}
        <button
          className={`kitchen-toggle ${kitchenOpen ? "open" : "closed"}`}
          onClick={handleToggle}
        >
          <span className="toggle-dot"></span>

          {/* ✅ handle null state */}
          {kitchenOpen === null
            ? "Loading..."
            : kitchenOpen
            ? "Kitchen Open"
            : "Kitchen Closed"}
        </button>

        <img className='profile' src={assets.profile_image} alt="profile" />
      </div>
    </header>
  );
};

export default Navbar;