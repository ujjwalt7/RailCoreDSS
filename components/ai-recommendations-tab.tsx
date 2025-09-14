"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function AIRecommendationsTab() {
  const recommendations = [
    {
      id: "REC001",
      title: "Reroute Proposal: Track Obstruction",
      source: "RailGuard App (Geotagged Photo)",
      priority: "Critical",
      rulesFollowed: 11,
      rulesTotal: 12,
    },
    {
      id: "REC002",
      title: "Speed Advisory: Weather Alert",
      source: "Satellite & Weather Data",
      priority: "Warning",
      rulesFollowed: 12,
      rulesTotal: 12,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className={rec.priority === "Critical" ? "border-red-200 alert-pulse" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{rec.title}</CardTitle>
                <Badge variant={rec.priority === "Critical" ? "destructive" : "secondary"}>{rec.priority}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Source: {rec.source}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {rec.rulesFollowed}/{rec.rulesTotal} Rules Followed
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    Flag for Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
