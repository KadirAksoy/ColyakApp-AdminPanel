import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./apiUrls";
import { AuthContext } from "../auth/AuthContext";

export const useTokenReset = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: API.BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        (error.response.status === 601 || error.response.status === 602) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        if (error.response.status === 601) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await axios.post(
              `${API.BASE_URL}${API.USERS.REFRESH_TOKEN}`,
              { refreshToken }
            );
            console.log(refreshToken);
            console.log(res);
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem("token", newToken);
            // Headers kontrolünü ekleyin
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
            return axiosInstance(originalRequest);
          } catch (error) {
            console.error(error);
            navigate("/");
          }
        } else if (error.response.status === 602) {
          navigate("/");
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
