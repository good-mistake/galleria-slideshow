"use client";

import Image from "next/image";
import data from "../../data.json";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Swiper as SwiperType } from "swiper";
export default function Home() {
  const [slides, setSlides] = useState<typeof data>([]);
  const [showSlide, setShowSlide] = useState<boolean>(false);
  const [start, setStart] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [modal, setModal] = useState<boolean>(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const progressPercent = ((activeSlide + 1) / slides.length) * 100;
  const randomSlide = () => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setSlides(shuffled);
    setStart(0);
    setShowSlide(true);
  };
  const specificSlide = (slide: (typeof data)[0]) => {
    const reordered = [slide, ...data.filter((d) => d !== slide)];
    setSlides(reordered);
    setStart(0);
    setShowSlide(true);
  };
  const customOrder = [
    data[0],
    data[4],
    data[8],
    data[11],
    data[1],
    data[5],
    data[9],
    data[12],
    data[2],
    data[6],
    data[13],
    data[3],
    data[7],
    data[10],
    data[14],
  ];
  const customOrderTablet = [
    data[0],
    data[2],
    data[4],
    data[6],
    data[8],
    data[11],
    data[13],
    data[1],
    data[3],
    data[5],
    data[7],
    data[9],
    data[10],
    data[12],
    data[14],
  ];
  const stopSlideshow = () => {
    setShowSlide(false);
  };
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => setHasMounted(true), []);
  const showGallery =
    width > 768 ? customOrder : width > 550 ? customOrderTablet : data;

  if (!hasMounted) return null;
  return (
    <div className="gallery">
      <header>
        <div>
          <Image
            src="/assets/shared/logo.svg"
            alt="logo"
            width={169.56}
            height={48}
          />
          <button onClick={showSlide ? stopSlideshow : randomSlide}>
            {showSlide ? "STOP SLIDESHOW" : "START SLIDESHOW"}
          </button>
        </div>
      </header>

      {!showSlide ? (
        <main className="masonry fadeIn">
          {showGallery.map((i) => (
            <div
              className={`item `}
              key={i.name + i.year}
              onClick={() => specificSlide(i)}
              style={{ cursor: "pointer" }}
            >
              <img src={i.images.thumbnail} alt={i.name} />
              <div>
                <h3>{i.name}</h3>
                <p>{i.artist.name}</p>
              </div>
            </div>
          ))}
        </main>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          loop={false}
          initialSlide={start}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          onSwiper={setSwiper}
          className="fadeIn"
        >
          {slides.map((i) => (
            <SwiperSlide key={i.name + i.year}>
              <div className={`slides ${i.name}`}>
                <div className="left">
                  <div className="paintAndView">
                    <img
                      className="painting"
                      src={
                        width > 550 ? i.images.hero.large : i.images.hero.small
                      }
                      alt={i.name}
                    />
                    <div
                      className="view"
                      onClick={() => {
                        swiper?.autoplay?.stop();
                        setModal(true);
                        setIsAutoplay(false);
                      }}
                    >
                      <img src="/assets/shared/icon-view-image.svg" alt="" />
                      <p>VIEW IMAGE</p>
                    </div>
                  </div>
                  <div className="nameAndImg">
                    <div>
                      <h3>{i.name}</h3>
                      <p>{i.artist.name}</p>
                    </div>
                    <img src={i.artist.image} alt="" />
                  </div>
                </div>
                <div className="right">
                  <h2>{i.year}</h2>
                  <div>
                    <p>{i.description}</p>
                    <a href={i.source} target="/">
                      GO TO SOURCE
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {showSlide && (
        <footer>
          <div className="bar" style={{ width: `${progressPercent}%` }} />
          <div>
            <h3>{slides[activeSlide].name}</h3>
            <p>{slides[activeSlide].artist.name}</p>
          </div>
          <div className="controls">
            <button
              onClick={() => swiper?.slidePrev()}
              disabled={activeSlide === 0}
              className={activeSlide === 0 ? "disabled" : ""}
            >
              <img src="/assets/shared/icon-back-button.svg" alt="icon" />
            </button>
            <button
              className="pause"
              onClick={() => {
                if (isAutoplay) {
                  swiper?.autoplay?.stop();
                } else {
                  swiper?.autoplay?.start();
                }
                setIsAutoplay(!isAutoplay);
              }}
            >
              {isAutoplay ? (
                <img src="/assets/shared/pause-svgrepo-com.svg" alt="icon" />
              ) : (
                <img
                  src="/assets/shared/media-playback-start-svgrepo-com.svg"
                  alt="icon"
                />
              )}
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              disabled={activeSlide === slides.length - 1}
              className={activeSlide === slides.length - 1 ? "disabled" : ""}
            >
              <img src="/assets/shared/icon-next-button.svg" alt="icon" />
            </button>
          </div>
        </footer>
      )}
      {modal && (
        <div
          className="modal"
          onClick={() => {
            setModal(false);
            swiper?.autoplay?.start();
            setIsAutoplay(true);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => {
                setModal(false);
                swiper?.autoplay?.start();
                setIsAutoplay(true);
              }}
            >
              CLOSE
            </button>
            <img
              src={slides[activeSlide].images.gallery}
              alt="Enlarged artwork"
            />
          </div>
        </div>
      )}
    </div>
  );
}
