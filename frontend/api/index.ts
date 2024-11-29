import { LoginDto, RegisterDto } from "@/Dtos/authDtos";
import Cookies from "js-cookie";
import { env } from "process";
import { toast } from "sonner";

const api_endpoint = env.API_ENDPOINT || "https://localhost:7060/api/";
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = Cookies.get("refreshToken");
  const jwtToken = Cookies.get("jwtToken");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${api_endpoint}Auth/refreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwtToken, refreshToken }),
    });

    if (response.ok) {
      const { result } = await response.json();
      Cookies.set("jwtToken", result.jwtToken, {
        expires: 7,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", result.refreshToken, {
        expires: 7,
        sameSite: "strict",
      });
      console.log("✅ Token refreshed successfully 👾");
      return true;
    } else {
      const data = await response.json();
      console.log(data);
      console.error("🔴 Error refreshing token:", data.message);
      toast.error("🔴 Error refreshing token " + data.message);
      return false;
    }
  } catch (error) {
    console.error("🔴 Error refreshing token:", error);
    toast.error("🔴 Error refreshing token " + error);
    return false;
  }
}

export async function getData(url: string) {
  let accessToken = Cookies.get("jwtToken");
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let response = await fetch(`${api_endpoint}${url}`, options);

  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Retry the original request with the new access token
      accessToken = Cookies.get("jwtToken");
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(`${api_endpoint}${url}`, options);
    }
  }
  const data = await response.json();
  return data;
}

async function authData(method: string, opts: { body: any }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  };

  if (opts.body) {
    options.body = opts.body;
  }

  const response = fetch(`https://localhost:7060/api/Auth/${method}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return response;
}

export async function registerUser(data: RegisterDto) {
  const options = {
    body: JSON.stringify({ ...data, roles: ["user"] }),
  };

  const response = await authData("register", options);

  return response;
}

export async function loginUser(data: LoginDto) {
  const options = {
    body: JSON.stringify(data),
  };

  const response = await authData("login", options);

  return response;
}

export async function putData(url: string, opts: { body: any }) {
  let accessToken = Cookies.get("jwtToken");
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: "",
  };
  if (opts.body !== undefined || opts.body !== null)
    options.body = JSON.stringify(opts.body);
  let response = await fetch(`${api_endpoint}${url}`, options);

  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Retry the original request with the new access token
      accessToken = Cookies.get("jwtToken");
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(`${api_endpoint}${url}`, options);
    }
  }

  const data = await response.json();
  return data;
}

export async function deleteData(url: string) {
  let accessToken = Cookies.get("jwtToken");
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  let response = await fetch(`${api_endpoint}${url}`, options);

  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Retry the original request with the new access token
      accessToken = Cookies.get("jwtToken");
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(`${api_endpoint}${url}`, options);
    }
  }

  const data = await response.json();
  return data;
}

export async function postData(
  url: string,
  opts: { body: any },
  contentType?: string
) {
  let accessToken = Cookies.get("jwtToken");
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Only set Content-Type if it's not multipart/form-data
  if (contentType && contentType !== "multipart/form-data") {
    headers["Content-Type"] = contentType;
  }

  const options: RequestInit = {
    method: "POST",
    headers,
    body: opts.body,
  };

  let response = await fetch(`${api_endpoint}${url}`, options);

  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Retry the original request with the new access token
      accessToken = Cookies.get("jwtToken");
      headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(`${api_endpoint}${url}`, options);
    }
  }

  const data = await response.json();
  return data;
}
