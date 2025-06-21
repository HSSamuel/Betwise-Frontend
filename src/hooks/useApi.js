import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * A custom hook to handle API calls, loading, and error states.
 * @param {Function} apiFunc - The API function to call from your services.
 * @returns {object} { data, error, loading, request }
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        let errorMessage;
        // FIX: Corrected typo "resgister" to "register"
        if (err.response && err.response.status === 401) {
          errorMessage = "Kindly register or login first.";
        } else {
          errorMessage =
            err.response?.data?.errors?.[0]?.msg ||
            err.response?.data?.msg ||
            err.message ||
            "An unexpected error occurred.";
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, error, loading, request };
};
