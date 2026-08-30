import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
	const { token, logout } = useAuth();

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
							{/* ZALOGOWANY */}

							{token && (
								<>
									<li className="nav-item">
										<Link className="nav-link active" to={"/my-books"}>
											My Books
										</Link>
									</li>

									<li className="nav-item">
										<Link className="nav-link active" to={"/my-fees"}>
											My Fees
										</Link>
									</li>

									<li className="nav-item">
										<Link className="nav-link active" to={"/shopping-cart"}>
											Shopping Cart
										</Link>
									</li>

									<li className="nav-item dropdown d-flex align-items-center">
										<Link
											className="nav-link dropdown-toggle"
											to={"#"}
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<i className="bi bi-person-circle text-white me-2"></i>
											Profile
										</Link>
										<ul className="dropdown-menu">
											<li>
												<Link className="dropdown-item" to={"/settings"}>
													Settings
												</Link>
											</li>
											<li>
												<Link
													className="dropdown-item"
													to={"/another-action"}
												>
													Another action
												</Link>
											</li>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<button className="dropdown-item" onClick={logout}>
													Logout
												</button>
											</li>
										</ul>
									</li>
								</>
							)}

							{/* NIEZALOGOWANY */}
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
		</div>
	);
};

export default NavBar;
