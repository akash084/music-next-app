"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
	const router = useRouter();
	const params = useSearchParams();

	useEffect(() => {
		const fetchToken = async () => {
			const code = params.get("code");
			if (!code) return;

			const codeVerifier = localStorage.getItem("code_verifier");
			if (!codeVerifier) return;

			const body = new URLSearchParams({
				client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
				grant_type: "authorization_code",
				code,
				redirect_uri: "http://localhost:3000/auth/callback",
				code_verifier: codeVerifier,
			});

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
				localStorage.setItem("refresh_token", data.refresh_token);
				const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
				localStorage.setItem("expires_at", expiresAt.toString());
				router.push("/");
			} else {
				console.error("Token exchange error", data);
			}
		};

		fetchToken();
	}, [params, router]);

	return <p>Authorizing with Spotify...</p>;
}
