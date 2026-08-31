import React from "react";
import SearchBar from "../common/SearchBar";
import BookGrid from "./BookGrid";

const BooksPage = () => {
	const [search, setSearch] = React.useState("");
	return (
		<div>
			<h2 className="d-flex justify-content-center mb-3">Books search and add to cart</h2>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search Book by title" />

			<BookGrid />
		</div>
	);
};

export default BooksPage;
