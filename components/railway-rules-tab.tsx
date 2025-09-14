"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Shield,
  Zap,
  MapPin,
  Clock,
  Users,
  Settings,
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component
const LeafletMap = dynamic(() => import("@/components/railway-rules-map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Rules Map...</div>
  ),
})

interface RailwayRule {
  id: string
  title: string
  description: string
  category: "safety" | "operational" | "maintenance" | "emergency"
  currentState: "compliant" | "warning" | "violation"
  aiOptimizedState: "compliant" | "warning" | "violation"
  priority: "high" | "medium" | "low"
  affectedTrains: string[]
  location?: {
    lat: number
    lng: number
    name: string
  }
  lastChecked: string
  recommendation?: string
}

export function RailwayRulesTab() {
  const [railwayRules] = useState<RailwayRule[]>([
    {
      id: "R001",
      title: "Signal Compliance",
      description: "All trains must follow signal indications without exception",
      category: "safety",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "high",
      affectedTrains: ["12301", "12002", "12259"],
      location: { lat: 28.6448, lng: 77.2167, name: "New Delhi Junction" },
      lastChecked: "2 minutes ago",
      recommendation: "Maintain current signal protocols",
    },
    {
      id: "R002",
      title: "Speed Restrictions",
      description: "Trains must not exceed prescribed speed limits in designated zones",
      category: "safety",
      currentState: "warning",
      aiOptimizedState: "compliant",
      priority: "high",
      affectedTrains: ["12002"],
      location: { lat: 28.6692, lng: 77.4538, name: "Ghaziabad Section" },
      lastChecked: "5 minutes ago",
      recommendation: "Reduce speed by 15 km/h due to weather conditions",
    },
    {
      id: "R003",
      title: "Platform Safety",
      description: "Maintain safe distance between trains and platform edge",
      category: "safety",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "high",
      affectedTrains: ["12301", "12259"],
      lastChecked: "1 minute ago",
    },
    {
      id: "R004",
      title: "Track Maintenance Windows",
      description: "No train movement during scheduled maintenance periods",
      category: "maintenance",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "medium",
      affectedTrains: [],
      location: { lat: 28.7041, lng: 77.1025, name: "Delhi Cantt Yard" },
      lastChecked: "10 minutes ago",
    },
    {
      id: "R005",
      title: "Emergency Protocol",
      description: "Emergency braking systems must be functional at all times",
      category: "emergency",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "high",
      affectedTrains: ["12301", "12002", "12259", "G1205"],
      lastChecked: "3 minutes ago",
    },
    {
      id: "R006",
      title: "Crew Rest Periods",
      description: "Locomotive crew must have adequate rest between shifts",
      category: "operational",
      currentState: "warning",
      aiOptimizedState: "compliant",
      priority: "medium",
      affectedTrains: ["G1205"],
      lastChecked: "15 minutes ago",
      recommendation: "Schedule crew rotation for goods train G1205",
    },
    {
      id: "R007",
      title: "Load Distribution",
      description: "Freight trains must maintain proper load distribution",
      category: "operational",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "medium",
      affectedTrains: ["G1205"],
      lastChecked: "8 minutes ago",
    },
    {
      id: "R008",
      title: "Communication Systems",
      description: "All trains must maintain radio contact with control room",
      category: "operational",
      currentState: "violation",
      aiOptimizedState: "warning",
      priority: "high",
      affectedTrains: ["G1205"],
      location: { lat: 28.5355, lng: 77.391, name: "Faridabad Section" },
      lastChecked: "20 minutes ago",
      recommendation: "Immediate radio system check required for G1205",
    },
    {
      id: "R009",
      title: "Weather Protocols",
      description: "Adjust operations based on weather conditions",
      category: "safety",
      currentState: "warning",
      aiOptimizedState: "compliant",
      priority: "high",
      affectedTrains: ["12002", "12259"],
      lastChecked: "1 minute ago",
      recommendation: "Implement fog protocol for reduced visibility",
    },
    {
      id: "R010",
      title: "Priority Train Clearance",
      description: "Priority trains (Rajdhani, Military) get precedence",
      category: "operational",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "high",
      affectedTrains: ["12301"],
      lastChecked: "5 minutes ago",
    },
    {
      id: "R011",
      title: "Station Dwell Time",
      description: "Trains must not exceed maximum station dwell time",
      category: "operational",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "medium",
      affectedTrains: ["12301", "12259"],
      lastChecked: "7 minutes ago",
    },
    {
      id: "R012",
      title: "Environmental Compliance",
      description: "Maintain noise and emission levels within prescribed limits",
      category: "operational",
      currentState: "compliant",
      aiOptimizedState: "compliant",
      priority: "low",
      affectedTrains: ["12301", "12002", "12259", "G1205"],
      lastChecked: "30 minutes ago",
    },
  ])

  const [selectedRule, setSelectedRule] = useState<RailwayRule | null>(railwayRules[0])

  const getStateColor = (state: string) => {
    switch (state) {
      case "compliant":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "violation":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "violation":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "safety":
        return <Shield className="h-4 w-4" />
      case "operational":
        return <Settings className="h-4 w-4" />
      case "maintenance":
        return <Zap className="h-4 w-4" />
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const complianceStats = {
    total: railwayRules.length,
    compliant: railwayRules.filter((r) => r.currentState === "compliant").length,
    warning: railwayRules.filter((r) => r.currentState === "warning").length,
    violation: railwayRules.filter((r) => r.currentState === "violation").length,
  }

  const aiOptimizedStats = {
    compliant: railwayRules.filter((r) => r.aiOptimizedState === "compliant").length,
    warning: railwayRules.filter((r) => r.aiOptimizedState === "warning").length,
    violation: railwayRules.filter((r) => r.aiOptimizedState === "violation").length,
  }

  const compliancePercentage = (complianceStats.compliant / complianceStats.total) * 100
  const aiOptimizedPercentage = (aiOptimizedStats.compliant / complianceStats.total) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Railway Rules Compliance</h2>
          <p className="text-muted-foreground">Monitoring adherence to all 12 operational rules</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Compliance</p>
            <p className="text-2xl font-bold text-primary">{compliancePercentage.toFixed(0)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">AI Optimized Potential</p>
            <p className="text-2xl font-bold text-secondary">{aiOptimizedPercentage.toFixed(0)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Potential Improvement</p>
            <p className="text-2xl font-bold text-green-600">
              +{(aiOptimizedPercentage - compliancePercentage).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{complianceStats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Compliant</p>
                <p className="text-2xl font-bold text-green-600">{complianceStats.compliant}</p>
                <p className="text-xs text-muted-foreground">AI: {aiOptimizedStats.compliant}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceStats.warning}</p>
                <p className="text-xs text-muted-foreground">AI: {aiOptimizedStats.warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Violations</p>
                <p className="text-2xl font-bold text-red-600">{complianceStats.violation}</p>
                <p className="text-xs text-muted-foreground">AI: {aiOptimizedStats.violation}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Optimizable</p>
                <p className="text-2xl font-bold text-blue-600">
                  {railwayRules.filter((r) => r.currentState !== r.aiOptimizedState).length}
                </p>
                <p className="text-xs text-muted-foreground">rules can improve</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {railwayRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedRule?.id === rule.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setSelectedRule(rule)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(rule.category)}
                      <span className="font-medium">{rule.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStateIcon(rule.currentState)}
                      <Badge variant="outline" className={getStateColor(rule.currentState)}>
                        {rule.currentState}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rule.lastChecked}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {rule.affectedTrains.length} trains
                    </span>
                  </div>

                  {rule.currentState !== rule.aiOptimizedState && (
                    <div className="mt-2 p-2 bg-secondary/10 rounded text-xs">
                      <span className="text-secondary font-medium">AI Optimization: </span>
                      {rule.currentState} → {rule.aiOptimizedState}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map and Details */}
        <div className="space-y-4">
          {/* Rules Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Rules Compliance Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg overflow-hidden">
                <LeafletMap rules={railwayRules} selectedRule={selectedRule} />
              </div>
            </CardContent>
          </Card>

          {/* Selected Rule Details */}
          {selectedRule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(selectedRule.category)}
                    {selectedRule.title}
                  </span>
                  <Badge variant="outline" className={getStateColor(selectedRule.currentState)}>
                    {selectedRule.currentState}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{selectedRule.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Current State</p>
                    <div className="flex items-center gap-2">
                      {getStateIcon(selectedRule.currentState)}
                      <span className="capitalize">{selectedRule.currentState}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">AI Optimized State</p>
                    <div className="flex items-center gap-2">
                      {getStateIcon(selectedRule.aiOptimizedState)}
                      <span className="capitalize">{selectedRule.aiOptimizedState}</span>
                    </div>
                  </div>
                </div>

                {selectedRule.recommendation && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>AI Recommendation:</strong> {selectedRule.recommendation}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Affected Trains</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRule.affectedTrains.map((train) => (
                      <Badge key={train} variant="secondary">
                        {train}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedRule.location && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedRule.location.name}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Apply AI Optimization
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
