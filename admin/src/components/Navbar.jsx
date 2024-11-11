import React from 'react'
import { assets } from '../assets/assets'

export default function Navbar() {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className="w-[7rem] sm:w-24 md:w-32 lg:w-40" src={assets.logo} alt="logo" />
      <button className='bg-gray-600 text-white px-5 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm py-[5px]'>Logout</button>
    </div>
  )
}
