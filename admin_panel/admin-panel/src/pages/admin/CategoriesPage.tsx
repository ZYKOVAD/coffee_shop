import {
  useEffect,
  useState,
} from "react";

import {
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
} from "../../api/categoriesApi";

import type { Category } from "../../types/category";
import CategoryForm from "../../components/CategoryForm";

export default function CategoriesPage() {

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [loadingSubmit, setLoadingSubmit] = useState(false);

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

  const openCreateModal = () => {
    setEditingCategory(null);

    setModalMode("create");

    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);

    setModalMode("edit");

    setIsModalOpen(true);
  };

  const handleCreate = async (data: any) => {
    try {
      setLoadingSubmit(true);

      await createCategory({
        name: data.name,
      });

      await loadCategories();

      setIsModalOpen(false);

      alert("Категория создана");
    } catch (e) {
      console.error(e);

      alert("Ошибка создания");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingCategory) return;

    try {
      setLoadingSubmit(true);

      await updateCategory(editingCategory.id, {
        name: data.name,
        isActive: data.isActive,
      });

      await loadCategories();

      setIsModalOpen(false);

      alert("Категория обновлена");
    } catch (e) {
      console.error(e);

      alert("Ошибка сохранения");
    } finally {
      setLoadingSubmit(false);
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
          onClick={openCreateModal}
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
                      onClick={() => openEditModal(category)}
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

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === "create"
                  ? "Добавление категории"
                  : "Редактирование категории"}
              </h2>

              <button
                style={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <CategoryForm
                submitText=""
                loading={loadingSubmit}
                initialData={editingCategory || undefined}
                showIsActive={modalMode === "edit"}
                onSubmit={
                  modalMode === "create"
                    ? handleCreate
                    : handleUpdate
                }
              />
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>

              <button
                style={styles.saveBtn}
                onClick={() => {
                  const form =
                    document.getElementById(
                      "category-form"
                    ) as HTMLFormElement;

                  form?.requestSubmit();
                }}
                disabled={loadingSubmit}
              >
                {loadingSubmit
                  ? "Сохранение..."
                  : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
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

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    width: "500px",
    maxHeight: "80vh",
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },

  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    margin: 0,
    color: "#442D25",
  },

  modalContent: {
    padding: "20px 24px",
    overflowY: "auto",
  },

  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    color: "#666",
  },

  modalFooter: {
    padding: "20px 24px",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },

  cancelBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#ece7e4",
    cursor: "pointer",
    fontWeight: 600,
  },

  saveBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#442D25",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
};