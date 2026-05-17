import { useAuth } from "../auth/AuthContext";

import { colors } from "../theme/colors";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        height: 80,
        background: "white",
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 24,
            color: colors.text,
          }}
        >
          Welcome back 👋
        </h2>

        <p
          style={{
            color:
              colors.textSecondary,
            marginTop: 4,
          }}
        >
          {user?.username}
        </p>
      </div>

      <button
        onClick={logout}
        style={{
          background: colors.primary,
          color: "white",
          padding: "12px 18px",
          borderRadius: 12,
          fontWeight: 600,
        }}
      >
        Logout
      </button>
    </header>
  );
}