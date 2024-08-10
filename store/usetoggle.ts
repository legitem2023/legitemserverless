import { create } from 'zustand';

interface ToggleState {
  isToggled: boolean;
  toggle: () => void;
}

const useToggleStore = create<ToggleState>((set) => ({
  isToggled: false,
  toggle: () => set((state) => ({ isToggled: !state.isToggled })),
}));

export default useToggleStore;
