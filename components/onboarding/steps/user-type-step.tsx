import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building2, 
  Users, 
  User, 
  Megaphone, 
  Camera,
  ArrowLeft,
  ArrowRight
} from "lucide-react"

interface UserTypeStepProps {
  onNext: (data: { userType: string }) => void
  onPrevious: () => void
  initialValue: string
}

export function UserTypeStep({ onNext, onPrevious, initialValue }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState(initialValue)

  const userTypes = [
    {
      id: "enterprise",
      title: "Enterprise",
      description: "Large organization with multiple teams and complex workflows",
      icon: Building2,
      features: ["Multi-team management", "Advanced analytics", "Custom integrations"]
    },
    {
      id: "agency",
      title: "Marketing Agency",
      description: "Agency managing multiple clients and campaigns",
      icon: Users,
      features: ["Client management", "Campaign tracking", "White-label options"]
    },
    {
      id: "creator",
      title: "Content Creator",
      description: "Individual creator or influencer managing personal brand",
      icon: User,
      features: ["Personal branding", "Audience insights", "Monetization tools"]
    },
    {
      id: "marketer",
      title: "Digital Marketer",
      description: "Marketing professional focused on digital campaigns",
      icon: Megaphone,
      features: ["Campaign optimization", "ROI tracking", "A/B testing"]
    },
    {
      id: "media",
      title: "Media Company",
      description: "News, entertainment, or media production company",
      icon: Camera,
      features: ["Content distribution", "Audience engagement", "Revenue analytics"]
    }
  ]

  const handleNext = () => {
    if (selectedType) {
      onNext({ userType: selectedType })
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>What best describes you?</CardTitle>
        <CardDescription>
          Help us customize your experience by selecting your user type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {userTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  selectedType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {type.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-secondary rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedType}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}