import React, { useEffect, useState } from 'react';
import { USER_API_END_POINT } from '../../utils/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LucideLoader } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Logout function
  const handleLogout = () => {
    localStorage.clear()
    console.log('token remove from localStorage');
    setUser(null);
    navigate('/login');
    console.log('logging out');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          headers: { Authorization: token }
        });

        if (res.status === 403) {
          toast(err.response.data.message, {
            icon: '⚠️',
          });
          handleLogout();
        } else {
          setUser(res.data.user);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
        handleLogout();
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div className='flex items-center justify-center my-8 '> <LucideLoader /></div>;
  }

  return (
    <>
      {/* <h1>Account</h1>
      <h2>{user._id}</h2>
      <h2>{user.name}</h2>
      <h2>{user.cart.length}</h2>
      <button onClick={handleLogout}>Logout</button> */}
      <div class=" flex items-center justify-center px-4 my-4 mb-16">
        <div class="bg-white  w-full max-w-md p-6 text-center">

          {/* <!-- Profile Image --> */}
          <div class="flex justify-center mb-4">
            {/* <img
              src="https://i.pravatar.cc/100"
              alt="User"
              class="w-24 h-24 rounded-full border-4 border-gray-200"
            /> */}

            <div className="w-24 h-24 flex text-2xl items-center justify-center font-bold bg-gray-200 rounded-full border-4 border-gray-200">
            {user.name.split(' ').map(name => name.charAt(0).toUpperCase()).join('')}

            </div>
          </div>

          {/* <!-- User Info --> */}
          <h2 class="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p class="text-sm text-gray-500 mb-6">{user.email}</p>

          {/* <!-- Menu --> */}
          <div class="space-y-4">

            <button onClick={() => navigate('/wishlist')} class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
              <span class="text-gray-700 font-medium">My Wishlist</span>
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button onClick={() => navigate('/orders')} class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
              <span class="text-gray-700 font-medium">My Orders</span>
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
              <span class="text-gray-700 font-medium">Account Settings</span>
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button onClick={handleLogout} class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-100 hover:bg-red-200 transition">
              <span class="text-red-600 font-medium">Logout</span>
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Account;
