import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null); // holds productId being removed
    const [updatingQty, setUpdatingQty] = useState(null); // holds productId being updated
    const token = localStorage.getItem('token');

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/cart`, {
                headers: { Authorization: token },
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
            setUpdatingQty(productId);
            await axios.put(
                `${USER_API_END_POINT}/update`,
                { productId, quantity },
                { headers: { Authorization: token } }
            );
            toast.success('Product quantity updated successfully');
            fetchCart();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update quantity');
        } finally {
            setUpdatingQty(null);
        }
    };

    const removeItem = async (productId) => {
        try {
            setRemoving(productId);
            await axios.delete(`${USER_API_END_POINT}/remove/${productId}`, {
                headers: { Authorization: token },
            });
            toast.success('Product removed from your cart');
            fetchCart();
        } catch (err) {
            console.error(err);
            toast.error('Failed to remove product');
        } finally {
            setRemoving(null);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const { total, totalDiscount, finalAmount } = useMemo(() => {
        let total = 0;
        let totalDiscount = 0;

        cart.forEach((item) => {
            const price = item.product.price;
            const quantity = item.quantity;
            const discountPercentage = item.product.discountPercentage || 0;

            const itemTotal = price * quantity;
            const discountAmount = (price * discountPercentage / 100) * quantity;

            total += itemTotal;
            totalDiscount += discountAmount;
        });

        return {
            total,
            totalDiscount,
            finalAmount: total - totalDiscount,
        };
    }, [cart]);

    if (loading) return <p>Loading cart...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-6">
                    {cart.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex items-center justify-between border p-4 rounded-lg shadow"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-sm text-gray-600">₹{item.product.price}</p>
                                    {item.product.discountPercentage > 0 && (
                                        <p className="text-sm text-green-500">
                                            {item.product.discountPercentage}% OFF
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateQuantity(item.product._id, parseInt(e.target.value))
                                    }
                                    className="w-20 border rounded px-2 py-1"
                                    disabled={updatingQty === item.product._id}
                                >
                                    {[...Array(10).keys()].map((num) => (
                                        <option key={num + 1} value={num + 1}>
                                            {num + 1}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => removeItem(item.product._id)}
                                    className={`text-red-500 hover:underline flex items-center gap-1 disabled:opacity-50`}
                                    disabled={removing === item.product._id}
                                >
                                    <Trash size={18} />
                                    {removing === item.product._id ? 'Removing...' : 'Remove'}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="text-right text-lg font-bold mt-6">
                        Total: ₹{total.toFixed(2)}
                    </div>

                    <div className="bg-white p-4 rounded shadow mt-4">
                        <h2 className="text-xl font-bold mb-2">Cart Summary</h2>

                        <div className="flex justify-between">
                            <span>Total Price:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        {
                            totalDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span>- ₹{totalDiscount.toFixed(2)}</span>
                                </div>
                            )
                        }

                        <div className="flex justify-between font-semibold mt-2 border-t pt-2">
                            <span>Final Amount:</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-lg text-green-600">
                            You save ₹{totalDiscount.toFixed(2)}
                        </p>
                        <button className="w-32 rounded-xl bg-pink-500 py-3 cursor-pointer text-white transition hover:bg-pink-600">
                            CheckOut
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
