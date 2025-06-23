import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { refresh_token } = await req.json();
		console.log("Refreshing with token:", refresh_token);
		console.log("Client ID:", process.env.NEXT_PUBLIC_CLIENT_ID);

		if (!refresh_token) {
			return NextResponse.json(
				{ error: "Missing refresh_token" },
				{ status: 400 }
			);
		}

		const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token,
			client_id: clientId,
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
			return NextResponse.json({ access_token: data.access_token });
		} else {
			console.error("Spotify refresh failed:", data);
			return NextResponse.json({ error: data }, { status: 400 });
		}
	} catch (error) {
		return NextResponse.json({ error: "Invalid request" }, { status: 500 });
	}
}
