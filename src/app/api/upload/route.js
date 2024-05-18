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
        console.log(data.playback_url);
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
