import React from 'react'
import backIcon from '@/public/backIcon.svg'
import Image from 'next/image';
import { Link, Button } from '@nextui-org/react'

export default function VideoDetails({ params }: {
  params: {
    scoutVidId: string;
  };
}) {
  return (
    <div>
      <Link href="/">
        <Button>
          <div className="flex items-center">
            <Image src={backIcon} alt="go back" height={40} />
            <h3 className="text-xl text-[#d4af37]">Go Back</h3>
          </div>
        </Button>
      </Link>
      Details {params.scoutVidId}
    </div>
  );
}
