interface SearchBarProps {
	search: string;
	setSearch: (value: string) => void;
	placeholder?: string;
}

const SearchBar = ({ search, setSearch, placeholder }: SearchBarProps) => {
	return (
		<div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-50 m-1">
			<form
				className="d-flex col-sm-10"
				role="search"
				onSubmit={(e) => e.preventDefault()} // ← blokada ENTER
			>
				<input
					className="form-control me-2 shadow"
					type="search"
					placeholder={placeholder || "Search bar"}
					aria-label="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") e.preventDefault(); // ← dodatkowa blokada
					}}
				/>
			</form>
			{/*
			<div className="col-sm-10 mb-4 text-center">
				{search ? `Searching for: ${search}` : "No search query"}
			</div>
			*/}
		</div>
	);
};

export default SearchBar;
