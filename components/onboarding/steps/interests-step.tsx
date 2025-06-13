import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ArrowRight,
  Globe,
  Smartphone,
  Video,
  Image,
  TrendingUp,
  Users2,
  Newspaper,
  Music,
  Gamepad2,
  ShoppingBag,
  Briefcase,
  Heart
} from "lucide-react"
interface InterestsStepProps {
  onNext: (data: { interests: string[] }) => void
  onPrevious: () => void
  initialValue: string[]
}

export function InterestsStep({ onNext, onPrevious, initialValue }: InterestsStepProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialValue || [])

  const interests = [
    { id: "social-media", label: "Social Media Marketing", icon: Smartphone },
    { id: "video-content", label: "Video Content", icon: Video },
    { id: "visual-design", label: "Visual Design", icon: Image },
    { id: "analytics", label: "Analytics & Insights", icon: TrendingUp },
    { id: "community", label: "Community Management", icon: Users2 },
    { id: "news-media", label: "News & Media", icon: Newspaper },
    { id: "entertainment", label: "Entertainment", icon: Music },
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
    { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
    { id: "b2b", label: "B2B Marketing", icon: Briefcase },
    { id: "lifestyle", label: "Lifestyle & Wellness", icon: Heart },
    { id: "global", label: "Global Markets", icon: Globe },
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleNext = () => {
    onNext({ interests: selectedInterests })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>What are your main interests?</CardTitle>
        <CardDescription>
          Select all areas that apply to your media strategy (minimum 3)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id)
            return (
              <div
                key={interest.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleInterest(interest.id)}
              >
                <interest.icon className={`h-6 w-6 mx-auto mb-2 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className="text-sm font-medium">{interest.label}</span>
              </div>
            )
          })}
        </div>

        {selectedInterests.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map(interestId => {
                const interest = interests.find(i => i.id === interestId)
                return (
                  <Badge key={interestId} variant="secondary">
                    {interest?.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={selectedInterests.length < 3}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}