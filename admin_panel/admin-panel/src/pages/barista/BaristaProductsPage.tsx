import { useEffect, useState } from "react";

import {
  activateProduct,
  deactivateProduct,
  getProducts,
} from "../../api/productsApi";

import type { Product } from "../../types/product";

import { toast } from "react-toastify";

type Tab =
  | "active"
  | "inactive"
  | "all";

export default function BaristaProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<Tab>("active");

  useEffect(() => {
    loadProducts();

    const interval = window.setInterval(
      loadProducts,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Ошибка загрузки товаров"
      );
    }
  };

  const toggleProduct = async (
    product: Product
  ) => {
    try {
      if (product.isActive) {
        await deactivateProduct(
          product.id
        );

        toast.success(
          `${product.name} скрыт`
        );
      } else {
        await activateProduct(
          product.id
        );

        toast.success(
          `${product.name} снова доступен`
        );
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                isActive:
                  !p.isActive,
              }
            : p
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Ошибка изменения статуса"
      );
    }
  };

  const activeCount = products.filter(
    (p) => p.isActive
  ).length;

  const inactiveCount =
    products.filter(
      (p) => !p.isActive
    ).length;

  const filteredProducts =
    products.filter((p) => {
      switch (tab) {
        case "active":
          return p.isActive;

        case "inactive":
          return !p.isActive;

        case "all":
          return true;

        default:
          return true;
      }
    });

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Наличие товаров
        </h1>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(tab === "active"
                ? styles.activeTab
                : {}),
            }}
            onClick={() =>
              setTab("active")
            }
          >
            В наличии (
            {activeCount})
          </button>

          <button
            style={{
              ...styles.tab,
              ...(tab ===
              "inactive"
                ? styles.activeTab
                : {}),
            }}
            onClick={() =>
              setTab("inactive")
            }
          >
            Нет в наличии (
            {inactiveCount})
          </button>

          <button
            style={{
              ...styles.tab,
              ...(tab === "all"
                ? styles.activeTab
                : {}),
            }}
            onClick={() =>
              setTab("all")
            }
          >
            Все ({products.length})
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                Название
              </th>

              <th style={styles.th}>
                Категория
              </th>

              <th style={styles.th}>
                Цена
              </th>

              <th style={styles.th}>
                Статус
              </th>

              <th style={styles.th}>
                Действие
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length ===
            0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={styles.empty}
                >
                  {tab ===
                    "active" &&
                    "Нет доступных товаров"}

                  {tab ===
                    "inactive" &&
                    "Нет скрытых товаров"}

                  {tab === "all" &&
                    "Товары отсутствуют"}
                </td>
              </tr>
            ) : (
              filteredProducts.map(
                (product) => (
                  <tr
                    key={product.id}
                    style={
                      styles.row
                    }
                  >
                    <td
                      style={
                        styles.td
                      }
                    >
                      <div
                        style={
                          styles.productName
                        }
                      >
                        {
                          product.name
                        }
                      </div>
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      {
                        product.categoryName
                      }
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      {
                        product.price
                      }{" "}
                      ₽
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor:
                            product.isActive
                              ? "#e7f7ed"
                              : "#f5e5e5",
                          color:
                            product.isActive
                              ? "#1c7c45"
                              : "#a33a3a",
                        }}
                      >
                        {product.isActive
                          ? "В наличии"
                          : "Нет"}
                      </span>
                    </td>

                    <td
                      style={
                        styles.td
                      }
                    >
                      <button
                        style={{
                          ...styles.button,
                          backgroundColor:
                            product.isActive
                              ? "#b84040"
                              : "#442D25",
                        }}
                        onClick={() =>
                          toggleProduct(
                            product
                          )
                        }
                      >
                        {product.isActive
                          ? "Скрыть"
                          : "Вернуть"}
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
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
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "24px",
    gap: "16px",
  },

  title: {
    fontSize: "32px",
    color: "#442D25",
    fontWeight: 700,
  },

  tabs: {
    display: "flex",
    gap: "12px",
  },

  tab: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#e7dfda",
    cursor: "pointer",
    fontWeight: 600,
  },

  activeTab: {
    backgroundColor: "#442D25",
    color: "white",
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.05)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "18px",
    backgroundColor: "#f8f5f2",
    color: "#442D25",
    fontSize: "15px",
    fontWeight: 700,
    borderBottom:
      "1px solid #eee",
  },

  td: {
    padding: "18px",
    borderBottom:
      "1px solid #f1f1f1",
    verticalAlign: "middle",
  },

  row: {
    backgroundColor: "white",
  },

  image: {
    width: "72px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "12px",
  },

  productName: {
    fontWeight: 700,
    color: "#442D25",
    marginBottom: "6px",
  },

  description: {
    color: "#777",
    fontSize: "14px",
    maxWidth: "300px",
  },

  status: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
  },

  button: {
    border: "none",
    borderRadius: "10px",
    color: "white",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },

  empty: {
    padding: "40px",
    textAlign: "center",
    color: "#777",
    fontSize: "18px",
    fontWeight: 600,
  },
};