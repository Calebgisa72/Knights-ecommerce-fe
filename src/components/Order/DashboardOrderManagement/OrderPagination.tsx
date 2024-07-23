import React, { ChangeEvent } from 'react';
import Pagination from '@mui/material/Pagination';

interface PaginationProps {
  start: number;
  end: number;
  total: number;
  setPage: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const OrderPagination = (props: PaginationProps) => {
  return (
    <div className="flex justify-between border-t border-neutral-300 pt-3 items-center text-neutral-600 text-[.7rem] xmd:text-[.76rem] lg:text-[.83rem]">
      <p>
        Showing {props.start} to {props.end} of {props.total} results
      </p>
      <Pagination
        count={Math.ceil(props.total / 6)}
        variant="outlined"
        shape="rounded"
        size="small"
        onChange={props.setPage}
      />
    </div>
  );
};

export default OrderPagination;
