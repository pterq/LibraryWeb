import { Link } from "react-router-dom";

const NavBar = () => {
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
								<Link className="nav-link active" aria-current="page" to={"/"}>
									Home
								</Link>
							</li>
							<li className="nav-item">
								<Link
									className="nav-link active"
									aria-current="page"
									to={"/about-us"}
								>
									About us
								</Link>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto mb-2 mb-lg-0 ">
							<li className="nav-item">
								<Link
									className="nav-link active"
									aria-current="page"
									to={"/my-books"}
								>
									My Books
								</Link>
							</li>
							<li className="nav-item">
								<Link
									className="nav-link active"
									aria-current="page"
									to={"/my-fees"}
								>
									My Fees
								</Link>
							</li>
							<li className="nav-item">
								<Link
									className="nav-link active"
									aria-current="page"
									to={"/shopping-cart"}
								>
									Shopping Cart
								</Link>
							</li>

							<li className="nav-item dropdown">
								<Link
									className="nav-link dropdown-toggle"
									to={"#"}
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Profile
								</Link>
								<ul className="dropdown-menu">
									<li>
										<Link className="dropdown-item" to={"/settings"}>
											Settings
										</Link>
									</li>
									<li>
										<Link className="dropdown-item" to={"/another-action"}>
											Another action
										</Link>
									</li>
									<li>
										<hr className="dropdown-divider" />
									</li>
									<li>
										<Link className="dropdown-item" to={"/logout"}>
											Logout
										</Link>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default NavBar;
