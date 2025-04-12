import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { USER_API_END_POINT } from '../../utils/api';
import { Star } from 'lucide-react';

const Review = ({ productId, userId }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]); // State for comments
    const token = localStorage.getItem('token')

    // Fetch comments when component loads
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/reviews/${productId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [productId]);

    // Handle new comment submission
    const handleAddReview = async (e) => {
        e.preventDefault()
        if (comment.trim() === '') return toast.warning('Write Some Comments')
        try {
            // const reviewData = {rating, comment, productId, userId };
            const response = await axios.post(`${USER_API_END_POINT}/add-reviews`, {
                rating, comment, productId, userId
            });
            // Add new comment to state
            setReviews((prevReview) => [response.data, ...prevReview]);
            setComment(""); // Clear input field
            setRating('')
            toast.success("Review added successfully!");
        } catch (error) {
            toast.error("Error adding comment:", error);
        }
    };


    
    const handleDeleteReview = async (reviewId) => {
        try {
            // Send DELETE request to backend
            const response = await axios.delete(`${USER_API_END_POINT}/review/${productId}/${reviewId}`);
            toast.success(response.data.message, { autoClose: 1000 })
            // Filter out the deleted comment from the state
            setReviews(prevComments => prevComments.filter(review => review._id !== reviewId));
        } catch (err) {
            toast.error('Error deleting reviews');
        }
    }
    return (
        <div className='mb-16'>
            <hr className="my-6" style={{ color: "lightgray" }} />
            <div class="flex justify-center items-center">
                {/* <!-- Review Form Container --> */}
                {token ? (

                    <div class="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
                        {/* <!-- Title Section --> */}
                        <h2 class="text-2xl font-semibold  text-gray-800 mb-6">Add Product Review</h2>
                        {/* <!-- Form Section --> */}
                        <form class="space-y-4" onSubmit={handleAddReview} >
                            <div className="form-group">
                                <label htmlFor="rating" className='block mb-2 text-sm text-slate-600' >Rating</label>
                                <select
                                    id="rating"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    required className='w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'

                                >
                                    <option value=''>--Select rating--</option>
                                    <option value={1}>1 - Poor</option>
                                    <option value={2}>2 - Fair</option>
                                    <option value={3}>3 - Good</option>
                                    <option value={4}>4 - Very Good</option>
                                    <option value={5}>5 - Excellent</option>
                                </select>
                            </div>

                            {/* <!-- Review Text Area --> */}
                            <div>
                                <textarea placeholder="Write your review..." rows="4" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" value={comment}
                                    onChange={(e) => setComment(e.target.value)}></textarea>
                            </div>

                            {/* <!-- Submit Button --> */}
                            <div class="flex justify-center">
                                <button type="submit" class="bg-pink-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition duration-300 w-full ">Submit Review</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    null
                )}
            </div>
            <p className="w-full text-center mt-4 text-2xl font-medium">Product review and rating</p>
            <div className="mt-6 space-y-4">
                {reviews && reviews.length > 0 ? (
                    reviews.map((comment, index) => (
                        <div key={index}>
                            <div className="max-w-screen-sm mx-auto my-0 px-4">
                                <div className="flex my-3 ">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                                            {comment.reviewerName.split(' ').map(name => name.charAt(0).toUpperCase()).join('')}
                                            {/* <img src={`${comment.createdBy.imageUrl}`} className='rounded-full' alt="" /> */}
                                        </div>
                                    </div>
                                    <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed max-w-[75vw] break-words  dark:border-slate-200">
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className="flex items-center py-2 rounded">
                                                    {Array.from({ length: comment.rating }, (_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-[orange] [stroke-width:0]" />
                                                    ))}
                                                </div>

                                                <strong className="dark:text-slate-700">{comment.reviewerName}</strong>


                                                <span className="text-xs text-gray-500 ml-2 dark:text-gray-400">{new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            {userId === comment.userId ? (
                                                <button onClick={() => handleDeleteReview(comment._id)}>⛔</button>
                                            ) : (null)}
                                        </div>

                                        <div className="flex">
                                            <p className="text-sm mt-1 text-gray-700">{comment.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))
                ) : (
                    <p>No review yet.</p>
                )}


            </div>
        </div>
    )
}

export default Review