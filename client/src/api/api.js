import axios from "axios";
import useSWR from "swr";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const refreshAuthLogic = async (failedRequest) => {
  await axios
    .post(`${process.env.REACT_APP_API_URL}/auth/token`, {
      refreshToken: localStorage.getItem("refreshToken"),
    })
    .then((tokenRefreshResponse) => {
      localStorage.setItem("token", tokenRefreshResponse.data.token);
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + tokenRefreshResponse.data.token;
      return Promise.resolve();
    })
    .catch((err) => {
      //console.log(err);
    });
};

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: localStorage.getItem("token")
    ? {
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    : null,
});

createAuthRefreshInterceptor(api, refreshAuthLogic);

export const fetcher = (url) => api.get(url).then((res) => res.data);
export const authFetcher = async (url, token) => {
  const headers = token ? { Authorization: "Bearer " + token } : void 0;

  const response = await api.get(url, {
    headers: headers,
  });

  const data = await response.data;

  return data;
};

export const usePolls = () => {
  const { data, error } = useSWR("/polls/", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    polls: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const usePollAuth = (slug, sessionId, token) => {
  const { data, mutate, error } = useSWR(
    [`/polls/${slug}/?sessionId=${sessionId}`, token],
    authFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    poll: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
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

export const usePollResults = (slug, autoRefresh) => {
  const { data, error } = useSWR(`/polls/${slug}/results`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: autoRefresh ? 1000 : 0,
  });

  return {
    pollResults: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUser = (token) => {
  const { data, mutate, error } = useSWR(
    token ? ["/auth/user", token] : null,
    authFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useProfile = (username, token) => {
  const { data, error } = useSWR(
    [`/users/profile/?username=${username}`, token],
    authFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    profile: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProfilePolls = (
  username,
  search,
  skip,
  take,
  sortBy,
  order,
  token
) => {
  const { data, error } = useSWR(
    [
      `/polls/?username=${username}&search=${search}&take=${take}&skip=${skip}&sortBy=${sortBy}&order=${order}`,
      token,
    ],
    authFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    polls: data,
    isLoading: !error && !data,
    isError: error,
  };
};
