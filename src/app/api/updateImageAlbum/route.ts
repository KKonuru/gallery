import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../server/db';
import { image } from '../../../server/db/schema';
import { album } from '../../../server/db/schema';
import {eq} from "drizzle-orm";
export async function POST(request: Request) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { name, url } = await request.json();
    //First check if the album exists
    const existingAlbum = await db.query.album.findFirst({
        where: (model, { and, eq }) => and(eq(model.albumname, name), eq(model.userId, userId)),
    });

    //If the album does not exists, create the album
    if (!existingAlbum) {
        await db.insert(album).values({
            albumname: name,
            userId: userId,
            public: false,
        });
    }
    
    await db.update(image).set({ albumName:name }).where(eq(image.url,url));

    return NextResponse.json({ success: true, message: 'Image Updated' });
}
