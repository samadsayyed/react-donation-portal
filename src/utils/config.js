import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.PUBLIC_ICHARMS_URL,
    headers: {
      Authorization: `Bearer ${import.meta.env.PUBLIC_ICHARMS_API_KEY}`,
      "Content-Type": "application/json",
    },
  });