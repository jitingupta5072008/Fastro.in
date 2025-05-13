import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);
    const [updatingQty, setUpdatingQty] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [addresses, setAddresses] = useState(null);
    const [payment, setpayment] = useState('');
    const [DeliveryTime, setDeliveryTime] = useState('');

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/cart`, {
                headers: { Authorization: token },
            });

            setCart(res.data.cart.filter(item => item.product !== null));
        } catch (error) {
            if (error.status === 403) navigate('/login');
            toast.error(error.response.data.message);
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
            toast.success('Cart Updated');
            fetchCart();
        } catch (err) {
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
            toast.error('Failed to remove product');
        } finally {
            setRemoving(null);
        }
    };

    const fetchUserAddress = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/profile`, {
                headers: { Authorization: token }
            });

            setAddresses(res.data.address);
        } catch (err) {
            toast(err.response.data.message, { icon: '⚠️' });
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchCart();
        fetchUserAddress();
    }, []);

    const { total, totalDiscount, finalAmount } = useMemo(() => {
        let total = 0;
        let totalDiscount = 0;

        cart.forEach((item) => {
            if (!item.product) return;

            const weightPrice = parseFloat(item.weight?.price || item.product?.price);
            const quantity = Math.max(item.quantity, item.product.minimumOrderQuantity || 1);
            const discountPercentage = item.product.discountPercentage || 0;

            const itemTotal = weightPrice * quantity;
            const discountAmount = (weightPrice * discountPercentage / 100) * quantity;

            total += itemTotal;
            totalDiscount += discountAmount;
        });

        return {
            total,
            totalDiscount,
            finalAmount: total - totalDiscount,
        };
    }, [cart]);

    const handleCheckout = async () => {
        setLoading(true);
        if (!payment || !DeliveryTime) return toast.error('Please Choose Payment Method or Delivery Time');
        try {
            const response = await axios.post(`${USER_API_END_POINT}/cart/checkout`, {
                paymentMethod: payment,
                DeliveryTime: DeliveryTime
            }, {
                headers: { Authorization: token }
            });

            if (response.status === 200) {
                navigate("/order-success", { state: { order: response.data.order } });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="mt-8 flex flex-col md:flex-row">
                <div className="max-w-4xl flex-1">
                    <h1 className="mb-6 text-3xl font-medium">
                        Shopping Cart <span className="text-pink-700 text-sm">{cart.length} Items</span>
                    </h1>

                    <div className="grid grid-cols-[2fr_1fr_1fr] pb-3 text-base font-medium text-gray-500">
                        <p className="text-left">Product Details</p>
                        <p className="text-center">Subtotal</p>
                        <p className="text-center">Action</p>
                    </div>

                    {loading ? (
                        [...Array(5)].map((_, index) => (
                            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] items-center pt-3 text-sm font-medium text-gray-500 md:text-base animate-pulse">
                                <div className="flex items-center gap-3 md:gap-6">
                                    <div className="h-24 w-24 rounded border border-gray-300 bg-gray-200"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-40 bg-gray-300 rounded"></div>
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="flex gap-2">
                                            <div className="h-4 w-10 bg-gray-200 rounded"></div>
                                            <div className="h-8 w-20 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block lg:block text-center">
                                    <div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        ))
                    ) : cart.length === 0 ? (
                        <img src="https://res.cloudinary.com/dfdenma4g/image/upload/v1745485919/myecoom/vroxqf53dp9c1qgnmied.gif" className="h-90 w-90 mx-auto" alt="" />
                    ) : (
                        cart.map((item) => (
                            <div key={item.product._id} className="grid grid-cols-[2fr_1fr_1fr] items-center pt-3 text-sm font-medium text-gray-500 md:text-base">
                                <div className="flex items-center gap-3 md:gap-6">
                                    <div className="flex h-24 w-24 items-center justify-center rounded border border-gray-300 bg-pink-200">
                                        <img
                                            className="h-full max-w-full object-cover"
                                            alt="Product"
                                            src={item.product.images[0] || "/placeholder.svg"}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.product.name} {item.product.discountPercentage > 0 ? `${item.product.discountPercentage}% Off` : null}</p>
                                        <div className="font-normal text-gray-500/70">
                                            <p>
                                                Weight: <span>{item.weight?.weight || "N/A"}</span>
                                            </p>
                                            <div className="flex items-center">
                                                <p>Qty:</p>
                                                <select
                                                    value={item.quantity < item.product.minimumOrderQuantity
                                                        ? item.product.minimumOrderQuantity
                                                        : item.quantity}
                                                    onChange={(e) =>
                                                        updateQuantity(item.product._id, parseInt(e.target.value))
                                                    }
                                                    className="w-20 border rounded px-2 mt-2"
                                                    disabled={updatingQty === item.product._id}
                                                >
                                                    {[...Array(10).keys()]
                                                        .map((num) => num + 1)
                                                        .filter(num => num >= item.product.minimumOrderQuantity)
                                                        .map((num) => (
                                                            <option key={num} value={num}>
                                                                {num}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center">
                                    ₹ {
                                        (
                                            parseFloat(item.weight?.price || item.product?.price) -
                                            (parseFloat(item.weight?.price || item.product?.price) * (item.product.discountPercentage || 0) / 100)
                                        ) * item.quantity
                                    }
                                </p>
                                <button onClick={() => removeItem(item.product._id)} disabled={removing === item.product._id}>
                                    <img
                                        className="inline-block h-6 w-6 disabled:opacity-50"
                                        alt="Remove"
                                        src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_3523_924)'%3e%3cpath%20d='M12.4993%207.50033L7.49935%2012.5003M7.49935%207.50033L12.4993%2012.5003M18.3327%2010.0003C18.3327%2014.6027%2014.6017%2018.3337%209.99935%2018.3337C5.39698%2018.3337%201.66602%2014.6027%201.66602%2010.0003C1.66602%205.39795%205.39698%201.66699%209.99935%201.66699C14.6017%201.66699%2018.3327%205.39795%2018.3327%2010.0003Z'%20stroke='%23FF532E'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_3523_924'%3e%3crect%20width='20'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                                    />
                                </button>
                            </div>
                        ))
                    )}

                    <button onClick={() => navigate('/')} className="group text-primary mt-8 flex items-center gap-2 font-medium">
                        <img
                            className="transition group-hover:-translate-x-1"
                            alt="arrow"
                            src="data:image/svg+xml,%3csvg%20width='15'%20height='11'%20viewBox='0%200%2015%2011'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.0909%205.5H1'%20stroke='%234FBF8B'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M6.14286%2010L1%205.5L6.14286%201'%20stroke='%234FBF8B'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
                        />
                        Continue Shopping
                    </button>
                </div>

                {/* Order Summary */}
                <div className="w-full my-8 mx-auto max-w-90 bg-gray-100 p-5 max-md:mt-16">
                    <h2 className="text-xl font-medium md:text-2xl">Order Summary</h2>
                    <hr className="my-5 border-gray-300" />

                    <div className="mb-6">
                        <p className="text-base font-medium uppercase">Delivery Address</p>
                        <div className="relative mt-2 flex items-start justify-between">
                            {loading ? (
                                <li className="w-full relative p-4 border rounded-xl shadow-sm bg-white animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                                </li>
                            ) : addresses ? (
                                <ul className="space-y-3">
                                    <li className="relative p-4 border rounded-xl shadow-sm bg-white">
                                        <button
                                            onClick={() => navigate('/add-address', { state: { address: addresses } })}
                                            className="absolute top-2 right-2 text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                        >
                                            Edit
                                        </button>
                                        <p><strong>{addresses.fullname}</strong></p>
                                        <p>{addresses.fulladdress}, {addresses.city}</p>
                                        <p>{addresses.state} - {addresses.pincode}</p>
                                        <p>{addresses.phone}</p>
                                    </li>
                                </ul>
                            ) : (
                                <>
                                    <p className="text-gray-500">No address found</p>
                                    <button onClick={() => navigate('/add-address')} className="text-primary cursor-pointer hover:underline">Add</button>
                                </>
                            )}
                        </div>

                        <p className="mt-6 text-base font-medium uppercase">Payment Method</p>
                        <select
                            value={payment}
                            onChange={(e) => setpayment(e.target.value)}
                            className="mt-2 w-full px-4 py-3 border border-gray-300 bg-white"
                        >
                            <option value="">💳 Select Payment Method</option>
                            <option value="Cash on Delivery">🚚 Cash on Delivery</option>
                        </select>

                        <p className="mt-6 text-base font-medium uppercase">Delivery Time</p>
                        <select
                            value={DeliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className="mt-2 w-full px-4 py-3 border border-gray-300 bg-white"
                        >
                            <option value="" disabled>Select Delivery Time</option>
                            <option value={'Morning (8AM-11AM)'}>Morning (8AM-11AM)</option>
                            <option value={'Evening (4PM-8PM)'}>Evening (4PM-8PM)</option>
                        </select>
                    </div>

                    <hr className="border-gray-300" />

                    <div className="mt-4 space-y-2 text-gray-500">
                        <p className="flex justify-between">
                            <span>Price</span>
                            <span> ₹{total.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Discount</span>
                            <span>-₹{totalDiscount.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="text-green-600">Free</span>
                        </p>
                        <p className="mt-3 flex justify-between text-lg font-medium">
                            <span>Total Amount:</span>
                            <span> ₹{finalAmount.toFixed(2)}</span>
                        </p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="bg-pink-500 hover:bg-pink-600 mt-6 w-full py-3 font-medium text-white transition"
                    >
                        {loading ? 'loading...' : 'Proceed to Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
