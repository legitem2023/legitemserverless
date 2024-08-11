import { create } from 'zustand';

interface ToggleState {
  isAddAccToggled: boolean;
  toggleAddAcc: () => void;
}

const usetoggleShowAdd = create<ToggleState>((set) => ({
    isAddAccToggled: false,
    toggleAddAcc: () => set((state) => ({ isAddAccToggled: !state.isAddAccToggled })),
}));

export default usetoggleShowAdd;
