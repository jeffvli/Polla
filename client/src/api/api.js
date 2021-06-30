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
      console.log(err);
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
  const { data, error } = useSWR(
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

export const usePollResults = (slug) => {
  const { data, error } = useSWR(`/polls/${slug}/results`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 1000,
  });

  return {
    pollResults: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUser = (token) => {
  const { data, error } = useSWR(["/auth/user", token], authFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    user: { isAuthenticated: !error, data: data },
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProfile = (username, token) => {
  const { data, error } = useSWR(
    [`/users/profile/?username=${username}`, token],
    authFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    profile: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProfilePolls = (username, search, skip, take, token) => {
  const { data, error } = useSWR(
    [
      `/polls/?username=${username}&search=${search}&take=${take}&skip=${skip}`,
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
