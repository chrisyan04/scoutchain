import { Schema, model, models } from "mongoose";

export interface IVideos {
  url: string;
  email: string;
  title: string;
}

const videoSchema = new Schema<IVideos>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = models.Video || model("Video", videoSchema);

export default Video;
