import React, { useEffect, useState } from "react";
import Card from "../../components/card";
import { albumApi } from "@/app/api/getData/getData";
import { Album } from "@/app/api/getData/getData";

interface Props {
	isMenuOpen: boolean;
	token: string | null;
}

const Albums = ({ isMenuOpen, token }: Props) => {
	const [albums, setAlbums] = useState<(Album | string)[]>([]);

	useEffect(() => {
		if (!token) return;

		const fetchAlbums = async () => {
			const albums = await albumApi(token);
			if (albums) setAlbums(albums); // optional check if albumApi could return undefined
		};

		if (token) fetchAlbums();
	}, [token]);

	return (
		<>
			<div className="albums flex flex-col flex-wrap gap-4">
				<span className="secondaryFont text-3xl font-medium">
					Latest Albums
				</span>
				<div className="primaryFont grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 justify-between">
					{(albums as Album[]).slice(0, 10).map((album) => (
						<Card key={album.id} album={album} isMenuOpen={isMenuOpen} />
					))}
				</div>
			</div>
		</>
	);
};

export default Albums;
