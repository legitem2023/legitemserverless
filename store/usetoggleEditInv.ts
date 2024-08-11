import { create } from 'zustand';

interface ToggleState {
  isInvToggled: boolean;
  toggleEdit: () => void;
}

const usetoggleEditInv = create<ToggleState>((set) => ({
    isInvToggled: false,
    toggleEdit: () => set((state) => ({ isInvToggled: !state.isInvToggled })),
}));

export default usetoggleEditInv;
