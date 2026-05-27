import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExplorerPage from "./pages/ExplorerPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ReplayPage from "./pages/ReplayPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorerPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "replay/:id", element: <ReplayPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
