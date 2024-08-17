import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../server/db';
import { album } from '../../../server/db/schema';

export async function POST(request: Request) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { name, publicDisplay } = await request.json();

    const existingAlbum = await db.query.album.findFirst({
        where: (model, { and, eq }) => and(eq(model.albumname, name), eq(model.userId, userId)),
    });

    if (existingAlbum) {
        return NextResponse.json({ success: false, message: 'Album already exists' });
    }

    await db.insert(album).values({
        albumname: name,
        userId: userId,
        public: publicDisplay,
    });

    return NextResponse.json({ success: true, message: 'Album created successfully' });
}
