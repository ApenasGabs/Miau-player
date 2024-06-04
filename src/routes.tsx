import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Live from "./pages/Live/Live";
import Movies from "./pages/Movies/Movies";
import Series from "./pages/Series/Series";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/series",
    element: (
      <>
        <Navbar />
        <Series />
      </>
    ),
  },
  {
    path: "/live",
    element: (
      <>
        <Navbar />
        <Live />
      </>
    ),
  },
  {
    path: "/movies",
    element: (
      <>
        <Navbar />
        <Movies />
      </>
    ),
  },
]);

export default router;
