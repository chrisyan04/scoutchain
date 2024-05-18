import React from 'react'

export default function VideoDetails({ params }: {
  params: {
    scoutVidId: string;
  };
}) {
  return (
    <div>
      Details {params.scoutVidId}
    </div>
  )
}
