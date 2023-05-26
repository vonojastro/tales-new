import { RefreshIcon } from "@heroicons/react/outline"
import React, { FormEvent, ReactNode } from "react"
import MyParticles from "../Background/Particles"
import particlesConfig from "../../particlesConfig/particles-config"


interface Props {
  children: React.ReactNode
}

const Feed = ({ children }: Props) => {
  // const sortedPosts = posts?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <div className="col-span-9 md:col-span-7 border-l md:p-5 relative bg-gray-100">
      {children}
    </div>
  )
}

export default Feed

