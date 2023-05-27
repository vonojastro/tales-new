import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import Timeago from 'react-timeago';
import { CommentData, LikesData, PostData, UserTypes } from '../../dataTypes/typings';
import { AiOutlineHeart } from '@react-icons/all-files/ai/AiOutlineHeart';
import { AiFillHeart } from '@react-icons/all-files/ai/AiFillHeart';
import { GoCommentDiscussion } from '@react-icons/all-files/go/GoCommentDiscussion';
import { HiOutlineShare } from '@react-icons/all-files/hi/HiOutlineShare';
import { IoIosReturnRight } from '@react-icons/all-files/io/IoIosReturnRight';
import { BiSend } from '@react-icons/all-files/bi/BiSend';
import { useCommentStore } from '../../utils/store';
import { useSession } from 'next-auth/react';
import axios from 'axios';



interface Props {
  post: PostData | PostData[] | any;
  user?: UserTypes;
  commentSubmit: (event: FormEvent<HTMLFormElement>, postId: number) => void;
  heartPost: (postId: number) => void;
}

interface Heart {
  likedPost: boolean,
  postId: number | null,
}

const PostComponent = ({ user, post, commentSubmit, heartPost }: Props) => {
  const [showComment, setShowComment] = useState<boolean>(false)
  const [likePost, setLikePost] = useState<boolean>(false)
  const { commentMessage, setCommentMessage } = useCommentStore();
  const session: any = useSession();
  // console.log(session)




  const comment: CommentData[] | CommentData | any = post.comments
  const sortedComments: CommentData[] | CommentData | any = comment.sort((a: CommentData, b: CommentData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className='w-full md:px-5 my-3 rounded-2xl md:rounded-2xl border bg-white max-w-[750px] mx-auto'>
      <div className='flex gap-3 items-start py-5 px-4'>
        <img className="flex h-8 w-8 drop-shadow-sm border rounded-full object-cover" src={`${post.profileImg ? post.profileImg : "https://links.papareact.com/gll"}`} alt="" />

        <div className='flex flex-col gap-2 pt-1 w-12/12'>
          <div className='flex flex-col md:items-center md:flex-row gap-2 md:gap-5'>
            <div className='flex  items-center flex-row gap-5'>
              <p className='text-gray-600 font-black'>{post.username.replace(/\b\w/g, (c: any) => c.toUpperCase())}</p>
              <p className='text-gray-400'>{"@" + post.username.replace(/\s+/g, "").toLowerCase()}</p>
            </div>
            <Timeago date={post.createdAt} className='text-gray-400 text-sm' />
          </div>
          <div>
            <p className='text-black '>{post.text}</p>
          </div>

          {post.image && (
            <img className='w-full md:w-8/12 border max-h-[1000px] rounded-lg'
              src={post.image} alt='img_post' />
          )}

          <div className='flex justify-between lg:max-w-[500px] px-5 md:px-10 py-3 md:py-5'>
            <div className='relative cursor-pointer'
              onClick={() => setShowComment(!showComment)} >
              <GoCommentDiscussion className='text-green-400 hover:text-green-500 duration-200 ease-in-out  cursor-pointer text-xl hover ' />
              {sortedComments.length > 0 && (
                <p className='absolute text-white text-[0.7rem] flex justify-center items-center bg-green-500 hover:bg-green-600 duration-100 hover:scale-[1.1] w-[20px] h-[20px] top-[-12px] right-[-12px] text-center b rounded-full '>
                  {sortedComments.length}
                </p>
              )}
            </div>

            {post.likes.some((item: any) => item.userEmail === session.data.user.email) ? (
              <AiFillHeart className='text-green-400 hover:text-green-500 duration-200 ease-in-out cursor-pointer text-xl hover'
                onClick={() => heartPost(post._id)} />
            ) :
              (
                <AiOutlineHeart className='text-green-400 hover:text-green-500 duration-200 ease-in-out cursor-pointer text-xl hover'
                  onClick={() => heartPost(post._id)} />
              )}
            <HiOutlineShare className='text-green-400 hover:text-green-500 duration-200 ease-in-out cursor-pointer text-xl hover' />
          </div>

          {post.likes.length > 0 && (
            <span className='text-gray-400 px-3 py-2 text-[0.9rem]' >
              {post.likes.length === 1 ? post.likes.map((item: LikesData) => (
                <span className='capitalize' key={item._id}>
                  {item.user}
                </span>
              )) : (
                <span >
                  {post.likes.length} people
                </span>
              )}
              {" "}
              like this
            </span>
          )}

          <form className='w-full flex items-center mb-3 lg:max-w-[500px]'
            onSubmit={(event) => commentSubmit(event, post._id)}>
            <input type='text' placeholder='Reply to this post...'
              className='border border-green-300 min-w-[230px] w-full md:min-w-[400px] md:max-w-[450px] px-3 py-2 text-[0.7rem] mr-3 rounded-3xl'
              onChange={(e) => setCommentMessage(e.target.value)}
              onClick={() => setShowComment(true)}
            />
            <button>
              <BiSend className='text-2xl text-green-300 hover:text-green-400 duration-200 ease-in-out mx-3 cursor-pointer' />
            </button>
          </form>
          {sortedComments.map((item: CommentData, index: number) => (
            <React.Fragment key={index}>
              {showComment === true && (
                <div className='flex flex-col w-12/12 md:w-10/12 lg:w-8/12 ' key={item.id}>
                  <div className='flex items-center justify-start gap-3 py-2'>
                    {/* <IoIosReturnRight className='hidden md:flex text-gray-400 text-sm md:text-[1.5rem]' /> */}
                    <div className='drop-shadow bg-white flex flex-col gap-2 px-3 py-4 rounded-xl w-full min-w-[290px] md:min-w-[400px] lg:min-w-[400px] lg:max-w-[400px]'>
                      <div className='flex  gap-3 items-center'>
                        <img className="flex h-8 w-8 drop-shadow-sm border rounded-full object-cover"
                          src={`${item.profImg ? item.profImg : "https://links.papareact.com/gll"}`} alt="" />
                        <div className='flex flex-col md:flex-row md:gap-3'>

                          <p className='text-[0.9rem] text-black capitalize'>
                            {item?.user}
                          </p>
                          <Timeago date={item.createdAt} className='text-gray-400 text-[0.9rem]' />
                        </div>
                      </div>
                      <p className='px-1 lg:px-5 text-[0.9rem]'>
                        {item.comment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* {comment.map((item: CommentData, index: number) => (
            <div key={index}>
              <p>
                {item.comment}
              </p>
            </div>
          ))} */}

        </div>
      </div>

    </div>
  )
}

export default PostComponent