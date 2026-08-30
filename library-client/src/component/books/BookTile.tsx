import { Link } from "react-router-dom";

import type { Book } from "../../types/Book";

interface BookTileProps {
	book: Book;
}

const BookTile: React.FC<BookTileProps> = ({ book }) => {
	return (
		<div>
			<div
				className="card text-center w-100 border-0 bg-white"
				style={{ transition: "0.2s", cursor: "pointer" }}
				onMouseEnter={(e) => e.currentTarget.classList.add("bg-primary-subtle")}
				onMouseLeave={(e) => e.currentTarget.classList.remove("bg-primary-subtle")}
			>
				<img
					src={book.imageUrl ?? "/src/assets/book-placeholder.jpg"}
					className="card-img-top w-50 mx-auto d-block mt-3"
					alt={book.title}
				/>

				<div className="card-body">
					<h5 className="card-title">{book.title}</h5>

					<p className="card-text">
						{book.description.length > 60
							? book.description.slice(0, 60) + "..."
							: book.description}
					</p>

					<Link to={`/book/${book.id}`} className="btn btn-primary">
						More details
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BookTile;
