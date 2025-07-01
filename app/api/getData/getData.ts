type ArtistImage = {
	url: string;
	height: number;
	width: number;
};

export type Album = {
	id: string;
	name: string;
	images: AlbumImage;
	artists: { id: string; name: string }[];
	release_date: string;
	total_tracks: number;
	external_urls: { spotify: string };
};

export type Artist = {
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	};
	genres: string[];
	href: string;
	id: string;
	images: ArtistImage[];
	name: string;
	popularity: number;
	type: string; // could be "artist"
	uri: string;
};

export type AlbumImage = {
	url: string;
	height: number;
	width: number;
}[];

export type Track = {
	album: Album;
	id: string;
	name: string;
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_urls: {
		spotify: string;
	};
	href: string;
	is_local: boolean;
	preview_url: string | null;
	track_number: number;
	type: "track";
	uri: string;
	available_markets: string[];
	artists: Artist[]; // Assuming you've already defined an Artist type elsewhere
};

export async function albumApi(token: string | null) {
	try {
		const res = await fetch(
			"https://api.spotify.com/v1/browse/new-releases?limit=50",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const data = await res.json();
		const list: (Album | string)[] = data.albums.items as Album[];
		list.push(data.albums.items.map((item: Album) => item.artists[0].id));
		return list;
	} catch (err) {
		console.error("Failed to fetch Album:", err);
	}
}

export async function artistApi(token: string | null, ids: string[]) {
	if (!token || ids.length === 0) return;
	try {
		const idsParam = ids.slice(0, 50).join(",");
		const res = await fetch(
			`https://api.spotify.com/v1/artists?ids=${idsParam}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const data = await res.json();
		const sorted = data.artists.sort(
			(a: Artist, b: Artist) => b.popularity - a.popularity
		);
		return sorted;
	} catch (err) {
		console.error("Failed to fetch Artists:", err);
	}
}

export async function tracksApi(token: string | null, album: Album) {
	try {
		const res = await fetch(
			`https://api.spotify.com/v1/albums/${album.id}/tracks`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const data = await res.json();
		return data.items || []; // ✅ fallback to empty array
	} catch (err) {
		console.error("Failed to fetch tracks:", err);
		return [];
	}
}

export async function albumTracksApi(token: string | null, id: string) {
	if (!token) return null;

	try {
		const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			console.error("Spotify track fetch failed:", res.status);
			return null;
		}

		const track = await res.json();
		return track; // ✅ no `.items`
	} catch (err) {
		console.error("Failed to fetch track:", err);
		return null;
	}
}
