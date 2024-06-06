"use client";
import { useState, useEffect } from "react";
import { getCookie } from "@/actions/auth";
import { updateProduct, oneProduct } from "@/actions/product";
import SideBar from "@/components/SideBar";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";

const UpdateProduct = () => {
  const searchParams = useSearchParams();
  const [values, setValues] = useState({
    title: "",
    brandName: "",
    quantity: "",
    category: "",
    subCategory: "",
    price: "",
    discount: "",
    description: "",
    availableColours: "",
    model: "",
    processor: "",
    ram: "",
    storage: "",
    display: "",
    graphics: "",
    weight: "",
    battery: "",
    keyboardBacklight: "",
    yearsOfWarranty: "",
    windows: "",
    formData: "",
  });
  const [productId, setProductId] = useState();
  const [refresh, setRefresh] = useState(false);

  const [alert, setAlert] = useState({
    message: "",
    error: false,
    loading: false,
    success: false,
  });

  const resetAlert = () => {
    setAlert({ message: "", error: false, loading: false, success: false });
  };

  const {
    title,
    brandName,
    quantity,
    category,
    subCategory,
    price,
    discount,
    description,
    availableColours,
    model,
    processor,
    ram,
    storage,
    display,
    graphics,
    weight,
    battery,
    keyboardBacklight,
    yearsOfWarranty,
    windows,
    formData,
  } = values;

  useEffect(() => {
    singleProduct();
  }, [refresh]);

  const singleProduct = async () => {
    let queryId = searchParams.get("productId");
    // return await oneProduct("65890e98e5acf76b89364c10")
    setProductId(queryId);
    // console.log(productId, "id..........................................");

    setAlert({
      ...alert,
      loading: false,
      message: "Fetching Product...",
      error: false,
      success: true,
    });
    return await oneProduct(queryId)
      .then((data) => {
        console.log(data);
        setValues({ ...values, ...data.doc, formData: new FormData() });
        setAlert({
          ...alert,
          loading: false,
          message: "Found product..",
          error: false,
          success: false,
        });
        setTimeout(() => {
          resetAlert();
        }, 1000);
        console.log(values);
      })
      .catch((err) => {
        console.log(data);
      });
  };

  const handleChange = (name) => (e) => {
    e.preventDefault();
    let value = name == "images" ? e.target.files[0] : e.target.value;
    if (name == "images") {
      // console.log(name, value, "workin..");
      formData.append(name, value);
      setValues({ ...values, [name]: value, formData });
    } else {
      setValues({ ...values, [name]: value });
    }
    // validateForm();
  };

  console.log(values);

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
      title,
      brandName,
      quantity,
      category,
      subCategory,
      price,
      discount,
      description,
      availableColours,
      model,
      processor,
      ram,
      storage,
      display,
      graphics,
      weight,
      battery,
      keyboardBacklight,
      yearsOfWarranty,
      windows,
    };

    for (const key in data) {
      formData.append(key, data[key]);
      setValues({ ...values, formData });
    }

    let token = getCookie("token_user");
    console.log(values, "before sent");
    // updateProduct("65890e98e5acf76b89364c10", values.formData, token)
    updateProduct(productId, values.formData, token)
      .then((data) => {
        if (data.status && data.status == "success") {
          console.log(data);
          setRefresh(!refresh);
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
            availableColours: "",
            model: "",
            processor: "",
            ram: "",
            storage: "",
            display: "",
            graphics: "",
            weight: "",
            battery: "",
            keyboardBacklight: "",
            yearsOfWarranty: "",
            windows: "",
          });
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
      <SideBar>
        <section className="bg-white dark:bg-gray-900">
          {alert && alert?.message && (
            <Modal alert={alert} setAlert={resetAlert} />
          )}
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Update a new product
            </h2>
            <form action="#">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* category */}
                <div>
                  <label
                    for="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={handleChange("category")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option selected="">Select category</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                    <option value="GA">Gaming/Console</option>
                    <option value="PH">Phones</option>
                  </select>
                </div>
                {/* sub category */}
                <div>
                  <label
                    for="subCategory"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Sub Category
                  </label>
                  <select
                    id="subCategory"
                    value={subCategory}
                    onChange={handleChange("subCategory")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option selected="">Select Sub-Category</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                    <option value="GA">Gaming/Console</option>
                    <option value="PH">Phones</option>
                  </select>
                </div>
                {/* product name */}
                {/* <div className="sm:col-span-2">
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={title}
                    onChange={handleChange("title")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required=""
                  />
                </div> */}
                {/* brand */}
                <div className="w-full">
                  <label
                    for="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={brandName}
                    onChange={handleChange("brandName")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Product brand"
                    required=""
                  />
                </div>
                {/* model */}
                <div className="w-full">
                  <label
                    for="model"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    id="model"
                    value={model}
                    onChange={handleChange("model")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Product Model"
                    required=""
                  />
                </div>
                {/* <!-- availableColours --> */}
                <div className="w-full">
                  <label
                    for="availableColours"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Available Colours
                  </label>
                  <input
                    type="text"
                    name="availableColours"
                    id="availableColours"
                    value={availableColours}
                    onChange={handleChange("availableColours")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Available Colours"
                    required=""
                  />
                </div>

                {/* <!-- processor --> */}
                <div className="w-full">
                  <label
                    for="processor"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Processor
                  </label>
                  <input
                    type="text"
                    name="processor"
                    id="processor"
                    value={processor}
                    onChange={handleChange("processor")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Processor"
                    required=""
                  />
                </div>

                {/* <!-- ram --> */}
                <div className="w-full">
                  <label
                    for="ram"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ram
                  </label>
                  <input
                    type="text"
                    name="ram"
                    id="ram"
                    value={ram}
                    onChange={handleChange("ram")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ram"
                    required=""
                  />
                </div>

                {/* <!-- storage --> */}
                <div className="w-full">
                  <label
                    for="storage"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Storage
                  </label>
                  <input
                    type="text"
                    name="storage"
                    id="storage"
                    value={storage}
                    onChange={handleChange("storage")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Storage"
                    required=""
                  />
                </div>

                {/* <!-- display --> */}
                <div className="w-full">
                  <label
                    for="display"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Display
                  </label>
                  <input
                    type="text"
                    name="display"
                    id="display"
                    value={display}
                    onChange={handleChange("display")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Display"
                    required=""
                  />
                </div>

                {/* <!-- graphics --> */}
                <div className="w-full">
                  <label
                    for="graphics"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Graphics
                  </label>
                  <input
                    type="text"
                    name="graphics"
                    id="graphics"
                    value={graphics}
                    onChange={handleChange("graphics")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Graphics"
                    required=""
                  />
                </div>

                {/* <!-- weight --> */}
                <div className="w-full">
                  <label
                    for="weight"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    value={weight}
                    onChange={handleChange("weight")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Weight"
                    required=""
                  />
                </div>

                {/* <!-- battery --> */}
                <div className="w-full">
                  <label
                    for="battery"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Battery
                  </label>
                  <input
                    type="text"
                    name="battery"
                    id="battery"
                    value={battery}
                    onChange={handleChange("battery")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Battery"
                    required=""
                  />
                </div>

                {/* <!-- keyboardBacklight --> */}
                <div className="w-full">
                  <label
                    for="keyboardBacklight"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Keyboard Backlight
                  </label>
                  <input
                    type="text"
                    name="keyboardBacklight"
                    id="keyboardBacklight"
                    value={keyboardBacklight}
                    onChange={handleChange("keyboardBacklight")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Keyboard Backlight"
                    required=""
                  />
                </div>

                {/* <!-- yearsOfWarranty --> */}
                <div className="w-full">
                  <label
                    for="yearsOfWarranty"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Years of Warranty
                  </label>
                  <input
                    type="text"
                    name="yearsOfWarranty"
                    id="yearsOfWarranty"
                    value={yearsOfWarranty}
                    onChange={handleChange("yearsOfWarranty")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Years of Warranty"
                    required=""
                  />
                </div>

                {/* <!-- windows --> */}
                <div className="w-full">
                  <label
                    for="windows"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Windows
                  </label>
                  <input
                    type="text"
                    name="windows"
                    id="windows"
                    value={windows}
                    onChange={handleChange("windows")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Windows"
                    required=""
                  />
                </div>

                {/* number of items */}
                <div className="w-full">
                  <label
                    for="numberOfItems"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Number of Items
                  </label>
                  <input
                    type="number"
                    name="numberOfItems"
                    id="numberOfItems"
                    value={quantity}
                    onChange={handleChange("quantity")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="9"
                    required=""
                  />
                </div>

                {/* price */}
                <div className="w-full">
                  <label
                    for="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    value={price}
                    onChange={handleChange("price")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Price"
                    required=""
                  />
                </div>
                {/* discount */}
                <div className="w-full">
                  <label
                    for="discount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount
                  </label>
                  <input
                    type="discount"
                    name="discount"
                    id="discount"
                    value={discount}
                    onChange={handleChange("discount")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="2%"
                    required=""
                  />
                </div>
                {/* description */}
                <div className="sm:col-span-2">
                  <label
                    for="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="8"
                    value={description}
                    onChange={handleChange("description")}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Your description here"
                  ></textarea>
                </div>
                {/* featured photo */}
                <div className="col-span-2">
                  <label
                    for="featured-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Featured Photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          for="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleChange("images")}
                            name="images"
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                {/* 1st/2nd/3rd photo */}
                <div className="flex flex-row gap-28 justify-between w-full">
                  <div className="col-span-full">
                    <label
                      for="img-1-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      1st photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            for="img-1-photo"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="img-1-photo"
                              type="file"
                              className="sr-only"
                              onChange={handleChange("images")}
                              name="images"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label
                      for="img-2-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      2nd photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            for="img-2-photo"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="img-2-photo"
                              type="file"
                              className="sr-only"
                              onChange={handleChange("images")}
                              name="images"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label
                      for="img-3-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      3rd photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            for="img-3-photo"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="img-3-photo"
                              type="file"
                              className="sr-only"
                              onChange={handleChange("images")}
                              name="images"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800"
              >
                Update product
              </button>
            </form>
          </div>
        </section>
      </SideBar>
    </>
  );
};

export default UpdateProduct;
