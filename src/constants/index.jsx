import { 
  LayoutDashboard,
  Calendar,
  Box,
  Settings,
  Package,
  Percent 
} from "lucide-react";

export const navbarLinks = [
  {
    links: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        label: "Appointments",
        icon: Calendar,
        path: "/dashboard/appointment",
      },
      {
        label: "Inventory",
        icon: Package,
        path: "/dashboard/inventory",
      },
      {
        label: "Services",
        icon: Settings,
        path: "/dashboard/service",
      },
      {
        label: "Combos",
        icon: Percent,
        path: "/dashboard/combo",
      },
         {
        label: "Staff Management",
        icon: Percent,
        path: "/dashboard/staff",
      },
       {
        label: "Staff Attendance",
        icon: Percent,
        path: "/dashboard/attendance",
      },
    ],
  },
];