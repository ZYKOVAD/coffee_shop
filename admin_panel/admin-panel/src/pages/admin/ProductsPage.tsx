import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  deleteProduct,
} from "../../api/productsApi";

import type { Product } from "../../types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Удалить товар?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((prev) =>
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

  if (!products.length) {
    return <div>Товары не найдены</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{
            fontSize: "32px",
            color: "#442D25",
            fontWeight: 700,
        }}>Товары</h1>

        <button 
            style={styles.createBtn}
            onClick={() => navigate("/admin/products/create")}
        >
          Добавить товар
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Название</th>
              <th style={styles.th}>Цена</th>
              <th style={styles.th}>Активность</th>
              <th style={styles.th}>Действия</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
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
                <td style={styles.td}>{product.id}</td>

                <td style={styles.td}>{product.name}</td>

                <td style={styles.td}>{product.price} ₽</td>

                <td style={styles.td}>
                  {product.isActive
                    ? "Активен"
                    : "Скрыт"}
                </td>

                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                        style={styles.editBtn}
                        onClick={() =>
                            navigate(
                            `/admin/products/${product.id}`
                            )
                        }
                    >
                        Изменить
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        handleDelete(product.id)
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

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  createBtn: {
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#442D25",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    transition: "0.2s",
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "10px",
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
    color: "#442D25",
    fontWeight: 600,
  },

  deleteBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#c0392b",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
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