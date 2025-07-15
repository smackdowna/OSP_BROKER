import imageKt from "../config/imageKit";


 export interface UploadFileResponse {
    url: string;
    fileId: string;
    name: string;
    thumbnailUrl?: string;
    fileType?: string;
}


const uploadFile = (file: string, fileName : string, folder: string): Promise<UploadFileResponse> => {
  return new Promise((resolve, reject) => {
    imageKt.upload(
      {
        file,
        fileName,
        folder: folder,
      },
      (err, result) => {
        if (err) {
          return reject(err.message);
        } else  {
            const response: UploadFileResponse = {
                url: result?.url as string,
                fileId: result?.fileId as string,
                name: result?.name as string,
                thumbnailUrl: result?.thumbnailUrl as string,
                fileType: result?.fileType as string
            };
            return resolve(response);
        }
      }
    );
  });
};

const deleteFile = (fileId: string) => {
  return new Promise((resolve, reject) => {
    imageKt.deleteFile(fileId, (err, result) => {
      if (err) {
        return reject(err.message);
      } else {
        return resolve(result);
      }
    });
  });
};

export {
  uploadFile,
  deleteFile
};
