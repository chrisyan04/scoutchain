"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadFile(file: File): Promise<Response> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = join("../public/", "video.mp4");
  await writeFile(path, buffer);
  return new Response("ok");
}
