"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AccountSecurity } from "@/components/profile/account-security";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Trash2,
} from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Content creator and social media strategist with 5+ years of experience in digital marketing.",
    company: "Digital Marketing Agency",
    website: "https://johndoe.com",
    joinDate: "January 2023",
    avatar: "/placeholder-avatar.jpg",
  });

  // Avatar handling functions (keep all existing avatar functions)
  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description:
          "Please select a valid image file (JPEG, PNG, GIF, or WebP).",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Avatar Selected",
      description: "Click 'Confirm' to save your new profile picture.",
    });
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast({
        title: "No File Selected",
        description: "Please select an avatar image first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProfileData((prev) => ({
        ...prev,
        avatar: avatarPreview || prev.avatar,
      }));

      setAvatarFile(null);
      setAvatarPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (!confirmed) return;

    setIsUploadingAvatar(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfileData((prev) => ({
        ...prev,
        avatar: "/placeholder-avatar.jpg",
      }));

      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Avatar Removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatarUpload = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Upload Cancelled",
      description: "Avatar upload has been cancelled.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getAvatarUrl = () => {
    return avatarPreview || profileData.avatar;
  };

  const getUserInitials = () => {
    return profileData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully!",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleCancelAvatarUpload();
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-8 mx-[5%]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Left Column - Profile Summary */}
        <div className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <Card className="p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={getAvatarUrl()}
                    alt={`${profileData.name}'s avatar`}
                  />
                  <AvatarFallback className="text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={triggerFileInput}
                    disabled={isUploadingAvatar}
                    title="Change Avatar"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />

              {isEditing && avatarFile && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-800 mb-3">
                      New avatar selected: {avatarFile.name}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        size="sm"
                        onClick={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUploadingAvatar ? "Uploading..." : "Confirm"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelAvatarUpload}
                        disabled={isUploadingAvatar}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isEditing &&
                profileData.avatar !== "/placeholder-avatar.jpg" &&
                !avatarFile && (
                  <div className="mb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAvatarRemove}
                      disabled={isUploadingAvatar}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Remove Avatar
                    </Button>
                  </div>
                )}

              <h2 className="text-xl font-semibold mb-1">{profileData.name}</h2>
              <p className="text-muted-foreground mb-3">{profileData.email}</p>

              <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                <p>• Maximum size: 5MB</p>
                <p>• Recommended: Square images (1:1 ratio)</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Created</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Generations</span>
                <span className="font-medium">1,432</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{profileData.joinDate}</span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <p className="font-medium text-red-800">Delete Account</p>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-100"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    );
                    if (confirmed) {
                      toast({
                        title: "Account Deletion",
                        description:
                          "Account deletion process would be initiated here.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.name}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.email}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.phone}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.location}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="mt-1 p-2 text-sm">{profileData.bio}</p>
              )}
            </div>
          </Card>

          {/* Professional Information
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Professional Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="company">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 text-sm">{profileData.company}</p>
                )}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 p-2 text-sm text-primary hover:underline block"
                  >
                    {profileData.website}
                  </a>
                )}
              </div>
            </div>
          </Card> */}

          {/* Account Security Component */}
          <AccountSecurity />
        </div>
      </div>
    </div>
  );
}
