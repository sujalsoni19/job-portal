import { ModeToggle } from "@/components/ui/themetoggle";
import { Link, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import { Button } from "@/components/ui/button";
import {
  PenBoxIcon,
  MenuIcon,
  BriefcaseBusinessIcon,
  Heart,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const { user } = useUser();

  const [showSignIn, setshowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get("sign-in")) {
      setshowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setshowSignIn(false);
      setSearch({});
    }
  };

  return (
    <div>
      <div className="backdrop-blur flex justify-between items-center py-4 px-1 sm:px-16">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex gap-1 sm:gap-8 items-center">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <MenuIcon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 sm:hidden">
              <SignedOut>
                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={() => setshowSignIn(true)}
                >
                  Login
                </Button>
              </SignedOut>

              <SignedIn>
                <div className="flex mb-1 justify-center">
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Jobs"
                        labelIcon={<BriefcaseBusinessIcon size={15} />}
                        href="/my-jobs"
                      />
                      <UserButton.Link
                        label="Saved Jobs"
                        labelIcon={<Heart size={15} />}
                        href="/saved-jobs"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>

                {user?.unsafeMetadata?.role === "recruiter" && (
                  <Link to="/post-job">
                    <Button variant="blue" className="w-full">
                      <PenBoxIcon className="mr-2 h-4 w-4" />
                      Post a Job
                    </Button>
                  </Link>
                )}
              </SignedIn>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex gap-4 items-center">
            <SignedOut>
              <Button variant="outline" onClick={() => setshowSignIn(true)}>
                Login
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusinessIcon size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                </UserButton.MenuItems>
              </UserButton>
              {user?.unsafeMetadata?.role === "recruiter" && (
                  <Link to="/post-job">
                    <Button variant="blue" className="w-full">
                      <PenBoxIcon className="mr-2 h-4 w-4" />
                      Post a Job
                    </Button>
                  </Link>
                )}
            </SignedIn>
          </div>
        </div>
      </div>
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 "
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            signUpFallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </div>
  );
}

export default Header;
