// store/useTextStore.ts
import { create } from 'zustand';

interface TextState {
  status: boolean;
  setOn: () => void;
  setOff: () => void;
}

const useCollapse = create<TextState>((set) => ({
  status: false,
  setOn: () => set(() => ({ status: true })),
  setOff: () => set(() => ({ status: false })),
}));

export default useCollapse;
