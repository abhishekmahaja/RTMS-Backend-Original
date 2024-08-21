import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloudinary_name: process.env.CLOUDINARY_NAME,
      cloudinary_apikey: process.env.CLOUDINARY_APIKEY,
      cloudinary_secretkey: process.env.CLOUDINARY_SECRETKEY,
    });
    console.log("Cloudinary Connected");
  } catch (error) {
    console.log("Cloudinary Not Connected");
    console.log(error);
  }
};
export default connectCloudinary;
