"use client";
import { Icon } from "@iconify/react";
import styles from "../menu/menu.module.css";

interface MenueProps {
	open: boolean;
	toggleOpen: () => void;
}

const Menue = ({ open, toggleOpen }: MenueProps) => {
	return (
		<>
			<div className="menue primaryFont flex flex-col gap-1">
				<a>
					<div className="border-2 rounded-md w-8" onClick={toggleOpen}>
						<Icon
							className="justify-self-center"
							icon="material-symbols:menu-rounded"
							width="24"
							height="24"
						/>
					</div>
				</a>
				<ul
					className={`flex flex-col items-start text-sm font-medium overflow-hidden transition-all ease-in-out ${
						open ? "max-w-[150px]" : "max-w-6"
					}`}>
					<a>
						<li className="flex gap-2 items-center">
							<Icon icon="mingcute:playlist-fill" width="20" height="20" />
							<span>Playlist</span>
						</li>
					</a>
					<a href="">
						<li className="flex gap-2 items-center">
							<Icon
								icon="material-symbols:artist-rounded"
								width="20"
								height="20"
							/>
							<span>Artists</span>
						</li>
					</a>
					<a href="">
						<li className="flex gap-2 items-center">
							<Icon icon="icon-park-solid:like" width="16" height="16" />
							<span>Likes</span>
						</li>
					</a>
					<a href="">
						<li className="flex gap-2 items-center">
							<Icon
								icon="material-symbols:bookmark-rounded"
								width="18"
								height="18"
							/>
							<span>Bookmarks</span>
						</li>
					</a>
					<a href="">
						<li className="flex gap-2 items-center">
							<Icon icon="mdi:magic" width="18" height="18" />
							<span>Surprise</span>
						</li>
					</a>
				</ul>
			</div>
		</>
	);
};

export default Menue;
