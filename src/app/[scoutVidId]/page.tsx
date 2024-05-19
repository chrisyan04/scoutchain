// /mnt/data/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import backIcon from "@/public/backIcon.svg";
import addIcon from "@/public/addIcon.svg";
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
import * as nearAPI from "near-api-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import outputVideo from "@/public/output_video7.mp4";

interface VideoData {
  id: string;
  title: string;
  url: string;
  user: string;
}

interface Report {
  id: string;
  user: string;
  feedback: string;
  video: string;
  index: number;
}

export default function VideoDetails({
  params,
}: {
  params: { scoutVidId: string };
}) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen: isOriginalOpen,
    onOpen: onOriginalOpen,
    onOpenChange: onOriginalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isAnalyzedOpen,
    onOpen: onAnalyzedOpen,
    onOpenChange: onAnalyzedOpenChange,
  } = useDisclosure();
  const [reportData, setReportData] = useState<Report[]>([]);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [report, setReport] = useState<string>("");
  const [emptyReport, setEmptyReport] = useState<boolean>(false);
  const { connect, keyStores, WalletConnection } = nearAPI;
  const [myKeyStore, setMyKeyStore] =
    useState<nearAPI.keyStores.KeyStore | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const [loading, setLoading] = useState(false);
  const [walletAccountObj, setWalletAccountObj] =
    useState<nearAPI.Account | null>(null);
  const [receiverId, setReceiverId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMyKeyStore(new keyStores.BrowserLocalStorageKeyStore());
    }
  }, []);

  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
  };

  const addReport = async () => {
    if (!report) {
      setEmptyReport(true);
      return;
    }

    setEmptyReport(false);

    try {
      const response = await fetch(
        `https://us-east-2.aws.neurelo.com/rest/report/__one`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY":
              "neurelo_9wKFBp874Z5xFw6ZCfvhXbTJBtQXczbOYlMQVeBt+/Hw5HRzpBXj8+72WTG3FXOBLTTKY4WUPn8g8Kc9S8jAYaal2H2yHaCsMcFtOvKgoWCmnNZJPHwYo45NvKBZsrh6nl+gryRNPpBSsm1khktd6MFTPgUQArG+n8X+UHoy2LoGUkEuQuC+s0nDOb6gDQfi_N687GDEkAm5YOp9PfL9u29a/WP68Rouy4TfbH6i2EVo=",
          },
          body: JSON.stringify({
            feedback: report,
            user: "yanner.testnet",
            video: params.scoutVidId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add report");
      }

      setAddModalOpen(false);
      setReport("");
      setLoading(true);

      const amount = BigInt(1000000000000000000000);
      if (walletAccountObj) {
        const result = await walletAccountObj.sendMoney(
          videoData!.user,
          amount
        );
        console.log("Transaction result:", result);
        window.location.reload();
        toast.success("$NEAR claimed successfully!");
      }
    } catch (error) {
      console.error("Error adding report:", error);
      console.error("Error sending money:", error);
      toast.error("$NEAR claim failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (myKeyStore) {
      const connectToNear = async () => {
        try {
          const nearConnection = await connect({
            ...connectionConfig,
            keyStore: myKeyStore,
          });
          const walletConnection = new WalletConnection(
            nearConnection,
            "testing"
          );
          console.log("Wallet connection:", walletConnection);

          const url = await walletConnection.requestSignInUrl({
            contractId: "yanner.testnet",
          });
          setConnectionStatus("Connected");
          console.log("URL:", url);

          if (walletConnection.isSignedIn()) {
            const walletAccountId = walletConnection.getAccountId();
            const walletAccount = walletConnection.account();
            console.log("Wallet account object:", walletAccount);

            const accountBalance = await walletAccount.getAccountBalance();
            console.log("Account balance:", accountBalance);

            setWalletAccountObj(walletAccount);
          }
        } catch (error) {
          console.log("Error connecting to NEAR:", error);
          setConnectionStatus("Failed to connect");
        }
      };
      connectToNear();
    }
  }, [myKeyStore]);

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
            (report: any) => report.video === videoData.id
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
          <Button className="text-[#d4af37] mx-4" onPress={onOriginalOpen}>
            Open Original Video
          </Button>
          <Button className="text-[#d4af37] mx-4" onPress={onAnalyzedOpen}>
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
            {reportData.length}
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
              <span className="text-[#d4af37]">{"Top Speed: "}</span>
              {"25.2 km/h"}
            </h4>
            <h4>
              <span className="text-[#d4af37]">{"Top Distance: "}</span>
              {"64.98 m"}
            </h4>
            <h4>
              <span className="text-[#d4af37]">{"Ball Possession: "}</span>
              {"42 %"}
            </h4>
          </div>
        </div>
      </div>
      <div className="text-center flex flex-col items-center justify-center my-4">
        <h2 className="text-4xl py-2">Reports</h2>
        <div className="">
          {videoData.user !== "yanner.testnet" && (
            <Card
              className="my-3 w-[500px] px-4 bg-[#d4af37]"
              isPressable
              onClick={() => setAddModalOpen(true)}
            >
              <CardBody>
                <div className="flex justify-center items-center">
                  <Image src={addIcon} alt="add" height={30} width={30}></Image>
                  &nbsp;
                  <span className="text-black text-lg">Add Report</span>
                </div>
              </CardBody>
            </Card>
          )}
          {reportData.length > 0 ? (
            reportData.map((report, index) => (
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
            ))
          ) : (
            <Card className="my-3 w-[500px] px-4" isPressable>
              <CardBody>
                <p className="text-[#d4af37] text-center">No Current Reports</p>
              </CardBody>
            </Card>
          )}
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
                      ((selectedReport?.feedback.length || 0) / 250) * 0.001 +
                      0.001
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
      <Modal
        isOpen={isOriginalOpen}
        onOpenChange={onOriginalOpenChange}
        size="3xl"
      >
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
      <Modal
        isOpen={isAnalyzedOpen}
        onOpenChange={onAnalyzedOpenChange}
        size="3xl"
      >
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
                  src="https://res.cloudinary.com/dyhkvcl9v/video/upload/v1716107319/videos/sgfmu3bhfqchmc2bwecg.mp4"
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
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={() => setAddModalOpen(!isAddModalOpen)}
        size="3xl"
      >
        <ModalContent>
          {(onAddClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-[#d4af37]">Add Report</span>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <h3 className="text-[#d4af37]">
                    Report &nbsp;
                    {emptyReport && (
                      <>
                        (
                        <span className="text-xs text-red-500">
                          This field is required
                        </span>
                        )
                      </>
                    )}
                    :
                  </h3>
                  <textarea
                    className="w-full h-[200px] p-2"
                    placeholder="Enter your report here..."
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                  ></textarea>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="light" onPress={addReport}>
                  Add
                </Button>
                <Button color="danger" variant="light" onPress={onAddClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
}
