import React, { useState } from 'react'
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ShipAddress = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
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
    const location = useLocation()
    const address = location.state?.address;
    console.log('address is this: ',address)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!formData) return toast.error('Add Address before place order')
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

            console.log(res);
            setUser(res.data.user);
            toast.success(res.data.message);
           
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
            navigate(-1)
        }
    };
    return (
        <div class="px-6 md:px-16 lg:px-24 xl:px-32">
            <div class="mt-16 pb-16">
                <p class="text-2xl md:text-3xl text-gray-500">Add Shipping <span class="font-semibold text-primary">Address</span></p>
                <div class="flex flex-col-reverse md:flex-row justify-between mt-10">
                    <div class="flex-1 max-w-md">
                        <form onSubmit={handleSubmit} class="space-y-3 mt-6 text-sm">
                            <div class="grid grid-cols-1 gap-4">
                                <input value={formData.fullname}
                                    onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="First Name" required="" type="text"  name="fullname" />
                                {/* <input value={formData.fullname}
                                    onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Last Name" required="" type="text"  name="lastName" /> */}
                            </div>
                            <input value={formData.email}
                                onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Email address" required="" type="email"  name="email" />

                            <input value={formData.fulladdress}
                                onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Full address" required="" type="text"  name="fulladdress" />

                            <div class="grid grid-cols-2 gap-4">
                                <input value={formData.city}
                                    onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="City" required="" type="text"  name="city" />
                                <input value={formData.state}
                                    onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="State" required="" type="text"  name="state" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <input value={formData.pincode}
                                    onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Zip code" required="" type="number"  name="pincode" />

                            <input value={formData.phone}
                                onChange={handleChange} class="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition" placeholder="Phone" required="" type="text"  name="phone" />

                            </div>
                            <div className="flex items-center mb-4">
                                <input type="checkbox" id="default_address" name="defaultAddress" className="h-5 w-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                    checked={formData.defaultAddress}
                                    onChange={handleChange}
                                />
                                <label htmlFor="default_address" className="ml-2 text-sm font-medium text-gray-700">Set as Default Address</label>
                            </div>
                                
                            <button type='submit' disabled={loading}  class="w-full mt-6 bg-pink-500 text-white py-3 hover:bg-pink-600 transition cursor-pointer uppercase">  {loading ? 'Adding..' : 'Save address'}</button>
                        </form>
                    </div>
                    <img class="md:mr-16 mb-16 md:mt-0" alt="Add Address" src="https://greencart-gs.vercel.app/assets/add_address_image-BNaKxJCQ.svg" />
                </div>
            </div>
        </div>
    )
}

export default ShipAddress