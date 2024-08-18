import Link from "next/link";
export const dynamic="force-dynamic";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getMyImages } from "../server/queries";
import Image from "next/image";
import { image } from "~/server/db/schema";
import { InferModel } from "drizzle-orm";
type ImageType = InferModel<typeof image>;
interface ImageListProps {
  images:  ImageType[];
}
function ImageList({ images }:ImageListProps) {
  return (
    <>
      {images.map((image, index) => (
        <div key={image.id + "-" + index} className="w-48">
          <Link href={`/photos/${image.id}`}>
          <Image src={image.url} style={{objectFit:"contain"}} width={480} height={480}  alt={image.name}/>
          </Link>
        </div>
      ))}
    </>
  );
}

async function Images() {
  const images = await getMyImages();
  // Get all keys from images objects
  const keys: string[] = Object.keys(images);

  return (
    <div className="justify-left px-4">
      {keys.map((key, index) => (
        <div key={key} className="font-semibold text-2xl py-10">
          {key}
          <div className="flex flex-row gap-4">
            {images[key] && images[key].length > 0 ? (
              <ImageList images={images[key]} key={key} />
            ) : (
              <p className="text-muted">No images</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default async function HomePage() {

  
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-2xl text-center">Please Sign In</div>
      </SignedOut>
      <SignedIn>
        <Images/>
      </SignedIn>
    </main>
  );
}
