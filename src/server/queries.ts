import "server-only";
import {db} from "./db";
import {auth} from "@clerk/nextjs/server"; 
import { eq } from "drizzle-orm";
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

    const image = await db.query.image.findFirst({
        where: (model, {eq}) => eq(model.id,id),
    });

    if (!image) throw new Error("Image not found");
    if(image.userId !== user.userId) throw new Error("Unauthorized");
    return image;
}