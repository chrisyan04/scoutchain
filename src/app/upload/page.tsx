"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { Link, Button } from "@nextui-org/react";
import backIcon from "@/public/backIcon.svg";
const Upload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("title", title);
      data.append("user", "orhanbc.testnet");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <Link href="/">
        <Button>
          <div className="flex items-center">
            <Image src={backIcon} alt="go back" height={40} />
            <h3 className="text-xl text-[#d4af37]">Go Back</h3>
          </div>
        </Button>
      </Link>
      <h1 className="text-center text-5xl font-bold my-8 text-[#d4af37]">
        Upload
      </h1>
      <div className="m-16">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-10"
        >
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Video:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              required
            />
          </label>
          <button type="submit">Upload</button>
        </form>
      </div>
    </section>
  );
};

export default Upload;
