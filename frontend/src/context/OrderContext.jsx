import { createContext, useContext, useState, useEffect } from "react";
import { USER_API_END_POINT } from "../utils/api";
import toast from "react-hot-toast";
import axios from "axios";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const token = localStorage.getItem("token");

  // Fetch Orders
  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/orders/${userId}`, {
        headers: { Authorization: token },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Place Order
  const placeOrder = async (userId, cartItems, payment, amount, qty, sellerPhone, address, DeliveryTime) => {
    if (payment.trim() === '') return toast.error('Choose payment method');
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/placeorder`, 
        { userId, cartItems, payment, amount, qty, sellerPhone, address, DeliveryTime },
        { headers: { Authorization: token } }
      );
      toast.success(response.data.message);
      setOrders([...orders, response.data.order]);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // ✅ Fetch Wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${USER_API_END_POINT}/wishlist/products`, {
          headers: { Authorization: token },
        });

        const wishlistProductIds = res.data?.wishlist?.map((p) => p._id) || [];
        setWishlist(wishlistProductIds);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, [token]);

  // ✅ Toggle Wishlist
  const handleWishlist = async (productId, setAllproducts = null) => {
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/product/wishlist`,
        { productId },
        { headers: { Authorization: token } }
      );

      toast.success(res?.data?.message || "Wishlist updated");

      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );

      if (setAllproducts) {
        setAllproducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };


  return (
    <OrderContext.Provider value={{ orders, fetchOrders, placeOrder, handleWishlist, wishlistLoading, wishlist }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
