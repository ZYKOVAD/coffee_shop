import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getUserById,
  updateBarista,
} from "../../api/usersApi";

export default function EditBaristaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!id) return;
    loadBarista();
  }, [id]);

  const loadBarista = async () => {
    try {
      const data = await getUserById(Number(id));

      setUsername(data.username);
      setEmail(data.email);
      setPhone(data.phone ?? "");
    } catch (error) {
      console.error(error);
      alert("Ошибка загрузки бариста");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBarista(Number(id), {
        username,
        phone,
        email,
      });

      alert("Бариста обновлён");
      navigate("/admin/baristas");
    } catch (error) {
      console.error(error);
      alert("Ошибка сохранения");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Редактирование бариста</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Имя"
            style={styles.input}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Телефон"
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Сохранить
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

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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