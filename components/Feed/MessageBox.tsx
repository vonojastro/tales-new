import React, { useState, FormEvent, useRef } from "react"
import {
  PhotographIcon,
  SearchCircleIcon,
  EmojiHappyIcon,
  CalendarIcon,
  LocationMarkerIcon
} from "@heroicons/react/outline"
import axios from "axios";
import { useSession } from "next-auth/react";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";
import { toast } from "react-hot-toast";
import { UserTypes } from "../../dataTypes/typings";
import { ColorRing } from "react-loader-spinner";
import { useMessageStore } from "../../utils/store";


interface ValidationResponse {
  success: boolean;
}


interface Props {
  user?: UserTypes;
  submit: (event: FormEvent<HTMLDivElement>) => Promise<void>;
  image?: File | undefined | null,
  setImage: React.Dispatch<React.SetStateAction<any>>,
  postLoading: boolean
}


const MessageBox = ({ user, submit, image, setImage, postLoading }: Props) => {

  const [updateLoading, setUpdateLoading] = useState<boolean>(false)

  const { message, setMessage } = useMessageStore();
  const session: any = useSession();


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileType = file.type.split('/')[0];
      if (fileType === 'image') {
        setImage(file);
      } else {
        alert('Please upload an image file');
      }
    }
  };

  // const uploadThumbnailSubmit = async (event: FormEvent<HTMLDivElement>) => {
  //   event?.preventDefault()
  //   setUpdateLoading(true)
  //   const formData = new FormData();



  //   if(image) {
  //     formData.append('postImage', image);
  //     const postRes = await axios.post('/api/tweet/post', formData, {
  //       headers: {
  //         'X-Auth-Token': session.data.token,
  //       },
  //     }
  //   );

  //     // console.log(postRes)
  //   }
  // }

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const handlePhotographIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="flex space-x-2  md:p-1">
      <div className="w-full flex flex-1 items-center border bg-white p-5 rounded-2xl max-w-[750px] mx-auto" onSubmit={submit}>
        <form className="flex flex-1 flex-col p-5">
          <div className="flex gap-5 items-center">
            <img className="flex h-9 w-9 md:h-10 md:w-10 drop-shadow-sm border rounded-full object-cover" src={user?.image ? user.image : `https://links.papareact.com/gll`} alt="" />
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="bg-gray-100 rounded-full h-8 w-full px-4 py-5  text-lg outline-none placeholder:text-lg my-2" type="text" placeholder="What's Happening?" />
          </div>
          <div className={`w-3/12 ${image ? 'h-full max-h-[200px]' : ''} overflow-hidden`}>
            {image ? (
              <div className="flex flex-col items-end m-5 relative">
                <img src={URL.createObjectURL(image)} alt="Preview" className="cursor-pointer " />
                <IoMdCloseCircle className="text-gray-300 cursor-pointer duration-200 ease-in-out hover:text-gray-400 text-2xl absolute top-[-12px] right-[-12px] bg-white rounded-full" onClick={() => setImage(null)} />
              </div>
            ) : ''}
          </div>
          <div className="flex items-center py-5">
            <div className="flex flex-1 space-x-2 text-green-500">

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <PhotographIcon className="h-5 w-5 transition-transform duration-150 ease-out hover:scale-150 cursor-pointer" onClick={handlePhotographIconClick} />
              </div>
              <SearchCircleIcon className="h-5 w-5 transition-transform duration-150 ease-out hover:scale-150 cursor-pointer" />
              <EmojiHappyIcon className="h-5 w-5 transition-transform duration-150 ease-out hover:scale-150 cursor-pointer" />
              <CalendarIcon className="h-5 w-5 transition-transform duration-150 ease-out hover:scale-150 cursor-pointer" />
              <LocationMarkerIcon className="h-5 w-5 transition-transform duration-150 ease-out hover:scale-150 cursor-pointer" />
            </div>

            <button
              disabled={!message}
              className=" flex items-center justify-center gap-1 disabled:bg-gray-300 px-5 hover:bg-green-300 py-2 font-bold text-white bg-green-500 rounded-full transition-all duration-200 ease-out">Post
              {postLoading ? (
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
        </form>

      </div>



    </div>
  )
}

export default MessageBox  