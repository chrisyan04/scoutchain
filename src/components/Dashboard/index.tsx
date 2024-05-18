import React from 'react'
import VideoCard from './VideoCard'

export default function Dashboard() {
  return (
    <section>
      <h1 className="text-center text-5xl font-bold my-8 text-[#d4af37]">
        Dashboard
      </h1>
      <div>
        <VideoCard />
      </div>
    </section>
  );
}
