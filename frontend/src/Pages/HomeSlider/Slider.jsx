import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/api';
import { LucideLoader } from 'lucide-react';

const Slider = () => {
    const [slides, setSlides] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/get/sliders`);
                setSlides(res.data.sliders);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching slider data", err);
            }
        };
        fetchSliderData();
    }, []);

    const handleSlideClick = (categoryId) => {
        navigate(`/products/category/${categoryId}`);
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center mt-4'>
                <LucideLoader /> Loading...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center mt-8 shadow-lg block md:hidden sm:hidden">
            <div className="max-w-lg">
                <Carousel autoSlide={true}>
                    {slides.map((s, index) => (
                       
                            <img
                            key={index}
                                src={s.imageUrl}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-auto object-cover"
                                onClick={() => navigate(`products/category/${s.category.slug}`)}
                            />
                        
                    ))}
                </Carousel>

            </div>
        </div>
    );
};

export default Slider;
