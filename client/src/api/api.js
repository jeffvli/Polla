import axios from "axios";
import useSWR from "swr";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const fetcher = (url) => api.get(url).then((res) => res.data);

export const usePolls = (refreshInterval) => {
  const { data, error } = useSWR(`/polls/`, fetcher, {
    refreshInterval: refreshInterval,
    revalidateOnFocus: false,
  });

  return {
    polls: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const usePoll = (slug) => {
  const { data, error } = useSWR(`/polls/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    poll: data,
    isLoading: !error && !data,
    isError: error,
  };
};
