"use client";
import { ShopContext } from "@/context/show-context";
import { useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";

const Cart = () => {
  let API = process.env.NEXT_PUBLIC_API_DEVELOPMENT;

  if (process.env.NEXT_PUBLIC_PRODUCTION == true) {
    API = process.env.NEXT_PUBLIC_API_PRODUCTION;
  }
  const {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    cartItems,
    removeEntireItem,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const router = useRouter();
  const [user, setUser] = useState();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const makePayment = async () => {
    // if (!user) {
    //   // <Modal />
    //   return <Modal alert={"Please log in to Continue"} setAlert={() => {}} />;
    //   setTimeout(function () {
    //     router.push("/users/login");
    //   }, 2000);

    //   return;
    // }
    const stripe = await loadStripe(
      "pk_test_51H1PjSIzYcTJzt02z5GaR7ntXS7SzKPSg1qSNRkeP55DoPFWyHwQ5MhuzBer27U1YSt1poEhuSHTntS9lvf6em3400mftYOTgG"
    );

    const headers = {
      "Content-Type": "application/json",
    };

    let tempUserId;
    if (localStorage.getItem("user")) {
      tempUserId = JSON.parse(localStorage.getItem("user"))._id;
    }
    const data = {
      products: Object.values(cartItems),
      subTotal: getTotalCartAmount(),
      userId: tempUserId,
    };
    let tempData = Object.values(cartItems);

    console.log(data, "converted ---", tempData);

    const response = await fetch(`${API}/products/create-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };

  return (
    <>
      <div className="flex justify-center my-6">
        <div className="flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5 py-8 px-4 mx-auto max-w-2xl lg:pt-16 lg:pb-4">
          <div className="flex-1">
            <table className="w-full text-sm lg:text-base" cellspacing="0">
              <thead>
                <tr className="h-12 uppercase">
                  <th className="hidden md:table-cell"></th>
                  <th className="text-left">Product</th>
                  <th className="lg:text-right text-left pl-5 lg:pl-0">
                    <span className="lg:hidden" title="Quantity">
                      Qtd
                    </span>
                    <span className="hidden lg:inline">Quantity</span>
                  </th>
                  <th className="hidden text-right md:table-cell">
                    Unit price
                  </th>
                  <th className="text-right">Total price</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(cartItems).map((item) => {
                  console.log(
                    item,
                    item.itemId,
                    item.itemtitle,
                    "inside cart ite................."
                  );

                  return (
                    <tr>
                      <td className="hidden pb-4 md:table-cell">
                        <a href="#">
                          <img
                            // src="https://limg.app/i/Calm-Cormorant-Catholic-Pinball-Blaster-yM4oub.jpeg"
                            src={`${process.env.NEXT_PUBLIC_API_DEVELOPMENT}/products/image/${item.itemimages}`}
                            className="w-20 rounded"
                            alt="Thumbnail"
                          />
                        </a>
                      </td>
                      <td>
                        <a href="#">
                          <p className="mb-2 md:ml-4">{item.itemtitle}</p>

                          <button
                            className="text-gray-700 md:ml-4"
                            onClick={() => removeEntireItem(item.itemId)}
                          >
                            <small>(Remove item)</small>
                          </button>
                        </a>
                      </td>
                      <td className="justify-center md:justify-end md:flex mt-6">
                        <div className="w-20 h-10">
                          {/* <div className="relative flex flex-row w-full h-8">
                          <input
                            type="number"
                            value={item.count}
                            className="w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black"
                          />
                        </div> */}
                          <div className="relative flex flex-row w-full h-10 mt-6 bg-transparent rounded-lg">
                            <button
                              className="w-20 h-full text-gray-600 bg-gray-300 rounded-l outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-400"
                              onClick={() => removeFromCart(item.itemId)}
                            >
                              <span className="m-auto text-2xl font-thin">
                                -
                              </span>
                            </button>
                            <input
                              type="number"
                              value={cartItems[item.itemId]?.count}
                              onChange={(e) =>
                                updateCartItemCount(
                                  item.itemId,
                                  Number(e.target.value),
                                  item.itemprice,
                                  item.itemtitle,
                                  item.itemimages
                                )
                              }
                              className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-300 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
                              placeholder="1"
                            />
                            <button className="w-20 h-full text-gray-600 bg-gray-300 rounded-r outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-400">
                              <span
                                className="m-auto text-2xl font-thin"
                                onClick={() =>
                                  addToCart(
                                    item.itemId,
                                    Number(cartItems[item.itemId]?.count),
                                    item.itemprice,
                                    item.itemtitle,
                                    item.itemimages
                                  )
                                }
                              >
                                +
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="hidden text-right md:table-cell">
                        <span className="text-sm lg:text-base font-medium">
                          {item.itemprice}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="text-sm lg:text-base font-medium">
                          {item.itemprice * item.count}€
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr className="pb-6 mt-6" />
            <div className="my-4 mt-6 -mx-2 lg:flex">
              <div className="lg:px-2 lg:w-full">
                {/* <div className="lg:px-2 lg:w-1/2"> */}
                <div className="p-4 bg-gray-100 rounded-full">
                  <h1 className="ml-2 font-bold uppercase">Order Details</h1>
                </div>
                <div className="p-4">
                  <p className="mb-6 italic">
                    Shipping and additionnal costs are calculated based on
                    values you have entered
                  </p>
                  <div className="flex justify-between border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Subtotal
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {getTotalCartAmount()}
                    </div>
                  </div>

                  {/* <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Tax
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      2,976.55€
                    </div>
                  </div> */}
                  <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Total
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      Rs. {getTotalCartAmount()}
                    </div>
                  </div>
                  {/* <a href="#"> */}
                  <button
                    onClick={makePayment}
                    className="flex justify-center w-full px-10 py-3 mt-6 font-medium text-white uppercase bg-gray-800 rounded-full shadow item-center hover:bg-gray-700 focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      aria-hidden="true"
                      data-prefix="far"
                      data-icon="credit-card"
                      className="w-8"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z"
                      />
                    </svg>
                    <span className="ml-2 mt-5px">Procceed to checkout</span>
                  </button>
                  {/* </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
