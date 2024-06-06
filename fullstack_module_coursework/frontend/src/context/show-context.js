"use client";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
// import { PRODUCTS } from "../products";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i = 1; i < 10 + 1; i++) {
    cart[i] = 0;
  }
  console.log(cart);
  return cart;
};

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // const [userCount, setUserCount] = useState({});
  let socket;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
      setCartItems(JSON.parse(localStorage.getItem("cartItems")) || {});
    }
  }, []);

  //   const getTotalCartAmount = () => {
  //     let totalAmount = 0;
  //     for (const item in cartItems) {
  //       if (cartItems[item] > 0) {
  //         let itemInfo = PRODUCTS.find((product) => product.id === Number(item));
  //         totalAmount += cartItems[item] * itemInfo.price;
  //       }
  //     }
  //     return totalAmount;
  //   };

  const updateCartItems = (newCartItems) => {
    console.log(newCartItems, "----------------------- New Cart Items");
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    console.log(
      JSON.parse(localStorage.getItem("cartItems")),
      "----------------------- New Cart Items"
    );
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const itemid in cartItems) {
      if (cartItems.hasOwnProperty(itemid)) {
        const item = cartItems[itemid];
        totalAmount += item.itemprice * item.count;
      }
    }

    return totalAmount;
  };

  //   const addToCart = (itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   };
  const addToCart = (itemid, itemprice, itemtitle, itemimages) => {
    // Check if cartItem has any items
    // If cartItems has items, check if itemid exists
    if (cartItems.hasOwnProperty(itemid)) {
      // If matched, increase the count by one
      let tempCart = {
        ...cartItems,
        [itemid]: {
          ...cartItems[itemid],
          count: cartItems[itemid].count + 1,
        },
      };
      setCartItems(tempCart);
      updateCartItems(tempCart);
      //   setCartItems({
      //     ...cartItems,
      //     [itemid]: {
      //       ...cartItems[itemid],
      //       count: cartItems[itemid].count + 1,
      //     },
      //   });
    } else {
      // If no match is found, add a new object with itemid as the key
      let tempCart = {
        ...cartItems,
        [itemid]: {
          itemid,
          itemprice,
          itemtitle,
          itemimages,
          count: 1,
        },
      };
      setCartItems(tempCart);

      updateCartItems(tempCart);
      //   setCartItems({
      //     ...cartItems,
      //     [itemid]: {
      //       itemid,
      //       itemprice,
      //       itemtitle,
      //       itemimages,
      //       count: 1,
      //     },
      //   });
    }
  };

  //   const removeFromCart = (itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  //   };

  const removeFromCart = (itemid) => {
    // Check if cartItem has any items
    if (Object.keys(cartItems).length === 0) {
      // If cartItems is empty, do nothing
      return;
    } else {
      // If cartItems has items, check if itemid exists
      if (cartItems.hasOwnProperty(itemid)) {
        // If count is more than 1, decrement it by one
        if (cartItems[itemid].count > 1) {
          let tempCart = {
            ...cartItems,
            [itemid]: {
              ...cartItems[itemid],
              count: cartItems[itemid].count - 1,
            },
          };

          setCartItems(tempCart);
          updateCartItems(tempCart);
          //   setCartItems({
          //     ...cartItems,
          //     [itemid]: {
          //       ...cartItems[itemid],
          //       count: cartItems[itemid].count - 1,
          //     },
          //   });
        } else {
          // If count is 1, remove the item from cartItems
          const updatedCart = { ...cartItems };
          delete updatedCart[itemid];
          setCartItems(updatedCart);
        }
      }
    }
  };

  //   const updateCartItemCount = (newAmount, itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  //   };

  const updateCartItemCount = (
    itemId,
    newAmount,
    itemprice,
    itemtitle,
    itemimages
  ) => {
    // Check if newAmount is 0 or less
    console.log(
      itemId,
      newAmount,
      itemprice,
      itemtitle,
      itemimages,
      "this is from update cart item count..."
    );
    if (newAmount <= 0) {
      // If newAmount is 0 or less, remove the item from cartItem
      const updatedCart = { ...cartItems };
      delete updatedCart[itemId];
      setCartItems(updatedCart);
      updateCartItems(updatedCart);
    } else {
      // If newAmount is greater than 0, update the count or add a new item
      //   setCartItems({
      //     ...cartItems,
      //     [itemId]: {
      //       ...cartItems[itemId],
      //       itemId,
      //       count: newAmount,
      //     },
      //   });
      if (cartItems.hasOwnProperty(itemId)) {
        // If matched, increase the count by one

        let tempCart = {
          ...cartItems,
          [itemId]: {
            ...cartItems[itemId],
            count: newAmount,
          },
        };
        setCartItems(tempCart);
        // setCartItems({
        //   ...cartItems,
        //   [itemId]: {
        //     ...cartItems[itemId],
        //     count: newAmount,
        //   },
        // });
        updateCartItems(tempCart);
      } else {
        // If no match is found, add a new object with itemid as the key
        let tempCart = {
          ...cartItems,
          [itemId]: {
            itemId,
            itemprice,
            itemtitle,
            itemimages,
            count: newAmount,
          },
        };
        setCartItems(tempCart);
        updateCartItems(tempCart);
        // setCartItems({
        //   ...cartItems,
        //   [itemId]: {
        //     itemId,
        //     itemprice,
        //     itemtitle,
        //     itemimages,
        //     count: newAmount,
        //   },
        // });
      }
    }
  };
  const removeEntireItem = (itemId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    updateCartItems(updatedCart);
  };

  const getItemCountById = (itemId) => {
    // Retrieve cartItems from local storage
    const cartItemsString = localStorage.getItem("cartItems");

    // Check if cartItems is present in local storage
    if (cartItemsString) {
      try {
        // Parse the JSON string to get the cartItems object
        const cartItems = JSON.parse(cartItemsString);

        // Check if the item with the given itemId exists in cartItems
        if (cartItems && cartItems[itemId]) {
          // Return the count property of the item
          return cartItems[itemId].count;
        }
      } catch (error) {
        console.error("Error parsing cartItems JSON:", error);
      }
    }

    // Return 0 if the item with the given itemId is not found
    return 0;
  };

  const checkout = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    // updateCartItems({});
  };

  const contextValue = {
    cartItems,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    removeEntireItem,
    getTotalCartAmount,
    checkout,
    socket,
    getItemCountById,
    // userCount,
    // setUserCount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
