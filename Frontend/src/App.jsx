import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './component/Layout/Layout';
import Home from './Pages/Home/Home';
import ProductDetail from './Pages/Products/ProductDetail';
import AuthForm from './component/Login/AuthForm';
import Wishlist from './Pages/Products/Wishlist';

import {Toaster} from 'react-hot-toast'
import Account from './Pages/Account/Account';
import Address from './Pages/Checkout/SingleProductCheckout';
import OrderPage from './Pages/Order/OrderPage';
import Search from './Pages/Search/Search';
import FilterProduct from './Pages/category/FilterProduct';
import CategoryProducts from './Pages/category/CategoryProducts';
import ScrollToTop from './component/ScrollToTop/ScrollToTop';
import CartPage from './Pages/Cart/CartPage';
import ShipAddress from './Pages/ShippingAddress/ShipAddress';
import OrderDetail from './Pages/Order/OrderDetail';
import OrderSuccess from './Pages/Order/OrderSuccess';
import SingleProductCheckout from './Pages/Checkout/SingleProductCheckout';
import CategoryProductCarousel from './Pages/category/CategoryProductCarousel';

function App() {

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Retrieve JWT from localStorage

    if (!token) {
      // If no token, redirect to login page
      return <Navigate to="/login" replace />;
    }

    return children; // Render protected component
  };

  return (
    
    <>
      <Router>
      <ScrollToTop /> 
        <Routes>
          {/* Define the main route that uses the Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/login' element={<AuthForm />} />
            <Route path='/wishlist' element={<Wishlist />} />

            <Route path='/account' element={<Account />} />
            <Route path='/mcheckout/:id' element={<SingleProductCheckout />} />
            <Route path='/orders' element={<OrderPage />} />
            <Route path='/search' element={<Search />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/add-address' element={<ShipAddress />} />

            <Route path='/categories' element={<FilterProduct />} />
            <Route path="/products/category/:slug" element={<CategoryProducts />} />
            <Route path="/order-details" element={<OrderDetail />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/categoryproduct" element={<CategoryProductCarousel />} />

            {/* <Route path='/admin/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

          </Route>
        </Routes>
      </Router>
      <Toaster/>
    </>
  )
}

export default App
