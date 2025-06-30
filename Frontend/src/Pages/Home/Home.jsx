import React from 'react';
import Slider from '../HomeSlider/Slider';
import Products from '../Products/Products';
import HomeCategoryIcon from '../category/HomeCategoryIcon';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Home = () => {
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 }
  };

  return (
    <div className='px-4 md:px-16 mb-16'>
      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={false}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        transitionDuration={600}
        customTransition="transform 600ms ease-in-out"
        removeArrowOnDeviceType={["mobile", "tablet", "desktop"]}
        arrows={false} // set false since you're removing them above
      >
        {/* Each slide should be a block element */}
        <div className='flex justify-center items-center'>
          <img src="/banner.jpg" alt="Banner 1" className='h-auto md:h-[300px] sm:h-[300px] w-full md:w-[90%] sm:w-[90%] my-2' />
        </div>
        <div className='flex justify-center items-center'>
          <img src="/banner.jpg" alt="Banner 2" className='h-auto md:h-[300px] sm:h-[300px] w-full md:w-[90%] sm:w-[90%] my-2' />
        </div>
        <div className='flex justify-center items-center'>
          <img src="/banner.jpg" alt="Banner 3" className='h-auto md:h-[300px] sm:h-[300px] w-full md:w-[90%] sm:w-[90%] my-2' />
        </div>
{/* 
        <div class="md:px-20 py-4 flex justify-center items-center">
          <img
            src=".././public/banner.jpg"
            alt="Same Day Delivery"
            class="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
        <div class=" md:px-20 py-4 flex justify-center items-center">
          <img
            src=".././public/banner.jpg"
            alt="Same Day Delivery"
            class="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
        <div class="md:px-20 py-4 flex justify-center items-center">
          <img
            src=".././public/banner.jpg"
            alt="Same Day Delivery"
            class="w-full h-auto max-h-[500px] object-contain"
          />
        </div> */}

      </Carousel>

      <HomeCategoryIcon />
      <Slider />
      <Products />

      {/* Scrolling Text Section */}
      <div
        className="relative overflow-hidden whitespace-nowrap w-full mx-0 my-10 px-0 py-3"
        style={{ fontFamily: '"PoppinsCustom", sans-serif' }}
      >
        <div className="animate-[scroll-text_10s_linear_infinite] flex gap-8 items-center w-max">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="text-[32px] md:text-[50px] font-semibold whitespace-nowrap">
              YOUR <span>EVERYDAY FASHION</span> BRAND
            </div>
          ))}
        </div>
        <p className='text-center mt-4'>Aspirational. Affordable. Convenient.</p>
      </div>
    </div>
  );
};

export default Home;
