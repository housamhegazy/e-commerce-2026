import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import ErrorPage from "./pages/erroePage";
import Home from "./pages/home/home";
import Root from "./root";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
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
