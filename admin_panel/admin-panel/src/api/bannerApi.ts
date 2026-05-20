import { api } from "./api";

export const getBanners = async () => {
  const res = await api.get("/Banners");
  return res.data;
};

export const createBanner = async (formData: FormData) => {
  const res = await api.post(
    "/Banners",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updateBanner = async (
  id: number,
  data: any
) => {
  await api.put(`/Banners/${id}`, data);
};

export const deleteBanner = async (
  id: number
) => {
  await api.delete(`/Banners/${id}`);
};

export const uploadBannerImage = async (
  id: number,
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post(
    `/Banners/${id}/image`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};