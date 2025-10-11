import api from "@/lib/axios";

export const login = async (email: string, password: string) => {
  const res = await api.post("/oauth/login", { email, password });

  // Lưu accessToken vào localStorage
  localStorage.setItem("accessToken", res.data.accessToken);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};
