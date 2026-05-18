import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserById,
  updateBarista,
} from "../../api/usersApi";

import BaristaForm from "../../components/BaristaForm";

export default function EditBaristaPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [barista, setBarista] =
    useState<any>(null);

  useEffect(() => {
    if (!id) return;

    loadBarista();
  }, [id]);

  const loadBarista = async () => {
    try {
      const data = await getUserById(
        Number(id)
      );

      setBarista(data);
    } catch (error) {
      console.error(error);

      alert("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await updateBarista(
        Number(id),
        data
      );

      alert("Сотрудник обновлен");

      navigate("/admin/baristas");
    } catch (error) {
      console.error(error);

      alert("Ошибка сохранения");
    }
  };

  if (loading || !barista) {
    return <div>Loading...</div>;
  }

  return (
    <BaristaForm
      title="Редактирование сотрудника"
      submitText="Сохранить"
      initialData={barista}
      onSubmit={handleSubmit}
    />
  );
}