import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";

const router = createBrowserRouter([
  {
    path: "/series",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/live",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/movies",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
]);

export default router;
