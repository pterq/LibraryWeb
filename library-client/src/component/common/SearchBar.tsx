interface SerachBarProps {
	search: string;
	setSearch: (value: string) => void;
	placeholder?: string;
}

const SearchBar = ({ search, setSearch, placeholder }: SerachBarProps) => {
	return (
		<div className="grid">
			<div className="row"></div>
			<div className="d-flex justify-content-center">
				<form className="d-flex col-sm-10 mb-4" role="search">
					<input
						className="form-control me-2 shadow"
						type="search"
						placeholder={placeholder || "Search bar"}
						aria-label="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</form>
			</div>

			<div className="row ">
				<div className="d-flex justify-content-center col-sm-10 mb-4">
					{search ? `Searching for: ${search}` : "No search query"}
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
