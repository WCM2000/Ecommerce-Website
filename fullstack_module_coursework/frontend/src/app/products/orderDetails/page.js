"use client";
import { useState, useEffect } from "react";
import { getCookie } from "@/actions/auth";
import SideBar from "@/components/SideBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import {
  allOrders,
  deleteOrder,
  searchOrders,
  updateOrder,
  oneOrder,
} from "@/actions/order";
import { useSearchParams } from "next/navigation";
const MyOrders = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allData, setAllData] = useState();
  const [orderId, setOrderId] = useState();
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useState(false);

  const [values, setValues] = useState({
    status: "",
  });

  const { status } = values;
  const [alert, setAlert] = useState({
    message: "",
    error: false,
    loading: false,
    success: false,
  });

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
            router.refresh();
          })
          .catch((err) => {
            console.log(err);
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
    setValues({ ...values, [name]: e.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    singleOrder();
    // router.refresh();
    // console.log(allData);
  }, [refresh]);

  const singleOrder = async () => {
    let queryId = searchParams.get("orderId");
    setAlert({
      ...alert,
      loading: false,
      message: "Fetching Order..",
      error: false,
      success: true,
    });
    // return await oneProduct("65890e98e5acf76b89364c10")
    setOrderId(queryId);
    // console.log(productId, "id..........................................");
    return await oneOrder(queryId)
      .then((data) => {
        console.log(data);
        setAllData(data.doc);
        setValues({ ...values, status: data.doc.status });
        setAlert({
          ...alert,
          loading: false,
          message: "Found the order details...",
          error: false,
          success: true,
        });
        setTimeout(() => {
          resetAlert();
        }, 1000);
      })
      .catch((err) => {
        console.log(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setAlert({
      ...alert,
      loading: false,
      message: "Updating the order..",
      error: false,
      success: true,
    });

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
      status,
    };

    // for (const key in data) {
    //   formData.append(key, data[key]);
    //   setValues({ ...values, formData });
    // }

    let token = getCookie("token_user");
    console.log(values, "before sent");
    // updateProduct("65890e98e5acf76b89364c10", values.formData, token)
    updateOrder(orderId, data, token)
      .then((data) => {
        if (data.status && data.status == "success") {
          setRefresh(!refresh);
          console.log(data);
          setValues({
            ...values,
            title: "",
            brandName: "",
            quantity: "",
            category: "",
            subCategory: "",
            price: "",
            discount: "",
            description: "",
          });
          setError(false);
          setAlert({
            ...alert,
            loading: false,
            message: "Order updated successfully...",
            error: false,
            success: true,
          });
          window.setTimeout(() => {
            setAlert({ ...alert, success: false, message: "" });
          }, 1000);

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
  console.log(allData, "is there data...");

  return (
    <>
      <SideBar>
        <section className="items-center lg:flex bg-gray-50 lg:h-full mt-12 font-poppins dark:bg-gray-800 ">
          {alert && alert?.message && (
            <Modal alert={alert} setAlert={resetAlert} />
          )}
          <div className="justify-center flex-1 max-w-6xl px-4 mx-auto  md:px-6">
            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-900">
              <div className="">
                <h2 className="px-6 py-4 pb-4 text-xl font-medium border-b border-gray-300 dark:border-gray-700 dark:text-gray-400">
                  OrderID : {allData?._id}
                </h2>

                <table className="w-full table-auto">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr className="text-xs text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
                      <th className="flex items-center py-3 pl-6 font-medium dark:text-gray-400">
                        {/* <input className="mr-4" type="checkbox" name="" id="" /> */}
                        <span>No.</span>
                      </th>
                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Product Name
                      </th>
                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Quantity
                      </th>
                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Price
                      </th>
                      <th className="px-6 py-3 font-medium dark:text-gray-400">
                        Ordered At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData &&
                      allData?.products?.map((product, index) => {
                        return (
                          <tr
                            className="border-b border-gray-200 dark:border-gray-800"
                            key={index}
                          >
                            <td className="flex items-center px-6 py-3 text-sm font-medium">
                              {/* <input className="mr-4" type="checkbox" name="" id="" /> */}
                              <p className="dark:text-gray-400">
                                {product.itemid}
                              </p>
                            </td>
                            <td className="px-6 text-sm font-medium dark:text-gray-400">
                              {product.itemtitle}
                            </td>
                            <td className="px-6 text-sm font-medium dark:text-gray-400">
                              {product.count}
                            </td>
                            <td className="px-6 text-sm font-medium dark:text-gray-400">
                              {product.itemprice}
                            </td>
                            <td className="px-6 text-sm font-medium dark:text-gray-400">
                              <span className="inline-block px-2 py-1 text-gray-700 dark:text-gray-400">
                                {allData.createdAt.split("T")[0]}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div className="flex flex-wrap items-center justify-between px-6 pt-3">
                  <p className="mb-1 text-xl lg:mb-0 dark:text-gray-400">
                    SubTotal
                  </p>
                  <p className="mb-1 text-xl lg:mb-0 dark:text-gray-400">
                    {allData?.subTotal}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-300 mt-2"></div>

              {user?.role == "admin" ? (
                <div className="grid grid-cols-3 md:grid-cols-3  gap-4 mt-1 ">
                  <div className="col-span-2 m-5">
                    <select
                      className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                      value={status}
                      onChange={handleChange("status")}
                    >
                      <option value="">Select Status</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                    </select>
                  </div>
                  <div className="col-span-1 m-5 flex justify-center bg-gray-300 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer">
                    <input
                      type="submit"
                      value="Update"
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-3  gap-4 mt-1 ">
                  <div className="col-span-2 m-5">
                    <select
                      className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                      value={status}
                      onChange={handleChange("status")}
                    >
                      <option value="">Select Status</option>
                      <option value="recieved">Recieved</option>
                    </select>
                  </div>
                  <div className="col-span-1 m-5 flex justify-center bg-gray-300 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer">
                    <input
                      type="submit"
                      value="Update"
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </SideBar>
    </>
  );
};

export default MyOrders;
