import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../server/db';
import { album } from '../../../server/db/schema';

export async function GET() {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }


    const userAlbums = await db.query.album.findMany({
        where: (model, { eq }) => eq(model.userId, userId),
    });

    //From each of the rows extract the value from column albumname
    const albumNames = userAlbums.map((album) => album.albumname);

    return NextResponse.json({ success: true, albums: albumNames });
}
