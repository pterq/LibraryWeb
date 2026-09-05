import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import { useAuth } from "../../context/AuthContext";
import CartPanel from "../../Pages/CartPanel";

const NavBar = () => {
	const { token, role, logout, hasFees } = useAuth();
	const cartOffcanvasRef = useRef<HTMLDivElement | null>(null);
	const dropdownRef = useRef<HTMLLIElement | null>(null);

	const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

	const openCartOffcanvas = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		if (!cartOffcanvasRef.current) return;

		const offcanvas = Offcanvas.getOrCreateInstance(cartOffcanvasRef.current);
		offcanvas.show();
	};

	const toggleProfileDropdown = () => {
		setProfileDropdownOpen((current) => !current);
	};

	const closeProfileDropdown = () => setProfileDropdownOpen(false);

	const handleLogout = () => {
		logout();
		closeProfileDropdown();
		window.location.replace("/");
	};

	//closed dropdown if clicking outside of it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileDropdownOpen &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setProfileDropdownOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [profileDropdownOpen]);

	return (
		<div>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
				<div className="container-fluid">
					<Link className="navbar-brand" to={"/"}>
						LibraryWeb
					</Link>

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<Link className="nav-link active" to={"/"}>
									Home
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link active" to={"/about-us"}>
									About us
								</Link>
							</li>
						</ul>

						<ul className="navbar-nav ms-auto mb-2 mb-lg-0 ">
							{token && (
								<>
									{role === "ADMIN" && (
										<li className="nav-item">
											<Link className="nav-link active" to={"/admin-panel"}>
												Admin Panel
											</Link>
										</li>
									)}

									{role === "LIBRARIAN" && (
										<li className="nav-item">
											<Link
												className="nav-link active"
												to={"/librarian-panel"}
											>
												Librarian Panel
											</Link>
										</li>
									)}

									{role !== "ADMIN" && role !== "LIBRARIAN" && (
										<>
											<li className="nav-item">
												<Link className="nav-link active" to={"/my-books"}>
													My Books
												</Link>
											</li>

											<li className="nav-item">
												<Link className="nav-link active" to={"/my-fees"}>
													My Fees
													{hasFees && (
														<span className="badge rounded-pill bg-danger ms-2 align-middle">
															1
														</span>
													)}
												</Link>
											</li>

											<li className="nav-item">
												<Link
													className="nav-link active"
													to={"#"}
													role="button"
													aria-controls="globalCartOffcanvas"
													onClick={openCartOffcanvas}
												>
													Shopping Cart
												</Link>
											</li>
										</>
									)}

									{/* 🔥 Dropdown z refem */}
									<li
										className="nav-item dropdown d-flex align-items-center"
										ref={dropdownRef}
									>
										<button
											type="button"
											className="nav-link dropdown-toggle border-0 bg-transparent text-white"
											onClick={toggleProfileDropdown}
											aria-expanded={profileDropdownOpen}
										>
											<i className="bi bi-person-circle text-white me-2"></i>
											Profile
										</button>
										<ul
											className={`dropdown-menu dropdown-menu-end ${
												profileDropdownOpen ? "show" : ""
											}`}
											style={{
												display: profileDropdownOpen ? "block" : "none",
												position: "absolute",
												right: 0,
												top: "100%",
												zIndex: 1000,
											}}
										>
											<li>
												<Link
													className="dropdown-item"
													to={"/settings"}
													onClick={closeProfileDropdown}
												>
													Settings
												</Link>
											</li>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<button
													className="dropdown-item"
													onClick={handleLogout}
												>
													Logout
												</button>
											</li>
										</ul>
									</li>
								</>
							)}

							{!token && (
								<>
									<li className="nav-item">
										<Link className="nav-link active" to={"/login"}>
											Login
										</Link>
									</li>

									<li className="nav-item">
										<Link className="nav-link active" to={"/register"}>
											Register
										</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>

			<div
				className="offcanvas offcanvas-end"
				data-bs-scroll="true"
				tabIndex={-1}
				id="globalCartOffcanvas"
				aria-labelledby="globalCartOffcanvasLabel"
				ref={cartOffcanvasRef}
			>
				<div className="offcanvas-header">
					<h4 className="offcanvas-title" id="globalCartOffcanvasLabel">
						Your Shopping Cart
					</h4>
					<button
						type="button"
						className="btn-close"
						data-bs-dismiss="offcanvas"
						aria-label="Close"
					></button>
				</div>
				<div className="offcanvas-body">
					<CartPanel />
				</div>
				{/* at the bottom of the cart panel */}
				<div className="d-flex justify-content-center m-3">
					<div className="d-flex justify-content-center">Get your books in library</div>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
