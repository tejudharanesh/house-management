import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Custom hook to check if the user is authenticated
export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
  });

  return { isAuthenticated, loading };
}
