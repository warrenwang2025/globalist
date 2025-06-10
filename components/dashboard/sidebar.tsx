"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Settings,
  Layout,
  Share2,
  Brain,
  UserCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SignOutModal } from "@/components/auth/signout-modal";

const routes = [
  {
    label: "Dashboard",
    icon: Layout,
    href: "/dashboard",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/dashboard/calendar",
  },
  {
    label: "Distribution",
    icon: Share2,
    href: "/dashboard/distribution",
  },
  {
    label: "AI Assistant",
    icon: Brain,
    href: "/dashboard/ai",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    avatar: "/avatars/default-avatar.jpg",
  });
  const [imageError, setImageError] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Simulate fetching user data - replace with your actual auth logic
  useEffect(() => {
    // Replace this with your actual user data fetching
    const fetchUserData = async () => {
      try {
        // const userData = await getCurrentUser(); // Your auth function
        const userData = {
          name: "John Doe",
          email: "john.doe@globalistmedia.com",
          avatar: "/avatars/user-avatar.jpg",
        };
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    try {
      // Simulate sign out process - replace with your actual sign out logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically:
      // 1. Clear authentication tokens
      // 2. Clear user data from state/localStorage
      // 3. Make API call to invalidate session
      // Example:
      // await signOut(); // Your auth function
      // localStorage.removeItem('authToken');
      // clearUserData();
      
      console.log("User signed out successfully");
      
      // Redirect to landing page
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Handle sign out error if needed
    } finally {
      setIsSigningOut(false);
      setShowSignOutModal(false);
    }
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleProfileNavigation = () => {
    router.push("/dashboard/profile");
    setIsProfileMenuOpen(false); // Close menu after navigation
  };

  return (
    <>
      <div className="space-y-4 py-4 flex flex-col h-full bg-secondary/5">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <h1 className="text-2xl font-bold">Media Suite</h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname === route.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="mt-auto px-3 relative">
          {/* Profile Menu - Positioned above the profile button */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-background border rounded-lg shadow-lg p-2 space-y-1 animate-in slide-in-from-bottom-2 duration-200 z-50">
              {/* Profile Button */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                  pathname === "/dashboard/profile"
                    ? "text-primary bg-primary/10"
                    : ""
                )}
                onClick={handleProfileNavigation}
              >
                <UserCircle className="h-5 w-5 mr-3" />
                Profile Settings
              </Button>

              {/* Sign Out Button */}
              <Button
                variant="ghost"
                className="w-full justify-start p-3 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                onClick={() => setShowSignOutModal(true)}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          )}

          {/* Profile Toggle Button */}
          <Button
            variant="secondary"
            className={cn(
              "w-full justify-start h-auto p-3 hover:bg-primary/10 transition-colors",
              isProfileMenuOpen || pathname === "/dashboard/profile"
                ? "bg-primary/10 text-primary"
                : ""
            )}
            onClick={handleProfileClick}
          >
            <div className="flex items-center w-full">
              <div className="relative mr-3 flex-shrink-0">
                {!imageError ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-gray-200"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="font-medium text-sm truncate w-full">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {user.email}
                </span>
              </div>
              <div className="ml-2 flex-shrink-0">
                {isProfileMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        open={showSignOutModal}
        onOpenChange={setShowSignOutModal}
        onConfirm={handleSignOut}
        isLoading={isSigningOut}
      />
    </>
  );
}
