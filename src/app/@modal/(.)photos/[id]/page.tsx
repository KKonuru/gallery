import { getImage } from "~/server/queries";
import {Modal} from "./modal";
import FullPageImageView from "~/components/full-image-page";
export default async function PhotoModal({
    params: {id:photoId},
} :{
    params: {id:string};
}) {
    const idAsNumber = Number(photoId);
    if (Number.isNaN(idAsNumber)) throw new Error("Invalid Photo ID");
    const image = await getImage(idAsNumber);
    return <Modal><FullPageImageView id={idAsNumber}/></Modal>
}
