import React, { useEffect, useState } from 'react'
import { Search, User, Heart, Menu, X,  Package, ShoppingCart } from "lucide-react";
import BottomNav from './BottomNav';
import { Link, useLocation } from 'react-router-dom';

import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';

const TopNav = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");
  const location = useLocation();

  useEffect(() => {
    // Close the mobile menu when route changes
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      // Set a fixed maxHeight for smooth animation
      setMenuHeight("500px");
    } else {
      setMenuHeight("0px");
    }
  }, [isMenuOpen]);

  const [user, setUser] = useState([]);
  const [category, setCategory] = useState([]);


  const token = localStorage.getItem("token")
  useEffect(() => {
    const token = localStorage.getItem("token")
    const fetchSliderData = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          headers: {
            Authorization: token,
          }
        });
        setUser(res.data);

        const resposne = await axios.get(`${USER_API_END_POINT}/categories`, {
          headers: {
            Authorization: token,
          }
        });
        setCategory(resposne.data.categories);
      } catch (err) {
        console.error("Error fetching slider data", err);
      }
    };
    fetchSliderData();
  }, []);

  const logout = () => {
    localStorage.clear()
    setUser(null);
    navigate('/login');
  };

  if (location.pathname === '/cart' || location.pathname.startsWith('/address') || location.pathname === '/order-success' ) {
    return null
  }

  return (
    <>
      <section class="header-top bg-black p-[12px] hidden sm:block ">
        <div class="flex items-center justify-around">
          <div class="left">
            <span style={{ color: '#fff', fontSize: '14px', textTransform: 'capitalize' }}>
              Free Shipping Sitewide on Every Order, Don't Miss Out!!</span></div><div class="right"><span style={{ color: '#fff', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', cursor: 'pointer', borderRight: '0', marginRight: '5px', paddingRight: '0' }} id="loginBtn" class="btn login">Log In</span>/<span style={{ color: '#fff', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', cursor: 'pointer', borderRight: '0', marginRight: '5px' }} id="registerBtn" class="btn signup">Signup</span></div></div></section>
      <nav className='bg-white shadow-md'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img style={{ height: '30px' }} src="https://res.cloudinary.com/dfdenma4g/image/upload/v1744713614/SliderImages/dw8zzti5akoqjallvmft.png" alt="Fastro.in " />
              {/* <h1 className='font-bold text-pink-600  cursor-pointer' style={{ fontSize: '25px' }}>Fastro</h1> */}

            </div>

            {/* Desktop Categories */}
            <div className="hidden md:flex space-x-4">
              <Link to="/" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">Home</Link>
              <a to="/" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">Shop</a>
              <a to="/" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">About us</a>
              <a to="/" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">Contact</a>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex flex-col items-center text-gray-700 hover:text-pink-500"
                >
                  <User className="w-6 h-6" />
                  <span className="text-xs">Profile</span>
                </button>
                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[99]">

                    {token ? (
                      <>
                        <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Account
                        </Link>
                        <Link onClick={logout} to={'/'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Logout
                        </Link>
                      </>
                    ) : (
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Login
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <Link to="/search" className="flex flex-col items-center text-gray-700 hover:text-pink-500">
                <Search className="w-5 h-5 " />
                <span className="text-xs">Search</span>
              </Link>
              <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-pink-500">
                <Heart className="w-6 h-6" />
                <span className="text-xs">Wishlist</span>
              </Link>
              <Link to={'/cart'} className="flex flex-col items-center text-gray-700 hover:text-pink-500 relative">
                {/* Badge */}
                <span style={{ marginRight: '-10px', marginTop: '-6px' }} className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                {user.cartLength}
                </span>
                <ShoppingCart className="w-6 h-6" />
               
                <span className="text-xs">Cart</span>

              </Link>

            </div>


            {/* Mobile menu button */}
            <div className="md:hidden flex gap-[10px] items-center">
            <Link to={'/cart'} className="flex flex-col items-center text-gray-700 hover:text-pink-500 relative">
                {/* Badge */}
                <span style={{ marginRight: '-10px', marginTop: '-6px' }} className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                  {user.cartLength}
                </span>
                <ShoppingCart className="w-6 h-6" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`md:hidden z-[99] overflow-hidden transition-all duration-300 ease-in-out absolute bg-white w-full z-10`}
          style={{ maxHeight: menuHeight }}
        >
          <div className="pt-4 pb-3 border-t border-gray-200">
            <Link to='/account'>
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name || 'username'}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email || 'user@gmail.com'}</div>
                </div>
              </div>
            </Link>
            <div className="mt-3 px-2 space-y-1">


              {category.map((cat, i) => (
                <Link
                  key={i}
                  to={`/products/category/${cat.slug}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-100"
                >
                  {cat.name}
                </Link>
              ))}


              <Link
                to="/wishlist"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-100"
              >
                Wishlist
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-100"
              >
                Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isProfileOpen && (
          <div className="fixed inset-0 bg-opacity-50" onClick={() => setIsProfileOpen(false)}></div>
        )}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
        )}

      </nav>
      <BottomNav />
    </>
  )
}

export default TopNav