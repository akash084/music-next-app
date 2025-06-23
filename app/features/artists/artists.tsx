import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { albumApi, artistApi } from "@/app/api/getData/getData";
import { Artist } from "@/app/api/getData/getData";

interface Props {
	isMenuOpen: boolean;
	token: string | null;
}

const Artists = ({ isMenuOpen, token }: Props) => {
	const [sortedArtists, setSortedArtists] = useState<Artist[]>([]);

	useEffect(() => {
		const fetchArtists = async () => {
			const albums = await albumApi(token);
			if (albums) {
				const ids: string[] = albums.slice(50, 51) as string[];
				const artists = await artistApi(token, ids);
				setSortedArtists(artists);
			}
		};

		if (token) fetchArtists();
	}, [token]);

	return (
		<>
			<div className=" flex flex-col flex-wrap gap-4">
				<span className="secondaryFont text-3xl font-medium">
					Popular Artists
				</span>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{sortedArtists.slice(0, 6).map((artist) => (
						<div
							key={artist.id}
							className="flex flex-col items-center transition-transform transform hover:-translate-y-2">
							<Image
								width={300}
								height={300}
								alt={artist.name}
								src={artist.images[0]?.url || "/fallback.jpg"}
								className={`rounded-full ${
									isMenuOpen ? "w-30 h-30" : "w-32 h-32"
								} object-cover`}
							/>
							<span className="mt-2 font-medium text-sm">{artist.name}</span>
							<span className="opacity-60 text-xs">
								Folowers: {artist.followers.total}
							</span>
						</div>
					))}
				</div>
				<div />
			</div>
		</>
	);
};

export default Artists;
