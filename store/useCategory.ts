// store/useTextStore.ts
import {create} from 'zustand';

interface TextState {
  text: string;
  setText: (newText: string) => void;
}

const useCategory = create<TextState>((set) => ({
  text: '',
  setText: (newText) => set({ text: newText }),
}));

export default useCategory;
