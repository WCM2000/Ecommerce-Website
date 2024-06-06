"use client";
import { useState, useEffect } from "react";
import { getCookie } from "@/actions/auth";
import SideBar from "@/components/SideBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { allOrders, deleteOrder, searchOrders } from "@/actions/order";
import Modal from "@/components/Modal";

const Orders = () => {
  const router = useRouter();
  const [allData, setAllData] = useState();
  const [show, setShow] = useState(false);
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [deleted, setDeleted] = useState(false);

  const [alert, setAlert] = useState({
    message: "",
    error: false,
    loading: false,
    success: false,
  });

  const [filterValues, setFilterValues] = useState({
    sort: "",
    price: "",
    status: "",
  });

  const [searchValues, setSearchValues] = useState({
    search: "",
  });

  const { search } = searchValues;
  const { sort, price, status } = filterValues;

  const resetAlert = () => {
    setAlert({ message: "", error: false, loading: false, success: false });
  };
  const initialSet = () => {
    setAllData(data);
  };

  const handleDelete = async (id) => {
    let token;

    if (getCookie("token_user")) {
      token = getCookie("token_user");
      let clicked = confirm(`You are about to delete ${id} `);

      if (clicked) {
        await deleteOrder(id, token)
          .then((data) => {
            console.log(data);
            setAlert({
              ...alert,
              loading: false,
              message: "Order deleted successfully..",
              error: false,
              success: true,
            });
            setDeleted(!deleted);
            setTimeout(() => {
              resetAlert();
            }, 2000);
          })
          .catch((err) => {
            setAlert({
              ...alert,
              loading: false,
              message: "There was a error deleting product...",
              error: false,
              success: true,
            });
            setDeleted(!deleted);
            setTimeout(() => {
              resetAlert();
            }, 2000);
          });
      }

      //   }
    } else {
      alert("You dont't have the permission to perform this action...");
      return;
    }
  };

  const handleChange = (name) => (e) => {
    e.preventDefault();
    setFilterValues({ ...filterValues, [name]: e.target.value });
  };
  const handleSearch = (name) => (e) => {
    e.preventDefault();
    setSearchValues({ ...searchValues, [name]: e.target.value });
  };

  const resetFilter = () => {
    setFilterValues({ sort: "", price: "", status: "" });
  };

  // ---------------pagination--------------------------
  const nextPage = () => {
    setPage((oldPage) => {
      let nextPage = oldPage + 1;
      if (nextPage > totalPages) {
        nextPage = 1;
      }
      return nextPage;
    });
  };
  const prevPage = () => {
    setPage((oldPage) => {
      let prevPage = oldPage - 1;
      if (prevPage <= 1) {
        prevPage = totalPages;
      }
      return prevPage;
    });
  };

  // ---------------pagination--------------------------

  useEffect(() => {
    console.log("page changed...", page);

    handleSubmit();
    // console.log(allData);
  }, [page, filterValues, deleted]);

  //   useEffect(() => {
  //     handleSearchSubmit();
  //   }, [searchValues]);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    let params;
    setAlert({ ...alert, loading: true });

    // let userId;
    // if (localStorage.getItem("user")) {
    //   userId = JSON.parse(localStorage.getItem("user"))._id;
    // }

    params = {
      // userId,
      limit,
      page,
    };

    if (filterValues?.sort) {
      params.sort = filterValues.sort;
    }
    if (filterValues?.price) {
      params.price = filterValues.price;
    }
    if (filterValues?.status) {
      params.status = filterValues.status;
    }
    if (searchValues?.search) {
      params.orderId = searchValues.search;
    }

    let token = getCookie("token_user");

    await allOrders(params)
      .then((data) => {
        console.log(data);
        if (data.status && data.status == "success") {
          setAllData(data.doc);
          console.log(data.totalCount);
          let totalCount = data.totalCount;
          setTotalPages(Math.ceil(totalCount / limit));
          setShow(false);

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

        // return { data };
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
  console.log(allData, "is there data...");

  return (
    <>
      {/* <section className="bg-white dark:bg-gray-900">
        <div className="flex flex-col overflow-x-auto py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Heading
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData?.map((product, index) => {
                      return (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={index}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {index}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {product.title}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {product.price}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {product.quantity}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">Cell</td>
                          <td className="whitespace-nowrap px-6 py-4">Cell</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <SideBar>
        <section className="items-center lg:flex bg-gray-50 lg:h-full mt-12 font-poppins dark:bg-gray-800 ">
          {alert && alert?.message && (
            <Modal alert={alert} setAlert={resetAlert} />
          )}
          <div className="justify-center flex-1 max-w-6xl px-4 mx-auto  md:px-6">
            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-900">
              <div className="">
                <h2 className="px-6 py-4 pb-4 text-xl font-medium border-b border-gray-300 dark:border-gray-700 dark:text-gray-400">
                  All Orders
                </h2>
                <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b dark:border-gray-700">
                  <div className="w-full md:w-full shadow p-5 rounded-lg bg-white">
                    <div className="relative">
                      <div className="absolute flex items-center ml-2 h-full">
                        <svg
                          className="w-4 h-4 fill-current text-primary-gray-dark"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z"></path>
                        </svg>
                      </div>

                      <input
                        type="text"
                        placeholder="Search by OrderID"
                        className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                        value={search}
                        onChange={handleSearch("search")}
                      />
                      <div
                        className="absolute flex right-0 top-0 mr-5 items-center ml-2 h-full "
                        onClick={handleSubmit}
                      >
                        <svg
                          className="w-4 h-4 fill-current text-primary-gray-dark"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="font-medium">Filters</p>

                      <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                        onClick={() => resetFilter()}
                      >
                        Reset Filter
                      </button>
                    </div>

                    <div>
                      <div className="grid grid-cols-3 md:grid-cols-3  gap-4 mt-4">
                        <select
                          className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                          value={sort}
                          onChange={handleChange("sort")}
                        >
                          <option value="">Sort</option>
                          <option value="createdAt">Earliest to Newest</option>
                          <option value="-createdAt">Newest to Earliest</option>
                        </select>

                        <select
                          className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                          value={status}
                          onChange={handleChange("status")}
                        >
                          <option value="">Select Status</option>
                          <option value="processing">Processing</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="received">Recieved</option>
                        </select>

                        <select
                          className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                          value={price}
                          onChange={handleChange("price")}
                        >
                          <option value="">Any Price</option>
                          <option value="50000">Less than 50,000</option>
                          <option value="100000">Less than 100,000</option>
                          <option value="200000">Less than 2000,000</option>
                          <option value="5000000">Less than 500,000</option>
                          <option value="100000">Less than 100,0000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr className="text-xs text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
                      <th className="flex items-center py-3 pl-6 font-medium dark:text-gray-400">
                        {/* <input className="mr-4" type="checkbox" name="" id="" /> */}
                        <span>OrderID</span>
                      </th>
                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        SubTotal
                      </th>
                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Ordered Date
                      </th>

                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData?.map((product, index) => {
                      return (
                        <tr
                          className="border-b border-gray-200 dark:border-gray-800"
                          key={index}
                        >
                          <td className="flex items-center px-6 py-3 text-sm font-medium">
                            <Link
                              href={`/products/orderDetails?orderId=${product._id}`}
                            >
                              {/* <input className="mr-4" type="checkbox" name="" id="" /> */}
                              <p className="dark:text-gray-400">
                                {product._id}
                              </p>
                            </Link>
                          </td>
                          <td className="px-6 text-sm font-medium dark:text-gray-400">
                            {product.subTotal}
                          </td>
                          <td className="px-6 text-sm font-medium dark:text-gray-400 capitalize">
                            {product.status}
                          </td>
                          <td className="px-6 text-sm font-medium dark:text-gray-400">
                            {product.createdAt.split("T")[0]}
                          </td>

                          <td className="px-6 text-sm font-medium dark:text-gray-400">
                            <span
                              className="inline-block px-2 py-1 text-red-700 bg-red-100 rounded-md dark:bg-gray-800 dark:text-gray-400 cursor-pointer"
                              onClick={() => handleDelete(product._id)}
                            >
                              Delete
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex flex-wrap items-center justify-between px-6 py-3">
                  <p className="mb-4 text-xs lg:mb-0 dark:text-gray-400">
                    Showing 1 to 10 of 13 entries
                  </p>
                  <nav aria-label="page-navigation ">
                    <ul className="flex mb-4 list-style-none lg:mb-0">
                      <li className="page-item  ">
                        <a
                          href="#"
                          className="relative block px-3 py-1 mr-1 text-xs text-gray-700 transition-all duration-300 rounded-md  dark:text-gray-400  hover:bg-blue-100"
                          onClick={prevPage}
                        >
                          Previous
                        </a>
                      </li>
                      {[...Array(totalPages)].map((val, index) => {
                        return (
                          <li
                            key={index}
                            className="page-item "
                            onClick={() => setPage(index + 1)}
                          >
                            <a
                              href="#"
                              className="relative block px-3 py-1 mr-1 text-xs text-gray-100 transition-all duration-300 bg-blue-600 rounded-md hover:text-blue-700 hover:bg-blue-200 dark:hover:text-gray-400 dark:hover:bg-gray-700"
                            >
                              {index + 1}
                            </a>
                          </li>
                        );
                      })}

                      <li className="page-item ">
                        <a
                          href="#"
                          className="relative block px-3 py-1 text-xs text-gray-700 transition-all duration-300 rounded-md dark:text-gray-400 dark:hover:bg-gray-700 hover:bg-blue-100 "
                          onClick={nextPage}
                        >
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SideBar>
    </>
  );
};

export default Orders;
