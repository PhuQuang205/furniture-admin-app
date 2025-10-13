import api from "@/lib/axios";
import {useUser} from "@/context/UserContext";

export const login = async (email: string, password: string) => {

  const res = await api.post("/oauth/login", { email, password });

  // Lưu accessToken vào localStorage
  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  // const { user, setUser } = useUser();
  // setUser(res.data.user);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};
