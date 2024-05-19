"use client";

import React, { useEffect, useState } from "react";
import backIcon from "@/public/backIcon.svg";
import Image from "next/image";
import {
  Link,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Avatar,
} from "@nextui-org/react";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import nearIcon from "@/public/nearIcon.svg";

interface VideoData {
  id: any;
  title: string;
  url: string;
  user: string;
  index: number;
}
interface Report {
  id: string;
  user: string;
  feedback: string;
  video: string;
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reportData, setReportData] = useState<any[]>([]);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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

  useEffect(() => {
    const fetchReportData = async () => {
      if (videoData) {
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
            (report: any) =>
              report.video === videoData.id
          );
          setReportData(filteredData);
        } catch (error) {
          // @ts-ignore
          setError(error.message);
        }
      }
    };

    fetchReportData();
  }, [videoData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!videoData) {
    return <div>Loading...</div>;
  }

  // console.log("scoutVidId:", params.scoutVidId);
  // console.log("videoData:", videoData);

  return (
    <>
      <Link href="/">
        <Button>
          <div className="flex items-center">
            <Image src={backIcon} alt="go back" height={40} />
            <h3 className="text-xl text-[#d4af37]">Go Back</h3>
          </div>
        </Button>
      </Link>
      <div className="items-center flex-col justify-center flex">
        <div className="items-center justify-center">
          <h2 className="text-center justify-center flex text-4xl">
            {"Video: "}&nbsp;
            <span className="text-[#d4af37]">{videoData.title || ""}</span>
          </h2>
        </div>
        <div className="my-4">
          <Button className="text-[#d4af37] mx-4" onPress={onOpen}>
            Open Original Video
          </Button>
          <Button className="text-[#d4af37] mx-4" onPress={onOpen}>
            Open Analyzed Video
          </Button>
        </div>
      </div>
      <div className="px-6 py-4 border-2 border-[#18181b] grid grid-cols-2 gap-4 rounded-[20px]">
        <div className="flex flex-col">
          <h4 className="py-2">
            <span className="text-[#d4af37]">{"User: "}</span>
            {videoData.user}
          </h4>
          <h4 className="py-2">
            <span className="text-[#d4af37]">{"Reports: "}</span>
            {"10"}
          </h4>
          <h4 className="py-2">
            <span className="text-[#d4af37]">{"ScoutVid++ (Premium): "}</span>
            {"Yes"}
          </h4>
        </div>
        <div className="flex flex-col border-2 border-[#18181b] rounded-[20px] p-2">
          <h2 className="text-center underline text-xl">AI Analyzed Data</h2>
          <div className="flex flex-col gap-2">
            <h4>
              <span className="text-[#d4af37]">{"Emotion: "}</span>
              {"Happy"}
            </h4>
            <h4>
              <span className="text-[#d4af37]">{"Age: "}</span>
              {"25"}
            </h4>
            <h4>
              <span className="text-[#d4af37]">{"Speed: "}</span>
              {"96"}
            </h4>
          </div>
        </div>
      </div>
      <div className="text-center flex flex-col items-center justify-center my-4">
        <h2 className="text-4xl py-2">Reports</h2>
        <div className="">
          {reportData.map((report, index) => (
            <Card
              key={report.id}
              className="my-3 w-[500px] px-4"
              isPressable
              onClick={() => {
                report.index = index;
                setSelectedReport(report);
                setReportModalOpen(true);
              }}
            >
              <CardBody>
                <div className="flex justify-between items-center">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={`https://nextui.org/avatars/avatar-${index + 4}.png`}
                  />
                  <span className="text-[#d4af37] text-sm">
                    @{report.user || ""}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isReportModalOpen}
        onOpenChange={() => setReportModalOpen(!isReportModalOpen)}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="">@{selectedReport?.user || ""}</span>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <h3 className="text-[#d4af37]">{"Report: "}</h3>
                  <p>{selectedReport?.feedback || ""}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-start items-center bg-white p-2 rounded-lg">
                  <p className="invert">
                    +{" "}
                    {(
                      ((selectedReport?.feedback.length || 0) / 250) *
                      0.001 + 0.001
                    ).toFixed(3)}
                  </p>
                  &nbsp;
                  <Image src={nearIcon} alt="near coin" height={20} />
                </div>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-[#d4af37]">{videoData.title || ""}</span>
              </ModalHeader>
              <ModalBody>
                <CldVideoPlayer
                  className=""
                  width={1640}
                  height={1080}
                  src={videoData.url}
                  colors={{
                    accent: "#d4af37",
                    base: "#d4af37",
                    text: "#d4af37",
                  }}
                  fontFace="Source Serif Pro"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
