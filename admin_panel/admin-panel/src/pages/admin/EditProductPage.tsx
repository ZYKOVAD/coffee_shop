import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProductById,
  updateProduct,
} from "../../api/productsApi";

import ProductForm from "../../components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [product, setProduct] =
    useState<any>(null);

  useEffect(() => {
    if (!id) return;

    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data =
        await getProductById(Number(id));

      setProduct(data);
    } catch (error) {
      console.error(error);

      alert("Ошибка загрузки товара");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await updateProduct(Number(id), data);

      alert("Товар обновлен");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      alert("Ошибка сохранения");
    }
  };

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  return (
    <ProductForm
      title="Редактирование товара"
      submitText="Сохранить"
      initialData={product}
      showIsActive
      onSubmit={handleSubmit}
    />
  );
}