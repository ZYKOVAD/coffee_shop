import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { createCategory } from "../../api/categoriesApi";

import CategoryForm from "../../components/CategoryForm";

export default function CreateCategoryPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      await createCategory({
        name: data.name,
      });

      alert("Категория создана");

      navigate("/admin/categories");
    } catch (error) {
      console.error(error);

      alert("Ошибка создания");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryForm
      title="Добавление категории"
      submitText="Создать категорию"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}