"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import {
  Mail,
  Plus,
  Users,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  UserPlus,
  UserMinus,
  X,
} from "lucide-react";
import axios from "axios";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: "subscribed" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
  source?: string;
}

interface EmailList {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  tags: string[];
  createdAt: Date;
  subscribers: Subscriber[];
  subscriberCount: number;
}

export function EmailListManager() {
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newListDialog, setNewListDialog] = useState(false);
  const [editListDialog, setEditListDialog] = useState(false);
  const [subscribersDialog, setSubscribersDialog] = useState(false);
  const [addSubscriberDialog, setAddSubscriberDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<EmailList | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused">(
    "all"
  );

  const [newListData, setNewListData] = useState({
    name: "",
    description: "",
    tags: "",
    initialEmails: "",
  });

  const [editListData, setEditListData] = useState({
    name: "",
    description: "",
    tags: "",
  });

  const [newSubscriberData, setNewSubscriberData] = useState({
    email: "",
    name: "",
  });

  // Load email settings from database
  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      if (response.data.success && response.data.data.emailSettings) {
        const emailSettings = response.data.data.emailSettings;
        
        // Load email lists
        if (emailSettings.lists) {
          setEmailLists(emailSettings.lists);
        }
      }
    } catch (error) {
      console.error("Error loading email settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmailSettings = async (updatedLists: EmailList[]) => {
    setIsSaving(true);
    try {
      // Get current settings first to preserve other email settings
      const currentResponse = await axios.get("/api/settings");
      const currentEmailSettings = currentResponse.data.data.emailSettings || {};
      
      const updatedEmailSettings = {
        ...currentEmailSettings,
        lists: updatedLists,
        trackOpens: currentEmailSettings.trackOpens !== false,
        trackClicks: currentEmailSettings.trackClicks !== false,
      };

      const response = await axios.patch("/api/settings", {
        category: "emailSettings",
        data: updatedEmailSettings,
      });

      if (response.data.success) {
        setEmailLists(updatedLists);
      } else {
        throw new Error('Failed to save email settings');
      }
    } catch (error) {
      console.error("Error saving email settings:", error);
      alert("Error saving email settings. Please try again.");
      throw error; // Re-throw to handle in calling function
    } finally {
      setIsSaving(false);
    }
  };

  // Filter lists based on search and status
  const filteredLists = emailLists.filter((list) => {
    const matchesSearch =
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || list.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter subscribers based on search query and selected list
  const filteredSubscribers = selectedList 
    ? selectedList.subscribers?.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(subscriberSearchQuery.toLowerCase()) ||
        subscriber.name?.toLowerCase().includes(subscriberSearchQuery.toLowerCase())
      )
    : [];

  const handleCreateList = async () => {
    if (!newListData.name.trim()) return;

    const newList: EmailList = {
      id: `list_${Date.now()}`,
      name: newListData.name,
      description: newListData.description,
      status: "active",
      tags: newListData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date(),
      subscribers: [],
      subscriberCount: 0,
    };

    // If initial emails are provided, add them as subscribers
    if (newListData.initialEmails.trim()) {
      const emailLines = newListData.initialEmails
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && isValidEmail(line));
      
      emailLines.forEach((email, index) => {
        const subscriber: Subscriber = {
          id: `sub_${Date.now()}_${index}`,
          email: email,
          name: email.split('@')[0], // Use email prefix as default name
          status: "subscribed",
          subscribedAt: new Date(),
          source: "initial_import",
        };
        newList.subscribers.push(subscriber);
      });
      
      newList.subscriberCount = newList.subscribers.length;
    }

    const updatedLists = [...emailLists, newList];
    await saveEmailSettings(updatedLists);
    
    setNewListData({ name: "", description: "", tags: "", initialEmails: "" });
    setNewListDialog(false);
  };

  const handleEditList = async () => {
    if (!selectedList || !editListData.name.trim()) return;

    const updatedLists = emailLists.map((list) =>
      list.id === selectedList.id
        ? {
            ...list,
            name: editListData.name,
            description: editListData.description,
            tags: editListData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          }
        : list
    );

    await saveEmailSettings(updatedLists);
    setEditListDialog(false);
    setSelectedList(null);
    setEditListData({ name: "", description: "", tags: "" });
  };

  const handleDeleteList = async (listId: string) => {
    const updatedLists = emailLists.filter((list) => list.id !== listId);
    await saveEmailSettings(updatedLists);
  };

  const toggleListStatus = async (listId: string) => {
    const updatedLists = emailLists.map((list) =>
      list.id === listId
        ? { ...list, status: list.status === "active" ? "paused" : "active" as "active" | "paused" }
        : list
    );

    await saveEmailSettings(updatedLists);
  };

  const openEditDialog = (list: EmailList) => {
    setSelectedList(list);
    setEditListData({
      name: list.name,
      description: list.description,
      tags: list.tags.join(", "),
    });
    setEditListDialog(true);
  };

  const openSubscribersDialog = (list: EmailList) => {
    setSelectedList(list);
    setSubscribersDialog(true);
    setSubscriberSearchQuery("");
  };

  // Add subscriber functionality
  const handleAddSubscriber = async () => {
    if (!selectedList || !newSubscriberData.email.trim() || !isValidEmail(newSubscriberData.email)) return;

    // Check if subscriber already exists
    const existingSubscriber = selectedList.subscribers.find(
      sub => sub.email.toLowerCase() === newSubscriberData.email.toLowerCase()
    );
    
    if (existingSubscriber) {
      alert("This email address is already subscribed to this list.");
      return;
    }

    const newSubscriber: Subscriber = {
      id: `sub_${Date.now()}`,
      email: newSubscriberData.email.toLowerCase().trim(), // Normalize email
      name: newSubscriberData.name?.trim() || newSubscriberData.email.split('@')[0],
      status: "subscribed",
      subscribedAt: new Date(),
      source: "manual",
    };


    const updatedLists = emailLists.map(list => 
      list.id === selectedList.id 
        ? {
            ...list,
            subscribers: [...list.subscribers, newSubscriber],
            subscriberCount: list.subscriberCount + 1
          }
        : list
    );

;

    try {
      await saveEmailSettings(updatedLists);
      
      // Update selectedList to reflect changes
      setSelectedList(prev => prev ? {
        ...prev,
        subscribers: [...prev.subscribers, newSubscriber],
        subscriberCount: prev.subscriberCount + 1
      } : null);
      
      setNewSubscriberData({ email: "", name: "" });
      setAddSubscriberDialog(false);
      
    } catch (error) {
      console.error('Error adding subscriber:', error);
      alert('Error adding subscriber. Please try again.');
    }
  };

  const handleRemoveSubscriber = async (subscriberId: string) => {
    if (!selectedList) return;
    
    const updatedLists = emailLists.map(list => 
      list.id === selectedList.id 
        ? {
            ...list,
            subscribers: list.subscribers.filter(sub => sub.id !== subscriberId),
            subscriberCount: Math.max(0, list.subscriberCount - 1)
          }
        : list
    );

    await saveEmailSettings(updatedLists);
    
    // Update selectedList to reflect changes
    setSelectedList(prev => prev ? {
      ...prev,
      subscribers: prev.subscribers.filter(sub => sub.id !== subscriberId),
      subscriberCount: Math.max(0, prev.subscriberCount - 1)
    } : null);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-4 md:p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Lists
            </h2>
            <p className="text-sm text-muted-foreground">
              Create and manage your email subscriber lists
            </p>
          </div>
          <Dialog open={newListDialog} onOpenChange={setNewListDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create List
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Email List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="listName">List Name *</Label>
                  <Input
                    id="listName"
                    value={newListData.name}
                    onChange={(e) =>
                      setNewListData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Newsletter Subscribers"
                  />
                </div>
                <div>
                  <Label htmlFor="listDescription">Description</Label>
                  <Textarea
                    id="listDescription"
                    value={newListData.description}
                    onChange={(e) =>
                      setNewListData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of this list"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="listTags">Tags (comma-separated)</Label>
                  <Input
                    id="listTags"
                    value={newListData.tags}
                    onChange={(e) =>
                      setNewListData((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    placeholder="newsletter, weekly, updates"
                  />
                </div>
                <div>
                  <Label htmlFor="initialEmails">
                    Initial Subscribers (optional)
                  </Label>
                  <Textarea
                    id="initialEmails"
                    value={newListData.initialEmails}
                    onChange={(e) =>
                      setNewListData((prev) => ({
                        ...prev,
                        initialEmails: e.target.value,
                      }))
                    }
                    placeholder="Enter email addresses, one per line:&#10;john@example.com&#10;jane@example.com&#10;bob@example.com"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter one email address per line. You can add more
                    subscribers later.
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateList}
                    className="flex-1"
                    disabled={!newListData.name.trim()}
                  >
                    Create List
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewListDialog(false);
                      setNewListData({
                        name: "",
                        description: "",
                        tags: "",
                        initialEmails: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All ({emailLists.length})
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
            >
              Active ({emailLists.filter((l) => l.status === "active").length})
            </Button>
            <Button
              variant={filterStatus === "paused" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("paused")}
            >
              Paused ({emailLists.filter((l) => l.status === "paused").length})
            </Button>
          </div>
        </div>

        {/* Lists */}
        <div className="space-y-4">
          {filteredLists.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lists found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first email list to get started"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Button onClick={() => setNewListDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First List
                </Button>
              )}
            </div>
          ) : (
            filteredLists.map((list) => (
              <div
                key={list.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{list.name}</h3>
                      <Badge
                        variant={
                          list.status === "active" ? "default" : "secondary"
                        }
                      >
                        {list.status}
                      </Badge>
                    </div>

                    {list.description && (
                      <p className="text-muted-foreground mb-3">
                        {list.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {list.subscriberCount.toLocaleString()} subscribers
                      </span>
                      <span>
                        Created: {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {list.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {list.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 ml-0 sm:ml-4 w-full sm:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSubscribersDialog(list)}
                      title="Manage Subscribers"
                    >
                      <Users className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(list)}
                      title="Edit List"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleListStatus(list.id)}
                      title={
                        list.status === "active"
                          ? "Pause List"
                          : "Activate List"
                      }
                    >
                      {list.status === "active" ? "Pause" : "Activate"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          title="Delete List"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Email List</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {list.name}? This
                            action cannot be undone and will remove all{" "}
                            {list.subscriberCount} subscribers from this list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteList(list.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete List
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Edit List Dialog */}
      <Dialog open={editListDialog} onOpenChange={setEditListDialog}>
          <DialogContent className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-6 py-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Email List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editListName">List Name *</Label>
              <Input
                id="editListName"
                value={editListData.name}
                onChange={(e) =>
                  setEditListData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g., Newsletter Subscribers"
              />
            </div>
            <div>
              <Label htmlFor="editListDescription">Description</Label>
              <Textarea
                id="editListDescription"
                value={editListData.description}
                onChange={(e) =>
                  setEditListData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of this list"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="editListTags">Tags (comma-separated)</Label>
              <Input
                id="editListTags"
                value={editListData.tags}
                onChange={(e) =>
                  setEditListData((prev) => ({
                    ...prev,
                    tags: e.target.value,
                  }))
                }
                placeholder="newsletter, weekly, updates"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleEditList}
                className="flex-1"
                disabled={!editListData.name.trim()}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditListDialog(false);
                  setSelectedList(null);
                  setEditListData({ name: "", description: "", tags: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscribers Management Dialog */}
      <Dialog open={subscribersDialog} onOpenChange={setSubscribersDialog}>
        <DialogContent className="w-full max-w-sm sm:max-w-md px-4 sm:px-6 py-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh] mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Subscribers - {selectedList?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add Subscriber and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={subscriberSearchQuery}
                  onChange={(e) => setSubscriberSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog
                open={addSubscriberDialog}
                onOpenChange={setAddSubscriberDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Subscriber
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subscriber</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subscriberEmail">Email Address *</Label>
                      <Input
                        id="subscriberEmail"
                        type="email"
                        value={newSubscriberData.email}
                        onChange={(e) =>
                          setNewSubscriberData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="subscriber@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subscriberName">Name (optional)</Label>
                      <Input
                        id="subscriberName"
                        value={newSubscriberData.name}
                        onChange={(e) =>
                          setNewSubscriberData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Subscriber Name"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleAddSubscriber}
                        className="flex-1"
                        disabled={
                          !newSubscriberData.email.trim() ||
                          !isValidEmail(newSubscriberData.email)
                        }
                      >
                        Add Subscriber
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAddSubscriberDialog(false);
                          setNewSubscriberData({ email: "", name: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Subscribers List */}
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredSubscribers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {subscriberSearchQuery
                      ? "No subscribers found"
                      : "No subscribers yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {subscriberSearchQuery
                      ? "Try adjusting your search criteria"
                      : "Add your first subscriber to get started"}
                  </p>
                  {!subscriberSearchQuery && (
                    <Button onClick={() => setAddSubscriberDialog(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First Subscriber
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredSubscribers.map((subscriber: Subscriber) => (
                    <div
                      key={subscriber.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{subscriber.name || subscriber.email}</p>
                          <Badge
                            variant={
                              subscriber.status === "subscribed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {subscriber.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {subscriber.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Subscribed:{" "}
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          {subscriber.source && ` • Source: ${subscriber.source}`}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove Subscriber
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove 
                              {subscriber.email} from this list? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleRemoveSubscriber(subscriber.id)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Subscriber
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscribers Summary */}
            {selectedList && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedList.subscriberCount}
                    </p>
                    <p className="text-sm font-medium text-blue-800">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedList.subscribers.filter(s => s.status === "subscribed").length}
                    </p>
                    <p className="text-sm font-medium text-green-800">
                      Subscribed
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedList.subscribers.filter(s => s.status === "unsubscribed").length}
                    </p>
                    <p className="text-sm font-medium text-orange-800">
                      Unsubscribed
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSubscribersDialog(false);
                  setSelectedList(null);
                  setSubscriberSearchQuery("");
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Subscriber Dialog */}
      <Dialog open={addSubscriberDialog} onOpenChange={setAddSubscriberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subscriber</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subscriberEmail">Email Address *</Label>
              <Input
                id="subscriberEmail"
                type="email"
                value={newSubscriberData.email}
                onChange={(e) =>
                  setNewSubscriberData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="subscriber@example.com"
              />
              {newSubscriberData.email &&
                !isValidEmail(newSubscriberData.email) && (
                  <p className="text-sm text-red-600 mt-1">
                    Please enter a valid email address
                  </p>
                )}
            </div>
            <div>
              <Label htmlFor="subscriberName">Name (optional)</Label>
              <Input
                id="subscriberName"
                value={newSubscriberData.name}
                onChange={(e) =>
                  setNewSubscriberData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Subscriber Name"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddSubscriber}
                className="flex-1"
                disabled={
                  !newSubscriberData.email.trim() ||
                  !isValidEmail(newSubscriberData.email)
                }
              >
                Add Subscriber
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAddSubscriberDialog(false);
                  setNewSubscriberData({ email: "", name: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card className="p-4 md:p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => {
              // Handle bulk import functionality
              console.log("Import contacts");
            }}
          >
            <Upload className="h-6 w-6" />
            <div className="text-center">
              <p className="font-medium">Import Contacts</p>
              <p className="text-xs text-muted-foreground">
                Upload CSV file with email addresses
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => {
              // Handle export functionality
              console.log("Export lists");
            }}
          >
            <Download className="h-6 w-6" />
            <div className="text-center">
              <p className="font-medium">Export Lists</p>
              <p className="text-xs text-muted-foreground">
                Download subscriber data as CSV
              </p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Summary Stats */}
      <Card className="p-4 md:p-6">
        <h3 className="font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {emailLists.length}
            </p>
            <p className="text-sm font-medium text-blue-800">Total Lists</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {emailLists.filter((l) => l.status === "active").length}
            </p>
            <p className="text-sm font-medium text-green-800">Active Lists</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {emailLists
                .reduce((total, list) => total + list.subscriberCount, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm font-medium text-purple-800">
              Total Subscribers
            </p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {emailLists.filter((l) => l.status === "paused").length}
            </p>
            <p className="text-sm font-medium text-orange-800">Paused Lists</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
