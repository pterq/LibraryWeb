import "./CollectionPage.css";

function CollectionPage() {
	const books = [
		{
			title: "Wladca Pierscieni",
			author: "J.R.R. Tolkien",
			genre: "Fantasy",
			available: true,
		},
		{
			title: "Duma i Uprzedzenie",
			author: "Jane Austen",
			genre: "Klasyka",
			available: false,
		},
		{
			title: "1984",
			author: "George Orwell",
			genre: "Dystopia",
			available: true,
		},
	];

	return (
		<section className="collection-page">
			<div className="collection-header">
				<h1>Kolekcja biblioteki</h1>
				<p>
					Ta podstrona prezentuje przykladowe pozycje. Mozesz rozbudowac ja o
					wyszukiwarke, filtry i polaczenie z API backendu.
				</p>
			</div>

			<div className="collection-grid">
				{books.map((book) => (
					<article key={book.title} className="book-card">
						<h2>{book.title}</h2>
						<p>Autor: {book.author}</p>
						<p>Gatunek: {book.genre}</p>
						<span
							className={
								book.available ? "status available" : "status unavailable"
							}
						>
							{book.available ? "Dostepna" : "Niedostepna"}
						</span>
					</article>
				))}
			</div>
		</section>
	);
}

export default CollectionPage;
