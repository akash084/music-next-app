import { Icon } from "@iconify/react";
import { useSpotifyPlayer } from "@/app/hooks/useSpotifyPlayer";
import { useState, useEffect } from "react";
import { albumApi, albumTracksApi, tracksApi } from "@/app/api/getData/getData";
import { Album } from "@/app/api/getData/getData";
import { Track } from "@/app/api/getData/getData";
import Image from "next/image";

interface Props {
	token: string | null;
}

const Player = ({ token }: Props) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPlayed, setHasPlayed] = useState(false); // 👈 Added flag
	const [currentTrack, setCurrentTrack] = useState<Track | null>(null); // 👈 Added flag
	const [tracks, setTracks] = useState<Track[]>([]);

	const { player, deviceId } = useSpotifyPlayer(token);

	useEffect(() => {
		if (!player) return;

		const handlePlayerStateChange = (state: Spotify.PlaybackState | null) => {
			if (!state || !state.track_window?.current_track) return;

			// Update currentTrack from player state
			const track = state.track_window.current_track;
			setCurrentTrack(track as unknown as Track); // Cast if needed
		};

		player.addListener("player_state_changed", handlePlayerStateChange);

		return () => {
			player.removeListener("player_state_changed", handlePlayerStateChange);
		};
	}, [player]);

	const playTrack = async () => {
		if (!deviceId || !token || tracks.length === 0) return;

		// Transfer playback
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

		// Play tracks
		await fetch(
			`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uris: tracks.map((track) => track.uri),
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

	const playNext = async () => {
		await player?.nextTrack();
		setIsPlaying(true);
	};

	const playPrevious = async () => {
		await player?.previousTrack();
		setIsPlaying(true);
	};

	useEffect(() => {
		const fetchTracks = async () => {
			const albums = await albumApi(token);
			if (albums) {
				const album = albums.slice(0, 1)[0];
				const tracksList = await tracksApi(token, album as Album);
				setTracks(tracksList);
				console.log(tracksList);
			}
		};

		if (token) fetchTracks();
	}, [token]);

	// const fetchCurrentTrack = async () => {
	// 	if (!token) return;

	// 	const res = await fetch(
	// 		"https://api.spotify.com/v1/me/player/currently-playing",
	// 		{
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		}
	// 	);

	// 	if (res.ok) {
	// 		const data = await res.json();
	// 		const track = data?.item;
	// 		if (track) {
	// 			setCurrentTrack(track);
	// 		}
	// 	} else {
	// 		console.warn("Failed to fetch currently playing track:", res.status);
	// 	}
	// };

	useEffect(() => {
		if (!hasPlayed && token && tracks.length > 0) {
			const fetchTrackDetails = async () => {
				const firstTrackId = tracks[0]?.id;
				if (!firstTrackId) return;

				console.log(firstTrackId); // ✅ Safe now

				const track = await albumTracksApi(token, firstTrackId);

				console.log(track);
				setCurrentTrack(track ?? null);
			};

			fetchTrackDetails();
		}
	}, [hasPlayed, token, tracks]);

	return (
		<div className="sticky bottom-0 z-[61] bg-base-100 border-t-2">
			<div className="content mx-[40px] lg:mx-[120px] grid grid-cols-2 lg:grid-cols-3  gap-2 items-center py-2">
				{/* Track Info */}
				<div className="track-container flex flex-row items-center gap-2">
					<div className="track-image w-10 h-10 rounded-sm">
						<Image
							className="rounded-sm object-cover"
							height={100}
							width={100}
							alt={currentTrack?.name || "Track cover"}
							src={currentTrack?.album?.images?.[2]?.url || "/fallback.jpg"}
						/>
					</div>
					<div className="track-details flex flex-col text-sm">
						<span className="font-medium truncate lg:w-40">
							{currentTrack?.name}
						</span>
						<span className="text-xs opacity-60">
							{currentTrack?.artists?.[0]?.name || "Unknown Artist"}
						</span>
					</div>
					<div className="hidden lg:block">
						<Icon icon="qlementine-icons:menu-dots-16" width="20" height="20" />
					</div>
				</div>

				{/* Player Controls */}
				<div className="player-container flex flex-col lg:items-center lg:pb-3 items-end">
					<div className="player-action flex items-center gap-3 p-2">
						<div className="hidden lg:block">
							<Icon icon="mingcute:shuffle-line" width="18" height="18" />
						</div>
						<button onClick={playPrevious}>
							<Icon icon="fluent:previous-20-filled" width="18" height="18" />
						</button>
						<button onClick={togglePlay} disabled={!tracks.length}>
							<div className="ring-1 p-1.5 rounded-full">
								<Icon
									icon={isPlaying ? "line-md:pause" : "line-md:play-filled"}
									width="18"
									height="18"
								/>
							</div>
						</button>
						<button onClick={playNext}>
							<Icon icon="fluent:next-20-filled" width="18" height="18" />
						</button>
						<div className="hidden lg:block">
							<Icon icon="ic:round-loop" width="18" height="18" />
						</div>
					</div>
					<div className="player-progress-bar w-75 h-1 bg-gray-300 rounded-full self-center hidden md:block" />
				</div>

				{/* Track Options */}
				<div className="tracks-option-container justify-self-end lg:flex items-center gap-2 hidden">
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
