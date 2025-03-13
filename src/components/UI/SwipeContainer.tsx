"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { setActiveIndex } from "../Redux/swipeSlice";

interface SwipeContainerProps {
  items: React.ReactNode[];
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ items }) => {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state:any) => state.swipe.activeIndex);

  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      onSlideChange={(swiper) => dispatch(setActiveIndex(swiper.activeIndex))}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwipeContainer;
