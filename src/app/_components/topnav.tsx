import { SignIn, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function TopNav(){
    return (
      <nav className="flex items-center justify-between border w-full p-4 text-xl font-semibold">
        <div>Gallery</div>
        <div>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
      </nav>
    )
  }
