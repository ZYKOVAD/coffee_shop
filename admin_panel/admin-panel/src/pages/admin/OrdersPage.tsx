import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/ordersApi";
import type { Order } from "../../types/order";


const statuses = [
  "all",
  "pending",
  "confirmed",
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
  "rejected",
  "notPickedUp",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [comments, setComments] = useState<
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
      alert("Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (x) => x.status === statusFilter
        );

  const handleStatusChange = async (
    orderId: number,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus(
        orderId,
        newStatus,
        comments[orderId] || ""
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                baristaComment:
                  comments[orderId] || "",
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка изменения статуса");
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Заказы</h1>

      <div style={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
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
                : status}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>№</th>
              <th style={styles.th}>Пользователь</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Сумма</th>
              <th style={styles.th}>Статус</th>
              <th style={styles.th}>Комментарий</th>
              <th style={styles.th}>Дата</th>
              <th style={styles.th}>Детали</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <>
                <tr key={order.id}>
                  <td style={styles.td}>
                    #{order.orderNumber}
                  </td>

                  <td style={styles.td}>
                    {order.userName}
                  </td>

                  <td style={styles.td}>
                    {order.email}
                  </td>

                  <td style={styles.td}>
                    {order.totalPrice} ₽
                  </td>

                  <td style={styles.td}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                      style={{
                        ...styles.status,
                        ...getStatusStyle(order.status),
                      }}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td style={styles.td}>
                    <input
                      type="text"
                      placeholder="Комментарий"
                      value={
                        comments[order.id] ??
                        order.baristaComment ??
                        ""
                      }
                      onChange={(e) =>
                        setComments({
                          ...comments,
                          [order.id]: e.target.value,
                        })
                      }
                      style={styles.commentInput}
                    />
                  </td>

                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() =>
                        setExpandedOrderId(
                          expandedOrderId === order.id
                            ? null
                            : order.id
                        )
                      }
                    >
                      {expandedOrderId === order.id
                        ? "Скрыть"
                        : "Показать"}
                    </button>
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={6} style={styles.itemsCell}>
                      <div style={styles.itemsBox}>
                        <h4 style={styles.itemsTitle}>
                          Состав заказа
                        </h4>

                        {order.items.map((item) => (
                          <div key={item.id} style={styles.itemRow}>
                            <span>
                              {item.productName} × {item.count}
                            </span>

                            <span>
                              {item.totalPrice} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending":
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };

    case "confirmed":
      return {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      };

    case "paid":
      return {
        backgroundColor: "#ede9fe",
        color: "#5b21b6",
      };

    case "preparing":
      return {
        backgroundColor: "#fde68a",
        color: "#92400e",
      };

    case "ready":
      return {
        backgroundColor: "#bfdbfe",
        color: "#1d4ed8",
      };

    case "completed":
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };

    case "cancelled":
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };

    case "rejected":
      return {
        backgroundColor: "#fecaca",
        color: "#7f1d1d",
      };

    case "notPickedUp":
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      };

    default:
      return {};
  }
};

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: "32px",
    color: "#442D25",
    fontWeight: 700,
    marginBottom: "24px",
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
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
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
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
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },

  itemsCell: {
    backgroundColor: "#faf7f5",
    padding: "16px",
  },

  itemsBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  itemsTitle: {
    marginBottom: "8px",
    color: "#442D25",
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px dashed #ddd",
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

  commentInput: {
    width: "180px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
};