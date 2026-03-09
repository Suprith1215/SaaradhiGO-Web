import { createBrowserRouter } from "react-router";
import { ShowcasePage } from "./screens/ShowcasePage";
import { AdminDashboard } from "./screens/admin/AdminDashboard";
import { BookRidePage } from "./screens/BookRidePage";
import { DriverSignupPage } from "./screens/DriverSignupPage";
import { RiderDashboard } from "./screens/RiderDashboard";
import { CustomerAuthPage } from "./screens/CustomerAuthPage";
import { DriverDashboard } from "./screens/DriverDashboard";
import { MapPage } from "./screens/MapPage";

export const router = createBrowserRouter([
  { path: "/", Component: ShowcasePage },
  { path: "/admin", Component: AdminDashboard },
  { path: "/book", Component: BookRidePage },
  { path: "/map", Component: MapPage },
  { path: "/driver", Component: DriverSignupPage },
  { path: "/rider", Component: RiderDashboard },
  { path: "/login", Component: CustomerAuthPage },
  { path: "/driver-dashboard", Component: DriverDashboard },
]);

