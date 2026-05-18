import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginRequest({
        email,
        password,
      });

      login(data);

      setTimeout(() => {
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "barista") {
          navigate("/barista/orders");
        } else {
          navigate("/");
        }
      }, 0);
    } catch (err) {
      console.log(err);
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f1ee",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "white",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            backgroundColor: "#442D25",
            padding: "40px 30px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: 36,
              margin: 0,
            }}
          >
            CoffeeShop
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              marginTop: 10,
            }}
          >
            Административная панель
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: 30,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#442D25",
                fontWeight: 600,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Введите email"
              required
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 16,
                border: "1px solid #d1d5db",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#442D25",
                fontWeight: 600,
              }}
            >
              Пароль
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Введите пароль"
              required
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 16,
                border: "1px solid #d1d5db",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#442D25",
              color: "white",
              border: "none",
              padding: 16,
              borderRadius: 18,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}