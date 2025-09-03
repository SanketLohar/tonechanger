// src/api/emailAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // ✅ remove /rewrite

const emailAPI = {
  // Rewrite Email (JSON body)
  rewriteEmail: (text, tone) => {
    const token = localStorage.getItem("authToken"); // FIXED KEY

    return axios.post(
      `${API_BASE_URL}/rewrite`,
      { text, tone },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  },

  // Upload File (Multipart/Form-Data)
  uploadFile: (file, tone) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tone", tone);

    const token = localStorage.getItem("authToken"); // FIXED KEY

    return axios.post(`${API_BASE_URL}/rewrite/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
};

export default emailAPI;
