import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../Navbar/TopNav';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <div className='mb-4'>
        <TopNav/>
      <main className=''>
        <Outlet/>
      </main>
      <Footer/>

    
    </div>
  );
};

export default Layout;
