import React from "react";
import SearchBar from "../component/common/SearchBar";
import BookGrid from "../component/page-components/books/BookGrid";

const BooksMainPage = () => {
	const [search, setSearch] = React.useState("");

	return (
		<div>
			<h2 className="d-flex justify-content-center mb-3">Search Books</h2>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search Book by title" />

			<BookGrid search={search} />
		</div>
	);
};

export default BooksMainPage;
