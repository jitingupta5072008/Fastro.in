import { Heart, LucideLoader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../../utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useOrder } from '../../context/OrderContext';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const Products = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const { handleWishlist, wishlistLoading, wishlist } = useOrder();
  const [deviceType, setDeviceType] = useState("desktop");


  useEffect(() => {
  const width = window.innerWidth;
  if (width < 464) {
    setDeviceType("mobile");
  } else if (width < 1024) {
    setDeviceType("tablet");
  } else {
    setDeviceType("desktop");
  }
}, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${USER_API_END_POINT}/allproducts`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllproducts(data.products);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();

  }, [])

  const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};


  if (loading) {
    return (<>
      <div class="bg-white flex flex-col items-center mt-4">

        <div class=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6  w-full  flex-col items-center gap-6 pb-14">

          {[...Array(8)].map((_, index) => (
            <div key={index} class="flex w-full max-w-[200px] cursor-pointer flex-col items-start gap-0.5">
              <div class="group relative flex h-52 w-full items-center justify-center rounded-lg bg-gray-300 animate-pulse overflow-hidden">
                <a class="w-full h-full absolute z-10" href="#" aria-label="Loading product link"></a>
                <div class="h-full w-full bg-gray-200 animate-pulse"></div>
                <button class="absolute top-2 right-2 z-20 rounded-full bg-white p-2">
                  <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                </button>
              </div>
              <a class="w-full" href="#" aria-label="Loading product link">
                <p class="w-full h-4 bg-gray-300 animate-pulse pt-2"></p>
                <p class="w-full h-3 bg-gray-200 animate-pulse text-xs"></p>
              </a>
              <div class="flex items-center gap-2">
                <p class="text-xs h-3 bg-gray-200 animate-pulse"></p>
                <div class="flex items-center gap-0.5">
                  <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                  <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                  <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                  <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                  <div class="h-3 w-3 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
              <div class="mt-1 w-full items-end justify-between">
                <div class="flex items-center gap-2">
                  <p class="text-lg font-medium h-4 bg-gray-300 animate-pulse"></p>
                </div>
                <button class="rounded-full mt-2 w-full border border-gray-500/20 px-4 py-1.5 text-xs text-gray-500 transition hover:bg-slate-50">
                  <div class="h-4 bg-gray-300 animate-pulse"></div>
                </button>
              </div>
            </div>
          ))}



        </div>
      </div>

    </>);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="hd w-full text-left">Popular products</h2>
<Carousel
  swipeable={false}
  draggable={false}
  showDots={true}
  responsive={responsive}
  ssr={true} // means to render carousel on server-side.
  infinite={true}
  autoPlay={deviceType !== "mobile"}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  customTransition="all .5"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  deviceType={deviceType}
  dotListClass="custom-dot-list-style"
  itemClass="carousel-item-padding-40-px"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Carousel>;


      <button className="rounded border px-12 py-2.5 text-gray-500/70 transition hover:bg-slate-50/90">See more</button>
    </div>
  );
};

export default Products;
