import { useState, useEffect } from "react";

interface User {
  isPremium: boolean;
}

export function useUser() {
  const [user, setUser] = useState<User>({ isPremium: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual auth logic
        const userData = { isPremium: false };
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, loading, setUser };
}