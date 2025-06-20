"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star, Zap, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const router = useRouter()

  const handleNavigateToAI = () => {
    router.push('/dashboard/ai')
  }

  const plans = [
    {
      name: "Free",
      price: isAnnual ? 0 : 0,
      originalPrice: null,
      description: "Perfect for getting started",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Basic AI content suggestions",
        "Smart Headline Generator",
        "Schedule Management",
        "Community support",
        "Standard analytics"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      popular: false,
      onClick: handleNavigateToAI
    },
    {
      name: "Plus",
      price: isAnnual ? 228 : 29,
      originalPrice: isAnnual ? 348 : null,
      description: "Best for content creators",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Advanced AI content generation",
        "Unlimited content generations",
        "SEO optimization tools",
        "Priority support",
        "Advanced analytics",
        "Brand voice customization"
      ],
      buttonText: "Upgrade to Plus",
      buttonVariant: "default" as const,
      popular: true,
      onClick: () => {
        console.log("Upgrading to Plus plan...")
        handleNavigateToAI()
      }
    },
    {
      name: "Pro",
      price: isAnnual ? 588 : 79,
      originalPrice: isAnnual ? 948 : null,
      description: "For teams and agencies",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Everything in Plus",
        "White-label solutions",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "Custom workflows"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
      onClick: () => {
        console.log("Contacting sales...")
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
            Unlock the full potential of AI-powered content creation
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save 30%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative p-6 md:p-8 ${
                plan.popular 
                  ? 'border-2 border-primary shadow-lg scale-105' 
                  : 'border shadow-sm'
              }`}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  variant="default"
                >
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl md:text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <div className="text-left">
                      {plan.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${plan.originalPrice}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        /{isAnnual ? 'year' : 'month'}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant={plan.buttonVariant}
                  className="w-full mb-6"
                  size="lg"
                  onClick={plan.onClick}
                >
                  {plan.buttonText}
                </Button>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </Card>
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </Card>
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <Card className="p-6 md:p-8 bg-primary/5 border-primary/20">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              Join thousands of content creators who trust Media Suite for their AI-powered content needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleNavigateToAI} className="w-full sm:w-auto">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}