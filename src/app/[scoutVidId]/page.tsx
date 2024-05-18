"use client";

import React, { useEffect, useState } from "react";
import backIcon from "@/public/backIcon.svg";
import Image from "next/image";
import { Link, Button } from "@nextui-org/react";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

interface VideoData {
  _id: string;
  title: string;
  url: string;
  user: string;
}

export default function VideoDetails({
  params,
}: {
  params: {
    scoutVidId: string;
  };
}) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(
          `https://us-east-2.aws.neurelo.com/rest/video/${params.scoutVidId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY":
                "neurelo_9wKFBp874Z5xFw6ZCfvhXbTJBtQXczbOYlMQVeBt+/Hw5HRzpBXj8+72WTG3FXOBLTTKY4WUPn8g8Kc9S8jAYaal2H2yHaCsMcFtOvKgoWCmnNZJPHwYo45NvKBZsrh6nl+gryRNPpBSsm1khktd6MFTPgUQArG+n8X+UHoy2LoGUkEuQuC+s0nDOb6gDQfi_N687GDEkAm5YOp9PfL9u29a/WP68Rouy4TfbH6i2EVo=",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const { data } = await response.json();
        setVideoData(data);
      } catch (error) {
        // @ts-ignore
        setError(error.message);
      }
    };

    fetchVideoData();
  }, [params.scoutVidId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!videoData) {
    return <div>Loading...</div>;
  }

  // console.log("scoutVidId:", params.scoutVidId);
  console.log("videoData:", videoData);

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
        <span className="text-[#d4af37]">{videoData.title || ""}</span>
      </h2>
      <CldVideoPlayer
        className=""
        width={800}
        height={450}
        src={videoData.url}
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
