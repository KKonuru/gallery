import Link from "next/link";
import { db } from "~/server/db";
const mockUrls = [
  "https://utfs.io/f/1d7feb4a-530b-4d9b-b698-436e6bebe468-i9ujm1.webp",
  "https://utfs.io/f/35453f08-a9d3-4c0a-b082-f6fd258dce94-yu13ay.webp",
  "https://utfs.io/f/6d5dcce1-13a3-42a1-87e7-80f2e61bc886-7xkir8.avif",
  "https://utfs.io/f/63f5e6a9-43cc-4ea0-a41d-34328e023e97-vwaf5h.avif",

];


const mockImages = mockUrls.map((url,index) => ({
    id:index+1,
    url:url,
  }
));

export default async function HomePage() {

  const posts = await db.query.posts.findMany();
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {
          posts.map((post) => (
            <div key={post.id} className="w-48">
              {post.name}
            </div>
          ))
        }
        {[...mockImages,...mockImages,...mockImages].map((image,index) => (
          <div key={image.id+"-"+index} className="w-48">
            <img src={image.url}/>
          </div>
        ))  }
      </div>
    </main>
  );
}
