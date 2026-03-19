import { createBrowserRouter } from "react-router";
import { ShowcasePage } from "./screens/ShowcasePage";
import { AdminDashboard } from "./screens/admin/AdminDashboard";
import { BookRidePage } from "./screens/BookRidePage";
import { DriverSignupPage } from "./screens/DriverSignupPage";
import { RiderDashboard } from "./screens/RiderDashboard";
import { CustomerAuthPage } from "./screens/CustomerAuthPage";
import { DriverDashboard } from "./screens/DriverDashboard";
import { MapPage } from "./screens/MapPage";
import { ErrorPage } from "./screens/ErrorPage";

export const router = createBrowserRouter([
  { path: "/", Component: ShowcasePage, ErrorBoundary: ErrorPage },
  { path: "/admin", Component: AdminDashboard, ErrorBoundary: ErrorPage },
  { path: "/book", Component: BookRidePage, ErrorBoundary: ErrorPage },
  { path: "/map", Component: MapPage, ErrorBoundary: ErrorPage },
  { path: "/driver", Component: DriverSignupPage, ErrorBoundary: ErrorPage },
  { path: "/rider", Component: RiderDashboard, ErrorBoundary: ErrorPage },
  { path: "/login", Component: CustomerAuthPage, ErrorBoundary: ErrorPage },
  { path: "/driver-dashboard", Component: DriverDashboard, ErrorBoundary: ErrorPage },
]);

