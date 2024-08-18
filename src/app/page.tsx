import Link from "next/link";
export const dynamic="force-dynamic";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getAllUserImages, getMyImages } from "../server/queries";
import Image from "next/image";
import { image } from "~/server/db/schema";
import { InferModel } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

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
      <div className="py-5">
        <Card key={index} >
          <CardHeader>
            <CardTitle> <div key={key} className="font-semibold text-2xl">
            {key}</div></CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-4">
              {images[key] && images[key].length > 0 ? (
                <ImageList images={images[key]} key={key} />
              ) : (
                <p className="text-muted">No images</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      ))}
    </div>
  );
}

async function UserImages(){
  const images = await getAllUserImages();
  if (!images || Object.keys(images).length === 0) {
    return <div className="text-center">No images</div>;
  }

  const userIds = Object.keys(images);

  return (
    <div className="justify-left px-4">
      {userIds.map((userId, userIndex) => (
        <div key={userId} className="py-10">
          {Object.keys(images[userId]).length > 0 ? (
            Object.keys(images[userId]).map((albumName, albumIndex) => (
              <Card key={albumIndex}>
                <CardHeader>
                  <CardTitle>
                    <div className="font-semibold text-2xl">{albumName}</div>
                  </CardTitle>
                  <CardDescription>Uploaded By: {userId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row gap-4">
                    <ImageList images={images[userId][albumName]} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center">No albums for this user</div>
          )}
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
        <UserImages/>
      </SignedOut>
      <SignedIn>
        <Tabs defaultValue="your-images" className="p-5">
          <TabsList>
            <TabsTrigger value="your-images">Your Images</TabsTrigger>
            <TabsTrigger value="user-images">User Images</TabsTrigger>
          </TabsList>
          <TabsContent value="your-images">
            <Images/>
          </TabsContent>
          <TabsContent value="user-images">
            <UserImages/>
          </TabsContent>
        </Tabs>
      </SignedIn>
    </main>
  );
}
