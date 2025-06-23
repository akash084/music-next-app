// "use client";

// import { useEffect, useState } from "react";
// import Home from "./home";
// import { useSearchParams } from "next/navigation";

// import LoginPage from "./auth/login/page";

// export default function MainPage() {
// 	const [token, setToken] = useState<string | null>(null);
// 	const [refreshToken, setRefreshToken] = useState<string | null>(null);
// 	const [loading, setLoading] = useState(true);

// 	const params = useSearchParams();

// 	useEffect(() => {
// 		const refreshAccessToken = async () => {
// 			const refreshToken = localStorage.getItem("refresh_token");
// 			if (!refreshToken) {
// 				console.error("No refresh token found.");
// 				return;
// 			}

// 			const body = new URLSearchParams({
// 				grant_type: "refresh_token",
// 				refresh_token: refreshToken,
// 				client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
// 			});

// 			try {
// 				const res = await fetch("https://accounts.spotify.com/api/token", {
// 					method: "POST",
// 					headers: {
// 						"Content-Type": "application/x-www-form-urlencoded",
// 					},
// 					body,
// 				});

// 				const data = await res.json();

// 				if (res.ok && data.access_token) {
// 					localStorage.setItem("access_token", data.access_token);
// 					setToken(data.access_token);
// 					console.log(data.access_token);

// 					if (data.refresh_token) {
// 						localStorage.setItem("refresh_token", data.refresh_token);
// 						console.log(data.refresh_token);
// 					}

// 					const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
// 					localStorage.setItem("expires_at", expiresAt.toString());
// 					console.log(localStorage.getItem("expires_at"));

// 					console.log("Access token refreshed");
// 				} else {
// 					console.error("Token refresh error:", data);
// 				}
// 			} catch (error) {
// 				console.error("Token refresh request failed:", error);
// 			}
// 		};

// 		// if (!token) refreshAccessToken();
// 	}, [params]);

// 	// const refreshAccessToken = async () => {
// 	// 	const refresh_token = localStorage.getItem("refresh_token");
// 	// 	const access_token = localStorage.getItem("access_token");
// 	// 	console.log("Stored access token:", access_token);
// 	// 	console.log("Stored refresh token:", refresh_token);

// 	// 	if (!refresh_token) return;

// 	// 	const res = await fetch("/api/refresh", {
// 	// 		method: "POST",
// 	// 		headers: { "Content-Type": "application/json" },
// 	// 		body: JSON.stringify({ refresh_token }),
// 	// 	});

// 	// 	const data = await res.json();

// 	// 	if (res.ok && data.access_token) {
// 	// 		localStorage.setItem("access_token", data.access_token);
// 	// 		localStorage.setItem("refresh_token", data.refresh_token);
// 	// 		setToken(data.access_token);
// 	// 	}
// 	// };

// 	useEffect(() => {
// 		// setRefreshToken(localStorage.getItem("refresh_token"));
// 		setToken(localStorage.getItem("access_token"));
// 		console.log(localStorage.getItem("expires_at"));
// 		if (token) setLoading(false);
// 	}, [token]);

// 	useEffect(() => {
// 		const accessToken = localStorage.getItem("access_token");
// 		const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");
// 		const now = Math.floor(Date.now() / 1000);

// 		if (accessToken && now < expiresAt) {
// 			console.log("token already expired");
// 			console.log(expiresAt);
// 			// Token is still valid
// 			// setToken(accessToken);
// 		} else {
// 			// Token expired or not present
// 			// refreshAccessToken();
// 			console.log("token not expired");
// 			console.log(expiresAt);
// 		}
// 	}, []);

// 	if (loading) return <p>Loading...</p>;

// 	// return token ? <Home token={token} /> : <LoginPage />;
// 	return token ? <Home token={token} /> : <LoginPage />;
// }

"use client";

import { useEffect, useState } from "react";
import Home from "./home";
import LoginPage from "./auth/login/page";

export default function MainPage() {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// ✅ Refresh the access token using refresh_token
	const refreshAccessToken = async () => {
		const refreshToken = localStorage.getItem("refresh_token");
		if (!refreshToken) return;

		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
		});

		try {
			const res = await fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body,
			});

			const data = await res.json();

			if (res.ok && data.access_token) {
				localStorage.setItem("access_token", data.access_token);
				setToken(data.access_token);

				// Store new refresh token if returned
				if (data.refresh_token) {
					localStorage.setItem("refresh_token", data.refresh_token);
				}

				const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
				localStorage.setItem("expires_at", expiresAt.toString());
			} else {
				console.error("Failed to refresh access token:", data);
			}
		} catch (err) {
			console.error("Refresh token request failed:", err);
		}
	};

	// ✅ On mount: check token validity and refresh if needed
	useEffect(() => {
		const checkToken = async () => {
			const accessToken = localStorage.getItem("access_token");
			const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");
			const now = Math.floor(Date.now() / 1000);

			if (accessToken && now < expiresAt) {
				// Token is still valid
				setToken(accessToken);
			} else if (localStorage.getItem("refresh_token")) {
				// Token expired → try to refresh
				await refreshAccessToken();
			}
			setLoading(false);
		};
		console.log(localStorage.getItem("expires_at"));
		checkToken();
	}, []);

	if (loading) return <p>Loading...</p>;

	return token ? <Home token={token} /> : <LoginPage />;
}
