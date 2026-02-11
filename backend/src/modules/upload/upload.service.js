const cloudinary = require("../../shared/config/cloudinary");

exports.uploadFiles = async (files, folder = "general") => {
  try {
    const results = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder,
                resource_type: "auto",
                quality: "auto",
                fetch_format: "auto",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              },
            );
            stream.end(file.buffer);
          }),
      ),
    );

    return results.map((file) => ({
      url: file.secure_url,
      public_id: file.public_id,
      resource_type: file.resource_type,
    }));
  } catch (error) {
    throw error;
  }
};

exports.deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
