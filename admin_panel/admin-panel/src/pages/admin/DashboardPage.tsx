import { useEffect, useState } from "react";

import {
  getCoffeeShop,
  updateCoffeeShop,
  type CoffeeShop,
} from "../../api/coffeeShopApi";

import {
  getProducts,
  getPopularProducts,
  makePopular,
  makeUnpopular,
} from "../../api/productsApi";

import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from "../../api/bannerApi";

export default function DashboardPage() {

  const [loading, setLoading] = useState(true);
  
  const [coffeeShop, setCoffeeShop] = useState<CoffeeShop | null>(null);
  const [savingCoffeeShop, setSavingCoffeeShop] = useState(false);
  const [isEditingCoffeeShop, setIsEditingCoffeeShop] = useState(false);

  const [bonusPercent, setBonusPercent] = useState(5);

  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);
  const [selectedPopularIds, setSelectedPopularIds] = useState<number[]>([]);

  const [banners, setBanners] = useState<any[]>([]);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSortOrder, setBannerSortOrder] = useState(0);
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  useEffect(() => {
    loadCoffeeShop();
    loadPopular();
    loadAllProducts();
    loadBanners();
  }, []);

  useEffect(() => {
    if (modalOpen) {
      setSelectedPopularIds(
        popularProducts.map((p) => p.id)
      );
    }
  }, [modalOpen, popularProducts]);

  const loadCoffeeShop = async () => {
    try {
      const data = await getCoffeeShop();
      setCoffeeShop(data);
    } catch (e) {
      console.error(e);
      alert(
        "Ошибка загрузки кофейни"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPopular = async () => {
    const data =
      await getPopularProducts();

    setPopularProducts(data);
  };

  const loadAllProducts = async () => {
    const data = await getProducts();

    setAllProducts(data);
  };

  const loadBanners = async () => {
    const data = await getBanners();
    setBanners(data);
  };

  const toggleLocalPopular = (id: number) => {
    setSelectedPopularIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }

      return [...prev, id];
    });
  };

  useEffect(() => {
    document.body.style.overflow =
      modalOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [modalOpen]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredProducts =
    showOnlyPopular
      ? allProducts.filter((p) =>
          selectedPopularIds.includes(p.id)
        )
      : allProducts;

  const savePopularProducts = async () => {
    try {
      const currentIds = popularProducts.map(
        (p) => p.id
      );

      const toAdd = selectedPopularIds.filter(
        (id) => !currentIds.includes(id)
      );

      const toRemove = currentIds.filter(
        (id) =>
          !selectedPopularIds.includes(id)
      );

      await Promise.all([
        ...toAdd.map((id) =>
          makePopular(id)
        ),

        ...toRemove.map((id) =>
          makeUnpopular(id)
        ),
      ]);

      await loadPopular();

      setModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>
          Главная
        </h1>

        <h2 style={styles.sectionTitle}>
          Настройки кофейни
        </h2>
      </div>

      {coffeeShop && (
        <div style={styles.section}>
          <div style={styles.settingsCard}>
            <div style={styles.settingsGrid}>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>
                  Адрес
                </label>

                <input
                  style={{
                    ...styles.input,
                    ...(!isEditingCoffeeShop
                      ? styles.disabledInput
                      : {}),
                  }}
                  disabled={
                    !isEditingCoffeeShop
                  }
                  value={coffeeShop.adress}
                  onChange={(e) =>
                    setCoffeeShop({
                      ...coffeeShop,
                      adress:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div style={styles.smallField}>
                <label style={styles.fieldLabel}>
                  Открытие
                </label>

                <input
                  type="time"
                  style={{
                    ...styles.input,
                    ...(!isEditingCoffeeShop
                      ? styles.disabledInput
                      : {}),
                  }}
                  disabled={
                    !isEditingCoffeeShop
                  }
                  value={coffeeShop.open.slice(
                    0,
                    5
                  )}
                  onChange={(e) =>
                    setCoffeeShop({
                      ...coffeeShop,
                      open:
                        e.target.value +
                        ":00",
                    })
                  }
                />
              </div>

              <div style={styles.smallField}>
                <label style={styles.fieldLabel}>
                  Закрытие
                </label>

                <input
                  type="time"
                  style={{
                    ...styles.input,
                    ...(!isEditingCoffeeShop
                      ? styles.disabledInput
                      : {}),
                  }}
                  disabled={
                    !isEditingCoffeeShop
                  }
                  value={coffeeShop.close.slice(
                    0,
                    5
                  )}
                  onChange={(e) =>
                    setCoffeeShop({
                      ...coffeeShop,
                      close:
                        e.target.value +
                        ":00",
                    })
                  }
                />
              </div>

              <div style={styles.activeField}>
                <label style={styles.fieldLabel}>
                  Активна
                </label>

                <input
                  type="checkbox"
                  disabled={
                    !isEditingCoffeeShop
                  }
                  checked={
                    coffeeShop.isActive
                  }
                  onChange={(e) =>
                    setCoffeeShop({
                      ...coffeeShop,
                      isActive:
                        e.target.checked,
                    })
                  }
                />
              </div>
            </div>

            <div style={styles.settingsBottom}>
              {!isEditingCoffeeShop ? (
                <button
                  style={styles.primaryButton}
                  onClick={() =>
                    setIsEditingCoffeeShop(
                      true
                    )
                  }
                >
                  Изменить
                </button>
              ) : (
                <div
                  style={
                    styles.settingsActions
                  }
                >
                  <button
                    style={
                      styles.secondaryButton
                    }
                    onClick={async () => {
                      await loadCoffeeShop();

                      setIsEditingCoffeeShop(
                        false
                      );
                    }}
                  >
                    Отмена
                  </button>

                  <button
                    style={
                      styles.primaryButton
                    }
                    disabled={
                      savingCoffeeShop
                    }
                    onClick={async () => {
                      try {
                        setSavingCoffeeShop(
                          true
                        );

                        await updateCoffeeShop(
                          {
                            adress:
                              coffeeShop.adress,
                            open:
                              coffeeShop.open,
                            close:
                              coffeeShop.close,
                            isActive:
                              coffeeShop.isActive,
                          }
                        );

                        setIsEditingCoffeeShop(
                          false
                        );

                        alert(
                          "Настройки сохранены"
                        );
                      } catch (e) {
                        console.error(e);

                        alert(
                          "Ошибка сохранения"
                        );
                      } finally {
                        setSavingCoffeeShop(
                          false
                        );
                      }
                    }}
                  >
                    Сохранить
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Бонусная система
          </h2>
        </div>

        <div style={styles.bonusCompactCard}>
          <div style={styles.bonusCompactLeft}>
            <div
              style={
                styles.bonusCompactTitle
              }
            >
              Процент начисления бонусов
            </div>

            <div
              style={
                styles.bonusCompactHint
              }
            >
              Начисление с каждого заказа
            </div>
          </div>

          <div style={styles.bonusControls}>
            <input
              type="number"
              min={1}
              max={20}
              value={bonusPercent}
              onChange={(e) =>
                setBonusPercent(
                  Number(
                    e.target.value
                  )
                )
              }
              style={styles.bonusInput}
            />

            <span
              style={styles.percentSign}
            >
              %
            </span>

            <button
              style={
                styles.primaryButton
              }
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Баннеры
            </h2>

            <div style={styles.popularSubtitle}>
              Отображаются на главной странице в мобильном приложении
            </div>
          </div>

          <div style={styles.sectionHeaderActions}>
            <button
              style={styles.primaryButton}
              onClick={() => {
                setEditingBanner(null);
                setBannerTitle("");
                setBannerSortOrder(0);
                setBannerIsActive(true);
                setBannerImage(null);
                setBannerModalOpen(true);
              }}
            >
              Добавить
            </button>
          </div>
        </div>

        <div style={styles.widgetsGrid}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              style={styles.widgetCard}
            >
              {banner.imgUrl && (
                <img
                  src={banner.imgUrl}
                  style={styles.widgetImage}
                />
              )}

              <div style={styles.widgetTop}>
                <div style={styles.widgetTitle}>
                  {banner.title || "Без названия"}
                </div>

                <div
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      banner.isActive
                        ? "#dff5e8"
                        : "#f3f3f3",
                    color: banner.isActive
                      ? "#1d7a46"
                      : "#777",
                  }}
                >
                  {banner.isActive
                    ? "Активен"
                    : "Скрыт"}
                </div>
              </div>

              <div style={styles.widgetDescription}>
                Порядок: {banner.sortOrder}
              </div>

              <div style={styles.widgetActions}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setEditingBanner(banner);

                    setBannerTitle(
                      banner.title || ""
                    );

                    setBannerSortOrder(
                      banner.sortOrder
                    );

                    setBannerIsActive(
                      banner.isActive
                    );

                    setBannerModalOpen(true);
                  }}
                >
                  Изменить
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={async () => {
                    if (
                      !confirm(
                        "Удалить баннер?"
                      )
                    )
                      return;

                    await deleteBanner(
                      banner.id
                    );

                    await loadBanners();
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Популярные товары
            </h2>

            <div
              style={
                styles.popularSubtitle
              }
            >
              Эти товары показываются на
              главном экране в мобильном
              приложении
            </div>
          </div>

          <div style={styles.sectionHeaderActions}>
            <button
              style={styles.primaryButton}
              onClick={() => setModalOpen(true)}
            >
              Настроить
            </button>
          </div>
        </div>

        <div style={styles.popularGrid}>
          {popularProducts.map((p) => (
            <div
              key={p.id}
              style={styles.productCard}
            >
              <div
                style={styles.productName}
              >
                {p.name}
              </div>

              <div
                style={styles.productMeta}
              >
                {p.price} ₽ •{" "}
                {p.categoryName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2
                style={styles.modalTitle}
              >
                Настройка популярных
                товаров
              </h2>

              <button
                onClick={() =>
                  setModalOpen(false)
                }
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div
                style={styles.filterRow}
              >
                <button
                  style={{
                    ...styles.filterButton,
                    ...(!showOnlyPopular
                      ? styles.filterButtonActive
                      : {}),
                  }}
                  onClick={() =>
                    setShowOnlyPopular(
                      false
                    )
                  }
                >
                  Все
                </button>

                <button
                  style={{
                    ...styles.filterButton,
                    ...(showOnlyPopular
                      ? styles.filterButtonActive
                      : {}),
                  }}
                  onClick={() =>
                    setShowOnlyPopular(
                      true
                    )
                  }
                >
                  Выбранные
                </button>
              </div>

              <div style={styles.modalList}>
                {filteredProducts.map(
                  (p) => {
                    const isPopular = selectedPopularIds.includes(p.id);

                    return (
                      <label
                        key={p.id}
                        style={styles.row}
                      >
                        <input
                          type="checkbox"
                          checked={isPopular}
                          onChange={() =>
                            toggleLocalPopular(p.id)
                          }
                        />

                        <span>
                          {p.name} •{" "}
                          {p.price} ₽
                        </span>
                      </label>
                    );
                  }
                )}
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.primaryButton}
                onClick={savePopularProducts}
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

      {bannerModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingBanner
                  ? "Редактирование баннера"
                  : "Создание баннера"}
              </h2>

              <button
                onClick={() =>
                  setBannerModalOpen(false)
                }
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.field}>
                <label>Название</label>

                <input
                  style={styles.input}
                  value={bannerTitle}
                  onChange={(e) =>
                    setBannerTitle(
                      e.target.value
                    )
                  }
                />
              </div>

              <div style={styles.field}>
                <label>Порядок</label>

                <input
                  type="number"
                  style={styles.input}
                  value={bannerSortOrder}
                  onChange={(e) =>
                    setBannerSortOrder(
                      Number(
                        e.target.value
                      )
                    )
                  }
                />
              </div>

              <div style={styles.field}>
                <label>Фото</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBannerImage(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                />
              </div>

              <div style={styles.checkboxField}>
                <input
                  type="checkbox"
                  checked={bannerIsActive}
                  onChange={(e) =>
                    setBannerIsActive(
                      e.target.checked
                    )
                  }
                />

                <label>Активен</label>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.primaryButton}
                onClick={async () => {
                  try {
                    if (editingBanner) {
                      await updateBanner(
                        editingBanner.id,
                        {
                          title:
                            bannerTitle,
                          sortOrder:
                            bannerSortOrder,
                          isActive:
                            bannerIsActive,
                        }
                      );

                      if (bannerImage) {
                        await uploadBannerImage(
                          editingBanner.id,
                          bannerImage
                        );
                      }
                    } else {
                      const formData =
                        new FormData();

                      formData.append(
                        "title",
                        bannerTitle
                      );

                      formData.append(
                        "sortOrder",
                        bannerSortOrder.toString()
                      );

                      if (bannerImage) {
                        formData.append(
                          "file",
                          bannerImage
                        );
                      }

                      await createBanner(
                        formData
                      );
                    }

                    await loadBanners();

                    setBannerModalOpen(false);
                  } catch (e) {
                    console.error(e);
                    alert("Ошибка");
                  }
                }}
              >
                Сохранить
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
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px 48px",
  },

  pageTitle: {
    margin: "0 0 32px",
    color: "#442D25",
    fontSize: "36px",
    fontWeight: 700,
  },

  section: {
    marginBottom: "48px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
  },

  sectionHeaderActions: {
    paddingRight: "22px",
  },

  sectionTitle: {
    margin: 0,
    color: "#442D25",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: 1.2,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    padding: "20px",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    margin: "0 0 10px",
    color: "#777",
    fontSize: "14px",
    fontWeight: 500,
  },

  value: {
    fontSize: "30px",
    fontWeight: 700,
    color: "#442D25",
    margin: 0,
  },

  bonusCompactCard: {
    background: "white",
    borderRadius: "18px",
    padding: "24px",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
  },

  bonusCompactLeft: {
    display: "flex",
    flexDirection: "column",
  },

  bonusCompactTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#442D25",
    marginBottom: "6px",
  },

  bonusCompactHint: {
    fontSize: "14px",
    color: "#777",
  },

  bonusControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  bonusInput: {
    width: "80px",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center",
  },

  percentSign: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#442D25",
  },

  primaryButton: {
    background: "#442D25",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    height: "42px",
  },

  popularSubtitle: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#777",
    lineHeight: 1.5,
    maxWidth: "520px",
  },

  popularGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(180px, 180px))",
    gap: "16px",
  },

  productCard: {
    background: "white",
    borderRadius: "14px",
    padding: "14px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.05)",
    minHeight: "82px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  productName: {
    fontWeight: 700,
    color: "#442D25",
    fontSize: "15px",
    lineHeight: 1.4,
  },

  productMeta: {
    fontSize: "12px",
    color: "#777",
    marginTop: "6px",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(3px)",
    zIndex: 1000,
    padding: "24px",
  },

  modal: {
    width: "100%",
    maxWidth: "720px",
    background: "white",
    borderRadius: "20px",
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "85vh",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #eee",
    flexShrink: 0,
  },

  modalTitle: {
    margin: 0,
    color: "#442D25",
    fontSize: "24px",
    fontWeight: 700,
  },

  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    color: "#442D25",
    padding: 0,
    width: "32px",
    height: "32px",
  },

  modalBody: {
    padding: "20px 24px",
    overflowY: "auto",
    flex: 1,
  },

  modalFooter: {
    padding: "20px 24px",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
    flexShrink: 0,
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  filterButton: {
    border: "1px solid #ddd",
    background: "#f5f5f5",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    color: "#442D25",
  },

  filterButtonActive: {
    background: "#442D25",
    color: "white",
    border: "1px solid #442D25",
  },

  modalList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 8px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
    userSelect: "none",
  },

  widgetsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "18px",
  },

  widgetCard: {
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.05)",
  },

  widgetImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },

  widgetTop: {
    padding: "16px 16px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  widgetTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#442D25",
  },

  widgetDescription: {
    padding: "12px 16px",
    color: "#777",
    fontSize: "14px",
  },

  widgetActions: {
    display: "flex",
    gap: "10px",
    padding: "0 16px 16px",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  editBtn: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #442D25",
    background: "white",
    color: "#442D25",
    cursor: "pointer",
    fontWeight: 600,
  },

  deleteBtn: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#c0392b",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  pageHeader: {
    marginBottom: "32px",
  },

  pageSubtitle: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#777",
  },

  settingsCard: {
    background: "white",
    borderRadius: "18px",
    padding: "20px",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)",
  },

  settingsGrid: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr auto",
    gap: "16px",
    alignItems: "flex-start",
  },

  smallField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  activeField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "90px",
  },

  settingsBottom: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },

  settingsActions: {
    display: "flex",
    gap: "10px",
  },

  disabledInput: {
    background: "#f3f1ee",
    color: "#442D25",
    border: "1px solid #d8d2cb",
    opacity: 1,
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  checkboxField: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  settingsTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  settingsTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#442D25",
    marginBottom: "6px",
  },

  settingsHint: {
    fontSize: "14px",
    color: "#777",
  },

  secondaryButton: {
    background: "#f3f3f3",
    color: "#442D25",
    border: "1px solid #ddd",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    height: "42px",
  },

  fieldLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#5f4a43",
    marginBottom: "8px",
  },
};