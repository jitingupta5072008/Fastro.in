import React, { useEffect, useState } from 'react';
import { SELLER_API_END_POINT, USER_API_END_POINT } from '../../utils/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useOrder } from '../../context/OrderContext';
import { CheckCircle, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const SingleProductCheckout = () => {
    const location = useLocation();
    const size = location.state?.size;
    const weight = location.state?.weight;
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = `${SELLER_API_END_POINT}/product/${id}`;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { address, fetchUserAddress } = useOrder();

    const [payment, setPayment] = useState('');
    const [DeliveryTime, setDeliveryTime] = useState('');
    const isSelected = payment === 'Cash on Delivery';

    const calculateDeliveryCharge = (amount) => {
        if (amount < 199) return 30;
        if (amount >= 199 && amount < 349) return 20;
        if (amount >= 349 && amount < 499) return 10;
        return 0;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await axios.get(url);
            setProduct(res.data.products);
            setProductImages(res.data.products.images);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        fetchUserAddress();
    }, []);

    const getOriginalPrice = () => {
        if (size?.price) return size.price;
        if (weight?.price) return weight.price;
        return product?.price || 0;
    };

    const originalPrice = getOriginalPrice();
    const finalPrice = Math.floor(originalPrice - (originalPrice * product?.discountPercentage) / 100);
    const discountValue = originalPrice - finalPrice;
    const discountPercentage = Math.floor((discountValue / originalPrice) * 100);
    const quantity = product?.minimumOrderQuantity || 1;
    const totalProductPrice = finalPrice * quantity;
    const deliveryCharge = calculateDeliveryCharge(totalProductPrice);
    const totalOrderAmount = totalProductPrice + deliveryCharge;

    const handleCheckout = async () => {
        if (!payment || !DeliveryTime) return toast.error('Please Choose Payment Method or Delivery Time');
        setLoading(true);

        try {
            const response = await axios.post(
                `${USER_API_END_POINT}/buy/checkout`,
                {
                    paymentMethod: payment,
                    DeliveryTime: DeliveryTime,
                    productId: product._id,
                    amount: totalOrderAmount,
                    quantity,
                    weight: weight?.weight,
                    size: size?.size,
                    
                },
                {
                    headers: { Authorization: token },
                }
            );

            if (response.status === 200) {
                navigate(`/order-success/${response.data.order._id}`, { state: { order: response.data.order } });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:flex md:gap-6">
            {/* Product and Address Section */}
            <div className="w-full md:w-2/3 space-y-4">
                {/* Product Info */}
                <div className="border rounded-lg">
                    {/* Estimated Delivery */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b rounded-t-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 3h14v14H3V3zm1 1v12h12V4H4zm4 2h4v1H8V6zm0 2h6v1H8V8zm0 2h6v1H8v-1z" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-800">
                            Estimated Delivery by <span className="font-medium text-black"> {(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/(\d+)(?= )/, d => d + (["th","st","nd","rd"][(d%10>3)?0:((d%100-d%10!=10)*d%10)] || "th"))) + ' • ' + DeliveryTime} </span>
                        </p>
                    </div>
                    {/* Product Row */}
                    <div className="flex px-4 py-3 gap-4">
                        <img src={productImages[0]} alt="Product" className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1 text-sm">
                            <h3 className="font-semibold text-gray-800">{product.name}</h3>
                            <div className="text-gray-700 mt-1">
                                ₹{finalPrice}
                                {discountPercentage > 0 && (
                                    <>
                                        <span className="line-through text-gray-400 ml-1">₹{originalPrice}</span>
                                        <span className="text-green-600 ml-1 text-xs">{discountPercentage}% Off</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                {size?.size && `Size: ${size.size} •`} {weight?.weight && `Weight: ${weight.weight}`} • Qty: {quantity}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 px-4 py-2 border-t rounded-b-lg">
                        <span>Sold by: {product.seller.shopName}</span>
                        <span className="text-green-600">{deliveryCharge === 0 ? "Free Delivery" : `Delivery ₹${deliveryCharge}`}</span>
                    </div>
                </div>

                {/* Address */}
                {address && (
                    <div className="border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0C5.589 0 2 3.589 2 8c0 5.25 7.518 11.696 7.875 11.992a1.004 1.004 0 001.25 0C10.482 19.696 18 13.25 18 8c0-4.411-3.589-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
                                </svg>
                                Delivery Address
                            </h3>
                            <button onClick={() => navigate('/add-address', { state: { address: address } })} className="text-pink-600 font-semibold text-sm">CHANGE</button>
                        </div>
                        <p className="font-semibold">{address.fullname}</p>
                        <p className="text-sm text-gray-700 mt-1">
                            {address.fulladdress}, dist - {address.city}, state - {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{address.phone}</p>
                    </div>
                )}

                {/* Payment and Delivery */}
                <div className="max-w-md p-4">
                    <h2 className="font-semibold text-lg mb-2">Select Payment Method</h2>
                    <div
                        className={`cursor-pointer border ${isSelected ? 'border-purple-600' : 'border-gray-300'} rounded-lg flex items-center justify-between p-4 transition-all`}
                        onClick={() => setPayment('Cash on Delivery')}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-gray-800">₹{totalOrderAmount}</span>
                            <span className="h-4 border-r border-gray-300" />
                            <span className="font-medium text-gray-800">Cash on Delivery</span>
                            <img src="https://static-assets.meesho.com/videos/cod_icon_v2.gif" alt="cod" className="w-5 h-5 ml-1" />
                        </div>
                        {isSelected ? <CheckCircle className="text-purple-600 w-5 h-5" /> : <Circle className="text-purple-600 w-5 h-5" />}
                    </div>
                    <p className="font-semibold text-lg mt-2">Delivery Time</p>
                    <select
                        value={DeliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select Delivery Time</option>
                        <option value={'Morning (8AM-11AM)'}>Morning (8AM-11AM)</option>
                        <option value={'Evening (4PM-8PM)'}>Evening (4PM-8PM)</option>
                    </select>
                </div>
            </div>

            {/* Price Summary */}
            <div className="w-full md:w-1/3 mt-6 md:mt-0 space-y-4">
                <div className="border rounded-lg p-4 shadow-sm space-y-2">
                    <h3 className="font-semibold text-gray-700">Price Details (1 Item)</h3>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Product Price</span>
                        <span>₹{originalPrice * quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Total Discounts</span>
                        <span>- ₹{discountValue * quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Charges</span>
                        <span>{deliveryCharge === 0 ? "Free" : `+ ₹${deliveryCharge}`}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                        <span>Order Total</span>
                        <span>₹{totalOrderAmount}</span>
                    </div>
                    <button onClick={handleCheckout} disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition">
                        {loading ? 'loading...' : 'CheckOut'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleProductCheckout;
