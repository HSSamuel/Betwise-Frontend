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
    // Use ...args to allow for multiple arguments to be passed to the apiFunc
    async (...args) => {
      // Get options from the last argument if it's an object, otherwise use default
      const options =
        args.length > 0 && typeof args[args.length - 1] === "object"
          ? args[args.length - 1]
          : {};
      const { showToastOnError = true } = options;

      setLoading(true);
      setError(null);
      try {
        // Pass all arguments to the API function
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.msg ||
          err.response?.data?.message || // Added for more robust error handling
          err.message ||
          "An unexpected error occurred.";

        setError(errorMessage);

        if (showToastOnError) {
          toast.error(errorMessage);
        }
        // It's better not to re-throw the error here,
        // as it might cause unhandled promise rejections in components.
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, error, loading, request, setData };
};
