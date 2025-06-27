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
		// console.log(localStorage.getItem("expires_at"));
		checkToken();
	}, []);

	if (loading) return <p>Loading...</p>;

	return token ? <Home token={token} /> : <LoginPage />;
}
