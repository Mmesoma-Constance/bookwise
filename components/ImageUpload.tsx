'use client';

import config from "@/lib/config";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  Image as IKImage,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
   
    const response = await fetch(`${config.env.apiEndpoint}/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Authentication request failed: ${message}`);
  }
};

interface Props {
  onFileChange: (filePath: string) => void;
}

const ImageUpload = ({ onFileChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    const fileToUpload = fileInputRef.current?.files?.[0];

    if (!fileToUpload) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const { signature, expire, token } = await authenticator();

      const res = await upload({
        file: fileToUpload,
        fileName: fileToUpload.name,
        publicKey,
        signature,
        expire,
        token,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      setFile({ filePath: res.filePath! });
      onFileChange(res.filePath!);

      toast.success("Image uploaded successfully", {
        description: `${res.filePath} uploaded successfully`,
      });
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload aborted");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid upload request");
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error during upload");
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error during upload");
      } else {
        toast.error("Image upload failed");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
      />

      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
          suppressHydrationWarning
        />
        <p className="text-base text-light-100">Upload a file</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {progress > 0 && progress < 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
      )}

      {file && (
        <IKImage
          urlEndpoint={urlEndpoint}
          src={file.filePath}
          alt={file.filePath}
          width={500}
          height={300}
        />
      )}
    </div>
  );
};

export default ImageUpload;