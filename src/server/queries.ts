import "server-only";
import {db} from "./db";
import {auth} from "@clerk/nextjs/server"; 
import { and, eq } from "drizzle-orm";
import {image} from "./db/schema";
import { redirect } from "next/navigation";
export async function getMyImages(){
    const user = auth();

    if(!user.userId)
        throw new Error("Unathorized");


    const images = await db.query.image.findMany({
        where: (model,{eq}) => eq(model.userId,user.userId),
        orderBy: (model,{desc}) => desc(model.id)
    })
    return images;
}

export async function getImage(id: number){
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const images = await db.query.image.findFirst({
        where: (model, {eq}) => eq(model.id,id),
    });

    if (!images) throw new Error("Image not found");
    if(images.userId !== user.userId) throw new Error("Unauthorized");
    return images;
}

export async function deleteImage(id: number){

    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");
    await db.delete(image).where(and(eq(image.id,id),eq(image.userId,user.userId)));
    redirect("/");

}