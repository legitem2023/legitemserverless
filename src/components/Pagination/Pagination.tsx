import React from 'react';
import { Icon } from '@iconify/react';
import useCurrentPage from '../../../store/useCurrentPage';


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {

  const { setCurrentPage } = useCurrentPage();






  const siblingsCount = 2;

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pagesToShow = range(
    Math.max(1, currentPage - siblingsCount),
    Math.min(totalPages, currentPage + siblingsCount)
  );

  return (
    <div className='flex justify-center my-4 bg-stone-400 border-4 border-stone-500 p-2'>
      <button
        onClick={() => {onPageChange(1);setCurrentPage(currentPage + 1)}}
        disabled={currentPage === 1}
        className='mx-1 px-3 py-1 bg-transparent text-black rounded hover:bg-palette_gray hover:text-palette_white'>
        <Icon icon="gg:chevron-double-right" style={{transform:'scaleX(-1)'}} />
      </button>
      <button
        onClick={() => {onPageChange(currentPage - 1);setCurrentPage(currentPage - 1)}}
        disabled={currentPage === 1}
        className='mx-1 px-3 py-1 bg-transparent text-black rounded hover:bg-palette_gray hover:text-palette_white'>
        <Icon icon="gg:chevron-right" style={{transform:'scaleX(-1)'}}/>
      </button>

      {pagesToShow.map(page => (
        <button
          key={page}
          onClick={() => {onPageChange(page);setCurrentPage(page)}}
          className={`mx-1 px-3 py-1 ${currentPage === page
            ? 'bg-lime-500 text-white hover:bg-lime-700'
            : 'text-black bg-transparent hover:bg-lime-800 hover:text-palette_white'
            } rounded`}>
          {page}
        </button>
      ))}

      <button
        onClick={() => {onPageChange(currentPage + 1);setCurrentPage(currentPage + 1)}}
        disabled={currentPage === totalPages}
        className='mx-1 px-3 py-1 bg-transparent text-black rounded hover:bg-palette_gray hover:text-palette_white'>
        <Icon icon="gg:chevron-right" />
      </button>

      <button
        onClick={() => {onPageChange(totalPages);setCurrentPage(totalPages)}}
        disabled={currentPage === totalPages}
        className='mx-1 px-3 py-1 bg-transparent text-black rounded hover:bg-palette_gray hover:text-palette_white'>
        <Icon icon="gg:chevron-double-right"/>
      </button>

    </div>
  );
};

export default Pagination;