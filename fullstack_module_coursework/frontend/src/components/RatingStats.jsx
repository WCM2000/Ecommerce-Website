// import React from "react";

// const RatingStats = ({ data, setShowReviewModel }) => {
//   console.log(
//     data,
//     data.length,
//     "review component............................"
//   );
//   // Calculate the average rating
//   const totalRatings = data.reduce(
//     (acc, item) => acc + Number(item.ratings),
//     0
//   );
//   const averageRating = totalRatings / data.length || 0;

//   // Create an array with five elements representing each star rating
//   const starRatings = Array.from({ length: 5 }, (_, index) => index + 1);

//   return (
//     // <div className="p-4">
//     //   <div className="mb-4">
//     //     <p className="text-xl font-bold mb-2">
//     //       Average Rating: {averageRating.toFixed(2)}
//     //     </p>
//     //   </div>
//     //   <div className="flex items-center">
//     //     {starRatings.map((rating) => (
//     //       <div key={rating} className="flex-1">
//     //         <p className="text-center">{rating} Star</p>
//     //         <div className="h-8 bg-gray-200 relative mt-2">
//     //           {data.map((item, index) => (
//     //             <div
//     //               key={index}
//     //               className={`h-full absolute bg-blue-500 w-full ${
//     //                 Number(item.ratings) >= rating ? "opacity-100" : "opacity-0"
//     //               }`}
//     //             ></div>
//     //           ))}
//     //         </div>
//     //       </div>
//     //     ))}
//     //   </div>
//     // </div>
//     <div className="text-gray-700">
//       <p className="font-medium mb-2">Reviews</p>
//       <ul className="mb-6 mt-2 space-y-2">
//         {starRatings.map((rating) => {
//           const ratingCount = data.filter(
//             (item) => Number(item.ratings) === rating
//           ).length;
//           const filledWidth =
//             ratingCount > 0 ? (ratingCount / data.length) * 100 : 0;
//           console.log(filledWidth, "This is the filled with.....");

//           return (
//             <li key={rating} className="flex items-center text-sm font-medium">
//               <span className="w-3">{rating}</span>
//               <span className="mr-4 text-yellow-400">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//               </span>
//               {/* <div className="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
//                 <div
//                   className={`h-full w-${
//                     (filledWidth / 100) * 12
//                   }/12 bg-yellow-400`}
//                 ></div>
//               </div>
//               <span className="w-3">{ratingCount}</span> */}
//               <div className="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
//                 <div
//                   className={`h-full  ${
//                     ratingCount > 0 ? "bg-yellow-400" : ""
//                   }`}
//                 ></div>
//                 {/* <div
//                   className={`h-full w-${
//                     (ratingCount / data.length) * 100
//                   }% bg-yellow-400`}
//                 ></div> */}
//                 {/* // className={`h-full w-${filledWidth}/100 bg-yellow-400`} */}
//               </div>
//               <div
//                 className={`h-2 w-${
//                   (ratingCount / data.length) * 100
//                 }% bg-gray-300`}
//               ></div>
//               {/* // className={`h-2 w-${100 - filledWidth}/100 bg-gray-300`} */}
//               <span className="w-3">{ratingCount}</span>
//             </li>
//           );
//         })}
//       </ul>
//       <button
//         className="w-36 rounded-full bg-blue-900 py-3 text-white font-medium"
//         onClick={() => setShowReviewModel(true)}
//       >
//         Write a review
//       </button>
//     </div>
//   );
// };

// export default RatingStats;

// ------------------------------------------ NEW COMPONENT ------------------------------------------

import React from "react";

const RatingStats = ({
  data,
  setShowReviewModel,
  isIdInProducts,
  allOrdered,
  userID,
  productID,
}) => {
  // Calculate the average rating
  const totalRatings = data.reduce(
    (acc, item) => acc + Number(item.ratings),
    0
  );
  const averageRating = totalRatings / data.length || 0;

  // Create an array with five elements representing each star rating
  const starRatings = Array.from({ length: 5 }, (_, index) => index + 1);

  // Calculate the percentage for each star rating
  const percentageRatings = starRatings.map((rating) => {
    const ratingCount = data.filter(
      (item) => Number(item.ratings) === rating
    ).length;
    return {
      rating,
      percentage: (ratingCount / data.length) * 100,
    };
  });

  return (
    <div className="text-gray-700">
      <div className="flex items-center mb-2">
        <div class="flex items-center">
          {[...Array(Math.round(averageRating))].map((val, index) => {
            return (
              <svg
                index={index}
                class="block h-5 w-6 align-middle text-yellow-500"
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
          {averageRating &&
            Math.round(averageRating) < 5 &&
            [...Array(5 - Math.round(averageRating))].map((val, index) => {
              return (
                <svg
                  key={index}
                  class="block h-5 w-6 align-middle text-gray-400"
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
        {/* {starRatings.map((_, index) => (
          <svg
            key={index}
            className="w-4 h-4 text-yellow-300 me-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))} */}
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {averageRating.toFixed(2)}
        </p>
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          out of
        </p>
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          5
        </p>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {data.length} global ratings
      </p>

      {percentageRatings.map(({ rating, percentage }) => {
        if (!percentage) {
          percentage = 0;
        }
        return (
          <div key={rating} className="flex items-center mt-4">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >{`${rating} star`}</a>
            <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className={`h-5 bg-yellow-300 rounded`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{`${percentage.toFixed(
              0
            )}%`}</span>
          </div>
        );
      })}
      {isIdInProducts(allOrdered, userID, productID) && (
        <button
          className="w-36 mt-6 rounded-full bg-blue-900 py-3 text-white font-medium"
          onClick={() => setShowReviewModel(true)}
        >
          Write a review
        </button>
      )}
    </div>
  );
};

export default RatingStats;
