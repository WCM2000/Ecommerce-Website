import Link from "next/link";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/show-context";
import CustomButton from "./CustomButton";

const NavBar = () => {
  // focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800
  const [user, setUser] = useState();
  const { cartItems } = useContext(ShopContext);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  return (
    <>
      <div className="flex flex-row items-center p-1 justify-between bg-gray-800 shadow-xs fixed top-0 w-full z-50">
        <Link href={"/"}>
          <div className="ml-8 text-lg font-bold text-white hidden md:flex">
            Laptop.LK
          </div>
        </Link>
        {/* <span className="w-screen md:w-1/3 h-10 bg-gray-200 cursor-pointer border border-gray-300 text-sm rounded-full flex">
        <input
          type="search"
          name="serch"
          placeholder="Search"
          className="flex-grow px-4 rounded-l-full rounded-r-full text-sm focus:outline-none"
        />

        <span className="w-8 h-8 m-1 mr-5 ">
          {" "}
          <img
            className=" rounded-full"
            src={"/svgs/search.svg"}
            alt=""
            className="text-white"
          />
        </span>
      </span> */}
        <div className="flex flex-row-reverse mr-4 ml-4 md:hidden">
          <i className="fas fa-bars h-8 w-8"></i>
        </div>
        <div className="flex flex-row-reverse mr-8 hidden md:flex">
          {/* <div className="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
          Button
        </div> */}
          {user ? (
            <div className="px-4 py-2 m-2">
              <Link
                // type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                href={"/users/profile"}
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="/svgs/user-white.svg"
                  alt=""
                />
              </Link>
            </div>
          ) : (
            <div className="px-4 py-2 m-2">
              <Link
                // type="button"
                className="relative flex rounded-full bg-gray-800 text-xl 
               
                 text-white hover:bg-white hover:text-gray-800 
                border-white border-2
                px-4  "
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                href={"/users/login"}
              >
                Login
                {/* <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Login</span> */}
                {/* <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                /> */}
              </Link>
            </div>
          )}
          <div className="px-4 py-2 m-2">
            <Link
              // type="button"
              className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              href={"/products/cart"}
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full text-white"
                src={"/svgs/cart.svg"}
                alt=""
              />
              {cartItems &&
                console.log(
                  cartItems.length,
                  "-----------------------------------------------------"
                )}
              {Object.keys(cartItems).length > 0 && (
                <div className="absolute top-0 right-0 bg-yellow-500 h-3 w-3 rounded-full"></div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
