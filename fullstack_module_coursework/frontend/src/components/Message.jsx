import React from "react";

const Message = ({ message, resetAlert }) => {
  return (
    <>
      <div className=" flex justify-center align-middle absolute top-24 w-4/6 h-1/2 z-[1000] bg-transparent">
        <div className="border-2 border-primary-600 mx-auto align-middle y-auto rounded-xl w-1/3 text-center bg-gray-50">
          <h1 className="mt-32 text-xl text-primary-500 font-bold align-middle">
            {message}
          </h1>
          <h2
            className="my-5 border-2 border-primary-600 text-primary-600 bg-white font-semibold text-xl hover:text-white hover:bg-primary-600 w-1/3 mx-auto rounded cursor-pointer"
            onClick={() => resetAlert()}
          >
            Close
          </h2>
        </div>
      </div>
    </>
  );
};

export default Message;
