import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const getImageKitClient = () => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit env vars are missing. Set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT."
    );
  }

  return new ImageKit({ publicKey, privateKey, urlEndpoint });
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const imagekit = getImageKitClient();
    return NextResponse.json(imagekit.getAuthenticationParameters());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ImageKit configuration error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}