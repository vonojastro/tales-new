
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
// import { parse } from 'cookie';
// import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ColorRing } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from '@react-icons/all-files/fc/FcGoogle';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import User from '../modelSql/user';
import sequelize from "../utils/dbMysql";
import Post from '../modelSql/post';
import Comment from '../modelSql/comment';
import connectDB from '../utils/dbMongo';
import MyParticles from '../components/Background/Particles';
import particlesConfig from '../particlesConfig/particles-config';


interface LoginForm {
  email: string;
  password: string;
}


interface prop {
  token?: string
}

type Props = /*unresolved*/ any
// interface Props {
//   token?: string | null;
// }


const login = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState<Boolean>(false)
  const { status, data } = useSession()


  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   setLoginLoading(true)
  //   try {
  //     const response = await axios.post("api/user/login", form);
  //     if (response.data.success) {
  //       router.push('/')
  //       setLoginLoading(false)
  //       toast.success('Login Successfully')
  //     } else if (response.data.success === false) {
  //       toast.error('Invalid Username or Password')
  //       setLoginLoading(false)
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Invalid Username or Password')
  //     setLoginLoading(false)
  //   }
  // };


  // Next Auth
  const signinGoogle = async () => {
    setLoginLoading(true)
    try {
      const res = await signIn('google')
      if (res) {
        setLoginLoading(false)
        router.push('/dashboard/')
      } else {
        setLoginLoading(false)
        // toast.error('Invalid Username or Password')
      }
    } catch (error) {
      setLoginLoading(false)
      // toast.error('Invalid Username or Password')
    }
  }


  const signinFacebook = async () => {
    setLoginLoading(true)
    try {
      const res = await signIn('facebook')
      if (res) {
        setLoginLoading(false)
        router.push('/dashboard/')
      } else {
        setLoginLoading(false)
        // toast.error('Invalid Username or Password')
      }
    } catch (error) {
      setLoginLoading(false)
      // toast.error('Invalid Username or Password')
    }
  }

  const signinGithub = async () => {
    setLoginLoading(true)
    try {
      const res = await signIn('github')
      if (res) {
        setLoginLoading(false)
        router.push('/dashboard/')
      } else {
        setLoginLoading(false)
        // toast.error('Invalid Username or Password')
      }
    } catch (error) {
      setLoginLoading(false)
      // toast.error('Invalid Username or Password')
    }
  }



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true)

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    console.log(res)

    if (res?.ok) {
      setLoginLoading(false)
      router.push('/dashboard/')
    } else {
      setLoginLoading(false)
      toast.error('Invalid Username or Password')
    }
  };

  return (
    <>
      {/* <MyParticles
        id='tsparticle'
        // particlesLoaded='particlesLoaded'
        options={particlesConfig}
      /> */}

      <div className='grid grid-cols-1 w-full min-h-screen lg:grid-cols-2'>


        {/* <Toaster /> */}
        <div className='flex flex-col items-center justify-center px-12 lg:px-2 order-last'>
          <div className='flex gap-3 justify-center items-end pb-12'>
            {/* <img className='w-[40px] h-[40px] ' src={require('../img/tagpros_logo2.png')} /> */}
          </div>
          {/* form */}
          <form className='flex flex-col gap-6 w-full md:w-6/12 lg:w-12/12' onSubmit={handleSubmit}>
            <div className=''>
              <h1>Sign in</h1>
              <p>Welcome Back! Please enter your details</p>
            </div>

            <div>
              <div className='flex flex-col'>
                <p className='translate-y-[9px] ml-3 z-50 bg-white px-3 w-min'>Email</p>
                <input id='email' type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className='border rounded-md z-0 py-2 px-4' />
              </div>
              <div className='flex flex-col'>
                <p className='translate-y-[9px] ml-3 z-50 bg-white px-3 w-min'>Password</p>
                <input id='password' type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className='border rounded-md z-0 py-2 px-4' />
              </div>

            </div>

            <div className='flex justify-between'>
              {/* <div className='flex gap-3 items-center'>
              <input id='rememberMe' type="checkbox" name="" className='bg-blue-200 w-4 h-5 border cursor-pointer' />
              <label htmlFor="rememberMe" className='cursor-pointer'>Remember Me</label>
            </div> */}

              <p className=''>
                <Link href='/forgot-password'>
                  Forgot password?
                </Link>
              </p>
            </div>

            <div className='flex flex-col'>
              <button className=' flex items-center justify-center gap-2 rounded-md py-2 bg-blue-500 text-white hover:bg-blue-300 duration-300 ease-in-out'>Sign in
                {loginLoading ? (
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
          <div className='flex justify-center gap-8 py-5 '>
            <button className='bg-white drop-shadow-lg rounded-full w-12 h-12 flex justify-center items-center hover:bg-gray-100 duration-300 ease-in-out' onClick={signinGoogle}>
              <FcGoogle className='text-2xl' />
            </button>
            <button className='bg-white drop-shadow-lg rounded-full w-12 h-12 flex justify-center items-center hover:bg-gray-100 duration-300 ease-in-out' onClick={signinFacebook}>
              <FaFacebook className='text-2xl text-[#3b5998]' />
            </button>
            <button className='bg-white drop-shadow-lg rounded-full w-12 h-12 flex justify-center items-center hover:bg-gray-100 duration-300 ease-in-out' onClick={signinGithub}>
              <AiFillGithub className='text-2xl' />
            </button>
          </div>
          <p className='text-center'>Don't have an account?{' '}
            <Link href='/signup' className='text-blue-500'>
              Sign up
            </Link>
          </p>
        </div>

        <div className='hidden lg:flex items-center justify-center'>
          <img className='m-10 rounded-xl w-[70%] drop-shadow-2xl border-3 border-white' src='/img/tales.png' alt='' />
        </div>

      </div>
    </>
  )
}

export default login


export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
  try {
    // await sequelize.authenticate();
    // console.log('Database connection established successfully.');
    connectDB()

    // await User.sync({ force: false });
    // await Post.sync({ force: false });
    // await Comment.sync({ force: false });



  } catch (err) {
    console.error('Unable to establish database connection:', err);
  }

  return {
    props: {}
  }
}

