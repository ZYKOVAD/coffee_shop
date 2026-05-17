import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCategoryById,
  updateCategory,
} from "../../api/categoriesApi";

import CategoryForm from "../../components/CategoryForm";

import type { Category } from "../../types/category";

export default function EditCategoryPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [category, setCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    if (!id) return;

    loadCategory();
  }, [id]);

  const loadCategory = async () => {
    try {
      const data =
        await getCategoryById(Number(id));

      setCategory(data);
    } catch (error) {
      console.error(error);

      alert("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await updateCategory(Number(id), {
        name: data.name,
        isActive: data.isActive,
      });

      alert("Категория обновлена");

      navigate("/admin/categories");
    } catch (error) {
      console.error(error);

      alert("Ошибка сохранения");
    }
  };

  if (loading || !category) {
    return <div>Loading...</div>;
  }

  return (
    <CategoryForm
      title="Редактирование категории"
      submitText="Сохранить"
      initialData={category}
      showIsActive
      onSubmit={handleSubmit}
    />
  );
}