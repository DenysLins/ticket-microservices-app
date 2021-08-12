import axios from "axios";
import { useState } from "react";

const useRequest = () => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (url, method, body) => {
    try {
      const response = await axios[method](url, body);
      return response.data;
    } catch (error) {
      setErrors(
        <div>
          {error.response.data.errors.map((err) => (
            <div
              className="alert alert-danger mt-3"
              role="alert"
              key={err.message}
            >
              <span> {err.message}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
