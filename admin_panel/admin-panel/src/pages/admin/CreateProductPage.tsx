import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../api/productsApi";

import ProductForm from "../../components/ProductForm";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      await createProduct(data);

      alert("Товар создан");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      alert("Ошибка создания");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      title="Добавление товара"
      submitText="Создать товар"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}