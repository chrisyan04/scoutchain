import React from "react";
import placeholder from "@/public/placeholder.jpeg";
import premiumIcon from "@/public/premiumIcon.svg";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Link,
  Divider,
} from "@nextui-org/react";

export default function VideoCard() {
  const scoutVidId = "Test-Title";

  return (
    <div>
      <Link href={`/${scoutVidId}`}>
        <Card isPressable>
          <CardHeader className="flex justify-between">
            <div className="items-start flex-col text-left">
              <p className="uppercase font-bold text-[#d4af37]">Title</p>
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
              alt="placeholder"
              height={200}
              width={200}
            />
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}
