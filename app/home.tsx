"use client";

import { useState } from "react";
import NavBar from "./features/navBar/navBar";
import Menue from "./features/menu/menu";
import Albums from "./features/albums/albums";
import Artists from "./features/artists/artists";
import Tracks from "./features/tracks/tracks";
import Player from "./features/player/player";

interface Props {
	token: string;
}

export default function Home({ token }: Props) {
	const [menuOpen, setMenuOpen] = useState(false);
	const toggleMenu = () => setMenuOpen((prev) => !prev);

	return (
		<>
			<div className="content lg:mx-[120px] mx-[40px]">
				<NavBar isMenuOpen={menuOpen} />
				<div className="flex gap-20 lg:my-4">
					<div className="h-60 sticky top-18 z-60 bg-base-100 hidden lg:block">
						<Menue open={menuOpen} toggleOpen={toggleMenu} />
					</div>
					<div className="body flex flex-col gap-14 w-full my-10">
						<Albums token={token} isMenuOpen={menuOpen} />
						<Artists token={token} isMenuOpen={menuOpen} />
						<Tracks token={token} isMenuOpen={menuOpen} />
					</div>
				</div>
			</div>
			<Player token={token} />
		</>
	);
}
