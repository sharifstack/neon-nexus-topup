import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = "neon-nexus",
  options: { maxWidth?: number; maxHeight?: number; isGif?: boolean } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: options.isGif ? "gif" : "auto",
        ...(options.isGif && { flags: "animated" }),
        ...(options.maxWidth && { width: options.maxWidth, crop: "limit" }),
        ...(options.maxHeight && { height: options.maxHeight, crop: "limit" }),
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error("Unknown Cloudinary error"));
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

export default cloudinary;
