import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getCategories } from "../api/categoriesApi";

import type { Category } from "../types/category";

interface Props {
  title: string;

  initialData?: {
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    categoryId: number;
    isActive?: boolean;
  };

  loading?: boolean;

  submitText: string;

  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    categoryId: number;
    isActive: boolean;
  }) => void | Promise<void>;

  showIsActive?: boolean;
}

export default function ProductForm({
  title,
  initialData,
  loading,
  submitText,
  onSubmit,
  showIsActive = false,
}: Props) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState(
    initialData?.name || ""
  );

  const [description, setDescription] =
    useState(initialData?.description || "");

  const [price, setPrice] = useState(
    initialData?.price || 0
  );

  const [imgUrl, setImgUrl] = useState(
    initialData?.imgUrl || ""
  );

  const [categoryId, setCategoryId] =
    useState(initialData?.categoryId || 1);

  const [isActive, setIsActive] = useState(
    initialData?.isActive ?? true
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSubmit({
      name,
      description,
      price,
      imgUrl,
      categoryId,
      isActive,
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
              navigate("/admin/products")
            }
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <div style={styles.field}>
            <label>Название</label>

            <input
              style={styles.input}
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div style={styles.field}>
            <label>Описание</label>

            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <div style={styles.field}>
            <label>Цена, руб</label>

            <input
              type="number"
              style={styles.input}
              value={price}
              onChange={(e) =>
                setPrice(Number(e.target.value))
              }
              required
            />
          </div>

          <div style={styles.field}>
            <label>Категория</label>

            <select
              style={styles.input}
              value={categoryId}
              onChange={(e) =>
                setCategoryId(Number(e.target.value))
              }
            >
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label>URL изображения</label>

            <input
              style={styles.input}
              value={imgUrl}
              onChange={(e) =>
                setImgUrl(e.target.value)
              }
            />
          </div>

          {showIsActive && (
            <div style={styles.checkboxField}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
              />

              <label>Активен</label>
            </div>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
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

const styles: Record<string, React.CSSProperties> =
  {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
    },

    card: {
      width: "100%",
      maxWidth: "700px",
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "18px",
      boxShadow:
        "0 4px 16px rgba(0,0,0,0.08)",
    },

    title: {
      color: "#442D25",
      fontSize: "32px",
      fontWeight: 700,
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    input: {
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },

    textarea: {
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      minHeight: "120px",
      fontSize: "16px",
      resize: "vertical",
    },

    checkboxField: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    button: {
      width: "100%",
      padding: "16px",
      border: "none",
      borderRadius: "12px",
      backgroundColor: "#442D25",
      color: "white",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
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
  };