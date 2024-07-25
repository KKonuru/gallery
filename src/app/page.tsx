import Link from "next/link";
export const dynamic="force-dynamic";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getMyImages } from "../server/queries";
import Image from "next/image";
async function Images(){
  const images = await getMyImages();
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {[...images].map((image,index) => (
        <div key={image.id+"-"+index} className="flex w-48 flex-col">
          <Link href={`/photos/${image.id}`}>
            <Image src={image.url} style={{objectFit:"contain"}} width={480} height={480}  alt={image.name}/>
          </Link>
        </div>
      ))  }
    </div>
  )

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
