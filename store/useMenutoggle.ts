import { create } from 'zustand';

interface ToggleState {
  isMenuToggled: boolean;
  menutoggle: () => void;
}

const useMenutoggle = create<ToggleState>((set) => ({
    isMenuToggled: false,
  menutoggle: () => set((state) => ({ isMenuToggled: !state.isMenuToggled })),
}));

export default useMenutoggle;
