// hooks/useSpotifyPlayer.ts
import { useEffect, useState } from "react";

export function useSpotifyPlayer(token: string | null) {
	const [player, setPlayer] = useState<Spotify.Player | null>(null);
	const [deviceId, setDeviceId] = useState<string | null>(null);

	useEffect(() => {
		if (!token || typeof window === "undefined") return;

		// Prevent reloading the SDK if it's already in the DOM
		if (!document.getElementById("spotify-player")) {
			const script = document.createElement("script");
			script.id = "spotify-player";
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);
		}

		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new Spotify.Player({
				name: "My Web Playback",
				getOAuthToken: (cb) => cb(token),
				volume: 0.5,
			});

			player.addListener("ready", ({ device_id }) => {
				console.log("Player ready with device ID", device_id);
				setDeviceId(device_id);
				transferPlayback(device_id, token);
			});

			player.addListener("initialization_error", ({ message }) =>
				console.error("Init error", message)
			);
			player.addListener("authentication_error", ({ message }) =>
				console.error("Auth error", message)
			);
			player.addListener("account_error", ({ message }) =>
				console.error("Account error", message)
			);

			player.connect().then((success) => {
				if (success) setPlayer(player);
			});
		};
	}, [token]);

	return { player, deviceId };
}

const transferPlayback = async (deviceId: string, token: string) => {
	await fetch("https://api.spotify.com/v1/me/player", {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			device_ids: [deviceId],
			play: false,
		}),
	});
};
