import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useDropdownStore } from '../../utils/store';



const Dropdown = () => {

  const { showDropdown, setShowDropdown } = useDropdownStore();
  return (
    <>
      <ul className={`w-full z-50 flex flex-col justify-center items-center md:items-start  md:w-[150px] ${showDropdown ? 'h-max md:h-min' : 'h-0 border-none'} bg-white border-[1px] absolute top-0 right-0 rounded-md duration-200 ease-in-out overflow-hidden `}>
        {/* <Link href='/dashboard/profile' className='w-full'> */}
          <li className='py-5 w-full md:py-3 px-6 cursor-pointer bg-white hover:bg-gray-100 duration-200 ease-in-out'>Profile </li>
        {/* </Link> */}
        <li className='py-5 w-full md:py-3 px-6 cursor-pointer bg-white hover:bg-gray-100 duration-200 ease-in-out' onClick={() => signOut()}>Sign Out</li>
      </ul>

    </>
  )
}

export default Dropdown