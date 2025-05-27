import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomePage.scss";
import SliderImageHome from "../components/SliderImageHome";
import BookSwiper from "../components/BookSwiper";
import axios from "axios";

import { ChevronRight } from "lucide-react";
import Loading from "../components/Loading";
const categories = [
  { label: 'Đô thị', value: 'dothi' },
  { label: 'Tiên hiệp', value: 'tienhiep' },
  { label: 'Trinh thám', value: 'trinhtham' },
  { label: 'Ngôn tình', value: 'ngontinh' },
  { label: 'Linh dị', value: 'linhdi' },
  { label: 'Truyện Ma', value: 'truyenma' },
];
const HomePage = () => {
  const navigate = useNavigate();
  const [listBookDoThi, setListBookDoThi] = useState([]);
  const [listBookNgonTinh, setListBookNgonTinh] = useState([]);
  const [listBookTrinhTham, setListBookTrinhTham] = useState([]);
  const [listBookTienHiep, setListBookTienHiep] = useState([]);
  const [listBookLinhDi, setListBookLinhDi] = useState([]);
  const [listBookTruyenMa, setListBookTruyenMa] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(categories.map(() => false));

  const getListBookDoThi = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/${categories[0].label}`,
      );
      setListBookDoThi(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const getListBookNgonTinh = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/${categories[3].label}`,
      );
      setListBookNgonTinh(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const getListBookTrinhTham = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/${categories[2].label}`,
      );
      setListBookTrinhTham(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const getListBookTienHiep = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/${categories[1].label}`,
      );
      setListBookTienHiep(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const getListBookLinhDi = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/${categories[4].label}`,
      );
      setListBookLinhDi(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const getListBookTruyenMa = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/book/random-books/${categories[5].label}`,
      );
      setListBookTruyenMa(res.data.data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getListBookDoThi();
        await getListBookNgonTinh();
        await getListBookTrinhTham();
        await getListBookTienHiep();
        await getListBookLinhDi();
        await getListBookTruyenMa();
      } catch (err) {
        console.log(err);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  if (isLoading) {
    return <Loading />
  }
  const handleReturnListCategory = (category) => {
    if (category === categories[0].value) {
      console.log(listBookDoThi);
      return listBookDoThi;
    }
    if (category === categories[1].value) {
      console.log(listBookTienHiep);
      return listBookTienHiep;
    }
    if (category === categories[2].value) return listBookTrinhTham;
    if (category === categories[3].value) return listBookNgonTinh;
    if (category === categories[4].value) return listBookLinhDi;
    if (category === categories[5].value) return listBookTruyenMa;
  }

  return (
    <div className="home-container">
      <div className="image-swiper">
        <SliderImageHome />
      </div>
      {/* <div className="book-swiper">
        <p className="book-swiper-title">UTEBOOK đề xuất</p>
        <BookSwiper />
      </div> */}
      {categories.map((category, index) => (
        <div className="book-swiper" key={index}>
          <div
            className="book-swiper-title-container"
          >
            <p className="book-swiper-title">
              {category.label}

            </p>
            <p
              className="more-title"
              onClick={() => navigate(`/utebook/novel/${category.label}`)}
            >
              Khám phá
              <ChevronRight size={20} />
            </p>
          </div>
          <BookSwiper
            itemData={handleReturnListCategory(category.value)}
            category={category.label}
          />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
