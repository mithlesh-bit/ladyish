import Image from "next/image";
import Container from "../shared/Container";

const Banner = () => {
  return (
    <Container>
      <div className="container py-6 bg-white flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center">
          {/* Text content */}
          <div className="w-full md:w-1/2 px-6 py-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Carefully Crafted
            </h2>
            <p className="text-gray-600 mb-3">
              All the products we make are handmade specially, for our
              customers. Once an order is placed it takes 10/15 days for us to
              handmake it.
            </p>
            <p className="text-gray-600 mb-6">
              This is one of the reasons we do not accept returns/exchange. We
              encourage you to check the size guide before placing your order,
              to receive your products correctly.
            </p>
            <button
              className="bg-rose-200 hover:bg-rose-300 text-gray-800 font-bold py-2 px-4 rounded-full"
              onClick={() => window.open("/products", "_self")}
            >
              Shop Now
            </button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/assets/home/banner/top.png"
              alt="Handmade product"
              width={550} // Set desired image width
              height={650} // Set desired image height to maintain aspect ratio
              quality={100}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Banner;
