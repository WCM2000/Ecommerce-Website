import { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import { getCookie } from "@/actions/auth";
import { createReview } from "@/actions/review";
import { useRouter } from "next/navigation";

const ReviewModal = ({ setShowReview, productId, refresh, setRefresh }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    comment: "",
    ratings: "",
    user: "",
    product: "",
  });

  const [alert, setAlert] = useState({
    message: "",
    error: false,
    loading: false,
    success: false,
  });

  const resetAlert = () => {
    setAlert({ message: "", error: false, loading: false, success: false });
  };

  const { comment, ratings, user, product } = values;

  const handleChange = (name) => (e) => {
    e.preventDefault();

    setValues({ ...values, [name]: e.target.value });
  };
  // validateForm();

  console.log(values);
  useEffect(() => {
    let userIdTemp;

    if (localStorage.getItem("user")) {
      userIdTemp = JSON.parse(localStorage.getItem("user"))._id;
      setValues({ ...values, user: userIdTemp, product: productId });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // -----------------------------------
    // if (!values.serialNumber || values.serialNumber.length <= 0) {
    //   setError(true);
    //   return;
    // }
    // if (!values.type || values.type.length <= 0) {
    //   setError(true);
    //   return;
    // }
    // if (!values.status || values.status.length <= 0) {
    //   setError(true);
    //   return;
    // }
    // if (!values.location || values.location.length <= 0) {
    //   setError(true);
    //   return;
    // }
    // if (!values.images || values.images.length <= 0) {
    //   setError(true);
    //   return;
    // }
    // -----------------------------------
    setAlert({ ...alert, loading: true });
    setValues({ ...values, loading: true, error: false });
    // console.log(values);
    // const data = {
    //   serialNumber,
    //   type,
    //   status,
    //   location,
    //   //   images,
    // };

    let data = {
      comment,
      ratings,
      user: values.user,
      product: values.product,
    };

    let token = getCookie("token_user");
    console.log(values, "before sent");
    createReview(data, token)
      .then((data) => {
        setRefresh(!refresh);
        if (data.status && data.status == "success") {
          console.log(data);
          setValues({
            ...values,
            comment: "",
            ratings: "",
            product: "",
            user: "",
          });
          setShowReview(false);
          setError(false);
          setAlert({
            ...alert,
            loading: false,
            message: data.message,
            error: false,
            success: true,
          });
          window.setTimeout(() => {
            setAlert({ ...alert, success: false, message: "" });
          }, 1000);
          router.reload();
          //   router.push(`/`);
        } else {
          setAlert({
            ...alert,
            loading: false,
            message: err.message,
            error: true,
            success: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setAlert({
          ...alert,
          loading: false,
          message: data.message,
          error: true,
          success: false,
        });
      });
  };

  return (
    <>
      {/* <!-- Main modal --> */}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div class="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Create a Review
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={() => setShowReview(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <form class="p-4 md:p-5">
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="ratings"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ratings
                  </label>
                  <select
                    id="ratings"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={ratings}
                    onChange={handleChange("ratings")}
                  >
                    <option selected="">Select ratings</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label
                    for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write a review here"
                    value={comment}
                    onChange={handleChange("comment")}
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSubmit}
              >
                <svg
                  class="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Create New Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
