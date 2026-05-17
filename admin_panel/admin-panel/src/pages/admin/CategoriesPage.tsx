import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getCategories,
  deleteCategory,
} from "../../api/categoriesApi";

import type { Category } from "../../types/category";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);

      alert("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      confirm("Удалить категорию?");

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((x) => x.id !== id)
      );
    } catch (error) {
      console.error(error);

      alert("Ошибка удаления");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Категории
        </h1>

        <button
          style={styles.createBtn}
          onClick={() =>
            navigate(
              "/admin/categories/create"
            )
          }
        >
          Добавить категорию
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>

              <th style={styles.th}>
                Название
              </th>

              <th style={styles.th}>
                Активность
              </th>

              <th style={styles.th}>
                Действия
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td style={styles.td}>
                  {category.id}
                </td>

                <td style={styles.td}>
                  {category.name}
                </td>

                <td style={styles.td}>
                  {category.isActive
                    ? "Активна"
                    : "Скрыта"}
                </td>

                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={styles.editBtn}
                      onClick={() =>
                        navigate(
                          `/admin/categories/${category.id}`
                        )
                      }
                    >
                      Изменить
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        handleDelete(
                          category.id
                        )
                      }
                    >
                      Удалить
                    </button>
                  </div>
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

  createBtn: {
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#442D25",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "18px",
    backgroundColor: "#f8f5f3",
  },

  td: {
    padding: "18px",
    borderBottom: "1px solid #eee",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#ece7e4",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#c0392b",
    color: "white",
    cursor: "pointer",
  },
};