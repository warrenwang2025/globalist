"use client";

import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentPosts = [
  {
    id: "1",
    title: "New Product Launch",
    platform: "LinkedIn",
    date: "2h ago",
    engagement: "324",
    image:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=140&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Behind the Scenes",
    platform: "Instagram",
    date: "5h ago",
    engagement: "1.2k",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    title: "Company Update",
    platform: "X",
    date: "1d ago",
    engagement: "456",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
  },
];

export function RecentPosts() {
  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div key={post.id} className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <img src={post.image} alt={post.title} className="object-cover" />
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{post.title}</p>
              <p className="text-sm text-muted-foreground">
                {post.platform} • {post.date}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {post.engagement} engagements
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
