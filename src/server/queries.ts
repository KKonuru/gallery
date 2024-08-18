import "server-only";
import {db} from "./db";
import {auth, clerkClient} from "@clerk/nextjs/server"; 
import { and, eq } from "drizzle-orm";
import {image} from "./db/schema";
import { redirect } from "next/navigation";
import { album } from "./db/schema";
export async function getMyImages(){
    const user = auth();

    if(!user.userId)
        throw new Error("Unathorized");

    const userAlbums = await db.query.album.findMany({
        where: (model, { eq }) => eq(model.userId, user.userId),
    });
    const albumImages: {[key: string]: any} = {};

    //From each of the rows extract the value from column albumname
    const albumNames = userAlbums.map((album) => album.albumname);
    for(let i=0;i<albumNames.length;i++){
        let album = albumNames[i];
        if(album){
            albumImages[album] = await db.query.image.findMany({
                where: (model, { and, eq }) => and(eq(model.userId, user.userId), eq(model.albumName, album)),
            })
        }
    }
    return albumImages;
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

export async function getAllUserImages(){
    const response = await clerkClient.users.getUserList();

    // Extract the list of user IDs from the response
    const userIds = response.data.map(user => user.id);
    //Organize by user id with map of images of album
    const userImages: {[key: string]: any} = {};
    for(let i=0;i<userIds.length;i++){
        const uId = userIds[i];
        if(uId){
            const uploaderInfo = await clerkClient.users.getUser(uId);
            //Gets all albums of the user that is public
            const userAlbums = await db.query.album.findMany({
                where: (model, {and, eq }) =>and( eq(model.public,true),eq(model.userId, uId)),
            });

            let albumImages: {[key: string]: any} = {};
        
            //From each of the rows extract the value from column albumname
            const albumNames = userAlbums.map((album) => album.albumname);
            if(albumNames.length===0)
                continue;
            for(let i=0;i<albumNames.length;i++){
                let album = albumNames[i];
                if(album){
                    let imageSet = await db.query.image.findMany({
                        where: (model, { and, eq }) => and(eq(model.userId, uId), eq(model.albumName, album)),
                    })
                    if(imageSet.length>0){
                        albumImages[album] = imageSet;
                    }
                }
            }
            if(uploaderInfo.fullName)
                userImages[uploaderInfo.fullName] = albumImages;
        }
        
    }
    return userImages;

}

export async function getUserAlbums(){
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");
    const albums = await db.query.album.findMany({
        where: (model, {eq}) => eq(model.userId, user.userId),
        orderBy: (model, {desc}) => desc(model.createdAt),
    });
    return albums;
}

export async function createUserAlbum( name: string, publicDisplay: boolean){
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");
    //Check if album already exists
    const existingAlbum = await db.query.album.findFirst({
        where: (model, {and,eq}) => and(eq(model.albumname,name),eq(model.userId,user.userId)),
    });
    if (existingAlbum) return false;
    await db.insert(album).values({
        albumname: name,
        public: publicDisplay,
        userId: user.userId,
    });
    return true;
}