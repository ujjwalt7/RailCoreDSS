import { create } from "zustand"

interface Train {
  id: string
  name: string
  status: string
  speed: number
  route: string
  currentStation: string
  nextStation: string
}

interface TrackSegment {
  id: string
  name: string
  status: "active" | "disabled"
  section: string
}

interface SimulationResult {
  before_scenario: {
    cascading_delay: number
    original_throughput: number
    route_data: any[]
  }
  after_scenario: {
    optimized_delay: number
    optimized_throughput: number
    route_data: any[]
  }
  summary_explanation: string
}

interface AppState {
  activeTab: string
  selectedTrain: Train | null
  trackSegments: TrackSegment[]
  simulationResult: SimulationResult | null
  setActiveTab: (tab: string) => void
  setSelectedTrain: (train: Train | null) => void
  updateTrackStatus: (trackId: string, status: "active" | "disabled") => void
  setSimulationResult: (result: SimulationResult) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "live-operations",
  selectedTrain: null,
  trackSegments: [
    { id: "T001", name: "Delhi-Ghaziabad Main Line", status: "active", section: "Northern" },
    { id: "T002", name: "Delhi-Faridabad Branch", status: "active", section: "Southern" },
    { id: "T003", name: "Delhi-Panipat Express Line", status: "active", section: "Northern" },
    { id: "T004", name: "Delhi-Rohtak Local Line", status: "disabled", section: "Western" },
    { id: "T005", name: "Delhi-Ballabhgarh Freight Line", status: "active", section: "Southern" },
  ],
  simulationResult: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTrain: (train) => set({ selectedTrain: train }),
  updateTrackStatus: (trackId, status) =>
    set((state) => ({
      trackSegments: state.trackSegments.map((track) => (track.id === trackId ? { ...track, status } : track)),
    })),
  setSimulationResult: (result) => set({ simulationResult: result }),
}))
