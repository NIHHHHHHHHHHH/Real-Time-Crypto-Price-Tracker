import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSorting, selectSorting } from '../features/crypto/cryptoSlice';
import { HiSelector, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const SortableTableHeader = ({ column, children }) => {
  const dispatch = useDispatch();
  const sorting = useSelector(selectSorting);

  // Handle the sorting logic based on user clicks
  const handleSort = () => {
    if (sorting.column === column) {
      // Toggle between ascending, descending, or reset sorting
      if (sorting.direction === 'desc') {
        dispatch(setSorting({ column, direction: 'asc' }));
      } else if (sorting.direction === 'asc') {
        dispatch(setSorting({ column: null, direction: null })); // Reset sorting
      }
    } else {
      dispatch(setSorting({ column, direction: 'desc' })); // Default to descending order
    }
  };

  // Determine the appropriate sorting icon based on the current sorting state
  const getSortIcon = () => {
    if (sorting.column !== column || !sorting.direction) {
      return <HiSelector className="inline ml-1 text-gray-500" />; // Default unselected state
    }
    return sorting.direction === 'asc'
      ? <HiChevronUp className="inline ml-1 text-blue-600" /> // Ascending icon
      : <HiChevronDown className="inline ml-1 text-blue-600" />; // Descending icon
  };

  return (
    // Clickable header that triggers sorting functionality
    <th onClick={handleSort} className="sortable-header cursor-pointer select-none">
      {children} <span className="sort-icon">{getSortIcon()}</span>
    </th>
  );
};

export default SortableTableHeader;
