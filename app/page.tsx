"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Train, AlertTriangle, Activity, TrendingUp, Navigation, Shield, BookOpen } from "lucide-react"
import { LiveMapTab } from "@/components/live-map-tab"
import { RailwayRulesTab } from "@/components/railway-rules-tab"
import { LiveOperationsTab } from "@/components/live-operations-tab"
import { AIRecommendationsTab } from "@/components/ai-recommendations-tab"
import { PerformanceAnalyticsTab } from "@/components/performance-analytics-tab"
import { IncidentReplayTab } from "@/components/incident-replay-tab"

export default function RailCoreCommandCenter() {
  const [activeTab, setActiveTab] = useState("live-operations")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Train className="h-8 w-8 text-secondary" />
            <div>
              <h1 className="text-2xl font-bold">RailCore: Station Master Command Center</h1>
              <p className="text-sm opacity-90">New Delhi Railway Station (NDLS)</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              <Activity className="h-4 w-4 mr-1" />
              System Active
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
              <p className="text-xs opacity-75">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
            <TabsTrigger
              value="live-operations"
              className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-4 w-4" />
              Live Operations
            </TabsTrigger>
            <TabsTrigger
              value="live-map"
              className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Navigation className="h-4 w-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger
              value="railway-rules"
              className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Railway Rules
            </TabsTrigger>
            <TabsTrigger
              value="ai-recommendations"
              className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger
              value="performance-analytics"
              className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              Performance Analytics
            </TabsTrigger>
            <TabsTrigger
              value="incident-replay"
              className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <AlertTriangle className="h-4 w-4" />
              Incident Replay
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="live-operations" className="mt-0">
              <LiveOperationsTab />
            </TabsContent>

            <TabsContent value="live-map" className="mt-0">
              <LiveMapTab />
            </TabsContent>

            <TabsContent value="railway-rules" className="mt-0">
              <RailwayRulesTab />
            </TabsContent>

            <TabsContent value="ai-recommendations" className="mt-0">
              <AIRecommendationsTab />
            </TabsContent>

            <TabsContent value="performance-analytics" className="mt-0">
              <PerformanceAnalyticsTab />
            </TabsContent>

            <TabsContent value="incident-replay" className="mt-0">
              <IncidentReplayTab />
            </TabsContent>
          </div>
        </Tabs>
      </nav>
    </div>
  )
}
