import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";
import Preloader from "../components/preloader/Preloader";
import Profile from "../pages/profile/Profile";
import Navbar from "../components/navbar/Navbar";
import LeftBar from "../components/leftBar/LeftBar";
import RightBar from "../components/rightBar/RightBar";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { DarkModeContext } from "../context/darkModeContext";
import { QueryClient, QueryClientProvider } from "react-query";
export default function AppRouter() {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const queryClient = new QueryClient();
  
  useEffect(() => {
    const fakeDataFetch = () => {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    fakeDataFetch();
  }, []);

  


const Layout = () => {
  return (

    <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    </QueryClientProvider>
  );
};

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
              <ProtectedRoute>
                {loading ? <Preloader /> : <Layout />}
                </ProtectedRoute>
            ),
            children: [
                {
                  path: "/",
                  element: <Home />,
                },
                {
                    path: "/profile/:id",
                    element: <Profile />,
                },
            ],
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ]);
  
  
  return (
    <RouterProvider router={router} />
  );
};

