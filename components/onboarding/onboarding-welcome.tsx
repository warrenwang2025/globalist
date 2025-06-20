import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, 
  Calendar, 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  ArrowRight
} from "lucide-react"

interface OnboardingWelcomeProps {
  onNext: () => void
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  const features = [
    {
      icon: Globe,
      title: "Global Content Management",
      description: "Manage content across multiple platforms and regions"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling for optimal engagement"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your media performance"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless workflow for media teams"
    },
    {
      icon: Zap,
      title: "Automation Tools",
      description: "Streamline repetitive tasks with smart automation"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security for your media assets"
    }
  ]

  return (
    <div className="space-y-8">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Transform Your Media Strategy
          </CardTitle>
          <CardDescription className="text-lg">
            Discover the power of integrated media management with our comprehensive suite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border">
                <feature.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Badge variant="secondary">Content Creation</Badge>
            <Badge variant="secondary">Social Media</Badge>
            <Badge variant="secondary">Analytics</Badge>
            <Badge variant="secondary">Team Management</Badge>
            <Badge variant="secondary">Brand Safety</Badge>
          </div>

          <div className="text-center">
            <Button onClick={onNext} size="lg" className="px-8">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Takes about 3-5 minutes to complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}