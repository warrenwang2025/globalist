"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { Brain, Wand2, Crown } from 'lucide-react'

export default function AIPage() {
  const [prompt, setPrompt] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const router = useRouter()

  const generateSuggestions = () => {
    // Simulated AI response
    setSuggestions([
      "10 Tips for Effective Social Media Marketing",
      "How to Boost Your Online Presence",
      "The Ultimate Guide to Content Strategy"
    ])
  }

  const handleGetPlus = () => {
    router.push('/pricing')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Assistant</h1>

        <Button variant="default" onClick={handleGetPlus}>
          <Crown className="mr-2 h-4 w-4" />
          Get Plus
        </Button>
      </div>

      {/* Top Grid: Content + Tools */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr] items-start">
        {/* Left column */}
        <Card className="p-6 h-full">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Topic</label>
              <Textarea
                placeholder="Describe your content topic or idea..."
                className="mt-2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={generateSuggestions}>
                <Brain className="mr-2 h-4 w-4" />
                Generate Ideas
              </Button>
              <Button variant="outline" className="flex-1">
                <Wand2 className="mr-2 h-4 w-4" />
                Optimize SEO
              </Button>
            </div>
          </div>
        </Card>

        {/* Right column */}
        <Card className="p-6 h-full">
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Tools</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Wand2 className="mr-2 h-4 w-4" />
                Headline Generator
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Content Improver
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg"
              >
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}