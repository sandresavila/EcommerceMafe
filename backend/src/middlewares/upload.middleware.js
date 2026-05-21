import multer from "multer";

import path from "path";

// CONFIG STORAGE
const storage = multer.diskStorage({

  destination: (
    req,
    file,
    cb
  ) => {

    cb(
      null,
      "uploads/"
    );
  },

  filename: (
    req,
    file,
    cb
  ) => {

    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1E9
      );

    cb(
      null,
      uniqueSuffix +
      path.extname(
        file.originalname
      )
    );
  },
});

// VALIDAR IMAGEN
const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Formato no permitido"
      ),
      false
    );
  }
};

// EXPORT
export const upload = multer({
  storage,
  fileFilter,
});