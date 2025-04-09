import React from 'react'
import Slider from '../HomeSlider/Slider'
import Products from '../Products/Products'
import HomeCategoryIcon from '../category/HomeCategoryIcon'

const Home = () => {
  return (
    <div className='px-6 md:px-16 lg:px-32 mb-16 '>
      <Slider />
      <HomeCategoryIcon />
      <Products />
      
      <div class="scrolling-text-container relative overflow-hidden whitespace-nowrap w-full mx-[0] my-[40px] px-[0] py-[12px]" style={{ fontFamily: '"PoppinsCustom", sans-serif !important' }}>
        <div class="scrolling-section animate-[scroll-text_10s_linear_infinite] flex gap-[30px] items-center w-max ">
          <div class="scrolling-text  text-[50px] font-semibold">
            YOUR
            <span> EVERYDAY FASHION </span>
            BRAND
          </div>
          <div class="scrolling-text text-[50px] font-semibold">
            YOUR
            <span> EVERYDAY FASHION </span>
            BRAND
          </div>
          <div class="scrolling-text text-[50px] font-semibold">
            YOUR
            <span> EVERYDAY FASHION </span>
            BRAND
          </div>
          <div class="scrolling-text text-[50px] font-semibold">
            YOUR
            <span> EVERYDAY FASHION </span>
            BRAND
          </div>
          <div class="scrolling-text text-[50px] font-semibold">
            YOUR
            <span> EVERYDAY FASHION </span>
            BRAND
          </div>
          <div class="scrolling-text text-[50px] font-semibold">
            YOUR
            <span> EVERYDAY FASHION </span>
            BRAND
          </div>
        </div>
        <p>Aspirational. Affordable. Convenient.</p>
      </div>
    </div>
  )
}

export default Home