"use client";

import { useRouter } from "next/navigation";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner"

// inferred input off useUploadThing
type Input = Parameters<typeof useUploadThing>;
function UploadSVG(){
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
      );
}
const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const result = await $ut.startUpload(selectedFiles);

    console.log("uploaded files", result);
    // TODO: persist result in state maybe?
  };

  return {
    inputProps: {
      onChange,
      multiple: ($ut.permittedFileInfo?.config?.image?.maxFileCount ?? 1) > 1,
      accept: "image/*",
    },
    isUploading: $ut.isUploading,
  };
};
function LoadingSpinner(){
  return(
     <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
      <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" className="spinner_aj0A"/>
    </svg>
  );
}
export function SimpleUploadButton(){
    const router= useRouter();
    const {inputProps} = useUploadThingInputProps("imageUploader",{
      onUploadBegin(){
        toast(<div className="flex items-center gap-2 text-white"><LoadingSpinner></LoadingSpinner> <span className="text-lg">Uploading...</span></div>,{
          duration: 100000,
          id: "upload-begin"
        });
      },
        onClientUploadComplete(){
          toast.dismiss("upload-begin");
          toast("Upload complete!");
            router.refresh();
        }
    });
    return (
    <div>
        <label htmlFor="upload-button"> <UploadSVG /></label>
        <input id="upload-button" type="file" className="sr-only" {...inputProps}/>
    </div>
    );
}