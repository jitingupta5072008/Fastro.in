import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './component/Layout/Layout';
import Home from './Pages/Home/Home';
import ProductDetail from './Pages/Products/ProductDetail';
import AuthForm from './component/Login/AuthForm';
import Wishlist from './Pages/Products/Wishlist';
import Mobile from './component/Login/Mobile';

import {Toaster} from 'react-hot-toast'
import Account from './Pages/Account/Account';
import Address from './Pages/Address/Address';
import AddProduct from './Pages/Seller/AddProduct/AddProduct';
import OrderPage from './Pages/Order/OrderPage';
import Dashboard from './Pages/Seller/Dashboard/Dashboard';
import Search from './Pages/Search/Search';
import FilterProduct from './Pages/category/FilterProduct';
import CategoryProducts from './Pages/category/CategoryProducts';

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
        <Routes>
          {/* Define the main route that uses the Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/login' element={<AuthForm />} />
            <Route path='/wishlist' element={<Wishlist />} />

            <Route path='/seller/add-product' element={<AddProduct />} />
            <Route path='/otplogin' element={<Mobile />} />
            <Route path='/account' element={<Account />} />
            <Route path='/address/:id' element={<Address />} />
            <Route path='/orders' element={<OrderPage />} />
            <Route path='/search' element={<Search />} />

            <Route path='/seller-dashboard' element={<Dashboard />} />

            {/* <Route path='/products/:name' element={<FilterProduct />} /> */}
            <Route path='/categories' element={<FilterProduct />} />
            <Route path="/products/category/:slug" element={<CategoryProducts />} />

            {/* <Route path='/admin/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

          </Route>
        </Routes>
      </Router>
      <Toaster/>
    </>
  )
}

export default App
