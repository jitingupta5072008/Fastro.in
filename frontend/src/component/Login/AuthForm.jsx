import { LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/api';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';


const AuthForm = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); 
    const [inputValue, setInputValue] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [username, setUsername] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);


    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Check if input contains only alphabets (email) or digits (mobile number)
        const isAlphabetic = /^[a-zA-Z]+$/.test(value);
        const isNumeric = /^[0-9]+$/.test(value);

        if (isAlphabetic) {
            setIsEmail(true); // It's email if only alphabets are entered
        } else if (isNumeric) {
            setIsEmail(false); // It's mobile number if only digits are entered 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isEmail) {
            // Handle email login
            try {
                const response = await axios.post(`${USER_API_END_POINT}/login/email`, { email: inputValue, password });
                toast.success(response.data.message)
                console.log(response)
                // Store JWT token in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);

                setTimeout(() => {
                    navigate(-1)
                }, 2000);

            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
           
            if (isOtpSent) {
                if (!otp) {
                    toast.error('OTP is required');
                    return;
                }
                try {
                    const response = await axios.post(`${USER_API_END_POINT}/login/otp`, { phone: inputValue, otp });

                    // Store JWT token in localStorage
                    localStorage.setItem('token', response.data.token);
          
                        setIsOtpVerified(true); 
                        toast.success(response.data.message); 
      
                        setTimeout(() => {
                            navigate('/account');
                        }, 2000);
                    
                } catch (error) {
                    toast.error(error.response ? error.response.data.message : 'Something went wrong!');
                }
            } else {
                try {
                    const response = await axios.post(`${USER_API_END_POINT}/login/send-otp`, { phone: inputValue });
                    setIsOtpSent(true);
                    toast.success(response.data.message);
                } catch (error) {
                    toast.error(error.response.data.message);
                }
            }
        }
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${USER_API_END_POINT}/register`, { username, email: inputValue, password });
            toast.success(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error(error.response.data.message);
        }

    }


    return (
        <div className='py-4 flex items-center justify-center sm:px-6 lg:px-8 '>

            {isLogin ? (
                // Login Form

                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">

                    <div className="w-16 flex items-center justify-center h-16 bg-pink-100 rounded-full mx-auto mb-4"> <LogIn className='text-pink-600' /> </div>
                    <h1 className="text-2xl font-bold text-gray-700 text-center mb-2">Welcome back</h1>
                    <p className="text-gray-500 text-center mb-4">Please sign in to continue</p>


                    <form action="#" method="POST" onSubmit={handleSubmit}>

                        <div className="space-y-4">

                            <div>
                                <label htmlFor="emailPhone" className="block text-sm font-medium text-gray-700">Enter Email or Mobile Number:</label>
                                <input type="text" id="emailPhone" name="emailPhone" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter email or phone number" required
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {isEmail ? (

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" id="password" name="password" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter your password" required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                            ) : (
                                <>
                                    {isOtpSent ? (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="otp">
                                                OTP
                                            </label>
                                            <input
                                                type="text"
                                                id="otp"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength="6"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                                placeholder="Enter OTP"
                                            />
                                        </div>
                                    ) : (

                                        <p>An OTP will be sent to your mobile number.</p>
                                    )}
                                </>
                            )}

                        </div>

                        <div>
                            {/* <button type="submit">{isEmail ? 'Login' : (isOtpSent ? 'Verify OTP' : 'Send OTP')}</button> */}
                            <button type="submit" className="w-full py-2 mt-4 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 transition duration-200">{isEmail ? 'Login' : (isOtpSent ? 'Verify OTP' : 'Send OTP')}</button>
                        </div>
                    </form>

                    <p onClick={toggleForm} className="text-center text-sm text-gray-500">Don't have an account? <a href="#" className="text-pink-500 hover:underline">Sign up</a></p>
                </div>


            ) : (

                // Signup Form
                <div onSubmit={handleRegisterSubmit} className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">

                    <div className="w-16 flex items-center justify-center h-16 bg-pink-100 rounded-full mx-auto mb-4"> <UserPlus className='text-pink-600' /> </div>
                    <h1 className="text-2xl font-bold text-gray-700 text-center mb-2">Create Account</h1>
                    <p className="text-gray-500 text-center mb-4">Get started with your account</p>


                    <form action="#" method="POST">

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input type="text" id="username" name="username" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter your username" required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter your email" required
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="password" name="password" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter your password" required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full py-2 mt-4 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 transition duration-200">Sign up</button>
                        </div>
                    </form>

                    <p onClick={toggleForm} className="text-center text-sm text-gray-500">Already have an account? <a href="#" className="text-pink-500 hover:underline">Log in</a></p>
                </div>

            )}


        </div>
    );
};

export default AuthForm;
