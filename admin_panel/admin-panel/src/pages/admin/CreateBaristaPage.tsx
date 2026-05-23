import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBarista } from "../../api/usersApi";
import BaristaForm from "../../components/BaristaForm";

export default function CreateBaristaPage() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    data: any
  ) => {
    try {
      setLoading(true);

      await createBarista(data);

      alert("Бариста создан");

      navigate("/admin/baristas");
    } catch (error) {
      console.error(error);

      alert("Ошибка создания");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaristaForm
      title="Создание сотрудника"
      submitText="Создать"
      loading={loading}
      showPassword
      passwordRequired
      onSubmit={handleSubmit}
    />
  );
}