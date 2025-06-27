"use client";

export default function LoginPage() {
	const generateRandomString = (len: number) => {
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const values = crypto.getRandomValues(new Uint8Array(len));
		return values.reduce((acc, x) => acc + possible[x % possible.length], "");
	};

	const sha256 = async (plain: string) => {
		const data = new TextEncoder().encode(plain);
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

		const challenge = await sha256(codeVerifier).then(base64encode);

		const params = new URLSearchParams({
			response_type: "code",
			client_id: clientId,
			scope,
			code_challenge_method: "S256",
			code_challenge: challenge,
			redirect_uri: redirectUri,
		});

		window.location.href = `https://accounts.spotify.com/authorize?${params}`;
	};

	return (
		<button
			onClick={startLogin}
			className="rounded-xl px-4 py-2 bg-green-500 text-white">
			Login with Spotify
		</button>
	);
}
