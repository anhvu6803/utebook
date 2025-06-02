import React, { useState } from 'react';
import "./styles/CustomLibraryList.scss";
import searchResult from "./../assets/icon-search-result.png";
import { useAuth } from '../contexts/AuthContext';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import WarningForm from './WarningForm';

function isOldEnough(birthDateISO, minAge) {
  const today = new Date();
  const birthDate = new Date(birthDateISO);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= minAge;
}

export default function CustomLibraryList({
  itemData,
  page,
  tab,
  handleViewDetail
}) {
  const { user } = useAuth();
  const itemPage = itemData[page - 1]?.map((item) => item) || [];
  console.log(itemData);

  const [showWarning, setShowWarning] = useState(false);

  const handleReadBook = (tab, bookData) => {
    if (!isOldEnough(user.ngaySinh, bookData.ageLimit)) {
      setShowWarning(true);
      return;
    }
    handleViewDetail(tab, bookData._id);
  };

  return (
    <>
      {showWarning && <WarningForm isShow={showWarning} />}
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

                      onClick={() => handleReadBook(tab, item)}
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
