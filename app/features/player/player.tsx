import React, { useEffect } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
// import { getDevices } from "@/app/api/player/player";

interface Props {
	token: string | null;
}

const Player = ({ token }: Props) => {
	useEffect(() => {
		// if (token) console.log(getDevices(token));
		// if (code) console.log(getToken(code));
	}, [token]);
	return (
		<div className="w-fullh-60 sticky bottom-0 z-61 bg-base-100 w-full border-t-2">
			<div className="content flex flex-row justify-between gap-2 items-center">
				<div className="track-container flex flex-row items-center gap-2">
					<div className="track-image w-10 h-10 bg-black border-1 rounded-sm"></div>
					<div className="track-details primaryFont flex flex-col text-sm">
						<span className="track-title font-medium">Lose control</span>
						<span className="track-artist opacity-60 text-xs">Teddy Swims</span>
					</div>
					<Icon icon="qlementine-icons:menu-dots-16" width="20" height="20" />
				</div>

				<div className="player-container pb-3 flex flex-col">
					<div className="player-action flex flex-row justify-center items-center gap-2 p-4 justify-self-center">
						<Icon icon="mingcute:shuffle-line" width="18" height="18" />
						<Icon icon="fluent:previous-20-filled" width="18" height="18" />
						<div className="ring-1 p-1.5 rounded-full w-7.5 justify-self-center">
							<Icon
								icon="line-md:play-filled"
								width="18"
								height="18"
								className="justify-self-center"
							/>
						</div>
						<Icon icon="fluent:next-20-filled" width="18" height="18" />
						<Icon icon="ic:round-loop" width="18" height="18" />
					</div>
					<div className="player-progress-bar w-lg border-2 self-center rounded-full"></div>
				</div>
				<div className="tracks-option-container flex flex-row items-center gap-2">
					<Icon icon="mingcute:volume-fill" width="18" height="18" />
					<Icon icon="icon-park-solid:like" width="16" height="16" />
					<Icon
						icon="material-symbols:bookmark-rounded"
						width="18"
						height="18"
					/>
					<Icon icon="tabler:playlist-add" width="20" height="20" />
				</div>
			</div>
		</div>
	);
};

export default Player;
