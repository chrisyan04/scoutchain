"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";

interface VideoData {
  _id: string;
  title: string;
  url: string;
  user: string;
}

export default function Dashboard() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "https://us-east-2.aws.neurelo.com/rest/video",
          {
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY":
                "neurelo_9wKFBp874Z5xFw6ZCfvhXbTJBtQXczbOYlMQVeBt+/Hw5HRzpBXj8+72WTG3FXOBLTTKY4WUPn8g8Kc9S8jAYaal2H2yHaCsMcFtOvKgoWCmnNZJPHwYo45NvKBZsrh6nl+gryRNPpBSsm1khktd6MFTPgUQArG+n8X+UHoy2LoGUkEuQuC+s0nDOb6gDQfi_N687GDEkAm5YOp9PfL9u29a/WP68Rouy4TfbH6i2EVo=",
            },
          }
        );

        const data = response.data.data;

        if (!Array.isArray(data)) {
          throw new Error("Fetched data is not an array");
        }

        const videosArray = data.map((video: any) => ({
          _id: video.id,
          title: video.title,
          url: video.url,
          user: video.user,
        }));

        console.log("Fetched data:", videosArray); // Log the fetched data

        setVideos(videosArray);
      } catch (error) {
        console.error("Error fetching videos:", error);
        // @ts-ignore
        setError(error.message || "An error occurred while fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h1 className="text-center text-5xl font-bold my-8 text-[#d4af37]">
        Dashboard
      </h1>
      <div className="gap-4 grid grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
}
