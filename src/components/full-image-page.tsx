import { getImage } from "~/server/queries";

export default async function FullPageImageView(props: {id: number}) {
    const image = await getImage(props.id);
    return( 
        <div className="flex w-full h-full">
            <div className="flex-shrink flex justify-center">
            <img src={image.url} className="object-contain flex-shrink"/>
            </div>
            <div className="w-48 flex-shrink-0 flex-col">
                <div className="text-xl bold">{image.name}</div>
            </div>
        </div>
    )
}
