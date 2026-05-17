import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBarista } from "../../api/usersApi";

export default function CreateBaristaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createBarista(form);

      alert("Бариста создан");
      navigate("/admin/baristas");
    } catch (error) {
      console.error(error);
      alert("Ошибка создания бариста");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Создание бариста</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            placeholder="Имя"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="phone"
            placeholder="Телефон"
            value={form.phoneNumber}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Создание..." : "Создать"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "white",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "20px",
    color: "#442D25",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "15px",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#442D25",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};