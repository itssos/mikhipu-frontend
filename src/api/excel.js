
import axiosInstance from "./axiosInstance";

export const uploadExcel = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await axiosInstance.post("/api/students/upload/excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress,
    });
    return response.data; // Se espera { successCount, failureCount, errors: [...] }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al subir el archivo Excel.");
  }
};
