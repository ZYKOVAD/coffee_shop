import { useRef } from "react";
import { useEffect, useState } from "react";

import { getOrders } from "../../api/ordersApi";

import type { Order } from "../../types/order";
import BaristaOrderCard from "../../components/BaristaOrderCard";

import { toast } from "react-toastify";

type Tab =
  | "new"
  | "active"
  | "today";

export default function BaristaOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [tab, setTab] = useState<Tab>("active");

    const previousOrderIds = useRef<number[]>([]);

    useEffect(() => {

        loadOrders();
        const interval = window.setInterval(
            loadOrders,
            10000
        );
        return () => {
            clearInterval(interval);
        };
    }, []);

    const loadOrders = async () => {
        try {
            console.log("Polling orders...");

            const data = await getOrders();

            const sorted = [...data].sort(
            (a, b) =>
                new Date(a.pickupTime).getTime() -
                new Date(b.pickupTime).getTime()
            );

            const currentIds = sorted.map(
            (o) => o.id
            );

            const newOrders = sorted.filter(
            (o) =>
                !previousOrderIds.current.includes(o.id) &&
                o.status === "pending"
            );

            if (
                previousOrderIds.current.length > 0 &&
                newOrders.length > 0
            ){
                playNotificationSound();

                toast.info(
                    `Новый заказ #${newOrders[0].orderNumber}`,
                    {
                    autoClose: false,
                    closeOnClick: true,
                    draggable: true,
                    }
                );
            }

            const pendingCount = sorted.filter(
            (o) => o.status === "pending"
            ).length;

            if (pendingCount > 0) {
            document.title = `(${pendingCount}) Новые заказы`;
            } else {
            document.title =
                "Casa Busano Barista";
            }

            previousOrderIds.current = currentIds;

            setOrders(sorted);
        } catch (error) {
            console.error(error);
        }
    };

    const playNotificationSound = () => {
        const audio = new Audio(
            "/notification.wav"
        );

        audio.volume = 1;

        audio.play().catch((e) => {
            console.log(
            "Sound play error",
            e
            );
        });
    };

    const newCount = orders.filter(
        (o) => o.status === "pending"
        ).length;

    const activeCount = orders.filter((o) =>
        [
            "confirmed",
            "preparing",
            "ready",
        ].includes(o.status)
        ).length;

    const todayCount = orders.filter((o) => {
        const today = new Date();

        const orderDate = new Date(
            o.createdAt
        );

        return (
            orderDate.toDateString() ===
            today.toDateString()
        );
    }).length;

  const filteredOrders = orders
    .filter((o) => {
        switch (tab) {
        case "new":
            return o.status === "pending";

        case "active":
            return [
            "confirmed",
            "preparing",
            "ready",
            ].includes(o.status);

        case "today":
            const today = new Date();

            const orderDate = new Date(
            o.createdAt
            );

            return (
            orderDate.toDateString() ===
            today.toDateString()
            );

        default:
            return true;
        }
    })
    .sort(
        (a, b) =>
        new Date(a.pickupTime).getTime() -
        new Date(b.pickupTime).getTime()
    );

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Заказы
        </h1>

        <div style={styles.tabs}>
           <button
                style={{
                    ...styles.tab,
                    ...(tab === "new"
                    ? styles.activeTab
                    : {}),
                }}
                onClick={() =>
                    setTab("new")
                }
                >
                Новые ({newCount})
            </button>

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
                Активные ({activeCount})
            </button>

            <button
                style={{
                    ...styles.tab,
                    ...(tab === "today"
                    ? styles.activeTab
                    : {}),
                }}
                onClick={() =>
                    setTab("today")
                }
                >
                Все за сегодня ({todayCount})
            </button>
        </div>
      </div>

      <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            alignItems: "start",
        }}
        >
        {filteredOrders.length === 0 ? (
            <div style={styles.empty}>
                {tab === "new" &&
                "Нет новых заказов"}

                {tab === "active" &&
                "Нет активных заказов"}

                {tab === "today" &&
                "Сегодня заказов не было"}
            </div>
            ) : (
            filteredOrders.map((order: any) => (
                <BaristaOrderCard
                key={order.id}
                order={order}
                onUpdated={loadOrders}
                />
            ))
            )}
        </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> =
  {
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

    list: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },

    card: {
      backgroundColor: "white",
      borderRadius: "18px",
      padding: "20px",
      boxShadow:
        "0 4px 16px rgba(0,0,0,0.06)",
    },

    top: {
      display: "flex",
      justifyContent:
        "space-between",
      marginBottom: "16px",
    },

    orderNumber: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#442D25",
    },

    user: {
      color: "#777",
    },

    status: {
      padding: "8px 12px",
      borderRadius: "999px",
      backgroundColor: "#f3ede9",
      color: "#442D25",
      fontWeight: 600,
      height: "fit-content",
    },

    items: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    item: {
      display: "flex",
      justifyContent:
        "space-between",
      paddingBottom: "8px",
      borderBottom: "1px solid #eee",
    },

    footer: {
      display: "flex",
      justifyContent:
        "space-between",
      marginTop: "16px",
      fontWeight: 700,
      color: "#442D25",
    },

    empty: {
        gridColumn: "1 / -1",
        background: "white",
        borderRadius: 20,
        padding: 40,
        textAlign: "center",
        color: "#777",
        fontSize: 18,
        fontWeight: 600,
        boxShadow:"0 4px 14px rgba(0,0,0,0.05)",
    },
  };