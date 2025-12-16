import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { pathname } = useLocation();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" replace />;
  }

 if (!user?.unsafeMetadata?.role && pathname !== "/onboarding") {
  return <Navigate to="/onboarding" replace />;
}


  return children;
}

export default ProtectedRoute;
