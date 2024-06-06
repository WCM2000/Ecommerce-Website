"use client";

import { useState } from "react";
import Image from "next/image";

import CustomButton from "./CustomButton";
import CarDetails from "./CarDetails";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { city_mpg, year, make, model, transmission, drive } = product;

  const [isOpen, setIsOpen] = useState(false);

  // const carRent = calculateCarRent(city_mpg, year);
  const carRent = 5000;

  const goTo = (link) => {
    router.push(link);
  };

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {" "}
          {`${product?.model} ${product?.processor} ${product?.ram} ${product?.storage} laptop`}
        </h2>
      </div>

      <p className="flex mt-6 text-[32px] leading-[38px] font-extrabold">
        <span className="self-start text-[14px] leading-[17px] font-semibold">
          Rs.
        </span>
        {product.price}
        <span className="self-end text-[14px] leading-[17px] font-medium"></span>
      </p>

      <div className="relative w-full h-40 my-3 object-contain">
        {product && product?.images && (
          <Image
            // src={"https://m.media-amazon.com/images/I/71ASAtN3OZL._AC_SX679_.jpg"}
            src={`${process.env.NEXT_PUBLIC_API_DEVELOPMENT}/products/image/${product.images[0]}`}
            alt="car model"
            fill
            priority
            className="object-contain"
          />
        )}
      </div>

      <div className="relative flex w-full mt-2">
        {/* <div className="flex group-hover:invisible w-full justify-between text-grey">
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/svgs/steering-wheel.svg"
              width={20}
              height={20}
              alt="steering wheel"
            />
            <p className="text-[14px] leading-[17px]">
              {transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/svgs/tire.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{drive}</p>
          </div>
          <div className="car-card__icon">
            <Image src="/svgs/gas.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{city_mpg} MPG</p>
          </div>
        </div> */}

        <div className="car-card__btn-container">
          <CustomButton
            title="View More."
            containerStyles="w-full py-[16px] rounded-full bg-primary-blue"
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            rightIcon="/svgs/right-arrow.svg"
            handleClick={() =>
              goTo(`/products/singleProduct?productId=${product._id}`)
            }
          />
        </div>
      </div>

      {/* <CarDetails
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        product={product}
      /> */}
    </div>
  );
};

export default ProductCard;
