import multer from "multer";
import path from "path";

// Define storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save images to public/images and videos to public/videos
    let destination = "public/images";
    if (file.mimetype.startsWith("video")) {
      destination = "public/videos";
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Prepend current timestamp to filename
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// Define file filter
const fileFilter = (req, file, cb) => {
  const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
  const allowedVideoMimeTypes = ["video/mp4", "video/mpeg", "video/quicktime"];

  // File size limits based on type
  const imageSizeLimit = 50 * 1024 * 1024; // 50 MB
  const videoSizeLimit = 100 * 1024 * 1024; // 100 MB

  const fileSizeLimit = file.mimetype.startsWith("video")
    ? videoSizeLimit
    : imageSizeLimit;

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedImageExtensions.includes(fileExtension)) {
    cb(null, true);
  } else if (allowedVideoMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.size >= fileSizeLimit) {
    cb(
      new Error(
        `File size exceeds the limit of ${
          file.mimetype.startsWith("video") ? "100 MB" : "50 MB"
        }.`
      )
    );
  } else {
    cb(
      new Error(
        "Only images (.jpg, .jpeg, .png, .webp, .pdf) and videos (.mp4, .mpeg, .mov) are allowed."
      )
    );
  }
};

// Create Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 6, // Maximum of 6 files per request
  },
});
