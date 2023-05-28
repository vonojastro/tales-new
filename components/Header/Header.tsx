import { ChatAlt2Icon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react'
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown';
import { HiMenu } from '@react-icons/all-files/hi/HiMenu';
import { useDropdownStore } from '../../utils/store';

interface User {
  name?: string | any;
  email?: string | any;
  image?: string | null;
}

interface Props {
  user?: User;

}

const Header = ({ user }: Props) => {
  const session: any = useSession();
  // console.log('session',session)

  const { showDropdown, setShowDropdown } = useDropdownStore();
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <>
      <div className='w-full max-w-screen border-b bg-white overflow-hidden px-3 md:px-5'>
        <div className='h-[80px] drop-shadow-sm  flex items-center justify-between lg:max-w-6xl mx-auto'>
          <Link href="/dashboard" >
            <div className='gap-4 flex items-center'>
              <ChatAlt2Icon className="h-10 w-10  text-[#28b8ac] cursor-pointer" /> <h3 className='text-xl font-bold uppercase leading-6 text-[#28b8ac] cursor-pointer'>Tales</h3>
            </div>
          </Link>

          <div className='flex items-center justify-between gap-5 relative '>
            <p className='hidden md:flex text-gray text-lg'>
              Welcome,{' '}
              {user?.name?.split(' ')[0].charAt(0).toUpperCase() + user?.name?.split(' ')[0].slice(1)}!
            </p>
            <div onClick={handleClick} className='hidden md:flex'>
              <img src={user?.image ? user?.image : "https://links.papareact.com/gll"} alt='profile-photo' className='cursor-pointer w-10 h-10 rounded-full drop-shadow-sm border hover:drop-shadow-md duration-200 ease-in-out' />
              <IoIosArrowDown className={`absolute bottom-0 right-[-2px] bg-white text-black drop-shadow-md p-[2px] rounded-full  w-4 h-4 ${showDropdown ? 'rotate-180' : 'rotate-0'} duration-300 ease-in-out cursor-pointer`} />
            </div>
            < HiMenu className='md:hidden text-[#28b8ac] text-4xl cursor-pointer' onClick={handleClick} />
          </div>
        </div>

      </div>

    </>
  )
}

export default Header