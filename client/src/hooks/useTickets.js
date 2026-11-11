import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";

export function useTickets(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const [state, setState] = useState({
    items: [],
    pagination: null,
    error: null,
    query: null,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const requestParams = Object.fromEntries(new URLSearchParams(query));

    ticketService
      .list(path, requestParams)
      .then((response) => {
        if (!cancelled) {
          setState({
            items: response.data?.items || [],
            pagination: response.data?.pagination || null,
            error: null,
            query,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            error,
            query,
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, query, refreshKey]);

  return {
    items: state.items,
    pagination: state.pagination,
    loading: state.query !== query,
    error: state.query === query ? state.error : null,
    refresh: () => setRefreshKey((key) => key + 1),
  };
}
