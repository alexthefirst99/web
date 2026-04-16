import { create } from 'zustand';

export type AppMode = 'overview' | 'skills' | 'projects' | 'research' | 'experience' | 'qa' | 'education' | 'role_fit';

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
  cameraTarget: [0, 0, 0], // Already matches overview mode — prevents camera jolt on load
  narratorText: "NEURAL INTERFACE ONLINE.\n\nWelcome to the interactive portfolio of Alex Tran.\n\nNavigate freely or ask me anything directly — projects, skills, research, or my fit for your team.\n\nI will guide you through the data.",
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
