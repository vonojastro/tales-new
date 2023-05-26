import type { NextPage } from "next"
import Head from "next/head"
import { useSession, getSession, signOut } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Header from "../../components/Header/Header";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { type DefaultSession } from 'next-auth';


// import Post from "../../modelSql/post";
import User from "../../modelSql/user";
import axios, { all } from "axios";
import { CommentData, PostData } from "../../dataTypes/typings";
import { toast } from "react-hot-toast";
import SidebarRow from "../../components/Sidebar/SidebarRow";
import PostComponent from "../../components/Feed/PostComponent";
import Link from "next/link";
import MessageBox from "../../components/Feed/MessageBox";
import Dropdown from "../../components/Header/Dropdown";
import { useCommentStore, useDropdownStore, useMessageStore, useUserStore } from "../../utils/store";
import MyParticles from "../../components/Background/Particles";
import particlesConfig from "../../particlesConfig/particles-config";
import connectDB from "../../utils/dbMongo";
import { Post } from "../../modelNosql/post";


interface Props {
  posts: PostData[]
}


const Home: NextPage<Props> = ({ posts }: Props) => {
  // const { status, data: session } = useSession()
  const session: any = useSession();

  // const [message, setMessage] = useState("")
  const [allPost, setAllPost] = useState<PostData[]>([])
  const [image, setImage] = useState<File | undefined | null>();
  const [postLoading, setPostLoading] = useState<boolean>(false)
  const [commentLoading, setCommentLoading] = useState<boolean>(false)

  const { commentMessage, setCommentMessage } = useCommentStore();
  const { message, setMessage } = useMessageStore();
  const { showDropdown, setShowDropdown } = useDropdownStore();

  const router = useRouter()

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push('/login');
    }

  }, [session?.status])

  async function fetchPosts() {
    try {
      const response = await axios.get('/api/tweet/getPost');
      setAllPost(response?.data.posts)

    } catch (error) {
      console.error(error);
    }
  }

  // postSubmit 
  const postSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setPostLoading(true)
    const formData = new FormData();
    formData.append('postMessage', message);
    setMessage("")

    if (image)
      formData.append('postImage', image);
    try {

      const response = await axios.post("/api/tweet/post", formData, {
        headers: {
          'X-Auth-Token': session.data.token,
        },
      }
      );

      if (response.data.success === true) {
        toast.success('Post Successfully')
        setImage(null)
        fetchPosts()

        setPostLoading(false)
      } else {
        toast.error('Post Failed')
        setPostLoading(false)
      }
    } catch (error) {
      console.error(error);
      toast.error('Post Failed')
      setPostLoading(false)
    }
  }

  const sortedPosts = allPost?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const oldSortedPosts = posts?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // commentSubmit
  const commentSubmit = async (event: FormEvent<HTMLFormElement>, postId: number) => {
    event.preventDefault();
    setCommentLoading(true)
    event.currentTarget.reset()

    const commentData = {
      postId: postId,
      commentMessage: commentMessage
    }
    try {
      const response = await axios.post("/api/tweet/comment/postComment", { postId, commentMessage }, {
        headers: {
          'X-Auth-Token': session.data.token,
        },
      }
      );

      if (response.data.success === true) {
        toast.success('Comment Successfully')

        setCommentMessage('')
        fetchPosts()

        setCommentLoading(false)
      } else {
        toast.error('Comment Failed')
        setCommentLoading(false)

      }

    } catch (error) {
      console.error(error);
      toast.error('Comment Failed')
      setCommentLoading(false)
    }
  }

  const heartPost = async (postId: number) => {
    // console.log(postId)

    if (postId) {
      const likeResponse = await axios.post('/api/tweet/likePost', { postId })

      if (likeResponse) {
        fetchPosts()
      }
    }

  };


  return (
    <>
      <Header user={session?.data?.user} />
      <div className="lg:max-w-6xl mx-auto" onClick={() => setShowDropdown(false)}>
        <Head>
          <title>Tales</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {session?.status === "authenticated" && (
          <main className="grid grid-cols-9" >
            <Sidebar>
              <SidebarRow title="Home" />
              <SidebarRow title="Friends" />
              <SidebarRow title="Groups" />
              <SidebarRow title="Games" />

            </Sidebar>
            <Feed>
              {/* <div className="flex items-center justify-end py-5">
                <RefreshIcon className=" h-6 w-6 cursor-pointer text-green-500 transition-all duration-300 ease-out hover:rotate-[-180deg] active:scale-125" />
              </div> */}

              <MessageBox postLoading={postLoading} user={session?.data?.user} submit={postSubmit} image={image} setImage={setImage} />
              <Dropdown />
              {allPost.length > 0 ? sortedPosts?.map((post, index) => (
                <PostComponent commentSubmit={commentSubmit} heartPost={heartPost} key={index} post={post} user={session?.data?.user} />
              )) : oldSortedPosts?.map((post, index) => (
                <PostComponent commentSubmit={commentSubmit} heartPost={heartPost} key={index} post={post} user={session?.data?.user} />
              ))}
            </Feed>
          </main>
        )}

      </div>
    </>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
  try {
    await connectDB(); // Ensure the database connection is established

    const posts: PostData[] = await Post.find({});

    // Convert the posts array to a JSON-serializable format
    const serializedPosts = JSON.parse(JSON.stringify(posts));

    return {
      props: {
        posts: serializedPosts
      }
    };
  } catch (err) {
    console.error('Unable to establish database connection:', err);
    return {
      props: {
        posts: []
      }
    };
  }
};
