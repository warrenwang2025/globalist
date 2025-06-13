import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { 
  CheckCircle,
  Sparkles,
  ArrowRight,
  Download,
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  HelpCircle,
  Video,
  MessageCircle
} from "lucide-react"

interface OnboardingCompletionProps {
  data: any
}

export function OnboardingCompletion({ data }: OnboardingCompletionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGetStarted = async () => {
    setIsLoading(true)
    // Here you would typically save the onboarding data to your backend
    try {
      // await saveOnboardingData(data)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      setIsLoading(false)
    }
  }

  const nextSteps = [
    {
      icon: Calendar,
      title: "Schedule Your First Post",
      description: "Create and schedule content across your platforms",
      action: "Go to Scheduler"
    },
    {
      icon: BarChart3,
      title: "Explore Analytics",
      description: "Discover insights about your audience and content performance",
      action: "View Analytics"
    },
    {
      icon: Users,
      title: "Invite Team Members",
      description: "Collaborate with your team on content creation and management",
      action: "Invite Team"
    },
    {
      icon: BookOpen,
      title: "Browse Templates",
      description: "Get started quickly with our pre-designed content templates",
      action: "View Templates"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-green-800">
            Welcome to Globalist Media Suite!
          </CardTitle>
          <CardDescription className="text-lg text-green-700">
            Your account is now set up and ready to transform your media strategy
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Your Setup Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                User Type
              </h4>
              <Badge variant="secondary" className="text-sm">
                {data.userType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Experience Level
              </h4>
              <Badge variant="secondary" className="text-sm">
                {data.experience?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Selected Interests ({data.interests?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest: string) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Primary Goals ({data.goals?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.goals?.map((goal: string) => (
                <Badge key={goal} variant="outline" className="text-xs">
                  {goal.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>
            Here is what we recommend to get the most out of your new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="p-4 rounded-lg border bg-accent/20 hover:bg-accent/30 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
                      {step.action} →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Mobile App
            </Button>
            <Button variant="outline" size="sm">
              <Video className="mr-2 h-4 w-4" />
              Watch Tutorial Videos
            </Button>
            <Button variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Button 
          onClick={handleGetStarted} 
          size="lg" 
          className="px-8 py-3 text-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Setting up your dashboard...
            </>
          ) : (
            <>
              Enter Your Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          You can always change these settings later in your account preferences
        </p>
      </div>
    </div>
  )
}