// store/useTextStore.ts
import {create} from 'zustand';
interface TextState {
  curNav: string;
  setNav: (newText: string) => void;
}

const useNav = create<TextState>((set) => ({
  curNav: './Product',
  setNav: (newText) => set({ curNav: newText }),
}));

export default useNav;
