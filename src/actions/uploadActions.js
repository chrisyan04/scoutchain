"use server";
import path from "path";
import os from "os";
import fs from "fs";
// import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
// import connectDB from "../db/config";

cloudinary.config({
  cloud_name: "dyhkvcl9v",
  api_key: "277452455343461",
  api_secret: "GsUeSnLEDVIR4wl7320Lbvlz-HU",
});

async function saveFileToLocal(file) {
  const bufferPromise = file.arrayBuffer().then((data) => {
    const buffer = Buffer.from(data);
    // const name = uuidv4();
    const ext = file.type.split("/")[1];

    const tempdir = os.tmpdir();
    // const uploadDir = path.join(tempdir, `/${name}.${ext}`);
    //const uploadDir = path.join(process.cwd(), "public", `/${file.name}$`);
    const filePath = path.join(__dirname, file.name);

    fs.writeFile(filePath, buffer, (err) => err && console.error(err));

    return { filepath: filePath, filename: file.name };
  });

  return bufferPromise;
}

function uploadFileToCloudinary() {
  const filePath = path.join(__dirname, "test.wav");
  const promise = cloudinary.v2.uploader.upload(filePath, {
    folder: "videos",
    resource_type: "raw",
  });

  console.log(promise);

  return promise;
}

export async function uploadFile(video) {
  try {
    const newFile = await saveFileToLocal(video);

    const file = await uploadFileToCloudinary();
    console.log(file.url);
    console.log(file);
    fs.unlink(newFile.filepath, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("File deleted successfully");
      }
    });

    console.log("hello");
    return file.url;
  } catch (error) {
    return { errMsg: error.message };
  }
}
