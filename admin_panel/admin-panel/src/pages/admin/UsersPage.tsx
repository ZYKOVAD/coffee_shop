import {
  useEffect,
  useState,
} from "react";

import { getUsers } from "../../api/usersApi";

import type { User } from "../../types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(
        data.filter((x) => x.role === "user")
      );
    } catch (error) {
      console.error(error);

      alert("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Пользователи
        </h1>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>

              <th style={styles.th}>
                Username
              </th>

              <th style={styles.th}>
                Телефон
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                Бонусы
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={styles.row}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "#faf7f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "white";
                }}
              >
                <td style={styles.td}>
                  {user.id}
                </td>

                <td style={styles.td}>
                  {user.username}
                </td>

                <td style={styles.td}>
                  {user.phone}
                </td>

                <td style={styles.td}>
                  {user.email}
                </td>

                <td style={styles.td}>
                  {user.bonusBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
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

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "18px 20px",
    backgroundColor: "#f8f5f3",
    color: "#442D25",
    fontWeight: 700,
    fontSize: "15px",
    borderBottom: "1px solid #eee",
  },

  td: {
    padding: "18px 20px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "15px",
    verticalAlign: "middle",
  },

  row: {
    transition: "0.2s",
  },
};