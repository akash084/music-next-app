import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Album, albumApi, Track, tracksApi } from "../../api/getData/getData";

interface Props {
	isMenuOpen: boolean;
	token: string | null;
}

const Tracks = ({ isMenuOpen, token }: Props) => {
	const [albums, setAlbums] = useState<Album[]>([]);
	const [tracks, setTracks] = useState<Track[]>([]);

	useEffect(() => {
		const fetchTracks = async () => {
			const albums = await albumApi(token);
			setAlbums(albums as Album[]);
			if (albums) {
				const album = albums.slice(0, 1)[0];
				const tracksList = await tracksApi(token, album as Album);
				setTracks(tracksList);
			}
		};

		if (token) fetchTracks();
	}, [token]);

	return (
		<div className="flex flex-col flex-wrap gap-4">
			<span className="secondaryFont text-3xl font-medium">Latest Tracks</span>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{tracks.slice(0, 12).map((track: Track) => (
					<div
						className="flex flex-row gap-2 items-center transition-transform transform hover:-translate-y-1 hover:shadow-lg"
						key={track.id}>
						<Image
							className={`rounded-sm ${
								isMenuOpen ? "w-10 h-10" : "w-10 h-10"
							} object-cover`}
							height={100}
							width={100}
							alt={track.name}
							src={
								albums.slice(0, 1)[0].images[2]?.url || "/fallback.jpg"
							}></Image>
						<div className="primaryFont flex flex-col gap-lg w-55">
							<span className="text-sm font-medium truncate ">
								{track.name}
							</span>
							<span className="opacity-60 text-xs">
								{track.artists[0].name}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Tracks;
