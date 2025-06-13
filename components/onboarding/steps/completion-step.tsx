import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles, ArrowRight, Users, Calendar, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"

interface CompletionStepProps {
  onComplete: () => void
  userData?: any // Optional: to display user-specific data
}

export function CompletionStep({ onComplete, userData }: CompletionStepProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Users,
      title: "Content Creation",
      description: "Create engaging content with our powerful editor"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Schedule posts across multiple platforms"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track performance and engagement metrics"
    }
  ]

  return (
    <Card className={`max-w-2xl mx-auto transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
            <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🎉 Congratulations!
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Your Media Suite is now ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-4">
          <p className="text-muted-foreground text-lg">
            You have successfully completed the setup process. Your preferences have been saved and your workspace is configured.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`bg-muted/50 rounded-lg p-4 transition-all duration-500 delay-${index * 100} ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-lg mb-3">🚀 Ready to Get Started?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your journey to better content management begins now. Let&#39;s create something amazing together!
            </p>
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={onComplete} size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Launch Media Suite
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}