import { useEffect, useState } from "react";

import {
  getBaristas,
  deleteBarista,
} from "../../api/usersApi";

import type { Barista } from "../../api/usersApi";

import { useNavigate } from "react-router-dom";

export default function BaristasPage() {
  const [baristas, setBaristas] = useState<Barista[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getBaristas();
      setBaristas(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки бариста");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Удалить бариста?");
    if (!ok) return;

    try {
      await deleteBarista(id);
      setBaristas(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Бариста</h1>

        <button
          style={styles.createBtn}
          onClick={() => navigate("/admin/baristas/create")}
        >
          + Создать
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Телефон</th>
              <th style={styles.th}>Действия</th>
            </tr>
          </thead>

          <tbody>
            {baristas.map((b) => (
              <tr key={b.id}>
                <td style={styles.td}>{b.id}</td>
                <td style={styles.td}>{b.username}</td>
                <td style={styles.td}>{b.email}</td>
                <td style={styles.td}>{b.phoneNumber}</td>

                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      navigate(`/admin/baristas/${b.id}`)
                    }
                  >
                    Изменить
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(b.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    fontSize: "32px",
    color: "#442D25",
    fontWeight: 700,
  },

  createBtn: {
    backgroundColor: "#442D25",
    color: "white",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#f8f5f3",
    color: "#442D25",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #eee",
  },

  editBtn: {
    marginRight: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ece7e4",
    cursor: "pointer",
    color: "#442D25",
  },

  deleteBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#c0392b",
    color: "white",
    cursor: "pointer",
  },
};