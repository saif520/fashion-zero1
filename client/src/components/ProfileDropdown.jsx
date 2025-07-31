import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../styles/ProfileDropdown.css';
import { getCurrentUser } from '../services/authServices';
import { logoutUser } from '../services/authServices';
import { Context } from '../main';
import { useContext } from 'react';
import { toast } from 'react-toastify';


const ProfileDropdown = ({ onClose }) => {
  const { setUser, setIsAuthenticated } = useContext(Context);
  const [closing, setClosing] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleOptionClick = (path) => {
    setClosing(true);
    setTimeout(() => {
      navigate(path);
      onClose();
    }, 200);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setClosing(true);
      setTimeout(onClose, 200);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUserData(res.user);
      } catch (err) {
        console.log('Not logged in');
        setUserData(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
  setClosing(true);
  try {
    const res = await logoutUser();  // res.message will contain "Logged out successfully."
    setUser(null);
    setIsAuthenticated(false);

    toast.success(res.message || 'Logged out.', {
      position: 'top-center',
      autoClose: 2000,
    });

    setTimeout(() => {
      onClose();  // Close dropdown
    }, 200);
  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Logout failed. Please try again.',
      { position: 'top-center', autoClose: 2000 }
    );
    setClosing(false);
  }
};


  return (
    <div className={`profile-dropdown ${closing ? 'fade-out' : 'fade-in'}`} ref={dropdownRef}>
      <div className="profile-header">
        <div className="profile-icon-wrapper">
          <FaUser className="profile-icon" />
        </div>
        <div className="profile-info">
          <h4>{userData?.name || 'Guest'}</h4>
          <p>{userData?.email || 'Not logged in'}</p>
        </div>
      </div>

      <div className="profile-options">
        {!userData ? (
          <>
            <button onClick={() => handleOptionClick('/auth?type=login')}>Login</button>
            <button onClick={() => handleOptionClick('/auth?type=register')}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => handleOptionClick('/my-orders')}>My Orders</button>
            <button onClick={() => handleOptionClick('/wishlist')}>Wishlist</button>
            <button onClick={() => handleOptionClick('/cart')}>Cart</button>
            <button onClick={() => handleOptionClick('/profile/edit')}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
