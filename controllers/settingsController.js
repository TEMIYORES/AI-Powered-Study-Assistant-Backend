import Account from "../model/Account.js";
import { v2 as cloudinary } from "cloudinary";
const updateSettingsAccount = async (req, res) => {
  const { email, fullName, phoneNumber } = req.body;
  let files = "";
  if (req.files) {
    files = Object.keys(req.files).map(async (key) => req.files[key]);
  }
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const account = await Account.findOne({ email }).exec();
    let imageUrl = "";
    if (files) {
      imageUrl = await files[0].then(async (fileBuffer) => {
        // Extract the file buffer from the file object
        const splitUrl = account.photoURL.split("/");
        const imageToDeleteId = splitUrl[splitUrl.length - 1].split(".")[0];
        await deleteImage(imageToDeleteId);
        const imageUrls = await uploadImageBuffer(
          fileBuffer,
          "AI-Powered Study Assistant"
        );
        return imageUrls;
      });
    }
    if (imageUrl) account.photoURL = imageUrl;
    if (fullName) account.fullName = fullName;
    // if (photoURL) account.photoURL = photoURL;
    if (phoneNumber) account.phoneNumber = phoneNumber;
    await account.save();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating info:", error);
    return res.sendStatus(400);
  }
};


// Function to delete an image from Cloudinary
const deleteImage = async (imageToDeleteId) => {
  try {
    const result = await cloudinary.uploader.destroy(
      "AI-Powered Study Assistant/" + imageToDeleteId,
      {
        resource_type: "image",
      }
    );
    console.log("Image deletion result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Function to upload image buffer to Cloudinary
const uploadImageBuffer = async (imageBuffer, folderName) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: folderName, resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(imageBuffer.data);
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export { updateSettingsAccount };
