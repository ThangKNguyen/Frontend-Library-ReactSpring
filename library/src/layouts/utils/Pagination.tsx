export const Pagination: React.FC<{ 
  currentPage: number, 
  totalPages: number, 
  paginate: (page: number) => void 
}> = ({ currentPage, totalPages, paginate }) => {

  const pageNumbers: number[] = [];

  // Always show the current page and up to 2 pages before/after
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        
        {/* First Page Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} 
            onClick={() => paginate(1)}>
          <button className="page-link">First Page</button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <li key={number} 
              className={`page-item ${currentPage === number ? 'active' : ''}`} 
              onClick={() => paginate(number)}>
            <button className="page-link">{number}</button>
          </li>
        ))}

        {/* Last Page Button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`} 
            onClick={() => paginate(totalPages)}>
          <button className="page-link">Last Page</button>
        </li>
      </ul>
    </nav>
  );
};
