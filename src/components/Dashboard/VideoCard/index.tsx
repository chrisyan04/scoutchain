'use client';

import React, { useState, useEffect } from "react";
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
  const [reports, setReports] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          `https://us-east-2.aws.neurelo.com/rest/report`,
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
        const filteredData = data.filter(
          (report: any) => report.video === video._id
        );
        setReports(filteredData.length);
      } catch (error) {
        // @ts-ignore
        setError(error.message);
      }
    };

    fetchReportData();
  }, [video]);

  if (error) {
    return <div>Error: {error}</div>;
  }
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
                {"Reports: "}
                <span className="text-[#d4af37] font-bold">{reports}</span>
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
            <Image src={placeholder} alt="thumbnail" height={200} width={300} />
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}
