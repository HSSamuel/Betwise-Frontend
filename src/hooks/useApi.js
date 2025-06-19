// In: src/hooks/useApi.js

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
    // 1. Accept an optional 'options' object as the second argument.
    async (requestData, options = {}) => {
      // 2. Set default options.
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

        // 3. Only show the toast if the option is true.
        if (showToastOnError) {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, error, loading, request };
};
