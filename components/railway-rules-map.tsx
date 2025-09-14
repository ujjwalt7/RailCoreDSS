"use client"

import { useState } from "react"

interface RailwayRule {
  id: string
  title: string
  currentState: "compliant" | "warning" | "violation"
  aiOptimizedState: "compliant" | "warning" | "violation"
  location?: {
    lat: number
    lng: number
    name: string
  }
}

interface RailwayRulesMapProps {
  rules: RailwayRule[]
  selectedRule: RailwayRule | null
}

export default function RailwayRulesMap({ rules, selectedRule }: RailwayRulesMapProps) {
  const [hoveredRule, setHoveredRule] = useState<string | null>(null)

  const getStateColor = (state: string) => {
    switch (state) {
      case "compliant":
        return "#22c55e"
      case "warning":
        return "#eab308"
      case "violation":
        return "#ef4444"
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

  const rulesWithLocations = rules.filter((rule) => rule.location)

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        {/* Railway network */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="railway-rules" patternUnits="userSpaceOnUse" width="2" height="2">
              <rect width="2" height="2" fill="#cbd5e1" />
              <rect width="1" height="2" fill="#94a3b8" />
            </pattern>
          </defs>
          {/* Railway lines */}
          <path d="M10,50 Q30,30 50,50 Q70,70 90,50" stroke="url(#railway-rules)" strokeWidth="1" fill="none" />
          <path d="M20,20 Q40,40 60,30 Q80,20 90,30" stroke="url(#railway-rules)" strokeWidth="0.8" fill="none" />
          <path d="M10,70 Q30,80 50,70 Q70,60 90,70" stroke="url(#railway-rules)" strokeWidth="0.8" fill="none" />

          {/* Control zones */}
          <circle
            cx="25"
            cy="45"
            r="8"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.5"
          />
          <circle
            cx="75"
            cy="55"
            r="10"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Station markers */}
        <div className="absolute top-[45%] left-[15%] w-3 h-3 bg-slate-600 rounded-full border-2 border-white"></div>
        <div className="absolute top-[25%] left-[35%] w-3 h-3 bg-slate-600 rounded-full border-2 border-white"></div>
        <div className="absolute top-[45%] left-[50%] w-3 h-3 bg-slate-600 rounded-full border-2 border-white"></div>
        <div className="absolute top-[65%] left-[75%] w-3 h-3 bg-slate-600 rounded-full border-2 border-white"></div>

        {/* Station labels */}
        <div className="absolute top-[40%] left-[10%] text-xs text-slate-700 font-medium bg-white/80 px-1 rounded">
          New Delhi
        </div>
        <div className="absolute top-[20%] left-[30%] text-xs text-slate-700 font-medium bg-white/80 px-1 rounded">
          Ghaziabad
        </div>
        <div className="absolute top-[40%] left-[45%] text-xs text-slate-700 font-medium bg-white/80 px-1 rounded">
          Delhi Cantt
        </div>
        <div className="absolute top-[60%] left-[70%] text-xs text-slate-700 font-medium bg-white/80 px-1 rounded">
          Faridabad
        </div>
      </div>

      {/* Rule markers */}
      {rulesWithLocations.map((rule) => {
        if (!rule.location) return null

        const position = getMapPosition(rule.location.lat, rule.location.lng)
        const isSelected = selectedRule?.id === rule.id
        const isHovered = hoveredRule === rule.id
        const hasOptimization = rule.currentState !== rule.aiOptimizedState

        return (
          <div
            key={rule.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              isSelected || isHovered ? "scale-125 z-20" : "z-10"
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            onMouseEnter={() => setHoveredRule(rule.id)}
            onMouseLeave={() => setHoveredRule(null)}
          >
            {/* Rule marker */}
            <div className="relative">
              {hasOptimization ? (
                // Split circle showing current vs optimized state
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg relative overflow-hidden ${
                    isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 w-1/2"
                    style={{ backgroundColor: getStateColor(rule.currentState) }}
                  ></div>
                  <div
                    className="absolute inset-0 left-1/2 w-1/2"
                    style={{ backgroundColor: getStateColor(rule.aiOptimizedState) }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs">⚡</div>
                </div>
              ) : (
                // Single state circle
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: getStateColor(rule.currentState) }}
                >
                  <div className="text-white text-xs">📋</div>
                </div>
              )}

              {/* Optimization indicator */}
              {hasOptimization && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                  <div className="text-white text-xs">✨</div>
                </div>
              )}
            </div>

            {/* Rule info popup */}
            {(isSelected || isHovered) && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-3 min-w-64 z-30">
                <h3 className="font-bold text-sm">{rule.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{rule.location.name}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Current State:</span>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium capitalize"
                      style={{
                        backgroundColor:
                          rule.currentState === "compliant"
                            ? "#dcfce7"
                            : rule.currentState === "warning"
                              ? "#fef3c7"
                              : "#fee2e2",
                        color:
                          rule.currentState === "compliant"
                            ? "#166534"
                            : rule.currentState === "warning"
                              ? "#92400e"
                              : "#991b1b",
                      }}
                    >
                      {rule.currentState}
                    </span>
                  </div>

                  {hasOptimization && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs">AI Optimized:</span>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium capitalize"
                        style={{
                          backgroundColor:
                            rule.aiOptimizedState === "compliant"
                              ? "#dcfce7"
                              : rule.aiOptimizedState === "warning"
                                ? "#fef3c7"
                                : "#fee2e2",
                          color:
                            rule.aiOptimizedState === "compliant"
                              ? "#166534"
                              : rule.aiOptimizedState === "warning"
                                ? "#92400e"
                                : "#991b1b",
                        }}
                      >
                        {rule.aiOptimizedState}
                      </span>
                    </div>
                  )}
                </div>

                {hasOptimization && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <span className="text-blue-700 font-medium">AI can optimize this rule compliance</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 rounded-lg p-3 text-xs">
        <h4 className="font-bold mb-2">Rule Status</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStateColor("compliant") }}></div>
            <span>Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStateColor("warning") }}></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStateColor("violation") }}></div>
            <span>Violation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-green-500"></div>
            <span>AI Optimizable</span>
          </div>
        </div>
      </div>

      {/* Compliance overview */}
      <div className="absolute top-4 right-4 bg-white/95 rounded-lg p-3 text-xs">
        <h4 className="font-bold mb-2">Compliance Overview</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Total Rules:</span>
            <span className="font-medium">{rules.length}</span>
          </div>
          <div className="flex justify-between">
            <span>With Locations:</span>
            <span className="font-medium">{rulesWithLocations.length}</span>
          </div>
          <div className="flex justify-between">
            <span>AI Optimizable:</span>
            <span className="font-medium text-blue-600">
              {rules.filter((r) => r.currentState !== r.aiOptimizedState).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
