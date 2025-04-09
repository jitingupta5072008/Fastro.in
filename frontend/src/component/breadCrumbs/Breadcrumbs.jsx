import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumbs = ({slug}) => {
  return (
    <>
         <nav className="text-sm text-gray-600 flex items-center space-x-1 mt-4 px-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <span className="mx-1">/</span>
        <Link to={`/products/category/${slug}`} className="hover:text-blue-600 transition">{slug}</Link>
        <span className="mx-1">/</span>
      </nav>
    </>
  )
}

export default Breadcrumbs