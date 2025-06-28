import { Icon } from "@iconify/react";
import { useSpotifyPlayer } from "@/app/hooks/useSpotifyPlayer";
import { useState } from "react";

interface Props {
	token: string | null;
}

const Player = ({ token }: Props) => {
	const { player, deviceId } = useSpotifyPlayer(token);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPlayed, setHasPlayed] = useState(false); // 👈 Added flag

	const playTrack = async () => {
		if (!deviceId || !token) return;

		// Transfer playback to this device
		await fetch("https://api.spotify.com/v1/me/player", {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				device_ids: [deviceId],
				play: false,
			}),
		});

		// Start playback
		await fetch(
			`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uris: ["spotify:track:6usohdchdzW9oML7VC4Uhk"], // You can make this dynamic later
				}),
			}
		);
	};

	const togglePlay = async () => {
		if (!player) return;

		if (!hasPlayed) {
			await playTrack(); // 👈 First click starts playback
			setHasPlayed(true);
			setIsPlaying(true);
		} else {
			await player.togglePlay(); // 👈 After that toggle
			setIsPlaying((prev) => !prev);
		}
	};

	return (
		<div className="sticky bottom-0 z-[61] bg-base-100 border-t-2">
			<div className="content flex flex-row justify-between gap-2 items-center px-4 py-2">
				{/* Track Info */}
				<div className="track-container flex items-center gap-2">
					<div className="track-image w-10 h-10 bg-black rounded-sm border" />
					<div className="track-details flex flex-col text-sm">
						<span className="font-medium">Lose Control</span>
						<span className="text-xs opacity-60">Teddy Swims</span>
					</div>
					<Icon icon="qlementine-icons:menu-dots-16" width="20" height="20" />
				</div>

				{/* Player Controls */}
				<div className="player-container flex flex-col items-center pb-3">
					<div className="player-action flex items-center gap-3 p-2">
						<Icon icon="mingcute:shuffle-line" width="18" height="18" />
						<Icon icon="fluent:previous-20-filled" width="18" height="18" />
						<button onClick={togglePlay}>
							<div className="ring-1 p-1.5 rounded-full">
								<Icon
									icon={isPlaying ? "line-md:pause" : "line-md:play-filled"}
									width="18"
									height="18"
								/>
							</div>
						</button>
						<Icon icon="fluent:next-20-filled" width="18" height="18" />
						<Icon icon="ic:round-loop" width="18" height="18" />
					</div>
					<div className="player-progress-bar w-75 h-1 bg-gray-300 rounded-full self-center" />
				</div>

				{/* Track Options */}
				<div className="tracks-option-container flex items-center gap-2">
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
