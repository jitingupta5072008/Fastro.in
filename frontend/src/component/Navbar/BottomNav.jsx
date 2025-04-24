import { Home, Search, User, SlidersHorizontal, Package } from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useOrder } from "../../context/OrderContext"


function BottomNav() {
  // const {totalProduct} = useCart();
  const token = localStorage.getItem("token")
  const location = useLocation()
  if (location.pathname === '/cart' || location.pathname.startsWith('/address') || location.pathname === '/order-success' ) {
    return null
  }

  return (<>

    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg  md:hidden z-[9999]">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        {token ? (
        <Link to="/account" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>

        ):(
        <Link to="/login" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        )}

        <Link to="/categories" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
        <SlidersHorizontal className='w-6 h-6' />
          <span className="text-xs mt-1">Category</span>
        </Link>
  
        <Link to={'/orders'} className="flex flex-col items-center text-gray-700 hover:text-pink-500 relative">
          <Package className="w-6 h-6" />
          <span className="text-xs">Orders</span>
        </Link>
      </div>
    </nav>
  </>
  )
}

export default BottomNav