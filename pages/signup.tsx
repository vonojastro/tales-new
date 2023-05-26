
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RegisterFormData } from '../dataTypes/typings';
import axios from 'axios';
import dbMysql from '../utils/dbMysql.js';
import dbPg from '../utils/dbPg.js'
import User from "../modelSql/user";
import sequelize from "../utils/dbMysql";
import type { GetServerSideProps, NextPage } from "next"
import toast, { Toaster } from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';
import { useRouter } from 'next/router';
import Post from '../modelSql/post';
import Comment from '../modelSql/comment';
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';



interface Props { }

const signup = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { status, data } = useSession()


    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status])


    const [signupLoading, setSignupLoading] = useState<Boolean>(false)


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSignupLoading(true)
        if (formData.password === formData.confirmPassword) {
            const register = await axios.post("api/user/register", {
                ...formData,
                post: 1324
            })
            if (register.data.success) {
                toast.success('Sign Up Successfully')
                setSignupLoading(false)

                router.push('/');

            } else if (register.data.success === false) {
                toast.error(register.data.message)
                setSignupLoading(false)
            }
        } else {
            // console.log("Password not matched")
            setSignupLoading(false)
            toast.error('Password not matched')
        }

    };

    // Next Auth
    const signupGoogle = async () => {
        setSignupLoading(true)
        try {
            const res = await signIn('google')
            if (res) {
                setSignupLoading(false)
                router.push('/dashboard')
            }
        } catch (error) {
            setSignupLoading(false)
            // toast.error('Invalid Username or Password')
        }
    }


    const signupFacebook = async () => {
        setSignupLoading(true)
        try {
            const res = await signIn('facebook')
            if (res) {
                setSignupLoading(false)
                router.push('/dashboard')
            }
        } catch (error) {
            setSignupLoading(false)
            // toast.error('Invalid Username or Password')
        }
    }

    const signupGithub = async () => {
        setSignupLoading(true)
        try {
            const res = await signIn('github')
            if (res) {
                setSignupLoading(false)
                router.push('/dashboard')
            }
        } catch (error) {
            setSignupLoading(false)
            // toast.error('Invalid Username or Password')
        }
    }


    return (
        <div className='grid grid-cols-1 w-full min-h-screen lg:grid-cols-2'>
            {/* <Toaster /> */}
            <div className='flex flex-col items-center justify-center px-12 lg:px-2 order-last'>

                <div className='flex gap-3 justify-center items-end pb-12'>
                    {/* <img className='w-[40px] h-[40px] ' src={require('../img/tagpros_logo2.png')} /> */}

                </div>

                {/* form */}
                <form className='flex flex-col gap-6 w-full md:w-6/12 lg:w-12/12' onSubmit={handleSubmit}>

                    <div className=''>
                        <h1>Register</h1>
                        <p>Welcome Back! Please enter your details</p>
                    </div>

                    <div>
                        <div className='flex flex-col'>
                            <p className='translate-y-[9px] ml-3 z-50 bg-white px-3 w-min'>Name</p>
                            <input id='name' type="text" required className='border bg-white focus:bg-transparent rounded-md z-0 py-2 px-4' onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className='flex flex-col'>
                            <p className='translate-y-[9px] ml-3 z-50 bg-white px-3 w-min'>Email</p>
                            <input id='email' type="email" className='border rounded-md z-0 py-2 px-4' onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className='flex flex-col'>
                            <p className='translate-y-[9px] ml-3 z-50 bg-white px-3 w-min'>Password</p>
                            <input id='password' type="password" required className='border rounded-md z-0 py-2 px-4' onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div className='flex flex-col'>
                            <p className='translate-y-[9px] ml-3 z-50 bg-white px-3 w-max'>Confirm Password</p>
                            <input id='password' type="password" required className='border rounded-md z-0 py-2 px-4' onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <button disabled={signupLoading === true} className=' flex gap-2 items-center justify-center rounded-md py-2 bg-blue-500 text-white hover:bg-blue-300 duration-300 ease-in-out'>Sign up
                            {signupLoading ? (
                                <ColorRing
                                    visible={true}
                                    height="30"
                                    width="30"
                                    ariaLabel="blocks-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="blocks-wrapper"
                                    colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                />
                            ) : ''}
                        </button>
                    </div>

                    <div className='flex justify-center items-center'>
                        <div className='w-full h-[1px] bg-gray-200'></div>
                        <p className='mx-3 '>Or</p>
                        <div className='w-full h-[1px] bg-gray-200'></div>
                    </div>


                </form>

                <div className='flex justify-center gap-8 py-5'>

                    <button onClick={signupGoogle} className='bg-white drop-shadow-lg rounded-full w-12 h-12 flex justify-center items-center  hover:bg-gray-100 duration-300 ease-in-out'>
                        <FcGoogle className='text-2xl' />
                    </button>

                    <button onClick={signupFacebook} className='bg-white drop-shadow-lg rounded-full w-12 h-12 flex justify-center items-center hover:bg-gray-100 duration-300 ease-in-out'>
                        <FaFacebook className='text-2xl text-[#3b5998]' />
                    </button>

                    <button className='bg-white drop-shadow-lg rounded-full w-12 h-12 flex justify-center items-center hover:bg-gray-100 duration-300 ease-in-out' onClick={signupGithub}>
                        <AiFillGithub className='text-2xl' />
                    </button>
                </div>

                <p className='text-center'>Already have an account?{' '}
                    <Link href='/' className='text-blue-500'>
                        Sign in
                    </Link>
                </p>
            </div>

            <div className='hidden lg:flex items-center justify-center'>
                <img className='m-10 rounded-xl w-[70%] drop-shadow-2xl border-3 border-white' src='/img/tales2.png' alt='' />
            </div>


        </div>
    )
}

export default signup


// export const getServerSideProps: GetServerSideProps<Props> = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection established successfully.');

//         await User.sync({ force: false });
//         console.log('User table created successfully.');

//         await Post.sync({ force: false });
//         console.log('Post table created successfully.');

//     } catch (err) {
//         console.error('Unable to establish database connection:', err);
//     }

//     return {
//         props: {}
//     }
// }
