import { Link, useLocation } from "react-router-dom";

import {
  FaBox,
  FaCoffee,
  FaHome,
  FaLayerGroup,
  FaList,
  FaUsers,
} from "react-icons/fa";

import { colors } from "../theme/colors";

const links = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <FaHome />,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: <FaList />,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: <FaCoffee />,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: <FaLayerGroup />,
  },
  {
    label: "Modifiers",
    path: "/admin/modifiers",
    icon: <FaBox />,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <FaUsers />,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: 260,
        background: colors.sidebar,
        color: "white",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <div
        style={{
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Coffee Admin
        </h1>

        <p
          style={{
            color: "#D1D5DB",
            marginTop: 8,
          }}
        >
          Management Panel
        </p>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {links.map((link) => {
          const active =
            location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 14,
                background: active
                  ? colors.primary
                  : "transparent",
                color: "white",
                transition: "0.2s",
              }}
            >
              {link.icon}

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}