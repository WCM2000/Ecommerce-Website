"use client";

import { createOrder } from "@/actions/order";
import { useContext, useEffect } from "react";
import { ShopContext } from "@/context/show-context";
import { getCookie } from "@/actions/auth";
import Link from "next/link";
const SuccessPage = () => {
  const {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    cartItems,
    removeEntireItem,
    getTotalCartAmount,
    checkout,
  } = useContext(ShopContext);

  // let cartData = cartItems;
  // let totalAmount = getTotalCartAmount();

  useEffect(() => {
    checkout();
  }, []);

  // useEffect(() => {
  //   handleSubmit(cartData, totalAmount);
  // }, []);

  // console.log(cartItems, getTotalCartAmount());
  // const handleSubmit = (cartData, totalAmount) => {
  //   let userIdTemp;
  //   if (localStorage.getItem("user")) {
  //     userIdTemp = JSON.parse(localStorage.getItem("user"))._id;
  //   }
  //   console.log(cartItems, getTotalCartAmount(), "from success-------------");
  //   let data = {
  //     subTotal: totalAmount,
  //     userId: userIdTemp,
  //     products: cartData,
  //   };

  //   console.log(data, "just before submit");
  //   let token = getCookie("token_user");

  //   createOrder(data, token)
  //     .then((data) => {
  //       if (data.status && data.status == "success") {
  //         console.log(data);
  //       } else {
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <div className="flex flex-col items-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600 w-20 h-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold">Thank You !</h1>
          <p>
            Thank you for your interest! Check your email for a link to the
            guide.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded rounded-full hover:bg-indigo-700 focus:outline-none focus:ring"
            href={"/"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span className="text-sm font-medium">Go back to Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
