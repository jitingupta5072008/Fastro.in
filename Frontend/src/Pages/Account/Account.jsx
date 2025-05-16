import React, { useEffect, useState } from 'react';
import { USER_API_END_POINT } from '../../utils/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Heart,
  Package,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          headers: { Authorization: token },
        });

        if (res.status === 403) {
          toast(res.data.message, { icon: '⚠️' });
          handleLogout();
        } else {
          setUser(res.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
        handleLogout();
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center my-8">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 my-4 mb-16">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md text-center">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 flex text-2xl items-center justify-center font-bold bg-gray-200 rounded-full border-4 border-gray-200">
            {user.name
              .split(' ')
              .map((name) => name.charAt(0).toUpperCase())
              .join('')}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500 mb-6">{user.email}</p>

        {/* Menu */}
        <div className="space-y-4 text-left">
          <MenuButton
            icon={<Heart className="text-pink-500 w-5 h-5" />}
            label="My Wishlist"
            onClick={() => navigate('/wishlist')}
          />
          <MenuButton
            icon={<Package className="text-indigo-500 w-5 h-5" />}
            label="My Orders"
            onClick={() => navigate('/orders')}
          />
          <MenuButton
            icon={<Settings className="text-gray-600 w-5 h-5" />}
            label="Account Settings"
          />
          <MenuButton
            icon={<LogOut className="text-red-500 w-5 h-5" />}
            label="Logout"
            textColor="text-red-600"
            bgColor="bg-red-100 hover:bg-red-200"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

const MenuButton = ({
  icon,
  label,
  onClick,
  textColor = 'text-gray-700',
  bgColor = 'bg-gray-100 hover:bg-gray-200',
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${bgColor} transition`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className={`font-medium ${textColor}`}>{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </button>
);

export default Account;
