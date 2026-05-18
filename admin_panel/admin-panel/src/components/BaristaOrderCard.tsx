import { useState } from "react";
import { updateOrderStatus, type OrderStatus } from "../api/ordersApi";

interface Props {
  order: any;
  onUpdated?: () => void;
}

const statusLabels: Record<string, string> = {
  pending: "Ожидает подтверждения",
  confirmed: "Подтвержден",
  preparing: "Готовится",
  ready: "Готов к выдаче",
  completed: "Завершен",
  cancelled: "Отменен",
};

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  ready: "#10b981",
  completed: "#6b7280",
  cancelled: "#ef4444",
};

export default function BaristaOrderCard({ order, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const changeStatus = async (status: OrderStatus, baristaComment?: string) => {
    try {
      setLoading(true);

      await updateOrderStatus(order.id, {
        status,
        baristaComment,
      });

      onUpdated?.();
    } catch (e) {
      console.log(e);
      alert("Ошибка обновления статуса");
    } finally {
      setLoading(false);
    }
  };

  const renderAction = () => {
    switch (order.status) {
      case "pending":
        return (
          <>
            <button onClick={() => changeStatus("confirmed")} style={btn}>
              Подтвердить
            </button>

            <button
              onClick={() => setShowCancel(true)}
              style={{ ...btn, background: "#ef4444" }}
            >
              Отклонить
            </button>
          </>
        );

      case "confirmed":
        return (
          <button onClick={() => changeStatus("preparing")} style={btn}>
            Начать готовить
          </button>
        );

      case "preparing":
        return (
          <button onClick={() => changeStatus("ready")} style={btn}>
            Готов к выдаче
          </button>
        );

      case "ready":
        return (
          <button onClick={() => changeStatus("completed")} style={btn}>
            Завершить
          </button>
        );

      default:
        return null;
    }
  };

  const formatTimeOnly = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
  };

  const pickupTime = formatTimeOnly(order.pickupTime);

  return (
    <div style={card}>
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>
            Заказ #{order.orderNumber}
          </h2>

          <div style={{ fontSize: 13, color: "#666" }}>
            Создан: {new Date(order.createdAt).toLocaleString()}
          </div>

        </div>

        <div
          style={{
            background: statusColors[order.status],
            color: "white",
            padding: "6px 12px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {statusLabels[order.status]}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h4 style={{ marginBottom: 10 }}>Состав заказа</h4>

        {order.items.map((item: any) => (
          <div key={item.id} style={itemRow}>
            <div>
              <div style={{ fontWeight: 600 }}>
                {item.productName}
              </div>

              <div style={{ fontSize: 13, color: "#666" }}>
                x{item.count}
              </div>

              {parseModifiers(item.selectedModifiers).length > 0 && (
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                    {parseModifiers(item.selectedModifiers)
                    .map((m: any) =>
                        m.price > 0
                        ? `${m.name} (+${m.price} ₽)`
                        : m.name
                    )
                    .join(", ")}
                </div>
              )}
            </div>

            <div style={{ fontWeight: 600 }}>
              {item.totalPrice} ₽
            </div>
          </div>
        ))}

        {order.clientComment && (
            <div
                style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 14,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                }}
            >
                <div
                style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#9a3412",
                    marginBottom: 4,
                }}
                >
                Комментарий клиента
                </div>

                <div style={{ fontSize: 14, color: "#7c2d12" }}>
                {order.clientComment}
                </div>
            </div>
        )}

      </div>
      
      {order.bonusUsed > 0 && (
        <div
            style={{
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 14,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            }}
        >
            <div
            style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#166534",
            }}
            >
            Использованы бонусы
            </div>

            <div
            style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#166534",
            }}
            >
            -{order.bonusUsed}
            </div>
        </div>
        )}

      <div style={total}>
        <span>Итого</span>
        <span>{order.totalPrice} ₽</span>
      </div>

      <div
        style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 18,
            background: "#f5f1ee",
            border: "1px solid #e7ddd7",
            textAlign: "center",
        }}
        >
        <div
            style={{
            fontSize: 12,
            letterSpacing: 1,
            color: "#8b6b61",
            fontWeight: 700,
            }}
        >
            ВРЕМЯ ВЫДАЧИ
        </div>

        <div
            style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#442D25",
            marginTop: 4,
            lineHeight: 1,
            }}
        >
            {pickupTime}
        </div>
    </div>

      <div style={{ marginTop: 16 }}>{renderAction()}</div>

      {showCancel && (
        <div style={{ marginTop: 16 }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Причина отклонения"
            style={textarea}
          />

          <button
            onClick={() => changeStatus("cancelled", comment)}
            style={{ ...btn, background: "#ef4444", marginTop: 8 }}
          >
            Подтвердить отказ
          </button>
        </div>
      )}
    </div>
  );
}

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 20,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const itemRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

const total: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 700,
  fontSize: 18,
  color: "#442D25",
};

const btn: React.CSSProperties = {
  background: "#442D25",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: 12,
  marginRight: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: 80,
  padding: 10,
  borderRadius: 12,
  border: "1px solid #ddd",
  resize: "vertical",
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