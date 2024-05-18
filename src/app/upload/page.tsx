"use client";

import React from "react";
import { useState } from "react";
import { uploadFile } from "@/actions/upload";

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
    <form onSubmit={handleSubmit}>
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
  );
};

export default Upload;
