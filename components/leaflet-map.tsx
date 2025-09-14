"use client"

import { useState } from "react"

interface Train {
  id: string
  name: string
  number: string
  status: "on-time" | "delayed" | "stopped" | "approaching"
  currentSpeed: number
  location: {
    lat: number
    lng: number
    station: string
  }
}

interface LeafletMapProps {
  trains: Train[]
  selectedTrain: Train | null
}

export default function LeafletMap({ trains, selectedTrain }: LeafletMapProps) {
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "#22c55e"
      case "delayed":
        return "#ef4444"
      case "stopped":
        return "#6b7280"
      case "approaching":
        return "#eab308"
      default:
        return "#6b7280"
    }
  }

  // Convert lat/lng to map coordinates (simplified projection)
  const getMapPosition = (lat: number, lng: number) => {
    // Delhi region bounds: lat 28.4-28.8, lng 77.0-77.6
    const minLat = 28.4,
      maxLat = 28.8
    const minLng = 77.0,
      maxLng = 77.6

    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        {/* Railway lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="railway" patternUnits="userSpaceOnUse" width="2" height="2">
              <rect width="2" height="2" fill="#94a3b8" />
              <rect width="1" height="2" fill="#64748b" />
            </pattern>
          </defs>
          {/* Main railway lines */}
          <path d="M10,50 Q30,30 50,50 Q70,70 90,50" stroke="url(#railway)" strokeWidth="0.8" fill="none" />
          <path d="M20,20 Q40,40 60,30 Q80,20 90,30" stroke="url(#railway)" strokeWidth="0.6" fill="none" />
          <path d="M10,70 Q30,80 50,70 Q70,60 90,70" stroke="url(#railway)" strokeWidth="0.6" fill="none" />
        </svg>

        {/* Station markers */}
        <div className="absolute top-[45%] left-[15%] w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="absolute top-[25%] left-[35%] w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="absolute top-[45%] left-[50%] w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="absolute top-[65%] left-[75%] w-2 h-2 bg-gray-600 rounded-full"></div>

        {/* Station labels */}
        <div className="absolute top-[40%] left-[10%] text-xs text-gray-600 font-medium">NDLS</div>
        <div className="absolute top-[20%] left-[30%] text-xs text-gray-600 font-medium">GZB</div>
        <div className="absolute top-[40%] left-[45%] text-xs text-gray-600 font-medium">DLI</div>
        <div className="absolute top-[60%] left-[70%] text-xs text-gray-600 font-medium">FDB</div>
      </div>

      {/* Train markers */}
      {trains.map((train) => {
        const position = getMapPosition(train.location.lat, train.location.lng)
        const isSelected = selectedTrain?.id === train.id
        const isHovered = hoveredTrain === train.id

        return (
          <div
            key={train.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              isSelected || isHovered ? "scale-125 z-20" : "z-10"
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            onMouseEnter={() => setHoveredTrain(train.id)}
            onMouseLeave={() => setHoveredTrain(null)}
          >
            {/* Train icon */}
            <div
              className={`w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
              }`}
              style={{ backgroundColor: getStatusColor(train.status) }}
            >
              <div className="text-white text-xs">🚂</div>
            </div>

            {/* Speed indicator */}
            {train.currentSpeed > 0 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/75 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                  {train.currentSpeed.toFixed(0)} km/h
                </div>
              </div>
            )}

            {/* Train info popup */}
            {(isSelected || isHovered) && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-30">
                <h3 className="font-bold text-sm">{train.name}</h3>
                <p className="text-xs text-gray-600">{train.number}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Status:</span>
                    <span className="font-medium capitalize" style={{ color: getStatusColor(train.status) }}>
                      {train.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Speed:</span>
                    <span className="font-medium">{train.currentSpeed.toFixed(0)} km/h</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Location:</span>
                    <span className="font-medium">{train.location.station}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-xs">
        <h4 className="font-bold mb-2">Train Status</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("on-time") }}></div>
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("delayed") }}></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("approaching") }}></div>
            <span>Approaching</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("stopped") }}></div>
            <span>Stopped</span>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 rounded-lg px-3 py-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium">Live Tracking</span>
      </div>
    </div>
  )
}
