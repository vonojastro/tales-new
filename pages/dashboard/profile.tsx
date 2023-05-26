import type { NextPage } from "next"
import Head from "next/head"
import { useSession, getSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Header from "../../components/Header/Header";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { type DefaultSession } from 'next-auth';

import Post from "../../modelSql/post";
import User from "../../modelSql/user";
import axios from "axios";
import { PostData } from "../../dataTypes/typings";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Dropdown from "../../components/Header/Dropdown";
import { useDropdownStore } from "../../utils/store";


interface Props {
  posts: PostData[]

}


const profile = ({ posts }: Props) => {
  // const { status, data: session } = useSession()
  const session: any = useSession();

  const { showDropdown, setShowDropdown } = useDropdownStore();


  return (
    <>
      <Header  user={session?.data?.user} />
      <div className="lg:max-w-6xl mx-auto" onClick={() => setShowDropdown(false)}>
        <Head>
          <title>Tales</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {session?.status === "authenticated" && (
          <main className="grid grid-cols-9" >
            <Sidebar >
              <div className="w-full flex h-[80vh] items-center justify-center">

                <img src={session?.data?.user.image ? session?.data?.user.image : "https://links.papareact.com/gll"} className="w-[100px] h-[100px] my-5 rounded-full bg-black" />
              </div>
            </Sidebar>
            <Feed>
              <Dropdown />
              <div className='w-full  '>

              </div>
            </Feed>
          </main>
        )}

      </div>
    </>
  )
}

export default profile


