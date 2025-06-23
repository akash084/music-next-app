export async function getDevices(token: string | null) {
	try {
		const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await res.json();
		return data; // ✅ return actual device list or empty array fallback
	} catch (err) {
		console.error("Failed to fetch devices:", err);
		return []; // ⛑️ prevent crash from undefined
	}
}
