import { NavLink, Route, Routes } from "react-router-dom";
import CollectionPage from "./pages/CollectionPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import "./App.css";

function App() {
	return (
		<>
			<header className="app-nav">
				<NavLink
					to="/"
					end
					className={({ isActive }) => (isActive ? "active-link" : "")}
				>
					Strona glowna
				</NavLink>
				<NavLink
					to="/kolekcja"
					className={({ isActive }) => (isActive ? "active-link" : "")}
				>
					Kolekcja
				</NavLink>
				<NavLink
					to="/nowa"
					className={({ isActive }) => (isActive ? "active-link" : "")}
				>
					Nazwa
				</NavLink>
			</header>

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/kolekcja" element={<CollectionPage />} />
				<Route path="/nowa" element={<CollectionPage />} />
			</Routes>
		</>
	);
}

export default App;
