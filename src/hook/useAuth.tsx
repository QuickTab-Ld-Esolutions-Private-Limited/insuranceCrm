import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      return null;
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    checkAuth();

    try {
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

      if (!data.success) {
        logoutUser();
        return null;
      }

      const accessToken = data?.data?.accessToken;

      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    } catch (error) {
      console.error(error);

      logoutUser();

      return null;
    }
  };

  return {
    accessToken,
    refreshToken,
    refreshAccessToken,
    checkAuth,
  };
};

export default useAuth;
