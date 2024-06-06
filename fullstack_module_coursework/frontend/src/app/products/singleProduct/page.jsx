"use client";
import { useState, useEffect, useContext } from "react";
import { getCookie } from "@/actions/auth";
import Image from "next/image";
import { ShopContext } from "@/context/show-context";
import { allOrders } from "@/actions/order";
// import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { oneProduct } from "@/actions/product";
import Modal from "@/components/Modal";
// import { io } from "socket.io-client";
import io from "socket.io-client";
import ReviewModal from "@/components/ReviewModal";
import RatingStats from "@/components/RatingStats";
import { allReviews } from "@/actions/review";
import { calculateAverageRating, isIdInProducts } from "@/util";

const socket = io("http://127.0.0.1:3001");
const SingleProduct = () => {
  // let socket = io("http://127.0.0.1:3000");

  const searchParams = useSearchParams();

  const [paramsData, setParamsData] = useState({
    productId: searchParams.get("productId"),
    userID: "",
  });
  const [imageIndex, setImageIndex] = useState(0);

  const [allData, setAllData] = useState();
  const [allReview, setAllReview] = useState();
  const [userCount, setUserCount] = useState({});
  const [check, setCheck] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [showReviewModel, setShowReviewModel] = useState(false);
  const [socketValues, setSocketValues] = useState({
    users: "",
  });

  // let userCount;

  const [alert, setAlert] = useState({
    message: "",
    error: false,
    loading: false,
    success: false,
  });

  const {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    cartItems,
    getTotalCartAmount,
    // userCount,
    // setUserCount,
    getItemCountById,
  } = useContext(ShopContext);

  //product State
  const [product, setProduct] = useState(paramsData.productId);
  const [allOrdered, setAllOrdered] = useState();

  // Messages States
  // const [message, setMessage] = useState(1);
  const [realTimeUserCount, setRealTimeUserCount] = useState(0);

  const joinProduct = () => {
    if (product !== "") {
      socket.emit("join_product", product);
    }
  };

  const sendProductId = () => {
    socket.emit("send_product_id", { product });
  };

  useEffect(() => {
    socket.on("receive_user_count", (data) => {
      console.log(data);
      // let temp = data.message + realTimeUserCount;
      setRealTimeUserCount(data);
    });
    // socket.on("userLeft", (data) => {
    //   console.log(data);
    //   // let temp = data.message + realTimeUserCount;
    //   setRealTimeUserCount(data.roomSize);
    // });
  }, [socket]);

  useEffect(() => {
    joinProduct();
    sendProductId();
  }, []);

  // ---------------SOCKET CHAT -------------------

  const tempFunc = (data) => {
    console.log(data, "from the temp func....");
    // await setUserCount((prev) => [...prev, ...data]);

    alert(data.count);
    setUserCount(data);
    console.log(data, userCount, "from the temp func....");
  };

  // useEffect(() => {
  //   console.log(userCount);
  // }, [userCount]);

  const resetAlert = () => {
    setAlert({ message: "", error: false, loading: false, success: false });
  };

  useEffect(() => {
    fetchData();

    setItemCount(getItemCountById(paramsData.productId));
    fetchReviews();
    handleOrderedProducts();
  }, [refresh]);

  const handleOrderedProducts = async (e) => {
    if (e) {
      e.preventDefault();
    }
    let params;
    setAlert({ ...alert, loading: true });

    let userId;
    if (localStorage.getItem("user")) {
      userId = JSON.parse(localStorage.getItem("user"))._id;
    } else {
      return;
    }

    setParamsData({ ...paramsData, userID: userId });
    params = {
      userId,
      limit: 10,
      page: 1,
    };

    let token = getCookie("token_user");

    await allOrders(params)
      .then((data) => {
        console.log(data);
        if (data.status && data.status == "success") {
          setAllOrdered(data.doc);
        }
        // return { data };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData = async () => {
    // let id = router.query.locationId;
    console.log(searchParams.get("medium"));
    let params = {
      medium: paramsData.medium,
      year: paramsData.year,
      subject: paramsData.subject,
      examType: paramsData.examType,
    };

    // console.log(id);
    await oneProduct(paramsData.productId)
      .then((data) => {
        console.log(data, "fetched.........................");
        if (data.status && data.status == "success") {
          // if (data.results == 0) {
          //   setAlert({
          //     ...alert,
          //     loading: false,
          //     message: data.message,
          //     error: false,
          //     success: true,
          //   });

          //   window.setTimeout(() => {
          //     resetAlert();
          //   }, 1000);
          // } else {
          setAllData(data.doc);
          console.log(data.doc, "inside else");
          setItemCount(cartItems[allData._id]?.count);
          // console.log(data.totalCount);
          // let totalCount = data.totalCount;
          // setTotalPages(Math.ceil(totalCount / limit));
          // setShow(false);
          // }
          setAlert({
            ...alert,
            loading: false,
            message: data.message,
            error: false,
            success: true,
          });

          window.setTimeout(() => {
            resetAlert();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);

        setAlert({
          ...alert,
          loading: false,
          message: "Loading...",
          error: true,
          success: false,
        });
      });
  };
  console.log(
    allData,
    "this is all dat",
    cartItems,
    "total amount of cart",
    getTotalCartAmount()
  );

  const fetchReviews = async () => {
    let data = {
      productId: paramsData.productId,
    };

    // console.log(id);
    await allReviews(data)
      .then((data) => {
        console.log(data, "reviews.........................");
        if (data.status && data.status == "success") {
          // if (data.results == 0) {
          //   setAlert({
          //     ...alert,
          //     loading: false,
          //     message: data.message,
          //     error: false,
          //     success: true,
          //   });

          //   window.setTimeout(() => {
          //     resetAlert();
          //   }, 1000);
          // } else {
          setAllReview(data.doc);
          console.log(data.doc, "inside else");

          // console.log(data.totalCount);
          // let totalCount = data.totalCount;
          // setTotalPages(Math.ceil(totalCount / limit));
          // setShow(false);
          // }
          // setAlert({
          //   ...alert,
          //   loading: false,
          //   message: data.message,
          //   error: false,
          //   success: true,
          // });

          window.setTimeout(() => {
            resetAlert();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);

        setAlert({
          ...alert,
          loading: false,
          message: err.message,
          error: true,
          success: false,
        });
      });
  };

  // if (allData) {

  // useEffect(() => {
  //   // if (paramsData?.productId) {
  //   socket.on(`product:6585c532f568a9e2fbefab9c`, (count) => {
  //     console.log(count, "from client socket---------");
  //   });
  //   // }
  //   // console.log(`product:${paramsData.productId}`);
  //   // socket.on(`product:${paramsData.productId}`, (count) => {
  //   //   console.log(count, "from client socket---------");
  //   // });
  // }, [socket]);

  // useEffect(() => {

  // }, [socket]);

  return (
    <>
      <section className="overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800">
        {alert && alert?.message && (
          <Modal alert={alert} setAlert={resetAlert} />
        )}
        {showReviewModel && (
          <ReviewModal
            setShowReview={setShowReviewModel}
            productId={paramsData?.productId}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        )}
        <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full mb-1 md:w-1/2 md:mb-0">
              <div className="sticky top-0 z-10 overflow-hidden ">
                <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
                  <img
                    alt=""
                    // src="https://i.postimg.cc/6qcPhTQg/R-18.png"
                    src={`${
                      process.env.NEXT_PUBLIC_API_DEVELOPMENT
                    }/products/image/${allData && allData.images[imageIndex]}`}
                    className="object-cover w-full lg:h-full "
                  />
                </div>
                <div className="flex-wrap hidden md:flex ">
                  {allData &&
                    allData?.images.map((image, index) => {
                      console.log(image, index, "this is from the slider");
                      return (
                        <div className="w-1/2 p-2 sm:w-1/4" key={index}>
                          <a
                            href="#"
                            className="block border border-blue-300 hover:border-blue-300"
                          >
                            <img
                              // src="https://i.postimg.cc/6qcPhTQg/R-18.png"
                              src={`${process.env.NEXT_PUBLIC_API_DEVELOPMENT}/products/image/${image}`}
                              alt=""
                              className="object-cover w-full lg:h-20"
                              onClick={() => setImageIndex(index)}
                            />
                          </a>
                        </div>
                      );
                    })}
                </div>
                <div className="bg-white dark:bg-gray-900">
                  <div className="py-2 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-md mb-8 lg:mb-16">
                      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        Laptop Specifications
                      </h2>
                    </div>
                    {allData && (
                      <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Processor
                          </h3>
                          <span className="text-gray-500 dark:text-gray-400">
                            {allData.processor}
                          </span>
                        </div>
                        {/* ram */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Ram
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.ram}
                          </p>
                        </div>
                        {/* storage */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                clip-rule="evenodd"
                              ></path>
                              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Storage
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.storage}
                          </p>
                        </div>
                        {/* Graphics */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Graphics
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.graphics}
                          </p>
                        </div>
                        {/* battery */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Battery
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.battery}
                          </p>
                        </div>
                        {/* display */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Display
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.display}
                          </p>
                        </div>
                        {/* available colours */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Available Colours
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.availableColours}
                          </p>
                        </div>
                        {/* weight */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Weight
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.weight}
                          </p>
                        </div>
                        {/* windows */}
                        <div>
                          <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <svg
                              className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="mb-2 text-xl font-bold dark:text-white">
                            Windows
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            {allData.windows}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 md:w-1/2 ">
              <div className="lg:pl-20">
                {/* price description */}
                <div className="mb-2 ">
                  <h2
                    className="max-w-xl mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl capitalize"
                    onClick={() => setCheck((prev) => prev + 1)}
                  >
                    {`${allData?.model} ${allData?.processor} ${allData?.ram} ${allData?.storage} laptop`}
                  </h2>
                  <p className="inline-block mb-6 text-4xl font-bold text-gray-700 dark:text-gray-400 ">
                    <span>${allData?.price}</span>
                    {/* <span className="text-base font-normal text-gray-500 line-through dark:text-gray-400">
                      $1800.99{check}
                    </span> */}
                  </p>

                  {/* real time */}
                  <div className="p-4 mb-8 border border-gray-300 dark:border-gray-700">
                    {realTimeUserCount && realTimeUserCount >= 1 && (
                      <h2 className="mb-4 text-xl font-semibold dark:text-gray-400">
                        Real time{" "}
                        <span className="px-2 bg-blue-500 text-gray-50">
                          {realTimeUserCount}
                        </span>
                        visitors right now!{" "}
                      </h2>
                    )}
                    <div className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-400">
                      {allData && allData?.quantity ? (
                        <span>
                          {`Hurry up! left ${allData?.quantity} in Stock`}
                        </span>
                      ) : (
                        <span>Hurry up! left 23 in Stock </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5  dark:bg-gray-600">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* description */}
                <p className="max-w-md text-gray-700 dark:text-gray-400">
                  {allData?.description}
                </p>
                {/* cart */}
                <div className="w-32 mb-8 ">
                  <label
                    htmlFor=""
                    className="w-full pb-1 text-xl font-semibold text-gray-700 border-b border-blue-300 dark:border-gray-600 dark:text-gray-400"
                  >
                    Quantity
                  </label>
                  {allData && (
                    <div className="relative flex flex-row w-full h-10 mt-6 bg-transparent rounded-lg">
                      <button
                        className="w-20 h-full text-gray-600 bg-gray-300 rounded-l outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-400"
                        // onClick={() => removeFromCart(allData._id)}
                        onClick={() => {
                          if (itemCount <= 0) {
                            return;
                          } else {
                            setItemCount(itemCount - 1);
                          }
                        }}
                      >
                        <span className="m-auto text-2xl font-thin">-</span>
                      </button>
                      <input
                        type="number"
                        value={itemCount}
                        // onChange={(e) =>
                        //   updateCartItemCount(
                        //     allData._id,
                        //     Number(e.target.value),
                        //     allData.price,
                        //     allData.title,
                        //     allData.images[0]
                        //   )
                        // }
                        className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-300 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
                        placeholder="1"
                      />
                      <button className="w-20 h-full text-gray-600 bg-gray-300 rounded-r outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-400">
                        <span
                          className="m-auto text-2xl font-thin"
                          onClick={() => setItemCount(itemCount + 1)}
                          // onClick={() =>
                          //   addToCart(
                          //     allData._id,
                          //     allData.price,
                          //     allData.title,
                          //     allData.images[0]
                          //   )
                          // }
                        >
                          +
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                {/* add to cart buy now buttona */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    className="w-full p-4 bg-blue-500 rounded-md lg:w-2/5 dark:text-gray-200 text-gray-50 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-700"
                    onClick={() => {
                      updateCartItemCount(
                        allData._id,
                        Number(itemCount),
                        allData.price,
                        allData.model,
                        allData.images[0]
                      );
                      if (itemCount == 0) {
                        setAlert({
                          ...alert,
                          loading: false,
                          message: "Product removed from the Cart..",
                          error: false,
                          success: true,
                        });
                      } else {
                        setAlert({
                          ...alert,
                          loading: false,
                          message: "Product Added to the Cart..",
                          error: false,
                          success: true,
                        });
                      }
                      setAlert({
                        ...alert,
                        loading: false,
                        message: "Product Added to the Cart..",
                        error: false,
                        success: true,
                      });

                      window.setTimeout(() => {
                        resetAlert();
                      }, 1000);
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
              {/* <!-- Reviews --> */}
              <div class="my-10 mx-auto max-w-screen-md px-10 py-16">
                <div class="flex w-full flex-col">
                  <div class="flex flex-col sm:flex-row">
                    <h1 class="max-w-sm text-3xl font-bold text-blue-900">
                      What people think <br />
                      about this product
                    </h1>
                    <div class="my-4 rounded-xl bg-white py-2 px-4 shadow sm:my-0 sm:ml-auto">
                      {allReview && (
                        <div class="flex h-16 items-center text-2xl font-bold text-blue-900">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-12 w-12 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {calculateAverageRating(allReview)}
                        </div>
                      )}
                      <p class="text-sm text-gray-500">Average User Rating</p>
                    </div>
                  </div>
                  {allReview && allOrdered && (
                    <RatingStats
                      data={allReview}
                      setShowReviewModel={setShowReviewModel}
                      isIdInProducts={isIdInProducts}
                      allOrdered={allOrdered}
                      userID={paramsData.userID}
                      productID={paramsData.productId}
                    />
                  )}
                  {/* <div class="text-gray-700">
                    <p class="font-medium">Reviews</p>
                    <ul class="mb-6 mt-2 space-y-2">
                      <li class="flex items-center text-sm font-medium">
                        <span class="w-3">5</span>
                        <span class="mr-4 text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <div class="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                          <div class="h-full w-10/12 bg-yellow-400"></div>
                        </div>
                        <span class="w-3">56</span>
                      </li>
                      <li class="flex items-center text-sm font-medium">
                        <span class="w-3">4</span>
                        <span class="mr-4 text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <div class="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                          <div class="h-full w-8/12 bg-yellow-400"></div>
                        </div>
                        <span class="w-3">12</span>
                      </li>
                      <li class="flex items-center text-sm font-medium">
                        <span class="w-3">3</span>
                        <span class="mr-4 text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <div class="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                          <div class="h-full w-1/12 bg-yellow-400"></div>
                        </div>
                        <span class="w-3">4</span>
                      </li>
                      <li class="flex items-center text-sm font-medium">
                        <span class="w-3">2</span>
                        <span class="mr-4 text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <div class="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                          <div class="h-full w-0 bg-yellow-400"></div>
                        </div>
                        <span class="w-3">0</span>
                      </li>
                      <li class="flex items-center text-sm font-medium">
                        <span class="w-3">1</span>
                        <span class="mr-4 text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <div class="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                          <div class="h-full w-1/12 bg-yellow-400"></div>
                        </div>
                        <span class="w-3">5</span>
                      </li>
                    </ul>
                    <button
                      class="w-36 rounded-full bg-blue-900 py-3 text-white font-medium"
                      onClick={() => setShowReviewModel(true)}
                    >
                      Write a review
                    </button>
                  </div> */}
                </div>
              </div>

              {/* <!-- /Reviews --> */}
            </div>
          </div>

          {/* reviews */}
          <div className="bg-white dark:bg-gray-900">
            <div className="py-2 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
              <div className="max-w-screen-md mb-8 lg:mb-16">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                  Reviews
                </h2>
              </div>

              {allReview ? (
                <div className="space-y-8  md:space-y-0">
                  <ul class="">
                    {allReview.map((review, index) => {
                      let goldStars = Number(review.ratings);
                      let darskStars = 5 - goldStars || 0;

                      console.log(
                        goldStars,
                        darskStars,
                        "Stars...................."
                      );
                      return (
                        <li class="py-8 text-left border px-4 m-2" key={index}>
                          <div class="flex items-start">
                            <div>
                              <img
                                className="h-8 w-8 rounded-full text-white"
                                fill
                                src={"/svgs/user-avatar.svg"}
                                alt=""
                              />
                            </div>
                            <div class="ml-6">
                              <div class="flex items-center">
                                {[...Array(Number(goldStars))].map(
                                  (val, index) => {
                                    return (
                                      <svg
                                        index={index}
                                        class="block h-6 w-6 align-middle text-yellow-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                          class=""
                                        ></path>
                                      </svg>
                                    );
                                  }
                                )}
                                {darskStars &&
                                  darskStars > 0 &&
                                  [...Array(darskStars)].map((val, index) => {
                                    return (
                                      <svg
                                        key={index}
                                        class="block h-6 w-6 align-middle text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                          class=""
                                        ></path>
                                      </svg>
                                    );
                                  })}
                              </div>
                              <p class="mt-5 text-base text-gray-900">
                                {review.comment}
                              </p>
                              <p class="mt-5 text-sm font-bold text-gray-900">
                                {review?.user[0]?.username}
                              </p>
                              <p class="mt-1 text-sm text-gray-600">
                                {review.createdAt.split("T")[0]}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="home__error-container">
                  <h2 className="text-black text-xl font-bold">
                    No reviews for this product yet
                  </h2>
                </div>
              )}
              {allReview && allReview.length <= 0 && (
                <div className="home__error-container">
                  <h2 className="text-black text-xl font-bold">
                    No reviews for this product yet
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
