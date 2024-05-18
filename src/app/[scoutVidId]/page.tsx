'use client'

import React from "react";
import backIcon from '@/public/backIcon.svg'
import Image from 'next/image';
import { Link, Button } from '@nextui-org/react'
// import ReactPlayer from "react-player";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

export default function VideoDetails({ params }: {
  params: {
    scoutVidId: string;
  };
}) {

  return (
    <div className="items-center">
      <Link href="/">
        <Button>
          <div className="flex items-center">
            <Image src={backIcon} alt="go back" height={40} />
            <h3 className="text-xl text-[#d4af37]">Go Back</h3>
          </div>
        </Button>
      </Link>
      <h2 className="text-center justify-center flex text-4xl">
        {"Video: "}&nbsp;
        <span className="text-[#d4af37]">{params.scoutVidId}</span>
      </h2>
      {/* <ReactPlayer url="https://res.cloudinary.com/dyhkvcl9v/video/upload/sp_auto/v1716064391/videos/qddkoyjysgdnwfzwogsx.m3u8" /> */}
        <CldVideoPlayer
          className=""
          width={800}
          height={450}
          src="https://res.cloudinary.com/dyhkvcl9v/video/upload/sp_auto/v1716064391/videos/qddkoyjysgdnwfzwogsx.m3u8"
          colors={{
            accent: "#d4af37",
            base: "#d4af37",
            text: "#d4af37",
          }}
          fontFace="Source Serif Pro"
        />
    </div>
  );
}
