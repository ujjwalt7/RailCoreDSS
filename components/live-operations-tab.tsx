"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Train, Zap, MapPin, Clock, Users, Play, Pause, Route, AlertTriangle, CheckCircle } from "lucide-react"

interface TrainData {
  id: string
  name: string
  status: "On Time" | "Delayed" | "Approaching" | "Stopped"
  speed: number
  location: string
  nextStation: string
  eta: string
  passengers: number
  delay: number
  route: string[]
}

export function LiveOperationsTab() {
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(true)
  const [showRouteDialog, setShowRouteDialog] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [alertSent, setAlertSent] = useState(false)

  const [activeTrains, setActiveTrains] = useState<TrainData[]>([
    {
      id: "12301",
      name: "Rajdhani Express",
      status: "On Time",
      speed: 110,
      location: "New Delhi Junction",
      nextStation: "Ghaziabad",
      eta: "14:25",
      passengers: 1200,
      delay: 0,
      route: [
        "New Delhi",
        "Ghaziabad",
        "Aligarh",
        "Kanpur",
        "Allahabad",
        "Varanasi",
        "Patna",
        "Gaya",
        "Dhanbad",
        "Asansol",
        "Durgapur",
        "Howrah",
      ],
    },
    {
      id: "12002",
      name: "Shatabdi Express",
      status: "Delayed",
      speed: 85,
      location: "Ghaziabad Section",
      nextStation: "Aligarh",
      eta: "15:10",
      passengers: 800,
      delay: 15,
      route: ["New Delhi", "Ghaziabad", "Aligarh", "Tundla", "Agra Cantt", "Gwalior", "Jhansi", "Bhopal"],
    },
    {
      id: "12259",
      name: "Duronto Express",
      status: "Approaching",
      speed: 95,
      location: "Approaching Platform 3",
      nextStation: "New Delhi Junction",
      eta: "14:15",
      passengers: 1100,
      delay: 5,
      route: [
        "Sealdah",
        "Asansol",
        "Dhanbad",
        "Gaya",
        "Patna",
        "Varanasi",
        "Allahabad",
        "Kanpur",
        "Aligarh",
        "Ghaziabad",
        "New Delhi",
      ],
    },
    {
      id: "G1205",
      name: "Goods Train",
      status: "Stopped",
      speed: 0,
      location: "Delhi Cantt Yard",
      nextStation: "Faridabad",
      eta: "16:00",
      passengers: 0,
      delay: 0,
      route: ["Delhi Cantt", "Faridabad", "Ballabhgarh", "Palwal", "Mathura", "Agra"],
    },
  ])

  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setActiveTrains((prev) =>
        prev.map((train) => {
          const speedVariation = Math.random() * 10 - 5 // ±5 km/h variation
          const newSpeed = Math.max(0, train.speed + speedVariation)

          // Simulate status changes
          let newStatus = train.status
          if (Math.random() < 0.1) {
            // 10% chance of status change
            const statuses: TrainData["status"][] = ["On Time", "Delayed", "Approaching", "Stopped"]
            newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          }

          return {
            ...train,
            speed: Math.round(newSpeed),
            status: newStatus,
            delay:
              newStatus === "Delayed"
                ? train.delay + Math.floor(Math.random() * 3)
                : newStatus === "On Time"
                  ? Math.max(0, train.delay - 1)
                  : train.delay,
          }
        }),
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isSimulating])

  const selectedTrainData = activeTrains.find((train) => train.id === selectedTrain)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "default"
      case "Delayed":
        return "destructive"
      case "Approaching":
        return "secondary"
      case "Stopped":
        return "outline"
      default:
        return "default"
    }
  }

  const handleViewRoute = () => {
    if (selectedTrainData) {
      setShowRouteDialog(true)
    }
  }

  const handleSendAlert = () => {
    if (selectedTrainData) {
      setShowAlertDialog(true)
    }
  }

  const confirmSendAlert = () => {
    setAlertSent(true)
    setShowAlertDialog(false)
    setTimeout(() => setAlertSent(false), 3000) // Reset after 3 seconds
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Live Train Operations</h2>
          <p className="text-muted-foreground">Real-time monitoring of active trains</p>
        </div>
        <Button
          onClick={() => setIsSimulating(!isSimulating)}
          variant={isSimulating ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isSimulating ? "Pause" : "Start"} Simulation
        </Button>
      </div>

      {alertSent && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Alert successfully sent to {selectedTrainData?.name} ({selectedTrainData?.id})
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5" />
              Active Trains ({activeTrains.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTrains.map((train) => (
              <div
                key={train.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedTrain === train.id ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setSelectedTrain(train.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{train.name}</p>
                    <p className="text-sm text-muted-foreground">{train.id}</p>
                  </div>
                  <Badge variant={getStatusColor(train.status)}>{train.status}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {train.speed} km/h
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {train.location}
                  </span>
                  {train.delay > 0 && <span className="text-red-600 font-medium">+{train.delay}min</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Train Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTrainData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedTrainData.name}</h3>
                  <Badge variant={getStatusColor(selectedTrainData.status)}>{selectedTrainData.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Current Speed</p>
                    <p className="text-2xl font-bold text-primary">{selectedTrainData.speed} km/h</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Delay</p>
                    <p
                      className={`text-2xl font-bold ${selectedTrainData.delay > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {selectedTrainData.delay > 0 ? `+${selectedTrainData.delay}` : "0"} min
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Current Location: {selectedTrainData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Next Station: {selectedTrainData.nextStation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">ETA: {selectedTrainData.eta}</span>
                  </div>
                  {selectedTrainData.passengers > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Passengers: {selectedTrainData.passengers.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1" onClick={handleViewRoute}>
                          <Route className="h-4 w-4 mr-2" />
                          View Route
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Route for {selectedTrainData.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {selectedTrainData.route.map((station, index) => (
                            <div key={station} className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  index === 0
                                    ? "bg-green-500"
                                    : index === selectedTrainData.route.length - 1
                                      ? "bg-red-500"
                                      : "bg-gray-300"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  station === selectedTrainData.location.split(" ")[0] ? "font-bold text-primary" : ""
                                }`}
                              >
                                {station}
                                {station === selectedTrainData.location.split(" ")[0] && " (Current)"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleSendAlert}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Send Alert
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Send Alert to {selectedTrainData.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            This will send an immediate alert to the train operator and control center.
                          </p>
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Alert Type: Priority operational notification for train {selectedTrainData.id}
                            </AlertDescription>
                          </Alert>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={confirmSendAlert} className="bg-red-600 hover:bg-red-700">
                              Send Alert
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a train from the list to view detailed information.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
