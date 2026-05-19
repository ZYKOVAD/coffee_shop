import { useState } from "react";

interface Props {
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
    <form
      id="category-form"
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
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
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