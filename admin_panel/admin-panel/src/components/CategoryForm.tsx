import { useState } from "react";

interface Props {
  title: string;

  submitText: string;

  loading?: boolean;

  initialData?: {
    name: string;
    isActive?: boolean;
  };

  showIsActive?: boolean;

  onSubmit: (data: {
    name: string;
    isActive: boolean;
  }) => void | Promise<void>;
}

export default function CategoryForm({
  title,
  submitText,
  loading,
  initialData,
  showIsActive = false,
  onSubmit,
}: Props) {
  const [name, setName] = useState(
    initialData?.name || ""
  );

  const [isActive, setIsActive] = useState(
    initialData?.isActive ?? true
  );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSubmit({
      name,
      isActive,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {title}
        </h1>

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

          {showIsActive && (
            <div style={styles.checkboxField}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
              />

              <label>Активна</label>
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
      marginBottom: "24px",
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
  };