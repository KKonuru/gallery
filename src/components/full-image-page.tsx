import { clerkClient } from "@clerk/nextjs/server";
import { deleteImage, getImage } from "~/server/queries";
import { Button } from "./ui/button";

export default async function FullPageImageView(props: {id: number}) {
    const image = await getImage(props.id);

    const uploaderInfo = await clerkClient.users.getUser(image.userId);
    return( 
        <div className="flex w-full h-full">
            <div className="flex-shrink flex justify-center">
            <img src={image.url} className="object-contain flex-shrink"/>
            </div>
            <div className="w-48 flex-shrink-0 flex-col border-l">
                <div className="text-xl text-center border-b p-2">{image.name}</div>
                <div className="flex flex-col p-2">
                    <span>
                        Uploaded by:
                    </span>
                    <span>
                        {uploaderInfo.fullName}
                    </span>
                </div>
                <div className="flex flex-col p-2">
                    <span>
                        Created on:
                    </span>
                    <span>
                        {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-col p-2">
                    <form action={async ()=> {
                        "use server";
                        await deleteImage(props.id);
                    }}>
                    <Button type="submit" variant="destructive">Delete</Button>
                    </form>
               </div>
            </div>
        </div>
    )
}
