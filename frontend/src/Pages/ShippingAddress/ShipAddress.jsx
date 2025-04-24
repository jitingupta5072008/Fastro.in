import React, { useState, useEffect } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ShipAddress = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const address = location.state?.address;

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        pincode: '',
        state: '',
        city: '',
        fulladdress: '',
        addressType: '',
        defaultAddress: false,
    });

    // 🛠 Set formData once if address exists
    useEffect(() => {
        if (address) {
            setFormData(address);
        }
    }, [address]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!formData) return toast.error('Add Address before placing order');

        try {
            const res = await axios.post(
                `${USER_API_END_POINT}/add/address`,
                formData,
                {
                    headers: {
                        Authorization: token,
                    }
                }
            );

            setUser(res.data.user);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
            navigate(-1);
        }
    };

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="mt-16 pb-16">
                <p className="text-2xl md:text-3xl text-gray-500">
                    Add Shipping <span className="font-semibold text-primary">Address</span>
                </p>
                <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
                    <div className="flex-1 max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-3 mt-6 text-sm">
                            <input value={formData.fullname}
                                onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Full Name" name="fullname" required />

                            <input value={formData.email}
                                onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Email" name="email" required />

                            <input value={formData.fulladdress}
                                onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Full Address" name="fulladdress" required />

                            <div className="grid grid-cols-2 gap-4">
                                <input value={formData.city}
                                    onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="City" name="city" required />
                                <input value={formData.state}
                                    onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="State" name="state" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input value={formData.pincode}
                                    onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Pincode" name="pincode" type="number" required />
                                <input value={formData.phone}
                                    onChange={handleChange} className="w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Phone" name="phone" required />
                            </div>

                            <div className="flex items-center mb-4">
                                <input type="checkbox" id="default_address" name="defaultAddress"
                                    checked={formData.defaultAddress}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-pink-500 border-gray-300 rounded" />
                                <label htmlFor="default_address" className="ml-2 text-sm font-medium text-gray-700">Set as Default Address</label>
                            </div>

                            <button type="submit" disabled={loading} className="w-full mt-6 bg-pink-500 text-white py-3 hover:bg-pink-600 transition uppercase">
                                {loading ? 'Adding..' : 'Save Address'}
                            </button>
                        </form>
                    </div>
                    <img className="md:mr-16 mb-16 md:mt-0" alt="Add Address" src="https://greencart-gs.vercel.app/assets/add_address_image-BNaKxJCQ.svg" />
                </div>
            </div>
        </div>
    );
};

export default ShipAddress;
