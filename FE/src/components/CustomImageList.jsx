import React, { useState } from 'react';
import "./styles/AccountTabs.scss";
import searchResult from "./../assets/icon-search-result.png";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import BookCard from './BookCard';
import { RingVolume } from '@mui/icons-material';

const reverseIndex = [
  false, false, false, true, true, true,
  false, false, false, true, true, true,
  false, false, false, true, true, true,
  false, false, false, true, true, true,
  false, false, false, true, true, true
]

export default function CustomImageList({ itemData, page, pageName }) {
  const itemPage = itemData[page - 1]?.map((item) => item) || [];
  const [isHovered, setIsHovered] = useState(itemPage.map(() => false));


  const handleHoverItemEnter = (index) => {
    if (isHovered.every((v) => !v)) {
      const updatedIsHovered = [...isHovered];
      updatedIsHovered[index] = true;
      setIsHovered(updatedIsHovered);
      console.log(itemPage[index]);
    }
  }
  const handleHoverItemLeave = (index) => {
    const updatedIsHovered = [...isHovered];
    updatedIsHovered[index] = false;
    setIsHovered(updatedIsHovered);
  }

  return (
    <>
      {
        itemPage.length > 0 ?
          (
            <>
              <ImageList
                cols={6}
                gap={30}
                sx={{
                  width: '100%',
                  height: '100%'
                }}
              >
                {itemPage.map((item, index) => (
                  <div>
                    <ImageListItem
                      key={item}
                      onMouseEnter={() => handleHoverItemEnter(index)}
                      onMouseLeave={() => handleHoverItemLeave(index)}
                    >
                      {!isHovered[index] ?
                        (
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
                        )
                        :
                        (
                          <div style={{
                            position: 'absolute',
                            zIndex: 1000,
                            ...(reverseIndex[index] ? { right: 0 } : { left: 0 }),
                          }}>
                            <BookCard
                              book={item}
                              status={reverseIndex[index] ? 'reversed' : 'normal'}
                              pageName={pageName}
                            />
                          </div>
                        )

                      }
                    </ImageListItem>

                    <span style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      wordBreak: 'break-word',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal', // Cho phép xuống dòng
                      wordWrap: 'break-word',
                      display: 'flex',
                      justifySelf: 'flex-start',
                      textAlign: 'left',
                      padding: '15px 0 15px 0',
                    }}>
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
