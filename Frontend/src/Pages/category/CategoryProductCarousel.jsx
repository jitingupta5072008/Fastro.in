import { Heart } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_API_END_POINT } from '../../utils/api';
import { useOrder } from '../../context/OrderContext';

const scrollByCards = 2;

const CategoryProductCarousel = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleWishlist, wishlistLoading, wishlist } = useOrder();

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${USER_API_END_POINT}/allproducts`);
        const data = await res.json();
        setAllProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild?.offsetWidth || 200;
      scrollRef.current.scrollBy({ left: -cardWidth * scrollByCards, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild?.offsetWidth || 200;
      scrollRef.current.scrollBy({ left: cardWidth * scrollByCards, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Fashion Category</h2>
        <div className="flex gap-2">
          <button onClick={scrollLeft} className="p-2 border rounded hover:bg-gray-100">{'<'}</button>
          <button onClick={scrollRight} className="p-2 border rounded hover:bg-gray-100">{'>'}</button>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-2 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {allProducts.map((product) => (
            <div
              key={product._id}
              className="flex-shrink-0 w-[200px] flex flex-col gap-1 scroll-snap-align-start"
            >
              <div className="group relative h-52 w-full rounded-lg bg-gray-100 overflow-hidden">
                <Link to={`/product/${product._id}`} className="w-full h-full absolute z-10">
                  <img
                    src={product.images[0].replace("/upload/", "/upload/w_400,f_auto,q_auto/")}
                    srcSet={`
                      ${product.images[0].replace("/upload/", "/upload/w_300,f_auto,q_auto/")} 300w,
                      ${product.images[0].replace("/upload/", "/upload/w_600,f_auto,q_auto/")} 600w
                    `}
                    sizes="(max-width: 640px) 300px, 600px"
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = '/fallback.png'; }}
                  />
                </Link>

                {product.discountPercentage > 0 && (
                  <span className="absolute top-2 left-0 z-20 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-tr-2xl rounded-br-2xl">
                    {product.discountPercentage}% Off
                  </span>
                )}

                <button
                  onClick={() => handleWishlist(product._id)}
                  disabled={wishlistLoading[product._id]}
                  className="absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md"
                >
                  <Heart className={`h-4 w-4 ${wishlist.includes(product._id) ? "text-red-600 fill-red-600" : "text-gray-400"}`} />
                </button>
              </div>

              <Link to={`/product/${product._id}`} className="w-full">
                <p className="truncate pt-1 font-medium text-sm">{product.name}</p>
                <p className="truncate text-xs text-gray-500 max-sm:hidden">{product.description}</p>
              </Link>

              <div className="flex items-center gap-2 text-xs">
                <p>5k</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src="https://quickcart-gs.vercel.app/_next/static/media/star_icon.f42949da.svg" alt="star" className="h-3 w-3" />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium">
                    ₹{Math.floor(product.price - (product.price * product.discountPercentage / 100))}
                  </p>
                  {product.discountPercentage > 0 && (
                    <p className="text-xs line-through text-gray-500">₹{product.price}</p>
                  )}
                </div>

                <button
                  disabled={product.availabilityStatus === "Out of Stock"}
                  className={`mt-1 w-full px-3 py-1 text-xs rounded-full transition
                    ${product.availabilityStatus === "In Stock"
                      ? "border border-gray-400 text-gray-600 hover:bg-gray-50"
                      : product.availabilityStatus === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800 animate-pulse"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  {product.availabilityStatus === "In Stock"
                    ? "Buy Now"
                    : product.availabilityStatus === "Low Stock"
                      ? "⚠️ Low Stock"
                      : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductCarousel;
