import { CheckCircle, Heart, Loader, Loader2, LoaderPinwheel, LucideLoader, MapPin, Star, Store } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { SELLER_API_END_POINT, USER_API_END_POINT } from '../../utils/api';
import Review from './Review';
import { useOrder } from '../../context/OrderContext';

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0)
    const [productImages, setProductImages] = useState([])

    const [related, setRelated] = useState([]);
    const { handleWishlist, wishlistLoading, wishlist } = useOrder();
    const navigate = useNavigate()
    // const { cart, setCart } = useCart();
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const url = `${SELLER_API_END_POINT}/product/${id}`;


    useEffect(() => {

        const fetchProduct = async () => {
            // Fetch product details
            const res = await axios.get(url);
            setProduct(res.data.products);
            setTags(res.data.products.tags)
            setProductImages(res.data.products.images)
            setLoading(false);

            // Fetch related products
            const relatedRes = await axios.get(`${USER_API_END_POINT}/products/related/${res.data.products._id}`);
            setRelated(relatedRes.data.related);
        };

        fetchProduct();
    }, [id]);

    const addToCart = async (productId, quantity = 1) => {
        try {
          const res = await axios.post(`${USER_API_END_POINT}/add-to-cart`, { productId, quantity },{
            headers: { Authorization: token }
          });
          console.log('Cart updated:', res.data.cart);
          toast.success("Added to cart!");
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      };

    if (loading) {
        return <div className='flex items-center justify-center mt-12'> <LucideLoader /> Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No product data available.</div>;
    }

    return (
        <div className='mb-8'>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 pt-4 mb-4">
                <div className="px-5 lg:px-16 xl:px-20">

                    <div className="mb-4 overflow-hidden rounded-lg bg-gray-500/10">
                        <img width="1280" height="720" decoding="async" data-nimg="1" className="h-auto w-full object-cover mix-blend-multiply" srcSet=""
                            src={productImages[selectedImage] || "/placeholder.svg"}
                            alt={`Product Image ${selectedImage + 1}`}
                            style={{ color: "transparent" }} />
                    </div>

                    <div className="flex gap-4 overflow-scroll p-1 [scrollbar-width:none]">

                        {productImages.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${selectedImage === index ? "ring-2 ring-pink-500" : ""
                                    }`}
                            >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Thumbnail ${index + 1}`}
                                    width={80}
                                    height={80}
                                    objectfit="cover"
                                />
                            </div>
                        ))}
                    </div>


                </div>
                <div className="flex flex-col p-4">
                    <div className='mb-4'>
                        <h1 className="mb-1 text-3xl font-medium text-gray-800/90">{product.name}</h1>
                        <p className="text-lg text-gray-500">by {product.seller.shopName}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <h4 className='text-sm bg-pink-100 p-1 rounded-xs'>Min. Order Quantity: {product.minimumOrderQuantity}</h4>
                        <div className="flex items-center bg-pink-500 text-white px-2 py-1 rounded">
                            <span className="font-bold mr-1">4.5</span>
                            <Star className="w-4 h-4 fill-current" />

                        </div>
                        <span className="text-gray-500">| {product.reviews.length} Ratings</span>
                    </div>


                    <p className="mt-3 text-gray-600">{product.description}</p>


                    <div className="py-4 pb-0">
                        <div className="text-3xl font-bold text-gray-900">
                            ₹{product.price - (product.price * product.discountPercentage) / 100}


                            {product.discountPercentage > 0 && (
                                <span className="ml-2 text-base font-normal text-gray-800/60 line-through">₹{product.price}</span>
                            )}

                        </div>
                        <div className="text-green-600 font-semibold">inclusive of all taxes</div>
                    </div>

                    <div className="mt-10 flex items-center gap-4">
        
                    <button onClick={() => addToCart(product._id, 1)} className="w-full rounded-xl bg-pink-500 py-3.5 cursor-pointer text-white transition hover:bg-pink-600">Add to Cart</button>

                    <button onClick={() => navigate(`/address/${product._id}`)} className="w-full rounded-xl bg-pink-500 py-3.5 cursor-pointer text-white transition hover:bg-pink-600">Buy now</button>
                    </div>

                    <hr className="my-6" style={{ color: "lightgray" }} />

                    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <Store className="text-purple-600 text-2xl" />
                            <div>
                                <h2 className="text-lg font-semibold">{product.seller.shopName}</h2>
                                <p className="text-sm text-gray-600">Clothing & Accessories</p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <MapPin className="text-gray-500" />
                            <p className="text-sm text-gray-700">{product.seller.shopAddress}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-green-600">
                            <CheckCircle />
                            <span className="text-sm font-medium">Verified Seller</span>
                        </div>
                    </div>
                    <hr className="my-6" style={{ color: "lightgray" }} />

                    <div className="overflow-x-auto mb-2">
                        <table className="w-full table-auto border-collapse">
                            <tbody>
                                <tr>
                                    {product.brand ? (
                                        <>
                                            <td className="font-medium text-gray-600">Brand</td>
                                            <td className="text-gray-800/50">{product.brand || 'No brand available'}</td>
                                        </>
                                    ) : (
                                        null
                                    )}
                                </tr>
                                <tr>
                                    {product.brand ? (
                                        <>
                                            <td className="font-medium text-gray-600">Tag</td>
                                            <td className="text-gray-800/50">
                                                {/* {tags.length > 0 ? (
                                            tags.map((tag, index) => (
                                                <span key={index} className='pr-2'>

                                                    {tag},
                                                </span>
                                            ))
                                        ) : (
                                            <div>No tags found</div>
                                        )} */}
                                            </td>
                                        </>
                                    ) : (
                                        null
                                    )}
                                </tr>
                                <tr>
                                    <td className="font-medium text-gray-600">Category</td>
                                    <td className="text-gray-800/50">{product.category?.name || "No category"}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className='mb-4 text-xl font-medium text-gray-800/90'>Product Details</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full  table-auto border-collapse">
                            <tbody>
                                <tr>
                                    <td className="font-medium text-gray-600">Product Name</td>
                                    <td className="text-gray-800/50">{product.name}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium text-gray-600">stock</td>
                                    <td className="text-gray-800/50">{product.stock}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium text-gray-600">availability Status</td>
                                    <td className="text-gray-800/50">{product.availabilityStatus}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium text-gray-600">return Policy</td>
                                    <td className="text-gray-800/50">{product.returnPolicy}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium text-gray-600">shipping info</td>
                                    <td className="text-gray-800/50">{product.shippingInformation}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>

            <Review productId={product._id} userId={userId} />

            {/* {related.map((item) => ( */}
            <div className="px-4 md:px-16 lg:px-32 mb-8 flex flex-col items-center mt-4">
                <h2 className="hd text-2xl w-full text-center">Related Products</h2>
                <div className="mt-4 grid w-full grid-cols-2 flex-col items-center gap-4 pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {Array.isArray(related) && related.length > 0 ? (
                        related.map((product) => (
                           
                                <div key={product._id} className="px-2 flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">

                                    <div className="group relative flex h-52 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-500/10 overflow-hidden">


                                        <Link to={`/product/${product._id}`} className="w-full h-auto absolute z-10">
                                            <img
                                                alt={product.title}
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                width="800"
                                                height="800"
                                                src={product.images[0]}
                                            />
                                        </Link>

                                        {product.discountPercentage > 0 && (
                                            <span
                                                className="absolute z-[99] rounded-br-2xl rounded-tr-2xl top-2 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500"
                                            >
                                                {product.discountPercentage}% Off
                                            </span>
                                        )}

                                        <button
                                            onClick={() => handleWishlist(product._id)}
                                            disabled={wishlistLoading[product._id]}
                                            className={`${wishlistLoading[product._id] ? 'opacity-50 cursor-not-allowed' : ''} absolute top-2 right-2 z-20 rounded-full bg-white p-2 shadow-md`}
                                        >
                                            <Heart className={`h-4 w-4 ${wishlist.includes(product._id) ? "text-red-600 fill-red-600" : "text-gray-400"} `} />

                                        </button>


                                    </div>

                                    <Link to={`/product/${product._id}`} className="w-full">
                                        <p className="w-full truncate pt-2 font-medium md:text-base">{product.name}</p>
                                        <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">{product.description}</p>
                                    </Link>


                                    <div className="flex items-center gap-2">
                                        <p className="text-xs">{product.rating}</p>
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
                                            ₹ {product.price - (product.price * product.discountPercentage / 100)}
                                            </p>

                                            {product.discountPercentage > 0 && (
                                                <p className="text-xs line-through text-gray-500">₹{product.price}</p>
                                            )}

                                        </div>

                                        <button className="rounded-full mt-2 w-full border border-gray-500/20 px-4 py-1.5 text-xs text-gray-500 transition hover:bg-slate-50 max-sm:hidden">
                                            Buy now
                                        </button>
                                    </div>

                                </div>
                           
                        ))
                    ) : (
                        <div>No products found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
