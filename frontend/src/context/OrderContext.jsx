import { createContext, useContext, useState, useEffect } from "react";
import { USER_API_END_POINT } from "../utils/api";
import toast from "react-hot-toast";
import axios from "axios";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
    // const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
  // Fetch Orders
  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`${USER_API_END_POINT}/orders/${userId}`,{
        headers: {
          Authorization: token,
      },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Place Order
  const placeOrder = async (userId, cartItems, payment,amount,qty,sellerPhone,address,DeliveryTime) => {
    
    if (payment.trim() === '') return toast.error('choose payment methode');
    try {

      // const updatedCartItems = cartItems.map(item => ({...item,quantity: qty,}));

      const response = await axios.post(`${USER_API_END_POINT}/placeorder`,{ userId, cartItems, payment,amount,qty,sellerPhone,address,DeliveryTime }, {
        // headers: {
        //     Authorization: token,
        // },
      });
      toast.success(response.data.message)
      setOrders([...orders,response.data.order]);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, fetchOrders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
