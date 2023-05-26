import React from "react"
import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  CollectionIcon,
  DotsCircleHorizontalIcon,
  MailIcon,
  UserIcon,
  HomeIcon,
  ChatAlt2Icon
} from "@heroicons/react/outline"
import SidebarRow from "./SidebarRow"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface Props {
  children: React.ReactNode
}

const Sidebar = ({ children }: Props) => {
  return (
    <div className="hidden md:flex flex-col col-span-1 md:col-span-2 items-center md:items-start h-[90vh] ">
      {children}
    </div>
  )
}

export default Sidebar