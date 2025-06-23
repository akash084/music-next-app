import React from "react";
import { Album } from "../api/getData/getData";
import Image from "next/image";

interface CardProps {
	album: Album;
	isMenuOpen: boolean;
}

const Card = ({ album, isMenuOpen }: CardProps) => {
	return (
		<div
			className={
				"rounded-lg overflow-hidden hover:shadow-lg Prima transition-transform transform hover:-translate-y-2"
			}>
			<Image
				width={300} // or album.images[0].width
				height={300} // or album.images[0].height
				src={album.images[0]?.url}
				alt={album.name}
				className={`${
					isMenuOpen ? "w-47" : "w-55"
				} transition-all ease-in-out object-cover`}
			/>
			<div className="p-2 flex flex-col text-xs">
				<span className="text-sm font-semibold truncate">{album.name}</span>
				<span className="text-gray-500 truncate">
					{album.artists.map((artist) => artist.name).join(", ")}
				</span>
				<span className="text-xs text-gray-400">{album.release_date}</span>
			</div>
		</div>
	);
};

export default Card;
