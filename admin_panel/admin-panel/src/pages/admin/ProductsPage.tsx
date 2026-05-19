import { useEffect, useState } from "react";

import {
  getProducts,
  deleteProduct,
  getModifiers,
  createModifier,
  updateModifier,
  deleteModifier,
  addModifierToProduct,
  removeModifierFromProduct,
  createProduct,
  updateProduct,
} from "../../api/productsApi";

import type { Product, Modifier  } from "../../types/product";
import ProductForm from "../../components/ProductForm";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allModifiers, setAllModifiers] = useState<Modifier[]>([]);
  const [selectedModifierIds, setSelectedModifierIds] = useState<number[]>([]);
  const [initialModifierIds, setInitialModifierIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] =
    useState<"products" | "modifiers">(
      "products"
    );

  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
  const [editingModifier,setEditingModifier] = useState<Modifier | null>(null);
  const [modifierName, setModifierName] = useState("");
  const [modifierPrice, setModifierPrice] = useState(0);

  const [isModifierProductsModalOpen, setIsModifierProductsModalOpen] = useState(false);
  const [selectedModifier, setSelectedModifier] = useState<Modifier | null>(null);

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [initialProductIds, setInitialProductIds] = useState<number[]>([]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit">("create");

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

  const loadModifiers = async () => {
    try {
      const data = await getModifiers();

      setModifiers(data);
    } catch (error) {
      console.error(error);

      alert(
        "Ошибка загрузки модификаторов"
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProducts();
    loadModifiers();
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

  const openModifiersModal = async (
    product: Product
  ) => {
    try {
      setSelectedProduct(product);

      const modifiers = await getModifiers();

      const ids = product.modifiers.map(
        (x) => x.id
      );

      setAllModifiers(modifiers);

      setSelectedModifierIds(ids);

      setInitialModifierIds(ids);

      setIsModifiersModalOpen(true);
    } catch (error) {
      console.error(error);

      alert(
        "Ошибка загрузки модификаторов"
      );
    }
  };

  const toggleModifier = (
    modifierId: number
  ) => {
    setSelectedModifierIds((prev) => {
      if (prev.includes(modifierId)) {
        return prev.filter(
          (x) => x !== modifierId
        );
      }

      return [...prev, modifierId];
    });
  };

  const saveModifiers = async () => {
    if (!selectedProduct) return;

    try {
      const added =
        selectedModifierIds.filter(
          (id) =>
            !initialModifierIds.includes(id)
        );

      const removed =
        initialModifierIds.filter(
          (id) =>
            !selectedModifierIds.includes(id)
        );

      await Promise.all([
        ...added.map((id) =>
          addModifierToProduct(
            selectedProduct.id,
            id
          )
        ),

        ...removed.map((id) =>
          removeModifierFromProduct(
            selectedProduct.id,
            id
          )
        ),
      ]);

      await loadProducts();

      setIsModifiersModalOpen(false);

      alert("Модификаторы сохранены");
    } catch (error) {
      console.error(error);

      alert(
        "Ошибка сохранения модификаторов"
      );
    }
  };

  const openCreateModifierModal = () => {
    setEditingModifier(null);

    setModifierName("");

    setModifierPrice(0);

    setIsModifierModalOpen(true);
  };

  const openEditModifierModal = (
    modifier: Modifier
  ) => {
    setEditingModifier(modifier);

    setModifierName(modifier.name);

    setModifierPrice(modifier.price);

    setIsModifierModalOpen(true);
  };

  const saveModifier = async () => {
    try {
      if (!modifierName.trim()) {
        alert("Введите название");

        return;
      }

      if (editingModifier) {
        await updateModifier(
          editingModifier.id,
          {
            name: modifierName,
            price: modifierPrice,
          }
        );
      } else {
        await createModifier({
          name: modifierName,
          price: modifierPrice,
        });
      }

      await loadModifiers();

      setIsModifierModalOpen(false);

      alert("Модификатор сохранен");
    } catch (error) {
      console.error(error);

      alert(
        "Ошибка сохранения модификатора"
      );
    }
  };

  const handleDeleteModifier = async (
    id: number
  ) => {
    const confirmed = confirm(
      "Удалить модификатор?"
    );

    if (!confirmed) return;

    try {
      await deleteModifier(id);

      setModifiers((prev) =>
        prev.filter((x) => x.id !== id)
      );

      alert("Модификатор удален");
    } catch (error) {
      console.error(error);

      alert(
        "Ошибка удаления модификатора"
      );
    }
  };

  const openModifierProductsModal = (modifier: Modifier) => {
    setSelectedModifier(modifier);

    const ids = modifier.productIds ?? [];

    setSelectedProductIds(ids);
    setInitialProductIds(ids);

    setIsModifierProductsModalOpen(true);
  };

  const toggleProduct = (productId: number) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const saveModifierProducts = async () => {
    if (!selectedModifier) return;

    try {
      const added = selectedProductIds.filter(
        (id) => !initialProductIds.includes(id)
      );

      const removed = initialProductIds.filter(
        (id) => !selectedProductIds.includes(id)
      );

      await Promise.all([
        ...added.map((productId) =>
          addModifierToProduct(productId, selectedModifier.id)
        ),

        ...removed.map((productId) =>
          removeModifierFromProduct(productId, selectedModifier.id)
        ),
      ]);

      await loadProducts();
      await loadModifiers(); // 👈 ВАЖНО обновить productIds

      setIsModifierProductsModalOpen(false);

      alert("Товары обновлены");
    } catch (e) {
      console.error(e);
      alert("Ошибка сохранения");
    }
  };

  const getProductsForModifier = (modifier: Modifier) => {
    return products.filter((p) =>
      modifier.productIds?.includes(p.id)
    );
  };

  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductModalMode("create");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductModalMode("edit");
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = async (data: any) => {
    try {
      await createProduct(data);

      alert("Товар создан");

      setIsProductModalOpen(false);

      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("Ошибка создания");
    }
  };

  const handleUpdateProduct = async (data: any) => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, data);

      alert("Товар обновлен");

      setIsProductModalOpen(false);

      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("Ошибка обновления");
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

        {activeTab === "products" ? (
          <button
            style={styles.createBtn}
            onClick={openCreateProductModal}
          >
            Добавить товар
          </button>
        ) : (
          <button
            style={styles.createBtn}
            onClick={openCreateModifierModal}
          >
            Добавить модификатор
          </button>
        )}
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === "products"
              ? styles.activeTab
              : {}),
          }}
          onClick={() =>
            setActiveTab("products")
          }
        >
          Товары
        </button>

        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === "modifiers"
              ? styles.activeTab
              : {}),
          }}
          onClick={() =>
            setActiveTab("modifiers")
          }
        >
          Модификаторы
        </button>
      </div>

      {activeTab === "products" ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Название</th>
                <th style={styles.th}>Цена</th>
                <th style={styles.th}>Активность</th>
                <th style={styles.th}>Модификаторы</th>
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
                    <div style={styles.modifiersCell}>
                      <span>
                        {product.modifiers.length} мод.
                      </span>

                      <button
                        style={styles.modifiersBtn}
                        onClick={() =>
                          openModifiersModal(product)
                        }
                      >
                        Настроить
                      </button>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.editBtn} onClick={() => openEditProductModal(product)}>
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
      ) : ( 
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Название</th>
                <th style={styles.th}>Цена</th>
                <th style={styles.th}>Продукты</th>
                <th style={styles.th}>Действия</th>
              </tr>
            </thead>

            <tbody>
              {modifiers.map((modifier) => (
                <tr
                  key={modifier.id}
                  style={styles.row}
                >
                  <td style={styles.td}>
                    {modifier.id}
                  </td>

                  <td style={styles.td}>
                    {modifier.name}
                  </td>

                  <td style={styles.td}>
                    {modifier.price} ₽
                  </td>

                  <td style={styles.td}>
                    <div style={styles.modifiersCell}>
                      <span>
                        {getProductsForModifier(modifier).length} тов.
                      </span>

                      <button
                        style={styles.modifiersBtn}
                        onClick={() =>
                          openModifierProductsModal(modifier)
                        }
                      >
                        Настроить
                      </button>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.editBtn}
                        onClick={() =>
                          openEditModifierModal(
                            modifier
                          )
                        }
                      >
                        Изменить
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() =>
                          handleDeleteModifier(
                            modifier.id
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
      )}

      {isModifiersModalOpen &&
        selectedProduct && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  Модификаторы для "
                  {selectedProduct.name}"
                </h2>

                <button
                  style={styles.closeBtn}
                  onClick={() =>
                    setIsModifiersModalOpen(false)
                  }
                >
                  ✕
                </button>
              </div>

              <div style={styles.modalContent}>
                {allModifiers.map(
                  (modifier) => (
                    <label
                      key={modifier.id}
                      style={styles.modifierRow}
                    >
                      <div>
                        <div>
                          {modifier.name}
                        </div>

                        <div
                          style={
                            styles.modifierPrice
                          }
                        >
                          +{modifier.price} ₽
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={selectedModifierIds.includes(
                          modifier.id
                        )}
                        onChange={() =>
                          toggleModifier(
                            modifier.id
                          )
                        }
                      />
                    </label>
                  )
                )}
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={styles.cancelBtn}
                  onClick={() =>
                    setIsModifiersModalOpen(false)
                  }
                >
                  Отмена
                </button>

                <button
                  style={styles.saveBtn}
                  onClick={saveModifiers}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
      )}

      {isModifierModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.smallModal}>
            
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingModifier
                  ? "Редактирование модификатора"
                  : "Создание модификатора"}
              </h2>

              <button
                style={styles.closeBtn}
                onClick={() =>
                  setIsModifierModalOpen(false)
                }
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label>Название</label>

                <input
                  style={styles.input}
                  value={modifierName}
                  onChange={(e) =>
                    setModifierName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label>Цена</label>

                <input
                  type="number"
                  style={styles.input}
                  value={modifierPrice}
                  onChange={(e) =>
                    setModifierPrice(
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() =>
                  setIsModifierModalOpen(false)
                }
              >
                Отмена
              </button>

              <button
                style={styles.saveBtn}
                onClick={saveModifier}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {isModifierProductsModalOpen && selectedModifier && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                Товары для "{selectedModifier.name}"
              </h2>

              <button
                style={styles.closeBtn}
                onClick={() =>
                  setIsModifierProductsModalOpen(false)
                }
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              {products.map((product) => (
                <label
                  key={product.id}
                  style={styles.modifierRow}
                >
                  <div>{product.name}</div>

                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                  />
                </label>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() =>
                  setIsModifierProductsModalOpen(false)
                }
              >
                Отмена
              </button>

              <button
                style={styles.saveBtn}
                onClick={saveModifierProducts}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {isProductModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {productModalMode === "create"
                  ? "Добавление товара"
                  : "Редактирование товара"}
              </h2>

              <button
                style={styles.closeBtn}
                onClick={() =>
                  setIsProductModalOpen(false)
                }
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <ProductForm
                title=""
                submitText=""
                loading={loading}
                initialData={editingProduct || undefined}
                showIsActive={productModalMode === "edit"}
                onSubmit={
                  productModalMode === "create"
                    ? handleCreateProduct
                    : handleUpdateProduct
                }
              />
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setIsProductModalOpen(false)}
              >
                Отмена
              </button>

              <button
                style={styles.saveBtn}
                onClick={() => {
                  const form = document.querySelector(
                    "#product-form"
                  ) as HTMLFormElement;

                  form?.requestSubmit();
                }}
                disabled={loading}
              >
                {loading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
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

  modifiersCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  modifiersBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ece7e4",
    color: "#442D25",
    cursor: "pointer",
    fontWeight: 600,
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

  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    color: "#666",
  },

  modalContent: {
    padding: "20px 24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  modifierRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    border: "1px solid #eee",
    borderRadius: "12px",
  },

  modifierPrice: {
    fontSize: "13px",
    color: "#777",
    marginTop: "4px",
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

  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },

  tabBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "#ece7e4",
    color: "#442D25",
    fontWeight: 600,
  },

  activeTab: {
    backgroundColor: "#442D25",
    color: "white",
  },

  smallModal: {
    width: "420px",
    backgroundColor: "white",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  productModal: {
    width: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "18px",
    backgroundColor: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
  },
};