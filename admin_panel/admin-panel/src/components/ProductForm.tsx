import { useEffect, useState } from "react";

import { getCategories } from "../api/categoriesApi";

import type { Category } from "../types/category";

interface Props {
  title: string;

  initialData?: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    imgUrl?: string;
    isActive?: boolean;
  };

  loading?: boolean;

  submitText: string;

  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    isActive: boolean;
  }) => void | Promise<void>;

  showIsActive?: boolean;

  onImageChange?: (file: File | null) => void;

  onDeleteImage?: () => void | Promise<void>;
}

export default function ProductForm({
  initialData,
  onSubmit,
  showIsActive = false,
  onImageChange,
  onDeleteImage,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState(initialData?.name || "");

  const [description, setDescription] = useState(initialData?.description || "");

  const [price, setPrice] = useState(initialData?.price || 0);

  const [categoryId, setCategoryId] = useState(initialData?.categoryId || 1);

  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imgUrl || null);

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
      categoryId,
      isActive,
    });
  };

  return (
        <form
          id="product-form"
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

          <div style={styles.formGroup}>
            <label>Фото товара</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageFile(file);
                onImageChange?.(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />

            {previewUrl && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={previewUrl}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </div>
            )}

            {previewUrl && (
              <button
                type="button"
                style={styles.deleteImageBtn}
                onClick={async () => {
                  await onDeleteImage?.();

                  setImageFile(null);
                  setPreviewUrl(null);
                  onImageChange?.(null);
                }}
              >
                Удалить фото
              </button>
            )}
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
        </form>
  );
}

const styles: Record<string, React.CSSProperties> =
  {
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

    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    deleteImageBtn: {
    marginTop: "10px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#c0392b",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  };