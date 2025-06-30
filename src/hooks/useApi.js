import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * A custom hook to handle API calls, loading, and error states.
 * @param {Function} apiFunc - The API function to call from your services.
 * @returns {object} { data, error, loading, request, setData }
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (...args) => {
      const lastArg = args.length > 0 ? args[args.length - 1] : undefined;
      const options =
        typeof lastArg === "object" && lastArg !== null ? lastArg : {};

      // FIX: Destructure the new keepPreviousData option
      const { showToastOnError = true, keepPreviousData = false } = options;

      setLoading(true);
      setError(null);

      // FIX: Only clear data if keepPreviousData is false
      if (!keepPreviousData) {
        setData(null);
      }

      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.";

        setError(errorMessage);

        if (showToastOnError) {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, error, loading, request, setData };
};
