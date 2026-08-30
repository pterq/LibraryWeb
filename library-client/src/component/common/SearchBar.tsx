interface SerachBarProps {
	searchBook: string;
	setSearchBook: (value: string) => void;
}

const SearchBar = ({ searchBook, setSearchBook }: SerachBarProps) => {
	return (
		<div className="grid">
			<div className="row"></div>
			<div className="d-flex justify-content-center">
				<form className="d-flex col-sm-10 mb-4" role="search">
					<input
						className="form-control me-2 shadow"
						type="search"
						placeholder="Search book by title"
						aria-label="Search"
						value={searchBook}
						onChange={(e) => setSearchBook(e.target.value)}
					/>
					<button
						className="btn btn-outline-success shadow"
						type="submit"
					>
						Search
					</button>
				</form>
			</div>

			<div className="row ">
				<div className="d-flex justify-content-center col-sm-10 mb-4">
					{searchBook
						? `Searching for: ${searchBook}`
						: "No search query"}
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
