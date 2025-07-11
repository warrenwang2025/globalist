"use client";

import React from "react";
import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Upload,
  RotateCcw,
  Loader2,
  Building,
  Globe,
} from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Discord-style editing states
  const [showImageEditDialog, setShowImageEditDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<string[]>([]);

  const {
    profileData,
    loading,
    updating,
    uploadingPicture,
    deletingAccount,
    updateProfile,
    uploadProfilePicture,
    removeProfilePicture,
    deleteAccount,
    refreshProfile,
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
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImageUrl(result);
        setTempImageUrl(result);
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
        setShowEditProfileDialog(false);
        setShowImageEditDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create canvas to generate resized image
  const createResizedImage = useCallback((
    imageUrl: string,
    zoom: number,
    position: { x: number; y: number },
    size: number = 300
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = size;
      canvas.height = size;
      
      img.onload = () => {
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Calculate image dimensions and position
        const scaledWidth = img.width * zoom;
        const scaledHeight = img.height * zoom;
        
        // Center the image and apply position offset
        const x = (size - scaledWidth) / 2 + position.x;
        const y = (size - scaledHeight) / 2 + position.y;
        
        // Draw the image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
    });
  }, []);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImageUrl(result);
        setTempImageUrl(result);
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
        setShowEditProfileDialog(false);
        setShowImageEditDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain movement within reasonable bounds
      const maxMove = 150;
      setImagePosition({
        x: Math.max(-maxMove, Math.min(maxMove, newX)),
        y: Math.max(-maxMove, Math.min(maxMove, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - imagePosition.x,
      y: touch.clientY - imagePosition.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      const maxMove = 150;
      setImagePosition({
        x: Math.max(-maxMove, Math.min(maxMove, newX)),
        y: Math.max(-maxMove, Math.min(maxMove, newY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Reset image position and zoom
  const resetImageTransform = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Save the edited image with transformations applied
  const handleSaveEditedImage = async () => {
    if (!originalImageUrl) return;

    setIsUploadingAvatar(true);
    
    try {
      // Create the resized image
      const resizedImageUrl = await createResizedImage(
        originalImageUrl,
        imageZoom,
        imagePosition,
        400 // High quality output
      );

      // Add to upload history
      setUploadHistory(prev => [resizedImageUrl, ...prev.slice(0, 4)]); // Keep last 5 uploads

      // Update profile data
      // setProfileData(prev => ({
      //   ...prev,
      //   profilePicture: resizedImageUrl
      // }));

      // Clean up temporary states
      setShowImageEditDialog(false);
      setTempImageUrl("");
      setOriginalImageUrl("");
      resetImageTransform();
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been saved with the applied transformations.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the edited image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle profile picture deletion
  const handleDeleteProfilePicture = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile picture?"
    );
    if (!confirmed) return;

    setIsUploadingAvatar(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Revoke the current avatar URL if it's a blob URL
      if (profileData?.profilePicture?.startsWith('blob:')) {
        URL.revokeObjectURL(profileData.profilePicture);
      }

      // Reset to default avatar
      // setProfileData(prev => ({
      //   ...prev,
      //   profilePicture: "/placeholder-avatar.jpg"
      // }));

      // Clear any temporary states
      setTempImageUrl("");
      setOriginalImageUrl("");
      resetImageTransform();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Profile Picture Deleted",
        description: "Your profile picture has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle edit profile click
  const handleEditProfileClick = () => {
    setShowEditProfileDialog(true);
  };

  // Handle cancel image editing
  const handleCancelImageEdit = () => {
    setShowImageEditDialog(false);
    setTempImageUrl("");
    setOriginalImageUrl("");
    resetImageTransform();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle selecting from upload history
  const handleSelectFromHistory = (imageUrl: string) => {
    setTempImageUrl(imageUrl);
    
    setShowEditProfileDialog(false);
    
    toast({
      title: "Profile Picture Updated",
      description: "Selected image from upload history.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getAvatarUrl = () => {
    return profileData?.profilePicture;
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
    handleCancelImageEdit();
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
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
          <Card className="p-4 md:p-6 bg-card border-border">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div 
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                  onClick={isEditing ? handleEditProfileClick : undefined}
                >
                  <Avatar className="w-20 h-20 md:w-24 md:h-24">
                    <AvatarImage
                      src={profileData.profilePicture}
                      alt={`${profileData.name}'s avatar`}
                    />
                    <AvatarFallback className="text-xl md:text-2xl bg-muted text-muted-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Discord-style hover overlay */}
                  {isEditing && (
                    <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200 ${
                      isHoveringAvatar ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Discord-style edit pen */}
                {isEditing && (
                  <button
                    onClick={handleEditProfileClick}
                    className="absolute -bottom-2 -right-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-1.5 text-xs shadow-lg transition-colors duration-200"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h2 className="text-lg md:text-xl font-semibold mb-1 text-foreground">{profileData.name}</h2>
              <p className="text-muted-foreground mb-3 text-sm md:text-base">{profileData.email}</p>

              {/* Upload History */}
              {uploadHistory.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Recent Uploads</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {uploadHistory.slice(0, 3).map((url, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectFromHistory(url)}
                        className="w-8 h-8 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors"
                        title="Click to use this image"
                      >
                        <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                <p>• Maximum size: 10MB</p>
                <p>• Transformations are saved permanently</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="font-semibold mb-4 text-foreground">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Created</span>
                <span className="font-medium text-foreground">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Generations</span>
                <span className="font-medium text-foreground">1,432</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium text-foreground">{profileData.joinDate}</span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-4 md:p-6 border-destructive/20 bg-card">
            <h3 className="text-lg font-semibold mb-4 text-destructive">
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5 gap-4">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-destructive/80">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    );
                    if (confirmed) {
                      deleteAccount();
                    }
                  }}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-6">
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Personal Information</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 text-foreground">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.name}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 text-foreground">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.email}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 text-foreground">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {profileData.phone || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-foreground">Location</Label>
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
                  <div className="flex items-center mt-1 p-2 text-foreground">
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
              <Label htmlFor="bio" className="text-foreground">Bio</Label>
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
                <p className="mt-1 p-2 text-sm text-foreground">{profileData.bio}</p>
              )}
            </div>
          </Card>

          {/* Account Security Component */}
          <AccountSecurity />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Discord-style Edit Profile Dialog - Rounded and Centered */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-2xl shadow-2xl border-0 p-0 bg-background">
          <div className="bg-background rounded-2xl p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Profile Picture</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Upload a new image, select from recent uploads, or delete your current picture.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={profileData.profilePicture}
                      alt="Current Profile Picture"
                    />
                    <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Device
                </Button>
                
                {profileData.profilePicture !== "/placeholder-avatar.jpg" && (
                  <Button
                    onClick={handleDeleteProfilePicture}
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isUploadingAvatar}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isUploadingAvatar ? "Deleting..." : "Delete Picture"}
                  </Button>
                )}
              </div>

              {/* Upload History */}
              {uploadHistory.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Recent Uploads</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadHistory.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectFromHistory(url)}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                        title={`Use upload ${index + 1}`}
                      >
                        <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditProfileDialog(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discord-style Image Edit Dialog - Rounded and Centered */}
      <Dialog open={showImageEditDialog} onOpenChange={setShowImageEditDialog}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl border-0 p-0 overflow-y-auto bg-background">
          <div className="bg-background rounded-2xl p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-foreground">Resize Your Image</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Adjust your image by zooming and positioning it. The final result will be saved permanently.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 border-2 border-dashed border-border rounded-full overflow-hidden bg-muted">
                  {tempImageUrl && (
                    <div
                      className="relative w-full h-full cursor-move select-none"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <img
                        src={tempImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover pointer-events-none"
                        style={{
                          transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                        }}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="zoom" className="text-sm font-medium text-foreground">
                    Zoom
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(imageZoom * 100)}%
                  </span>
                </div>
                <input
                  id="zoom"
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={imageZoom}
                  onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              {/* Position Info */}
              <div className="text-center text-xs text-muted-foreground">
                <p>Drag the image to reposition • Position: ({imagePosition.x}, {imagePosition.y})</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Different
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImageTransform}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleCancelImageEdit}
                className="w-full sm:w-auto"
                disabled={isUploadingAvatar}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEditedImage}
                className="w-full sm:w-auto"
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
