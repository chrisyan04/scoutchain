import React from "react";
import placeholder from "@/public/placeholder.jpeg";
import premiumIcon from "@/public/premiumIcon.svg";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
} from "@nextui-org/react";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    url: string;
    user: string;
  };
}

export default function VideoCard({ video }: VideoCardProps) {

  return (
    <div>
      <Link href={`/${video._id}`}>
        <Card isPressable>
          <CardHeader className="flex justify-between">
            <div className="items-start flex-col text-left">
              <p className="uppercase font-bold text-[#d4af37]">
                {video.title}
              </p>
              <h4>
                {"Reviews: "}
                <span className="text-[#d4af37] font-bold">{"10"}</span>
              </h4>
            </div>
            <div className="items-end">
              <Image
                priority
                src={premiumIcon}
                alt="premium"
                height={30}
                width={30}
              />
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <Image
              src={placeholder}
              alt="thumbnail"
              height={200}
              width={300}
            />
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}
