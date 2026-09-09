import React from "react";
import type { BookType } from "../../../../types/DbTypes";

import BOOK_PLACEHOLDER_IMAGE from "../../../../assets/book-placeholder.jpg";
import { useAuth } from "../../../../context/AuthContext";

const BookDataCard = ({ bookData }: { bookData: BookType | null }) => {
	const { role } = useAuth();

	return (
		<div className="card mb-3">
			<div className="card-body">
				<div className="d-flex gap-3">
					<img
						src={bookData?.imageUrl || BOOK_PLACEHOLDER_IMAGE}
						alt={bookData?.title || "Book cover"}
						style={{ width: "120px", height: "180px", objectFit: "cover" }}
						className="border rounded"
						onError={(e) => (e.currentTarget.src = BOOK_PLACEHOLDER_IMAGE)}
					/>

					<div>
						<h5>
							<strong>Book information</strong>
						</h5>

						{role !== "USER" && (
							<p>
								<strong>Book ID:</strong> {bookData?.id}
							</p>
						)}

						<div className="row">
							<div className="col-md-6">
								<p>
									<strong>Title:</strong> {bookData?.title || "-"}
								</p>
								<p>
									<strong>Authors:</strong>{" "}
									{bookData?.authors
										?.map((author) => author.firstName + " " + author.lastName)
										.join(", ") || "-"}
								</p>
								<p>
									<strong>Published year:</strong>{" "}
									{bookData?.publishedYear || "-"}
								</p>
							</div>

							<div className="col-md-6">
								<p>
									<strong>ISBN:</strong> {bookData?.isbn || "-"}
								</p>
								<p>
									<strong>Categories:</strong>{" "}
									{bookData?.categories
										?.map((category) => category.name)
										.join(", ") || "-"}
								</p>
							</div>
						</div>

						<p>
							<strong>Description:</strong>
						</p>
						<p>{bookData?.description || "-"}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookDataCard;
