import { useEffect, useState } from "react";

import {
  getDashboardStats,
  type DashboardStats,
} from "../../api/dashboardApi";

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data =
        await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.error(error);

      alert("Ошибка загрузки dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>Нет данных</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>
        Главная
      </h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            Пользователи
          </h3>

          <p style={styles.value}>
            {stats.usersCount}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            Товары
          </h3>

          <p style={styles.value}>
            {stats.productsCount}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            Категории
          </h3>

          <p style={styles.value}>
            {stats.categoriesCount}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            Заказы
          </h3>

          <p style={styles.value}>
            {stats.ordersCount}
          </p>
        </div>
      </div>

      <h1 style={styles.title}>
        Бонусная система
      </h1>

      <h1 style={styles.title}>
        Популярные товары
      </h1>
      
    </div>
  );
}

const styles: Record<string, React.CSSProperties> =
  {
    title: {
      marginBottom: "28px",
      color: "#442D25",
      fontSize: "32px",
      fontWeight: 700,
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
      padding: "28px",
      boxShadow:
        "0 4px 16px rgba(0,0,0,0.06)",
    },

    cardTitle: {
      marginBottom: "16px",
      color: "#777",
      fontSize: "16px",
    },

    value: {
      fontSize: "42px",
      fontWeight: 700,
      color: "#442D25",
      margin: 0,
    },
  };