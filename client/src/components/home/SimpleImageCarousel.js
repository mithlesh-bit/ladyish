import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SimpleImageCarousel = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
           `${process.env.NEXT_PUBLIC_BASE_URL}/corousel/get-corousel`
        );
        const data = await response.json();
        setCarouselData(data); // Set all data in one state update
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % carouselData.length);
  }, [carouselData.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? carouselData.length - 1 : current - 1
    );
  }, [carouselData.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div
      className="relative w-full overflow-hidden mx-auto rounded-lg"
      style={{ minHeight: "500px", maxWidth: "90%" }}
    >
      {carouselData.length ? (
        carouselData.map((item, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}
          >
            <Image
              src={item.image}
              alt={`Slide ${index}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 flex items-center p-4">
              <div
                className="text-black text-xl font-bold p-2 rounded"
                style={{ marginLeft: "10%" }}
              >
                <h2 className="mb-4" style={{ fontSize: "3.0rem" }}>
                  {item.title || "Default Title"}
                </h2>
                <button
                  className="px-7 py-3 border border-black rounded-secondary bg-black hover:bg-black/80 text-white transition-colors drop-shadow w-fit mt-4"
                  onClick={() => (window.location.href = item.link)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <div>Loading...</div>
        </div>
      )}

      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full text-black hover:bg-gray-200 z-20"
        aria-label="Previous image"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full text-black hover:bg-gray-200 z-20"
        aria-label="Next image"
      >
        &#10095;
      </button>
    </div>
  );
};

export default SimpleImageCarousel;
