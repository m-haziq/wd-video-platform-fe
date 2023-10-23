import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const baseURL: string | undefined = process.env.REACT_APP_API_URL;
console.log("env", process.env);
const axiosInstance: AxiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
);

export default axiosInstance;
