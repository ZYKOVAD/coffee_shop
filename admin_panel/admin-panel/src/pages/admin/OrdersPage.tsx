import { useEffect, useState } from "react";

import {
  getOrders,
  updateOrderStatus,
  type OrderStatus,
} from "../../api/ordersApi";

import type { Order, } from "../../types/order";

const statuses = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
  "rejected",
  "notPickedUp",
  "refunded",
];

const getNextStatuses = (status: string) => {
  switch (status) {
    case "pending":
      return ["confirmed", "preparing", "rejected"];

    case "confirmed":
      return ["preparing"];

    case "preparing":
      return ["ready"];

    case "ready":
      return ["completed", "notPickedUp"];

    case "completed":
      return ["refunded"];

    default:
      return [];
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<
    Order[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [comments, setComments] =
    useState<
      Record<number, string>
    >({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      alert(
        "Ошибка загрузки заказов"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);

    if (!order) return;

    const allowed = getNextStatuses(order.status); 
    
     if (!allowed.includes(newStatus)) {
      alert(`Нельзя перевести ${order.status} → ${newStatus}`);
      return;
    }

    try {
        await updateOrderStatus(
          orderId,
          {
            status:
              newStatus as OrderStatus,

            baristaComment:
              comments[orderId] ||
              "",
          }
        );

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  baristaComment:
                    comments[
                      orderId
                    ] || "",
                }
              : order
          )
        );

        if (
          selectedOrder &&
          selectedOrder.id === orderId
        ) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            baristaComment:
              comments[orderId] ||
              "",
          });
        }
      } catch (error) {
        console.error(error);

        alert(
          "Ошибка изменения статуса"
        );
      }
    };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (x) =>
            x.status ===
            statusFilter
        );

  return (
    <div>
      <h1 style={styles.title}>
        Заказы
      </h1>

      <div style={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          style={styles.select}
        >
          {statuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status === "all"
                ? "Все статусы"
                : getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                №
              </th>

              <th style={styles.th}>
                Пользователь
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                Сумма
              </th>

              <th style={styles.th}>
                Статус
              </th>

              <th style={styles.th}>
                Дата
              </th>

              <th style={styles.th}>
                Детали
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(
              (order) => (
                <tr key={order.id}>
                  <td style={styles.td}>
                    #
                    {
                      order.orderNumber
                    }
                  </td>

                  <td style={styles.td}>
                    {order.userName}
                  </td>

                  <td style={styles.td}>
                    {order.email}
                  </td>

                  <td style={styles.td}>
                    {
                      order.totalPrice
                    }{" "}
                    ₽
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        ...getStatusStyle(order.status),
                      }}
                    >
                      {
                        getStatusLabel(order.status)
                      }
                    </span>
                  </td>

                  <td style={styles.td}>
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </td>

                  <td style={styles.td}>
                    <button
                      style={
                        styles.button
                      }
                      onClick={() => {
                        setSelectedOrder(order);
                        setSelectedStatus(order.status);
                      }}
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div
              style={
                styles.modalHeader
              }
            >
              <h2
                style={
                  styles.modalTitle
                }
              >
                Заказ #
                {
                  selectedOrder.orderNumber
                }
              </h2>

              <button
                style={
                  styles.closeButton
                }
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
              >
                ✕
              </button>
            </div>

            <div
              style={
                styles.infoGrid
              }
            >
              <div>
                <b>
                  Пользователь:
                </b>{" "}
                {
                  selectedOrder.userName
                }
              </div>

              <div>
                <b>Email:</b>{" "}
                {
                  selectedOrder.email
                }
              </div>

              <div>
                <b>Статус:</b>{" "}
                {
                  getStatusLabel(selectedOrder.status)
                }
              </div>

              <div>
                <b>Сумма:</b>{" "}
                {
                  selectedOrder.totalPrice
                }{" "}
                ₽
              </div>

              <div>
                <b>
                  Использовано
                  бонусов:
                </b>{" "}
                {
                  selectedOrder.bonusUsed
                }
              </div>

              <div>
                <b>
                  Начислено
                  бонусов:
                </b>{" "}
                {
                  selectedOrder.bonusEarned
                }
              </div>

              <div>
                <b>
                  Время
                  получения:
                </b>{" "}
                {new Date(
                  selectedOrder.pickupTime
                ).toLocaleString()}
              </div>

              <div>
                <b>Создан:</b>{" "}
                {new Date(
                  selectedOrder.createdAt
                ).toLocaleString()}
              </div>
            </div>

            <div style={styles.section}>
              <h3
                style={
                  styles.sectionTitle
                }
              >
                Комментарий
                клиента
              </h3>

              <div
                style={
                  styles.commentBox
                }
              >
                {selectedOrder.clientComment ||
                  "Нет комментария"}
              </div>
            </div>

            <div style={styles.section}>
              <h3
                style={
                  styles.sectionTitle
                }
              >
                Состав заказа
              </h3>

              <div
                style={
                  styles.itemsList
                }
              >
                {selectedOrder.items.map(
                  (item) => (
                    <div key={item.id} style={styles.itemRow}>
                      <div>
                        <div>
                          {item.productName} × {item.count}
                        </div>

                        {parseModifiers(item.selectedModifiers).length > 0 && (
                          <div style={styles.modifiers}>
                            {parseModifiers(item.selectedModifiers)
                              .map((m: any) =>
                                m.price > 0 ? `${m.name} (+${m.price} ₽)` : m.name
                              )
                              .join(", ")}
                          </div>
                        )}
                      </div>
                        
                      <div>{item.totalPrice} ₽</div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div style={styles.section}>
              <h3
                style={
                  styles.sectionTitle
                }
              >
                Управление
                заказом
              </h3>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                style={{
                ...styles.modalSelect,
                ...getStatusStyle(
                  selectedOrder.status
                ),
              }}
              >
                <option value={selectedOrder.status}>
                  {getStatusLabel(selectedOrder.status)}
                </option>

                {getNextStatuses(selectedOrder.status).map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Комментарий бариста"
                value={
                  comments[
                    selectedOrder.id
                  ] ??
                  selectedOrder.baristaComment ??
                  ""
                }
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [
                      selectedOrder.id
                    ]:
                      e.target
                        .value,
                  })
                }
                style={
                  styles.textarea
                }
              />

              <button
                style={
                  styles.saveButton
                }
                onClick={async () => {
                  await handleStatusChange(
                    selectedOrder.id,
                    selectedStatus
                  );

                  setSelectedOrder(null);
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

const statusConfig: Record<
  string,
  {
    label: string;
    style: React.CSSProperties;
  }
> = {
  pending: {
    label: "Ожидает подтверждения",
    style: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
  },

  confirmed: {
    label: "Подтверждён",
    style: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
  },

  preparing: {
    label: "Готовится",
    style: {
      backgroundColor: "#fde68a",
      color: "#92400e",
    },
  },

  ready: {
    label: "Готов",
    style: {
      backgroundColor: "#bfdbfe",
      color: "#1d4ed8",
    },
  },

  completed: {
    label: "Завершён",
    style: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
  },

  cancelled: {
    label: "Отменён",
    style: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
  },

  rejected: {
    label: "Отклонён",
    style: {
      backgroundColor: "#fecaca",
      color: "#7f1d1d",
    },
  },

  notPickedUp: {
    label: "Не забрали",
    style: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
    },
  },

  refunded: {
    label: "Возврат",
    style: {
      backgroundColor: "#e0e7ff",
      color: "#3730a3",
    },
  },
};

const getStatusLabel = (
  status: string
) => {
  return (
    statusConfig[status]?.label ||
    status
  );
};

const getStatusStyle = (
  status: string
) => {
  return (
    statusConfig[status]?.style || {}
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  title: {
    fontSize: "32px",
    color: "#442D25",
    fontWeight: 700,
    marginBottom: "24px",
  },

  filters: {
    marginBottom: "20px",
  },

  select: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minWidth: "220px",
    backgroundColor: "white",
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#f8f5f3",
    color: "#442D25",
    fontWeight: 700,
  },

  td: {
    padding: "16px",
    borderBottom:
      "1px solid #eee",
    verticalAlign: "middle",
  },

  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#442D25",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  status: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: "900px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "white",
    borderRadius: "24px",
    padding: "28px",
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.18)",
  },

  modalHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  modalTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#442D25",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "28px",
    cursor: "pointer",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "14px",
    marginBottom: "28px",
  },

  section: {
    marginBottom: "28px",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#442D25",
    marginBottom: "14px",
  },

  commentBox: {
    padding: "16px",
    background: "#f8f5f3",
    borderRadius: "14px",
  },

  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  itemRow: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "12px 0",
    borderBottom:
      "1px dashed #ddd",
  },

  modalSelect: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    fontWeight: 700,
    marginBottom: "16px",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    resize: "vertical",
    marginBottom: "18px",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  saveButton: {
    padding: "14px 20px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#442D25",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  modifiers: {
  fontSize: "12px",
  color: "#777",
  marginTop: "4px",
},
};

const parseModifiers = (mods: any) => {
  if (!mods) return [];

  try {
    const parsed =
      typeof mods === "string"
        ? JSON.parse(mods)
        : mods;

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};