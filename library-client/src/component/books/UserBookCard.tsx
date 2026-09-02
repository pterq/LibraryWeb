import React from "react";

import { MockData } from "../../types/MockData";
import type { LoanType } from "../../types/DbTypes";
import { useParams } from "react-router-dom";

const loans = MockData.mockLoans;

const UserBookCard = () => {
	const { id } = useParams<{ id: string }>();
	const loan: LoanType | undefined = loans.find((f) => f.id === parseInt(id || "", 10));

	if (!loan) {
		return <div>Loan not found</div>;
	}

	return (
		<div>
			<h2>Book Card info for Loan from UserBookPage</h2>

			{/*back link*/}
			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Return
			</button>

			{/*Display loan information here */}
			<div className="row mt-4 g-4 align-items-start">
				<div className="col-12 col-md-4 col-lg-3">
					<img
						src={
							loan.bookPhysical.book.coverImageUrl ??
							"/src/assets/book-placeholder.jpg"
						}
						className="img-fluid rounded shadow-sm"
						alt={loan.bookPhysical.book.title}
					/>
				</div>

				<div className="col-12 col-md-8 col-lg-9">
					<p>Book Title: {loan.bookPhysical.book.title}</p>
					<p>
						Author:{" "}
						{loan.bookPhysical.book.authors.authors
							.map(
								(a: { firstName: string; lastName: string }) =>
									`${a.firstName} ${a.lastName}`,
							)
							.join(", ")}
					</p>
					<p>Loan Date: {new Date(loan.loanDate).toLocaleDateString()}</p>
					<p>Return Date: {new Date(loan.returnDate).toLocaleDateString()}</p>
					<p>Status: {loan.status}</p>
					<p>
						User info: {loan.user.firstName} {loan.user.lastName}
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserBookCard;
