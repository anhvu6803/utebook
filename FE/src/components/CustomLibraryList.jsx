import React, { useState } from 'react';
import "./styles/CustomLibraryList.scss";
import searchResult from "./../assets/icon-search-result.png";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function CustomLibraryList({
  itemData,
  page,
  tab,
  handleViewDetail
}) {
  const itemPage = itemData[page - 1]?.map((item) => item) || [];
  console.log(itemData);
  return (
    <>
      {
        itemPage.length > 0 ?
          (
            <>
              <ImageList
                cols={5}
                gap={20}
                sx={{
                  width: '100%',
                  height: '100%'
                }}
              >
                {itemPage.map((item, index) => (
                  <div>
                    <ImageListItem
                      key={item}
                    >
                      <img
                        srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.image}?w=248&fit=crop&auto=format`}
                        loading="lazy"
                        style={{
                          width: 200,
                          height: 300,
                          borderRadius: 15,
                          objectFit: 'cover',
                        }}

                      />

                    </ImageListItem>

                    <span
                      className="book-title"

                      onClick={() => handleViewDetail(tab, item._id)}
                    >
                      {item.bookname}
                    </span>
                  </div>
                ))}
              </ImageList>
            </>
          )
          :
          (<>
            <div className="no-books">
              <img src={searchResult} alt="No Books" />
              <p className="title">Chưa có cuốn sách nào</p>
              <p className="subtitle">
                Cùng khám phá kho tàng tri thức rộng lớn với UTEBOOK
              </p>
            </div>
          </>)
      }
    </>
  );
}
