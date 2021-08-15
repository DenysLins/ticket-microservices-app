import axios from "axios";

const axiosBuilder = ({ req }) => {
  return axios.create({
    baseURL: `http://${process.env.AUTH_URL}:${process.env.AUTH_PORT}`,
    headers: req.headers,
  });
};
export default axiosBuilder;
