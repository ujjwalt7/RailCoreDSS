"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Brain, Camera, CheckCircle, Play, Satellite, Settings, Shield } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ScrollArea } from "@radix-ui/react-scroll-area"

interface Recommendation {
  rec_id: string
  title: string
  source: string
  proposal_details: string
  rules_followed: number
  rules_total: number
  priority_level: "Critical" | "Warning" | "Info"
  timestamp: string
}
export function AIRecommendationsTab() {
  const { selectedTrain, trackSegments, updateTrackStatus, setSimulationResult } = useAppStore()

  const [incidentType, setIncidentType] = useState("")
  const [duration, setDuration] = useState("")
  const [affectedTrain, setAffectedTrain] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [location, setLocation] = useState("")

  useEffect(() => {
    // Mock recommendations data
    const mockRecommendations: Recommendation[] = [
      {
        rec_id: "REC001",
        title: "Reroute Proposal: Track Obstruction",
        source: "RailGuard App (Geotagged Photo)",
        proposal_details:
          "Reroute Train 12420 via Ghaziabad loop line due to reported fallen tree on main line between KM 15-16.",
        rules_followed: 11,
        rules_total: 12,
        priority_level: "Critical",
        timestamp: "2 minutes ago",
      },
      {
        rec_id: "REC002",
        title: "Speed Advisory: Weather Alert",
        source: "Satellite & Weather Data",
        proposal_details:
          "Reduce speed by 20% for all trains on Delhi-Panipat section due to heavy rain forecast and reduced visibility.",
        rules_followed: 12,
        rules_total: 12,
        priority_level: "Warning",
        timestamp: "5 minutes ago",
      },
      {
        rec_id: "REC003",
        title: "Hold Proposal: Priority Rescheduling",
        source: "AI-Brain (Network Optimization)",
        proposal_details:
          "Hold Goods Train G1247 at Panipat for 8 minutes to allow military convoy M3 priority passage.",
        rules_followed: 12,
        rules_total: 12,
        priority_level: "Warning",
        timestamp: "8 minutes ago",
      },
      {
        rec_id: "REC004",
        title: "Platform Change Suggestion",
        source: "Passenger Flow Analytics",
        proposal_details:
          "Move Kerala Express from Platform 12 to Platform 8 to reduce passenger congestion and improve boarding efficiency.",
        rules_followed: 10,
        rules_total: 12,
        priority_level: "Info",
        timestamp: "12 minutes ago",
      },
    ]


    setRecommendations(mockRecommendations)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "Warning":
        return "bg-yellow-500"
      case "Info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "Warning":
        return "outline"
      case "Info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSourceIcon = (source: string) => {
    if (source.includes("RailGuard")) return <Camera className="w-4 h-4" />
    if (source.includes("Satellite")) return <Satellite className="w-4 h-4" />
    if (source.includes("AI-Brain")) return <Brain className="w-4 h-4" />
    return <Shield className="w-4 h-4" />
  }
  const handleRunSimulation = async () => {
    if (!incidentType || !duration || !location) {
      alert("Please fill in all required fields")
      return
    }

    // Mock API call to run simulation
    const mockResult = {
      before_scenario: {
        cascading_delay: 45,
        original_throughput: 85,
        route_data: [],
      },
      after_scenario: {
        optimized_delay: 12,
        optimized_throughput: 92,
        route_data: [],
      },
      summary_explanation: `AI optimization reduced delays by 73% through intelligent rerouting around ${location}. The system prioritized Rajdhani Express while rescheduling goods trains, saving 33 minutes of cascading delays across the network.`,
    }

    setSimulationResult(mockResult)
    alert("Simulation completed! Check the bottom panel for results.")
  }

  const handleApprove = (recId: string) => {
    alert(`Recommendation ${recId} approved and implemented`)
  }

  const handleFlag = (recId: string) => {
    alert(`Recommendation ${recId} flagged for manual review`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="w-3/5 border-r border-border w-full">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-secondary" />
              <span>AI Recommendations</span>
              <Badge variant="outline" className="ml-auto">
                {recommendations.filter((r) => r.priority_level === "Critical").length} Critical
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="space-y-4 p-4">
                {recommendations.map((rec) => (
                  <Card
                    key={rec.rec_id}
                    className={`border-l-4 ${
                      rec.priority_level === "Critical"
                        ? "border-l-red-500 animate-pulse-alert"
                        : rec.priority_level === "Warning"
                          ? "border-l-yellow-500"
                          : "border-l-blue-500"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold mb-1">{rec.title}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {getSourceIcon(rec.source)}
                            <span>Source: {rec.source}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={getPriorityVariant(rec.priority_level)}>{rec.priority_level}</Badge>
                          <span className="text-xs text-muted-foreground">{rec.timestamp}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-card-foreground mb-3">{rec.proposal_details}</p>

                      {/* Rules Compliance */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Railway Rules Compliance</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${(rec.rules_followed / rec.rules_total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {rec.rules_followed}/{rec.rules_total} ✓
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Flag for Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="what-if" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="what-if">What-If Scenario</TabsTrigger>
            <TabsTrigger value="track-mgmt">Track Management</TabsTrigger>
          </TabsList>

          <TabsContent value="what-if" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scenario Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="incident-type">Incident Type *</Label>
                  <Select value={incidentType} onValueChange={setIncidentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="track-obstruction">Track Obstruction</SelectItem>
                      <SelectItem value="engine-failure">Engine Failure</SelectItem>
                      <SelectItem value="weather-delay">Weather Delay</SelectItem>
                      <SelectItem value="power-outage">Power Outage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="affected-train">Affected Train</Label>
                  <Select value={affectedTrain} onValueChange={setAffectedTrain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select train (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12301">12301 - Rajdhani Express</SelectItem>
                      <SelectItem value="12002">12002 - Shatabdi Express</SelectItem>
                      <SelectItem value="12259">12259 - Duronto Express</SelectItem>
                      <SelectItem value="G1205">G1205 - Goods Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Delhi-Ghaziabad Section"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleRunSimulation}
                  className="w-full flex items-center gap-2"
                  disabled={!incidentType || !duration || !location}
                >
                  <Play className="h-4 w-4" />
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="track-mgmt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Track Status Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Track Segment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trackSegments.map((track) => (
                      <TableRow key={track.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{track.name}</p>
                            <p className="text-xs text-muted-foreground">{track.section} Section</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={track.status === "active"}
                              onCheckedChange={(checked) =>
                                updateTrackStatus(track.id, checked ? "active" : "disabled")
                              }
                            />
                            <span className="text-sm">{track.status === "active" ? "Enabled" : "Disabled"}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
