import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import ErrorPage from "./pages/erroePage";
import HomeProducts from "./pages/home/home";
import Root from "./root";
import ProductDetails from "./pages/productDetails/productDetails"
import Login from "./pages/login/login";
import Register from "./pages/register/register";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomeProducts />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/product/:id",
          element: <ProductDetails />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
export default App;
