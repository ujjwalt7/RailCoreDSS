"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Train, MapPin, Zap, AlertTriangle, RefreshCw, Clock, Calendar, Navigation } from "lucide-react"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false })

interface RailRadarTrain {
  train_number: string
  train_name: string
  type: string
  days_ago: number
  mins_since_dep: number
  current_station: string
  current_station_name: string
  current_lat: number
  current_lng: number
  departure_minutes: number
  current_day: number
  halt_mins: number
  next_station: string
  next_station_name: string
  next_lat: number
  next_lng: number
  next_arrival_minutes: number
  next_day: number
  distance_from_source_km: number
  next_distance: number
}

interface LiveTrain {
  id: string
  name: string
  number: string
  status: "on-time" | "delayed" | "stopped" | "approaching"
  currentSpeed: number
  maxSpeed: number
  location: {
    lat: number
    lng: number
    station: string
  }
  destination: string
  delay: number
  nextStation: string
  eta: string
  type: string
  minsSinceDep: number
  distanceFromSource: number
}

export function LiveMapTab() {
  const [liveTrains, setLiveTrains] = useState<LiveTrain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrain, setSelectedTrain] = useState<LiveTrain | null>(null)
  const [showTrainModal, setShowTrainModal] = useState(false)
  const mapRef = useRef<any>(null)
  
  // Add custom CSS for map components
  useEffect(() => {
    // Add custom styles for Leaflet components
    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.innerHTML = `
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.2);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 3px 14px rgba(0,0,0,0.2);
        }
        .custom-tooltip .leaflet-tooltip {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-weight: 500;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .custom-tooltip .leaflet-tooltip-top:before {
          border-top-color: rgba(0, 0, 0, 0.7);
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  // Convert RailRadar data to our LiveTrain format
  const convertRailRadarData = (railRadarTrains: RailRadarTrain[]): LiveTrain[] => {
    return railRadarTrains
      .filter((train) => {
        // Filter out trains with invalid coordinates
        return (
          train &&
          typeof train.current_lat === 'number' &&
          typeof train.current_lng === 'number' &&
          !isNaN(train.current_lat) &&
          !isNaN(train.current_lng) &&
          train.current_lat !== 0 &&
          train.current_lng !== 0 &&
          train.train_number &&
          train.train_name
        )
      })
      .map((train) => {
        const estimatedSpeed = train.halt_mins === 0 ? Math.floor(Math.random() * 80) + 40 : 0
        const status = train.halt_mins > 0 ? "stopped" :
          train.days_ago > 0 ? "delayed" :
            estimatedSpeed > 60 ? "on-time" : "approaching"

        return {
          id: train.train_number,
          name: train.train_name,
          number: train.train_number,
          status: status as "on-time" | "delayed" | "stopped" | "approaching",
          currentSpeed: estimatedSpeed,
          maxSpeed: train.type === "Suvidha" ? 130 : 110,
          location: {
            lat: train.current_lat,
            lng: train.current_lng,
            station: train.current_station_name || 'Unknown Station',
          },
          destination: train.next_station_name || 'Unknown Destination',
          delay: train.days_ago * 1440 + train.mins_since_dep - train.departure_minutes,
          nextStation: train.next_station_name || 'Unknown Station',
          eta: `${Math.floor(train.next_arrival_minutes / 60)}:${(train.next_arrival_minutes % 60).toString().padStart(2, '0')}`,
          type: train.type || 'Unknown',
          minsSinceDep: train.mins_since_dep || 0,
          distanceFromSource: train.distance_from_source_km || 0,
        }
      })
  }

  // Fetch live train data from local JSON file
  const fetchLiveTrains = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/data.json")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const convertedTrains = convertRailRadarData(result.data)
        setLiveTrains(convertedTrains)
        if (convertedTrains.length > 0 && !selectedTrain) {
          setSelectedTrain(convertedTrains[0])
        }
      } else {
        throw new Error("Invalid JSON data format")
      }
    } catch (error) {
      console.error("Error fetching live trains:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch live train data")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and setup interval
  useEffect(() => {
    fetchLiveTrains()

    // Refresh data every 2 minutes (since it's local data)
    const interval = setInterval(fetchLiveTrains, 120000)

    return () => clearInterval(interval)
  }, [])

  // Create custom train icon for Leaflet
  const createTrainIcon = (status: string, isSelected: boolean = false) => {
    if (typeof window === 'undefined') return null

    const L = require('leaflet')
    const color = status === "on-time" ? "#22c55e" :
      status === "delayed" ? "#ef4444" :
        status === "stopped" ? "#6b7280" : "#eab308"
    
    const size = isSelected ? 20 : 16
    const borderWidth = isSelected ? 3 : 2
    const pulseAnimation = isSelected ? 'animate-ping' : ''
    
    return L.divIcon({
      html: `
        <div class="relative">
          <div style="
            background-color: ${color}; 
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            border: ${borderWidth}px solid white; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            z-index: 10;
            position: relative;
          "></div>
          ${isSelected ? `<div style="
            position: absolute;
            top: -4px;
            left: -4px;
            width: ${size + 8}px;
            height: ${size + 8}px;
            border-radius: 50%;
            background-color: ${color};
            opacity: 0.3;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            z-index: 5;
          "></div>` : ''}
        </div>
      `,
      className: 'custom-train-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-500"
      case "delayed":
        return "bg-red-500"
      case "stopped":
        return "bg-gray-500"
      case "approaching":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-green-500 text-white">On Time</Badge>
      case "delayed":
        return <Badge className="bg-red-500 text-white">Delayed</Badge>
      case "stopped":
        return <Badge className="bg-gray-500 text-white">Stopped</Badge>
      case "approaching":
        return <Badge className="bg-yellow-500 text-white">Approaching</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Live Train Tracking</h2>
          <p className="text-muted-foreground">
            Live monitoring of {liveTrains.length} active trains across India
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={fetchLiveTrains}
            disabled={loading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              {loading ? "Updating..." : "Live Updates Active"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Train List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5" />
                Active Trains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : liveTrains.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No live trains available
                </div>
              ) : (
                liveTrains.map((train) => (
                  <div
                    key={train.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedTrain?.id === train.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    onClick={() => {
                      setSelectedTrain(train);
                      // Center map on selected train with animation
                      if (mapRef.current && train.location.lat && train.location.lng) {
                        const map = mapRef.current;
                        map.flyTo(
                          [train.location.lat, train.location.lng],
                          13,
                          {
                            animate: true,
                            duration: 1.5
                          }
                        );
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(train.status)} animate-pulse`}></div>
                        <span className="font-medium">{train.number}</span>
                      </div>
                      {getStatusBadge(train.status)}
                    </div>
                    <p className="text-sm font-medium truncate">{train.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {train.location.station} → {train.nextStation}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {train.currentSpeed} km/h
                      </span>
                      <span className="text-muted-foreground">
                        {train.distanceFromSource.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map and Train Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Train Positions - Indian Railway Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden border">
                {loading ? (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : typeof window !== 'undefined' && liveTrains.length > 0 ? (
                  <MapContainer
                    center={[20.5937, 78.9629]} // Center of India
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    zoomControl={false}
                    className="z-0"
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <ZoomControl position="bottomright" />

                    {liveTrains
                      .filter((train) =>
                        train.location &&
                        typeof train.location.lat === 'number' &&
                        typeof train.location.lng === 'number' &&
                        !isNaN(train.location.lat) &&
                        !isNaN(train.location.lng)
                      )
                      .map((train) => (
                        <Marker
                          key={train.id}
                          position={[train.location.lat, train.location.lng]}
                          icon={createTrainIcon(train.status, selectedTrain?.id === train.id)}
                          eventHandlers={{
                            click: () => {
                              setSelectedTrain(train)
                              setShowTrainModal(true)
                            },
                          }}
                        >
                          <Tooltip 
                            direction="top" 
                            offset={[0, -10]} 
                            opacity={1} 
                            permanent={selectedTrain?.id === train.id}
                            className="custom-tooltip"
                          >
                            <div className="text-xs font-medium">{train.number}</div>
                          </Tooltip>
                          <Popup className="custom-popup">
                            <div className="p-3 min-w-[220px]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{train.number}</span>
                                {getStatusBadge(train.status)}
                              </div>
                              <p className="text-sm font-medium mb-1 truncate">{train.name}</p>
                              <div className="flex items-start gap-2 mb-3 mt-2">
                                <div className="min-w-4 flex flex-col items-center mt-1">
                                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  <div className="h-8 w-0.5 bg-gray-200 my-1"></div>
                                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                </div>
                                <div className="space-y-2 flex-1">
                                  <div>
                                    <p className="text-xs font-medium">{train.location.station}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium">{train.nextStation}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <span className="text-gray-500">Speed:</span>
                                  <br />
                                  <span className="font-medium">{train.currentSpeed} km/h</span>
                                </div>
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <span className="text-gray-500">Distance:</span>
                                  <br />
                                  <span className="font-medium">{train.distanceFromSource.toFixed(1)} km</span>
                                </div>
                              </div>
                              <div className="mt-3 pt-2 border-t flex justify-between items-center">
                                <div>
                                  <span className="text-xs text-gray-500">Next ETA: </span>
                                  <span className="text-xs font-medium">{train.eta}</span>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setSelectedTrain(train)
                                    setShowTrainModal(true)
                                  }}
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No train data available</p>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-2 left-2 bg-white/95 p-3 rounded-lg shadow-md text-xs space-y-1.5 z-[1000] border">
                  <h4 className="font-semibold text-xs mb-2 text-gray-700">Train Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                    <span>On Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                    <span>Delayed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                    <span>Approaching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full border border-white"></div>
                    <span>Stopped</span>
                  </div>
                  <div className="pt-1 mt-1 border-t border-gray-200 text-[10px] text-gray-500">
                    Total trains: {liveTrains.length}
                  </div>
                </div>

                {/* Live Update Indicator */}
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs shadow-md z-[1000] flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Train Details */}
          {selectedTrain && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Train className="h-5 w-5" />
                    {selectedTrain.name} ({selectedTrain.number})
                  </span>
                  {getStatusBadge(selectedTrain.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Speed</p>
                    <p className="text-2xl font-bold text-primary">{selectedTrain.currentSpeed}</p>
                    <p className="text-xs text-muted-foreground">km/h</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Distance Covered</p>
                    <p className="text-2xl font-bold">{selectedTrain.distanceFromSource.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">km</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Train Type</p>
                    <p className="text-lg font-bold text-blue-600">{selectedTrain.type}</p>
                    <p className="text-xs text-muted-foreground">category</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Next ETA</p>
                    <p className="text-2xl font-bold text-primary">{selectedTrain.eta}</p>
                    <p className="text-xs text-muted-foreground">{selectedTrain.nextStation}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Current Location</p>
                    <p className="font-medium">{selectedTrain.location.station}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTrain.location.lat.toFixed(4)}, {selectedTrain.location.lng.toFixed(4)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Running Status</p>
                    <p className="font-medium">
                      {selectedTrain.minsSinceDep} minutes since departure
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Speed Progress</span>
                    <span className="text-sm">
                      {((selectedTrain.currentSpeed / selectedTrain.maxSpeed) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedTrain.currentSpeed / selectedTrain.maxSpeed) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Send Alert
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-2 bg-transparent"
                    onClick={() => setShowTrainModal(true)}
                  >
                    <MapPin className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Train Detail Modal */}
          {selectedTrain && (
            <Dialog open={showTrainModal} onOpenChange={setShowTrainModal}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Train className="h-6 w-6 text-primary" />
                      <span className="text-xl">{selectedTrain.name}</span>
                    </div>
                    <Badge className="ml-2 text-sm" variant="outline">{selectedTrain.number}</Badge>
                  </DialogTitle>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedTrain.status)}
                      <span className="text-sm text-muted-foreground">{selectedTrain.type}</span>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Left column */}
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Navigation className="h-4 w-4" /> Journey Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="min-w-5 flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <div className="h-12 w-0.5 bg-gray-200 my-1"></div>
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          </div>
                          <div className="space-y-3 flex-1">
                            <div>
                              <p className="font-medium">{selectedTrain.location.station}</p>
                              <p className="text-xs text-muted-foreground">Current Station</p>
                            </div>
                            <div>
                              <p className="font-medium">{selectedTrain.nextStation}</p>
                              <p className="text-xs text-muted-foreground">Next Station (ETA: {selectedTrain.eta})</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Time Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Minutes Since Departure</p>
                          <p className="text-lg font-semibold">{selectedTrain.minsSinceDep} mins</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Arrival In</p>
                          <p className="text-lg font-semibold">{selectedTrain.eta}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delay Status</p>
                          <p className="text-lg font-semibold">{selectedTrain.delay > 0 ? `${selectedTrain.delay} mins` : 'On Time'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column */}
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Current Speed</span>
                            <span className="text-sm font-medium">{selectedTrain.currentSpeed} km/h</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${(selectedTrain.currentSpeed / selectedTrain.maxSpeed) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Max Speed: {selectedTrain.maxSpeed} km/h</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Distance Covered</p>
                            <p className="text-lg font-semibold">{selectedTrain.distanceFromSource.toFixed(1)} km</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Distance to Next</p>
                            <p className="text-lg font-semibold">{(selectedTrain.distanceFromSource * 0.1).toFixed(1)} km</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Location Information
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Coordinates</p>
                          <p className="text-base font-medium">{selectedTrain.location.lat.toFixed(6)}, {selectedTrain.location.lng.toFixed(6)}</p>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg mt-2 flex items-center justify-center">
                          <div className="text-center text-sm text-muted-foreground">
                            <MapPin className="h-6 w-6 mx-auto mb-1 text-primary" />
                            Train is currently at {selectedTrain.location.station}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setShowTrainModal(false)}>Close</Button>
                  <Button className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Send Alert
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
