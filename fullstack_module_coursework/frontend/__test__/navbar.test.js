import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { ShopContext } from "../src/context/show-context";
// import NavBar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import "@testing-library/jest-dom";

describe("NavBar Component", () => {
  test("renders without errors", async () => {
    const mockCartItems = {
      "659763242e3662df0451a8c6": {
        itemid: "659763242e3662df0451a8c6",
        itemprice: 250000,
        itemtitle: "",
        itemimages: "product-6588ebdb294cda52249904ac-1704420131723-1.jpeg",
        count: 4,
      },
      "659958460e3faaa293367a53": {
        itemid: "659958460e3faaa293367a53",
        itemprice: 999.99,
        itemtitle: "Laptop XYZ",
        count: 2,
      },
    };
    render(<Footer />);
    // render(
    //   <ShopContext.Provider value={{ cartItems: mockCartItems }}>
    //     <NavBar />
    //   </ShopContext.Provider>
    // );
    await waitFor(() => {
      const myElem = screen.getByText("About");
      expect(myElem).toBeInTheDocument();
    });
    // Assert that the component renders without throwing any errors
  });
});
