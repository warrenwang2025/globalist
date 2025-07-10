"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
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
  Building,
  Globe,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    profileData,
    loading,
    updating,
    uploadingPicture,
    updateProfile,
    uploadProfilePicture,
    removeProfilePicture,
  } = useProfile();

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    company: "",
    website: "",
  });

  // Initialize edit data when profile data loads
  React.useEffect(() => {
    if (profileData) {
      setEditData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        company: profileData.company,
        website: profileData.website,
      });
    }
  }, [profileData]);

  // Avatar handling functions
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

    const success = await uploadProfilePicture(avatarFile);
    if (success) {
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarRemove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (!confirmed) return;

    await removeProfilePicture();
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    return avatarPreview || profileData?.profilePicture;
  };

  const getUserInitials = () => {
    return profileData?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = async () => {
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleCancelAvatarUpload();
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 mx-0 md:mx-[5%]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-4 md:p-8 mx-0 md:mx-[5%]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">Unable to load profile data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 mx-0 md:mx-[5%]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                <X className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={updating}
                className="flex-1 sm:flex-none"
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {updating ? 'Saving...' : 'Save Changes'}
                </span>
                <span className="sm:hidden">
                  {updating ? 'Saving...' : 'Save'}
                </span>
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-[1fr_2fr]">
        {/* Left Column - Profile Summary */}
        <div className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <Card className="p-4 md:p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-20 h-20 md:w-24 md:h-24">
                  <AvatarImage
                    src={getAvatarUrl()}
                    alt={`${profileData.name}'s avatar`}
                  />
                  <AvatarFallback className="text-xl md:text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={triggerFileInput}
                    disabled={uploadingPicture}
                    title="Change Avatar"
                  >
                    {uploadingPicture ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
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
                        disabled={uploadingPicture}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {uploadingPicture ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelAvatarUpload}
                        disabled={uploadingPicture}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isEditing &&
                profileData.profilePicture !== "/default-user-profile-picture.webp" &&
                !avatarFile && (
                  <div className="mb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAvatarRemove}
                      disabled={uploadingPicture}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {uploadingPicture ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-3 w-3" />
                      )}
                      Remove Avatar
                    </Button>
                  </div>
                )}

              <h2 className="text-lg md:text-xl font-semibold mb-1">{profileData.name}</h2>
              <p className="text-muted-foreground mb-3 text-sm md:text-base">{profileData.email}</p>

              <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                <p>• Maximum size: 5MB</p>
                <p>• Recommended: Square images (1:1 ratio)</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold mb-4">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Created</span>
                <span className="font-medium">{profileData.contentCreatedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Generations</span>
                <span className="font-medium">{profileData.aiGenerationsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-4 md:p-6 border-red-200">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50 gap-4">
                <div>
                  <p className="font-medium text-red-800">Delete Account</p>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-100 w-full sm:w-auto"
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
          <Card className="p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
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
                <div className="flex items-center mt-1 p-2">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {profileData.email}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.phone || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={editData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="mt-1"
                    placeholder="Enter location"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.location || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={editData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="mt-1"
                    placeholder="Enter company name"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.company || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={editData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="mt-1"
                    placeholder="https://example.com"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.website ? (
                      <a 
                        href={profileData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profileData.website}
                      </a>
                    ) : (
                      'Not provided'
                    )}
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
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="mt-1 p-2 text-sm">
                  {profileData.bio || 'No bio provided'}
                </p>
              )}
            </div>
          </Card>

          {/* Account Security Component */}
          <AccountSecurity />
        </div>
      </div>
    </div>
  );
}