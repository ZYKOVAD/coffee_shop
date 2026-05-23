import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title =
      "Casa Busano Admin";
  }, []);

  return (
    <div style={styles.container}>
      
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Casa Busano Admin Panel</h2>

        <nav style={styles.nav}>
          <Link style={styles.link} to="/admin"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.05)";
            }}>
            Главная
          </Link>

          <Link style={styles.link} to="/admin/products"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.05)";
            }}>
            Товары
          </Link>

          <Link style={styles.link} to="/admin/categories"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.05)";
            }}>
            Категории
          </Link>

          <Link style={styles.link} to="/admin/orders"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.05)";
            }}>
            Заказы
          </Link>

          <Link style={styles.link} to="/admin/users"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.05)";
            }}>
            Пользователи
          </Link>

          <Link style={styles.link} to="/admin/baristas"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.05)";
            }}>
            Сотрудники
          </Link>
        </nav>

        <div style={styles.bottom}>
          <div style={styles.user}>
            {user?.username}
          </div>

          <button style={styles.logoutBtn} onClick={logout}>
            Выйти
          </button>
        </div>
      </aside>

      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },

  sidebar: {
    width: "270px",
    background:
      "linear-gradient(180deg, #442D25 0%, #2E1D18 100%)",

    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "28px 20px",
    boxShadow: "4px 0 18px rgba(0,0,0,0.08)",
    position: "relative",
    zIndex: 10,
  },

  logo: {
    marginBottom: "40px",
    fontSize: "28px",
    fontWeight: 800,
    letterSpacing: "0.5px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  link: {
    color: "white",
    textDecoration: "none",

    fontSize: "16px",

    padding: "14px 18px",

    borderRadius: "14px",

    transition: "0.2s",

    backgroundColor: "rgba(255,255,255,0.05)",
  },

  bottom: {
    marginTop: "auto",
  },

  user: {
    marginBottom: "12px",
  },

  logoutBtn: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#fff",
    color: "#442D25",
    cursor: "pointer",
    fontWeight: 600,
  },

  content: {
    flex: 1,
    height: "100vh",
    overflowY: "auto",
    padding: "32px",
    boxSizing: "border-box",
    backgroundColor: "#f7f5f3",
  },
};