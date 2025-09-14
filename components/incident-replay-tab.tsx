"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"

export function IncidentReplayTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Incident Replay System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Pause className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Select an incident to replay</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
