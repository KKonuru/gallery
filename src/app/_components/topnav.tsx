"use client";

import { SignIn, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { UploadButton } from "~/utils/uploadthing";
import {SimpleUploadButton} from "./simple-upload";
import {useRouter}  from "next/navigation";
export function TopNav(){
  const router = useRouter();
    return (
      <nav className="flex items-center justify-between border w-full p-4 text-xl font-semibold">
        <div ><h1 style={{cursor:'pointer'}} onClick={()=>{router.push("/")}}>Gallery</h1></div>
        <div className = "flex flex-row gap-4 items-center">
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <SimpleUploadButton />
                <UserButton />
            </SignedIn>
        </div>
      </nav>
    )
  }
