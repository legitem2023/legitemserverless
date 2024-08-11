import create from 'zustand';

// Define the store interface
interface PageStore {
  currentPageNo: number;
  setCurrentPage: (page: number) => void;
}

// Create the store
const useCurrentPage = create<PageStore>((set) => {
  // Initialize state to default value
  let initialPage = 1;

  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage) {
      initialPage = Number(storedPage) || 1;
    }
  }

  return {
    currentPageNo: initialPage,
    setCurrentPage: (page: number) => {
      set({ currentPageNo: page });
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentPage', page.toString());
      }
    },
  };
});

export default useCurrentPage;
