// store/useTextStore.ts
import {create} from 'zustand';

interface TextState {
  text: string;
  setModel: (newText: string) => void;
}

const useModel = create<TextState>((set) => ({
  text: 'https://hokei-storage.s3.ap-northeast-1.amazonaws.com/images/Legit/model_houses/cb500x/source/CB500X.glb',
  setModel: (newText) => set({ text: newText }),
}));

export default useModel;
