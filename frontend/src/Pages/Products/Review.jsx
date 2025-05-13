import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { USER_API_END_POINT } from '../../utils/api';
import { Loader2, Star } from 'lucide-react';

const Review = ({ productId, userId }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("You can upload up to 5 images.");
            return;
        }
        setImages(prev => [...prev, ...files]);
    };
    
    console.log(images);
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
            const formData = new FormData();
            formData.append('rating', rating);
            formData.append('comment', comment);
            formData.append('productId', productId);
            formData.append('userId', userId);
            images.forEach(img => formData.append('images', img));
        try {
            setLoading(true);

            // const reviewData = {rating, comment, productId, userId };
            const response = await axios.post(`${USER_API_END_POINT}/add-reviews`,formData);
            // Add new comment to state
            setReviews((prevReview) => [response.data, ...prevReview]);
            setComment(""); // Clear input field
            setRating('')
            toast.success("Review added successfully!");
        } catch (error) {
            toast.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };



    const handleDeleteReview = async (reviewId) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${USER_API_END_POINT}/review/${productId}/${reviewId}`);
            toast.success(response.data.message, { autoClose: 1000 })
            setReviews(prevComments => prevComments.filter(review => review._id !== reviewId));
        } catch (err) {
            toast.error('Error deleting reviews');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='mb-16'>
            <hr className="my-6" style={{ color: "lightgray" }} />
            {/* <!-- Review Form Container --> */}
            {token ? (

                <form class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={handleAddReview} >
                    <h2 class="text-xl font-semibold text-gray-800">Write a Review</h2>

                    {/* <!-- Rating Input --> */}
                    <div>
                        <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
                        <select id="rating" name="rating"
                            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" required value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}>
                            <option value="">---Select rating---</option>
                            <option value="5" class="mr-2">★★★★★</option>
                            <option value="4" class="mr-2">★★★★☆</option>
                            <option value="3" class="mr-2">★★★☆☆</option>
                            <option value="2" class="mr-2">★★☆☆☆</option>
                            <option value="1" class="mr-2">★☆☆☆☆</option>
                        </select>
                    </div>

                    {/* <!-- Review Text --> */}
                    <div>
                        <label for="review" class="block text-sm font-medium text-gray-700">Your Review</label>
                        <textarea id="review" name="review" rows="4" placeholder="Share your experience..."
                            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" required value={comment}
                            onChange={(e) => setComment(e.target.value)}></textarea>
                    </div>

                    {/* <!-- Image Upload --> */}
                    <div>
                        <label for="images" class="block text-sm font-medium text-gray-700 mb-1">Upload Images (optional)</label>
                        <input type="file" id="images" name="images" multiple accept="image/*" onChange={handleImageChange}
                            class="block w-full text-sm text-gray-500 file:mr-4 mt-2 mb-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
                        <p class="mt-1 text-xs text-gray-500">You can upload multiple images (up to 5).</p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {images.map((img, i) => (
                            <img key={i} src={URL.createObjectURL(img)} alt="preview" className="h-16 w-16 object-cover rounded" />
                        ))}
                    </div>

                    {/* <!-- Submit Button --> */}
                    <div>
                        <button type="submit" disabled={loading}
                            class="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-md transition">
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>


            ) : (
                null
            )}


            <div className="mt-6 space-y-4">
                {/* <p className="w-full text-center mt-4 text-2xl font-medium">Product review and rating</p> */}
                <h2 class="text-2xl text-center mt-4 font-bold mb-6">Customer Reviews</h2>
                {reviews && reviews.length > 0 ? (
                    reviews.map((comment, index) => (
                        <div class="max-w-xl mx-auto mt-10 px-4">

                            {/* <!-- Single Review --> */}
                            <div class="bg-white shadow-md rounded-lg p-5 mb-6">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center space-x-3">
                                        {/* <img src="https://i.pravatar.cc/40" alt="User Avatar" class="w-10 h-10 rounded-full"/> */}
                                        <div className='w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold'>

                                            {comment.reviewerName.split(' ').map(name => name.charAt(0).toUpperCase()).join('')}
                                        </div>
                                        <div>
                                            <p class="text-sm font-semibold text-gray-800">{comment.reviewerName}</p>
                                            <p class="text-xs text-gray-500">
                                                {new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="text-pink-400 flex text-sm">
                                        {/* ★★★★☆ */}
                                        {Array.from({ length: comment.rating }, (_, i) => (
                                            // <Star key={i} className="w-4 h-4 fill-[pink] [stroke-width:0]" />
                                            <span className="w-4 h-4 text-xl [stroke-width:0] bold">
                                            ★
                                            </span>
                                        ))}
                                        {userId === comment.userId ? (
                                            <button onClick={() => handleDeleteReview(comment._id)}>{loading ? <Loader2 className='h-5 w-5' /> : '⛔'} </button>
                                        ) : (null)}
                                    </div>
                                </div>

                                <p class="text-gray-700 text-sm mb-4">
                                    {comment.comment}
                                </p>

                                <div>
                                    {Array.isArray(comment.images) && comment.images.length > 0 && (

                                        comment.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`review-img-${i}`}
                                                className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm"
                                            />
                                        ))

                                    )}

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="flex items-center justify-center">No review yet.</p>
                )}


            </div>
        </div>
    )
}

export default Review