
import { useEffect, useState } from 'react';
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/cart`,{
        headers: { Authorization: token }
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(`${USER_API_END_POINT}/update`, { productId, quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${USER_API_END_POINT}/remove/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
      alert('Failed to remove item');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const product = item.product;
      return acc + (product.price * item.quantity);
    }, 0);
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.product._id} className="flex items-center justify-between border p-4 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  className="w-16 border rounded px-2 py-1"
                  onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                />
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right text-lg font-bold mt-6">
            Total: ₹{calculateTotal()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
