import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Adiciona o token de autenticação em todas as requisições
// Verifica se o token está presente no localStorage e adiciona ao header Authorization
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta as respostas para lidar com erros de autenticação
// Se o token for inválido ou expirado, remove o token do localStorage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove o token inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      console.error("Sessão expirada ou token inválido");
    }
    return Promise.reject(error);
  }
);

export default api;
