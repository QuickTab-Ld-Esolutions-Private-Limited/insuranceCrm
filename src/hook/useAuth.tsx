import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { IApiResponse } from "../interface/crmInterface";

const useAuth = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    toast.error("Session expired, please login again");

    setTimeout(() => navigate("/", { replace: true }), 1000);
  };

  const checkAuth = () => {
    if (!refreshToken) {
      logoutUser();
    }

    return null;
  };

  const refreshAccessToken = async (
    url: string,
    options: RequestInit = {},
  ): Promise<IApiResponse | null> => {
    const refreshToken = localStorage.getItem("refreshToken");

    // no refresh token
    checkAuth();

    try {
      // generate new access token
      const response = await fetch(
        "https://insurancecrm.quicktabhub.com/token/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      const data = await response.json();

      // refresh failed
      if (!data.success) {
        logoutUser();
        return null;
      }

      // new token
      const newAccessToken = data?.data?.accessToken;

      localStorage.setItem("accessToken", newAccessToken);

      // retry original request
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      return await retryResponse.json();
    } catch (error) {
      console.error(error);

      logoutUser();

      return null;
    }
  };

  return {
    accessToken,
    refreshToken,
    logoutUser,
    refreshAccessToken,
    checkAuth,
  };
};

export default useAuth;
