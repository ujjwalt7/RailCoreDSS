"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Train, Fuel, Clock, MapPin, Zap, CheckCircle } from "lucide-react"

export function PerformanceAnalyticsTab() {
  const [viewMode, setViewMode] = useState<"current" | "optimized">("current")

  const currentKpis = [
    { label: "Punctuality", value: "87%", trend: "up", icon: Clock, optimized: "94%" },
    { label: "Trains Passed", value: "156", trend: "up", icon: Train, optimized: "168" },
    { label: "Fuel Saved", value: "2,340L", trend: "up", icon: Fuel, optimized: "3,120L" },
    { label: "Avg Savings", value: "15min", trend: "up", icon: TrendingUp, optimized: "22min" },
  ]

  const stationPerformance = [
    { name: "New Delhi", current: 85, optimized: 92, lat: 28.6448, lng: 77.2167 },
    { name: "Mumbai Central", current: 78, optimized: 88, lat: 19.076, lng: 72.8777 },
    { name: "Chennai Central", current: 82, optimized: 90, lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", current: 79, optimized: 86, lat: 22.5726, lng: 88.3639 },
    { name: "Bangalore", current: 88, optimized: 94, lat: 12.9716, lng: 77.5946 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Performance Analytics</h2>
          <p className="text-muted-foreground">Current state vs AI-optimized performance comparison</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "current" ? "default" : "outline"}
            onClick={() => setViewMode("current")}
            size="sm"
          >
            Current State
          </Button>
          <Button
            variant={viewMode === "optimized" ? "default" : "outline"}
            onClick={() => setViewMode("optimized")}
            size="sm"
          >
            AI Optimized
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold">{viewMode === "current" ? kpi.value : kpi.optimized}</p>
                  {viewMode === "current" && <p className="text-xs text-blue-600">Potential: {kpi.optimized}</p>}
                </div>
                <kpi.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">{viewMode === "current" ? "+5.2%" : "+12.8%"}</span>
                {viewMode === "current" && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    +7.6% potential
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Network Performance Map - {viewMode === "current" ? "Current State" : "AI Optimized State"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden relative">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=68.0,6.0,97.0,37.0&layer=mapnik"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Network Performance Map"
            />

            {/* Station Performance Overlays */}
            {stationPerformance.map((station, index) => (
              <div
                key={station.name}
                className="absolute bg-white rounded-lg shadow-lg p-2 text-xs"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 2) * 20}%`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      (viewMode === "current" ? station.current : station.optimized) > 85
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="font-medium">{station.name}</span>
                </div>
                <div className="mt-1">
                  <div className="flex justify-between">
                    <span>Performance:</span>
                    <span className="font-medium">{viewMode === "current" ? station.current : station.optimized}%</span>
                  </div>
                  {viewMode === "current" && (
                    <div className="flex justify-between text-blue-600">
                      <span>Potential:</span>
                      <span>+{station.optimized - station.current}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>High Performance (85%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate Performance (70-85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Needs Improvement (&lt;70%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Current State Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>On-time Performance</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex justify-between">
                <span>Average Delay</span>
                <span className="font-medium">12 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Efficiency</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity Utilization</span>
                <span className="font-medium">82%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              AI Optimized Potential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>On-time Performance</span>
                <span className="font-medium text-green-600">94% (+7%)</span>
              </div>
              <div className="flex justify-between">
                <span>Average Delay</span>
                <span className="font-medium text-green-600">8 minutes (-4min)</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Efficiency</span>
                <span className="font-medium text-green-600">89% (+11%)</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity Utilization</span>
                <span className="font-medium text-green-600">91% (+9%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
