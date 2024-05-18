import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import { join } from "path";

cloudinary.config({
  cloud_name: "dyhkvcl9v",
  api_key: "277452455343461",
  api_secret: "GsUeSnLEDVIR4wl7320Lbvlz-HU",
});

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const title = data.get("title");
    const user = data.get("user");

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join("/", "tmp", file.name);
    await writeFile(path, buffer);
    console.log(`open ${path} in your browser`);

    cloudinary.v2.uploader
      .upload(path, { resource_type: "video", folder: "videos" })
      .then((data) => {
        fetch("https://us-east-2.aws.neurelo.com/rest/video/__one", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY":
              "neurelo_9wKFBp874Z5xFw6ZCfvhXbTJBtQXczbOYlMQVeBt+/Hw5HRzpBXj8+72WTG3FXOBLTTKY4WUPn8g8Kc9S8jAYaal2H2yHaCsMcFtOvKgoWCmnNZJPHwYo45NvKBZsrh6nl+gryRNPpBSsm1khktd6MFTPgUQArG+n8X+UHoy2LoGUkEuQuC+s0nDOb6gDQfi_N687GDEkAm5YOp9PfL9u29a/WP68Rouy4TfbH6i2EVo=",
          },
          body: JSON.stringify({ url: data.playback_url, user, title }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Video uploaded successfully");
            } else {
              console.error("Failed to upload video");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => {
        console.err(err);
      });

    return new Response("Video uploaded successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to upload video", { status: 500 });
  }
};
