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
    async (requestData, options = {}) => {
      const { showToastOnError = true } = options;

      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(requestData);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.msg ||
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

  // --- Implementation: Expose setData so components can perform optimistic updates ---
  return { data, error, loading, request, setData };
};
