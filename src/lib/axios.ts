import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
	baseURL: "http://localhost:8080/admin/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// === Thêm accessToken vào mỗi request ===
api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

interface FailedRequest {
	resolve: (token: string | null) => void;
	reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token);
	});
	failedQueue = [];
};

// === Interceptor xử lý lỗi 401 ===
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};

		if (
			!error.response ||
			error.response.status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes("/oauth/token/refresh")
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		if (isRefreshing) {
			// Nếu đang refresh thì đợi token mới
			return new Promise<string | null>((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			}).then((token) => {
				if (token && originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${token}`;
				}
				return api(originalRequest);
			});
		}

		isRefreshing = true;

		try {
			const res = await axios.post<{ accessToken: string }>(
				"http://localhost/api/oauth/token/refresh",
				{},
				{ withCredentials: true }
			);

			const newAccessToken = res.data.accessToken;
			localStorage.setItem("accessToken", newAccessToken);
			api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

			processQueue(null, newAccessToken);
			return api(originalRequest);
		} catch (err) {
			processQueue(err);
			localStorage.removeItem("accessToken");
			window.location.href = "/login";
			return Promise.reject(err);
		} finally {
			isRefreshing = false;
		}
	}
);

export default api;
