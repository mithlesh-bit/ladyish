import React from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Container from "../shared/Container";
import { useRouter } from "next/navigation";

const Banner1 = () => {
  const router = useRouter();

  const images = [
    "/assets/home/banner/model1.png",
    "/assets/home/banner/top.png",
    "/assets/home/banner/earn.png",
  ];

  return (
    <Container>
      <div
        className="bg-[#f8f0ea] h-full w-full rounded-primary relative flex flex-col gap-y-8 lg:p-24 pt-8 pb-0 mt-12"
        style={{ backgroundImage: "url(/assets/home/banner/dots.svg)" }}
      >
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
        >
          {images.map((src, index) => (
            <div key={index}>
              <Image
                src={src}
                alt={`model-${index}`}
                height={872}
                width={500}
                className="lg:absolute bottom-0 right-0 order-2 lg:w-[500px] lg:ml-0 md:ml-auto"
              />
            </div>
          ))}
        </Carousel>
        <article className="flex flex-col justify-start items-end order-1 px-8">
          <div className="flex flex-col gap-y-4 max-w-lg z-20 mr-auto">
            <h1 className="md:text-6xl text-4xl">
              Customizable✿ Affordable✿ Sustainable✿
            </h1>
            <p className="flex flex-row gap-x-0.5 items-center text-lg text-black">
              Your local crochet shop 🧶
            </p>
            <button
              className="px-8 py-4 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit mt-4"
              onClick={() => window.open("/products", "_self")}
            >
              Shop Now
            </button>
          </div>
        </article>
      </div>
    </Container>
  );
};

export default Banner1;
