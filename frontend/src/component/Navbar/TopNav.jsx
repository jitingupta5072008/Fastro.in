import React, { useEffect, useState } from 'react'
import { Search, User, Heart, Menu, X, Package, ShoppingCart, UserPlus, LogIn, BadgePercent } from "lucide-react";
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
       return 
      }
    };
    fetchSliderData();
  }, []);

  const logout = () => {
    localStorage.clear()
    setUser(null);
    navigate('/login');
  };

  if (location.pathname === '/cart' || location.pathname.startsWith('/address') || location.pathname === '/order-success') {
    return null
  }

  return (
    <>
      <section className="bg-black sm:bg-gradient-to-r sm:from-gray-900 sm:to-black py-3 px-6 hidden sm:block shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Promo */}
        <div className="flex items-center gap-3 text-white text-sm">
          <BadgePercent className="w-5 h-5 text-yellow-400" />
          <p className="font-medium">
            Enjoy <span className="text-pink-400 font-bold">Free Delivery</span> +{' '}
            <span className="text-pink-400 font-bold">New Deals</span> Daily!
          </p>
        </div>

        {/* Right Auth Links */}
        <div className="flex items-center gap-5 text-white text-sm font-semibold">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1 hover:text-yellow-300 transition"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-1 hover:text-yellow-300 transition"
          >
            <UserPlus className="w-4 h-4" />
            Signup
          </button>
        </div>
      </div>
    </section>

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
              <Link to="/categories" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">Shop</Link>
              <Link to="/" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">About us</Link>
              <Link to="/" className=" font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300">Contact</Link>
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