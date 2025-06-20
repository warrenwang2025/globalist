import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Zap,
  Shield,
  Globe2
} from "lucide-react"

interface GoalsStepProps {
  onNext: (data: { goals: string[] }) => void
  onPrevious: () => void
  initialValue: string[]
}

export function GoalsStep({ onNext, onPrevious, initialValue }: GoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialValue || [])

  const goals = [
    {
      id: "increase-engagement",
      title: "Increase Engagement",
      description: "Boost likes, comments, shares, and overall audience interaction",
      icon: TrendingUp
    },
    {
      id: "grow-audience",
      title: "Grow Audience",
      description: "Expand reach and attract new followers across platforms",
      icon: Users
    },
    {
      id: "improve-roi",
      title: "Improve ROI",
      description: "Maximize return on investment for media campaigns",
      icon: DollarSign
    },
    {
      id: "save-time",
      title: "Save Time",
      description: "Streamline workflows and automate repetitive tasks",
      icon: Clock
    },
    {
      id: "optimize-performance",
      title: "Optimize Performance",
      description: "Use data-driven insights to improve content performance",
      icon: Zap
    },
    {
      id: "brand-consistency",
      title: "Brand Consistency",
      description: "Maintain consistent brand voice and visual identity",
      icon: Shield
    },
    {
      id: "global-reach",
      title: "Global Expansion",
      description: "Expand into new markets and international audiences",
      icon: Globe2
    },
    {
      id: "content-strategy",
      title: "Content Strategy",
      description: "Develop and execute comprehensive content strategies",
      icon: Target
    }
  ]

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleNext = () => {
    onNext({ goals: selectedGoals })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>What are your primary goals?</CardTitle>
        <CardDescription>
          Select the goals you want to achieve with Globalist Media Suite
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                id={goal.id}
                checked={selectedGoals.includes(goal.id)}
                onCheckedChange={() => toggleGoal(goal.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <goal.icon className="h-5 w-5 text-primary" />
                  <label
                    htmlFor={goal.id}
                    className="font-medium cursor-pointer"
                  >
                    {goal.title}
                  </label>
                </div>
                <p className="text-sm text-muted-foreground pl-8">
                  {goal.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={selectedGoals.length === 0}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}