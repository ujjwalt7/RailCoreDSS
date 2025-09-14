"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Train, Fuel, Clock, MapPin, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface PerformanceComparison {
  metric: string
  current: number
  optimized: number
  unit: string
  improvement: number
}

export function PerformanceAnalyticsTab() {
  const [comparisons, setComparisons] = useState<PerformanceComparison[]>([
    { metric: "Punctuality", current: 87, optimized: 94, unit: "%", improvement: 7 },
    { metric: "Fuel Efficiency", current: 2340, optimized: 2890, unit: "L saved", improvement: 550 },
    { metric: "Average Delay", current: 12, optimized: 6, unit: "min", improvement: -6 },
    { metric: "Route Optimization", current: 78, optimized: 91, unit: "%", improvement: 13 },
  ])

  const kpis = [
    { label: "Punctuality", value: "87%", trend: "up", icon: Clock },
    { label: "Trains Passed", value: "156", trend: "up", icon: Train },
    { label: "Fuel Saved", value: "2,340L", trend: "up", icon: Fuel },
    { label: "Avg Savings", value: "15min", trend: "up", icon: TrendingUp },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setComparisons((prev) =>
        prev.map((comp) => ({
          ...comp,
          current: comp.current + (Math.random() - 0.5) * 2,
          optimized: comp.optimized + (Math.random() - 0.5) * 1,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                </div>
                <kpi.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+5.2%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comparisons.map((comp) => (
              <div key={comp.metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{comp.metric}</span>
                  <Badge variant={comp.improvement > 0 ? "default" : "destructive"}>
                    {comp.improvement > 0 ? "+" : ""}
                    {comp.improvement.toFixed(1)}
                    {comp.unit}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Current: {comp.current.toFixed(1)}
                      {comp.unit}
                    </span>
                    <span className="text-primary">
                      AI Optimized: {comp.optimized.toFixed(1)}
                      {comp.unit}
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-red-400 rounded-full"
                      style={{ width: `${(comp.current / Math.max(comp.current, comp.optimized)) * 100}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full opacity-70"
                      style={{ width: `${(comp.optimized / Math.max(comp.current, comp.optimized)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Network Performance Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg relative overflow-hidden border">
              {/* Railway Network Visualization */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Railway Lines */}
                <line x1="50" y1="100" x2="350" y2="100" stroke="#1e40af" strokeWidth="3" />
                <line x1="100" y1="50" x2="100" y2="250" stroke="#1e40af" strokeWidth="3" />
                <line x1="200" y1="80" x2="300" y2="200" stroke="#1e40af" strokeWidth="3" />
                <line x1="150" y1="150" x2="350" y2="220" stroke="#1e40af" strokeWidth="3" />
              </svg>

              {/* Station Markers with Current vs Optimized States */}
              <div className="absolute top-20 left-12 flex flex-col items-center">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg bg-gradient-to-r from-red-400 to-green-500"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs mt-1 bg-white px-1 rounded shadow">Delhi</span>
              </div>

              <div className="absolute top-12 left-24 flex flex-col items-center">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg bg-gradient-to-r from-red-400 to-green-500"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs mt-1 bg-white px-1 rounded shadow">Ghaziabad</span>
              </div>

              <div className="absolute top-32 left-36 flex flex-col items-center">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg bg-gradient-to-r from-red-400 to-green-500"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs mt-1 bg-white px-1 rounded shadow">Aligarh</span>
              </div>

              <div className="absolute bottom-16 right-12 flex flex-col items-center">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg bg-gradient-to-r from-red-400 to-green-500"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs mt-1 bg-white px-1 rounded shadow">Mumbai</span>
              </div>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Current State</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>AI Optimized</span>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="absolute top-2 right-2 bg-white/90 p-2 rounded text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Needs Attention</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
