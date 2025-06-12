"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  BarChart3,
  Menu,
  X,
  Palette,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SignOutModal } from "@/components/auth/signout-modal";
import { motion } from "framer-motion";

const routes = [
  {
    label: "Dashboard",
    icon: Layout,
    href: "/dashboard",
    premium: false,
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/dashboard/calendar",
    premium: false,
  },
  {
    label: "Distribution",
    icon: Share2,
    href: "/dashboard/distribution",
    premium: false,
  },
  {
    label: "Analytics ",
    icon: BarChart3,
    href: "/dashboard/analytics",
    premium: true, // Analytics is premium only
  },
  {
    label: "AI Assistant",
    icon: Brain,
    href: "/dashboard/ai",
    premium: false,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    premium: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    avatar: "/avatars/default-avatar.jpg",
    isPremium: false, // Add premium status
  });
  const [imageError, setImageError] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulate fetching user data - replace with your actual auth logic
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = {
          name: "John Doe",
          email: "john.doe@globalistmedia.com",
          avatar: "/avatars/user-avatar.jpg",
          isPremium: false, // Set this based on your user's subscription status
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("User signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
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
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleRouteClick = (route: (typeof routes)[0], e: React.MouseEvent) => {
    // Check if route requires premium and user is not premium
    if (route.premium && !user.isPremium) {
      e.preventDefault();
      router.push("/pricing");
      closeMobileMenu();
      return;
    }

    // For non-premium routes or premium users, proceed normally
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-10 w-10"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-full fixed inset-y-0 z-40 flex flex-col bg-background border-r transition-transform duration-300 ease-in-out",
          "w-72",
          "md:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="space-y-4 py-4 flex flex-col h-full">
          <div className="px-3 py-2 flex-1">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center pl-3 mb-8 mt-12 md:mt-4"
            >
              <h1 className="text-xl md:text-2xl font-bold">Media Suite</h1>
              {user.isPremium && (
                <Crown className="h-5 w-5 ml-2 text-yellow-500" />
              )}
            </Link>

            {/* Navigation */}
            <div className="space-y-1">
              {routes.map((route) => {
                const isPremiumRoute = route.premium && !user.isPremium;

                return (
                  <Link
                    key={route.href}
                    href={isPremiumRoute ? "#" : route.href}
                    onClick={(e) => handleRouteClick(route, e)}
                    className={cn(
                      "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition relative",
                      pathname === route.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground",
                      isPremiumRoute && "opacity-60"
                    )}
                  >
                    <div className="flex items-center flex-1">
                      <route.icon className="h-5 w-5 mr-3" />
                      {route.label}
                      {isPremiumRoute && (
                        <Crown className="h-4 w-4 ml-auto text-yellow-500" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Theme Toggle Section */}
          <div className="px-3 border-t pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Theme</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-3 relative">
            {/* Profile Menu - Positioned above the profile button */}
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-3 right-3 mb-2 bg-background border rounded-lg shadow-lg p-2 space-y-1 z-50"
              >
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

                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  onClick={() => setShowSignOutModal(true)}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </motion.div>
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
                  {user.isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm truncate">
                      {user.name}
                    </span>
                    {user.isPremium && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium">
                        PRO
                      </span>
                    )}
                  </div>
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
