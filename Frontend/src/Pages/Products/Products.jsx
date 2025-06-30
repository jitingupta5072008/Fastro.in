import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_API_END_POINT } from '../../utils/api';
import { useOrder } from '../../context/OrderContext';
import { Heart } from 'lucide-react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Custom arrows
// Swiggy-style left arrow
const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 transition duration-200 flex items-center justify-center"
    aria-label="Previous"
  >
    <svg
      className="w-5 h-5 text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

// Swiggy-style right arrow
const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 transition duration-200 flex items-center justify-center"
    aria-label="Next"
  >
    <svg
      className="w-5 h-5 text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);


const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 }
};

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleWishlist, wishlistLoading, wishlist } = useOrder();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${USER_API_END_POINT}/allproducts`);
        const data = await res.json();
        setAllProducts(data.products || {});
        setLoading(false);
        console.log(allProducts)
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return (
      <div className="bg-white flex flex-col items-center mt-4 w-full">
        <h2 className="text-xl font-semibold text-left w-full mb-4">
          Loading products...
        </h2>
        <div className="mt-6 w-full flex-col items-center pb-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col w-full max-w-[200px] gap-1 animate-pulse">
              <div className="relative h-52 w-full rounded-lg bg-gray-300 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200"></div>
                <button className="absolute top-2 right-2 rounded-full bg-white p-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                </button>
              </div>
              <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-3 w-6 bg-gray-300 rounded"></div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 w-3 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="mt-2 w-full">
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="mt-2">
      {Object.entries(allProducts).map(([category, products]) => (
        <div key={category} className="mb-4">
          <div className='flex items-center justify-between'>
            <h2 className="text-xl font-semibold mb-1">{category}</h2>
            <Link to={`/${category._id}`} className="rounded  text-gray-500/70 transition hover:bg-slate-50/90">See more</Link>
            {/* <h2 className="text-md  mb-1">See All</h2> */}
          </div>

          <div className="relative">
            <Carousel
              responsive={responsive}
              swipeable={true}
              draggable={true}
              showDots={false}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000} // 3 seconds between slides
              keyBoardControl={true}
              transitionDuration={600} // smoother transition speed
              customTransition="transform 600ms ease-in-out" // smooth ease-in-out
              containerClass="carousel-container"
              itemClass="px-2"
              removeArrowOnDeviceType={["mobile"]}
              renderButtonGroupOutside={true}
              arrows={true}
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
              className="h-[390px]"
            >

              {products.map((product) => (
                <div key={product._id} className="flex w-full max-w-[300px] cursor-pointer flex-col items-start gap-0.5">
                  <div className="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                    <Link to={`/product/${product._id}`} className="w-full h-full absolute z-10">
                      <img
                        src={product.images[0]?.replace("/upload/", "/upload/w_400,f_auto,q_auto/")}
                        srcSet={`
                          ${product.images[0]?.replace("/upload/", "/upload/w_300,f_auto,q_auto/")} 300w,
                          ${product.images[0]?.replace("/upload/", "/upload/w_600,f_auto,q_auto/")} 600w,
                          ${product.images[0]?.replace("/upload/", "/upload/w_1000,f_auto,q_auto/")} 1000w
                        `}
                        sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 1000px"
                        alt={product.name}
                        title={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = '/fallback.png' }}
                      />
                    </Link>

                    {product.discountPercentage > 0 && (
                      <span className="absolute z-[99] rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500">
                        {product.discountPercentage}% Off
                      </span>
                    )}

                    <button
                      onClick={() => handleWishlist(product._id)}
                      disabled={wishlistLoading[product._id]}
                      className={`absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md ${wishlistLoading[product._id] ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${wishlist.includes(product._id) ? 'text-red-600 fill-red-600' : 'text-gray-400'
                          }`}
                      />
                    </button>
                  </div>

                  <Link to={`/product/${product._id}`} className="w-full">
                    <p className="w-full truncate pt-2 font-medium md:text-base">{product.name}</p>
                    <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">
                      {product.description}
                    </p>
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs">5k</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, index) => (
                        <img
                          key={index}
                          alt="star_icon"
                          width="18"
                          height="17"
                          className="h-3 w-3"
                          src={`https://quickcart-gs.vercel.app/_next/static/media/star_icon.f42949da.svg`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-1 w-full items-end justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-medium text-black-500">
                        ₹ {Math.floor(product.price - (product.price * product.discountPercentage) / 100)}
                      </p>
                      {product.discountPercentage > 0 && (
                        <p className="text-xs line-through text-gray-500">₹{product.price}</p>
                      )}
                    </div>

                    <button
                      disabled={product.availabilityStatus === 'Out of Stock'}
                      className={`rounded-full mt-2 w-full px-4 py-1.5 text-xs transition m
                        ${product.availabilityStatus === 'In Stock'
                          ? 'border border-gray-500/20 text-gray-500'
                          : product.availabilityStatus === 'Low Stock'
                            ? 'focus:ring-4 border focus:outline-none bg-yellow-100 text-yellow-800 ring-yellow-400 animate-pulse'
                            : 'border border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed'
                        }`}
                    >
                      {product.availabilityStatus === 'In Stock'
                        ? 'Buy Now'
                        : product.availabilityStatus === 'Low Stock'
                          ? '⚠️ Low Stock - Hurry!'
                          : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </Carousel>

          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
