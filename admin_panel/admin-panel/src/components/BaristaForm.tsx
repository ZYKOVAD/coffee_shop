import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;

  submitText: string;

  loading?: boolean;

  initialData?: {
    username: string;
    email: string;
    phone: string;
  };

  showPassword?: boolean;

  onSubmit: (data: {
    username: string;
    email: string;
    phone: string;
    password?: string;
  }) => void | Promise<void>;
}

export default function BaristaForm({
  title,
  submitText,
  loading,
  initialData,
  showPassword = false,
  onSubmit,
}: Props) {
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    initialData?.username || ""
  );

  const [email, setEmail] = useState(
    initialData?.email || ""
  );

  const [phone, setPhone] =
    useState(initialData?.phone || "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      showPassword &&
      password !== confirmPassword
    ) {
      alert("Пароли не совпадают");
      return;
    }

    await onSubmit({
      username,
      email,
      phone,
      password: showPassword
        ? password
        : undefined,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {title}
          </h1>

          <button
            type="button"
            style={styles.closeButton}
            onClick={() =>
              navigate("/admin/baristas")
            }
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Имя"
            style={styles.input}
            required
          />

          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
            style={styles.input}
            required
          />

          <input
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder="Телефон"
            style={styles.input}
          />

          {showPassword && (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Пароль"
                style={styles.input}
                required
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Повтор пароля"
                style={styles.input}
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Сохранение..."
              : submitText}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    background: "white",
    padding: "32px",
    borderRadius: "18px",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    color: "#442D25",
    fontSize: "32px",
    fontWeight: 700,
  },

  closeButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#f3f3f3",
    color: "#442D25",
    fontSize: "26px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "15px",
  },

  button: {
    marginTop: "10px",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#442D25",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "16px",
  },
};