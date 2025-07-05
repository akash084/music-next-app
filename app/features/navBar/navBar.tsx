import React from "react";
import { Icon } from "@iconify/react";
import ThemeToggle from "../../utility/themeToggle/themeToggle";

interface Props {
	isMenuOpen: boolean;
}

const NavBar = ({ isMenuOpen }: Props) => {
	return (
		<>
			<div className="nav sticky top-0 z-50 bg-base-100 primaryFont py-2 flex flex-row items-center flex-wrap lg:justify-between justify-center gap-2">
				<div
					className={`flex transition-all ease-in-out ${
						isMenuOpen ? "lg:gap-34" : "lg:gap-18"
					} gap-2 flex-row items-center self-center sm:justify-between`}>
					<Icon
						className="colorPrimary hover:cursor-pointer"
						icon="bi:apple-music"
						width="35"
						height="35"
					/>
					<div className="lg:w-96 lg:h-9 lg:flex gap-2 border-2 border-solid rounded-md hidden">
						<button>
							<Icon
								className="icon mx-2 hover:cursor-pointer"
								icon="tabler:search"
							/>
						</button>

						<input
							type="text"
							className="w-full text-sm outline-none primaryFont"
							placeholder="Search your Favourite Song, Artist or Albums"
						/>
					</div>
					<div className="w-65 h-9 flex gap-2 border-2 border-solid rounded-md lg:hidden">
						<button>
							<Icon
								className="icon mx-2 hover:cursor-pointer"
								icon="tabler:search"
							/>
						</button>

						<input
							type="text"
							className="w-full text-sm outline-none primaryFont"
							placeholder="Search your Favourite Song..."
						/>
					</div>
				</div>
				<div className="navRight flex flex-row text-sm primaryFont items-center gap-2">
					<div className="dropdown hover:cursor-pointer">
						<div
							tabIndex={0}
							role="button"
							className="collapse-title profile flex px-2 py-1.5 gap-1 rounded-3xl border-2 borderPrimary">
							<Icon
								// className="opacity-80"
								icon="solar:user-bold"
								width="18"
								height="18"
							/>
							<span className="opacity-80">Guest</span>
							<Icon
								// className="opacity-80"
								icon="oui:arrow-down"
								width="18"
								height="18"
							/>
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content  bg-base-100 rounded-box z-1 w-25 p-2 shadow-sm text-center">
							<li>
								<a>Login</a>
							</li>
						</ul>
					</div>
					<ThemeToggle />
					<ul className="visible lg:hidden flex flex-row gap-2 items-center text-sm font-medium overflow-hidden transition-all ease-in-out ring-2 rounded-md p-1">
						<a>
							<li className="flex gap-2 items-center">
								<Icon icon="mingcute:playlist-fill" width="20" height="20" />
							</li>
						</a>
						<a href="">
							<li className="flex gap-2 items-center">
								<Icon
									icon="material-symbols:artist-rounded"
									width="20"
									height="20"
								/>
							</li>
						</a>
						<a href="">
							<li className="flex gap-2 items-center">
								<Icon icon="icon-park-solid:like" width="16" height="16" />
							</li>
						</a>
						<a href="">
							<li className="flex gap-2 items-center">
								<Icon
									icon="material-symbols:bookmark-rounded"
									width="18"
									height="18"
								/>
							</li>
						</a>
						<a href="">
							<li className="flex gap-2 items-center">
								<Icon icon="mdi:magic" width="18" height="18" />
							</li>
						</a>
					</ul>
				</div>
			</div>
		</>
	);
};

export default NavBar;
