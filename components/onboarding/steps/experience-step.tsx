import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  Users,
  Building,
  Crown
} from "lucide-react"

interface ExperienceStepProps {
  onNext: (data: { experience: string }) => void
  onPrevious: () => void
  initialValue: string
}

export function ExperienceStep({ onNext, onPrevious, initialValue }: ExperienceStepProps) {
  const [selectedExperience, setSelectedExperience] = useState(initialValue)

  const experienceLevels = [
    {
      id: "beginner",
      title: "Just Getting Started",
      description: "New to media management and looking to learn the basics",
      icon: Sparkles,
      features: ["Guided tutorials", "Template library", "Basic analytics"],
      color: "text-green-600"
    },
    {
      id: "intermediate",
      title: "Some Experience",
      description: "Have managed media before but want to improve efficiency",
      icon: User,
      features: ["Advanced scheduling", "Performance insights", "Team collaboration"],
      color: "text-blue-600"
    },
    {
      id: "advanced",
      title: "Experienced User",
      description: "Comfortable with media tools and looking for advanced features",
      icon: Users,
      features: ["Custom workflows", "API integrations", "Advanced analytics"],
      color: "text-purple-600"
    },
    {
      id: "expert",
      title: "Media Professional",
      description: "Expert level user managing complex campaigns and teams",
      icon: Building,
      features: ["Enterprise features", "White-label options", "Custom reporting"],
      color: "text-orange-600"
    },
    {
      id: "enterprise",
      title: "Enterprise Leader",
      description: "Leading large-scale media operations across organizations",
      icon: Crown,
      features: ["Multi-org management", "Advanced security", "Dedicated support"],
      color: "text-red-600"
    }
  ]

  const handleNext = () => {
    if (selectedExperience) {
      onNext({ experience: selectedExperience })
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>What is your experience level?</CardTitle>
        <CardDescription>
          Help us tailor the interface and features to match your expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <div
              key={level.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedExperience === level.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedExperience(level.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  selectedExperience === level.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <level.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{level.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {level.features.map((feature, index) => (
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
          <Button onClick={handleNext} disabled={!selectedExperience}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}