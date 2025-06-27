"use client";

export default function LoginPage() {
	const generateRandomString = (length: number) => {
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], "");
	};

	const sha256 = async (plain: string) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(plain);
		return await crypto.subtle.digest("SHA-256", data);
	};

	const base64encode = (input: ArrayBuffer) =>
		btoa(String.fromCharCode(...new Uint8Array(input)))
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");

	const startLogin = async () => {
		const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
		const redirectUri = "http://localhost:3000/auth/callback";
		const scope =
			"user-read-private user-read-email user-read-playback-state streaming";

		const codeVerifier = generateRandomString(64);
		localStorage.setItem("code_verifier", codeVerifier);

		const hashed = await sha256(codeVerifier);
		const challenge = base64encode(hashed);

		const params = new URLSearchParams({
			response_type: "code",
			client_id: clientId,
			scope,
			code_challenge_method: "S256",
			code_challenge: challenge,
			redirect_uri: redirectUri,
			show_dialog: "true", // optional: force re-consent
		});

		window.location.href = `https://accounts.spotify.com/authorize?${params}`;
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<button
				onClick={startLogin}
				className="rounded-xl px-6 py-3 bg-green-500 text-white text-lg font-semibold hover:bg-green-600 transition-all">
				Login with Spotify
			</button>
		</div>
	);
}
