import React, { SVGProps } from 'react'

interface Props {

  title: string
}

const SidebarRow = ({ title} : Props) => {

  return (
    <div className='group flex items-center w-full  space-x-2 px-4 py-3 lg:py-4  transition-all duration-200 cursor-pointer hover:bg-gray-100 '>
    
      <p className='hidden md:inline-flex group-hover:text-green-500 lg:text-xl'>{title}</p>
    </div>
  )
}

export default SidebarRow