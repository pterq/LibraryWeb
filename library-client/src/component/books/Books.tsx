import React from "react";
import SearchBar from "../common/SearchBar";
import BookGrid from "./BookGrid";

const Books = () => {
	const [search, setSearch] = React.useState("");
	return (
		<div>
			<h2 className="d-flex justify-content-center mb-3">
				Books search and add to cart
			</h2>

			<SearchBar searchBook={search} setSearchBook={setSearch} />

			<BookGrid />
		</div>
	);
};

export default Books;
