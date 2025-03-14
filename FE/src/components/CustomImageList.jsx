import * as React from 'react';
import "./styles/AccountTabs.scss";
import searchResult from "./../assets/icon-search-result.png";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function CustomImageList({ itemData }) {
  return (
    <>
      {
        itemData.length > 0 ?
          (
            <>
              <ImageList
                cols={4}
                gap={30}

                sx={{
                  width: '100%',
                  height: '100%'
                }}
              >
                {itemData.map((item) => (
                  <div>
                    <ImageListItem key={item.img}>
                      <img
                        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.img}?w=248&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 330,
                          borderRadius: 15,
                          objectFit: 'cover',
                        }}
                      />
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
                      {item.title}
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
