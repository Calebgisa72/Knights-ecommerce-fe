import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from '../../components/Pagination';

describe('Pagination', () => {
  const onPageChange = vi.fn();

  it('should render without crashing', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
  });

  it('should call onPageChange with correct page number when previous button is clicked', () => {
    const { getByText } = render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    const previousButton = getByText('<');

    fireEvent.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable previous button when on the first page', () => {
    const { getByText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    const previousButton = getByText('<');

    expect(previousButton).toBeDisabled();
  });

  it('should call onPageChange with correct page number when next button is clicked', () => {
    const { getByText } = render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    const nextButton = getByText('>');

    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should disable next button when on the last page', () => {
    const { getByText } = render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);
    const nextButton = getByText('>');

    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange with the correct page number when a page number button is clicked', () => {
    const { getByText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    const pageNumberButton = getByText('3');

    fireEvent.click(pageNumberButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
