import React from 'react';
import Pagination from '@mui/material/Pagination';

export default function PaginationButtons({ count, page, handlePageChange }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'end', paddingTop: '30px' }}>
            <Pagination
                count={count}
                page={page}
                onChange={(event, value) => handlePageChange(event, value)}
                showFirstButton
                showLastButton
            />
        </div>
    );
}