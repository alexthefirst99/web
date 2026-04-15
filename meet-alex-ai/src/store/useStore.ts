import { create } from 'zustand';

export type AppMode = 'overview' | 'skills' | 'projects' | 'research' | 'experience' | 'qa' | 'role_fit';

interface AppState {
  mode: AppMode;
  activeNodeId: string | null;
  cameraTarget: [number, number, number];
  narratorText: string;
  isNarrating: boolean;
  
  // Actions
  setMode: (mode: AppMode) => void;
  setActiveNodeId: (id: string | null) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  setNarratorText: (text: string) => void;
  setIsNarrating: (isNarrating: boolean) => void;
  updateStateFromAI: (mode: AppMode, focusId: string | null, text: string) => void;
}

export const useStore = create<AppState>((set) => ({
  mode: 'overview',
  activeNodeId: null,
  cameraTarget: [0, 0, 5], // Default overview camera position
  narratorText: "NEURAL INTERFACE ONLINE.\n\nYou have entered the construct of Alex Tran.\n\nNavigate freely. Ask me anything — projects, skills, research, or role fit.\n\nI will guide you through the data engrams.",
  isNarrating: false,

  setMode: (mode) => set({ mode }),
  setActiveNodeId: (id) => set({ activeNodeId: id }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setNarratorText: (text) => set({ narratorText: text }),
  setIsNarrating: (isNarrating) => set({ isNarrating }),
  
  updateStateFromAI: (mode, focusId, text) => set({
    mode,
    activeNodeId: focusId,
    narratorText: text,
    isNarrating: true
  })
}));
