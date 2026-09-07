import type { LoanResponse } from "../../types/DbTypes";
import { useParams } from "react-router-dom";
import ImageFrame from "../common/ImageFrame";

const loans: LoanResponse[] = [];

const UserBookCard = () => {
	const { id } = useParams<{ id: string }>();
	const loan: LoanResponse | undefined = loans.find((f) => f.id === parseInt(id || "", 10));

	if (!loan) {
		return <div>Loan not found</div>;
	}

	return (
		<div className="container mt-4 border p-4">
			<h2>Book Card info for Loan from UserBookPage</h2>

			{/*back link*/}
			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Return
			</button>

			<div className="row mt-4 g-4 align-items-start">
				<div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center">
					<ImageFrame
						imageUrl={loan.copy.book.imageUrl ?? null}
						alt={loan.copy.book.title}
					/>
				</div>

				<div className="col-12 col-md-8 col-lg-9">
					<p>
						<strong>Book Title:</strong> {loan.copy.book.title}
					</p>
					<p>
						<strong>Authors:</strong>{" "}
						{loan.copy.book.authors
							.map(
								(a: { firstName: string; lastName: string }) =>
									`${a.firstName} ${a.lastName}`,
							)
							.join(", ")}
					</p>
					<p>
						<strong>Loan Date:</strong> {new Date(loan.loanDate).toLocaleDateString()}
					</p>
					<p>
						<strong>Return Date:</strong>{" "}
						{new Date(loan.returnDate).toLocaleDateString()}
					</p>
					<p>
						<strong>Status:</strong> {loan.status}
					</p>
					<p>
						<strong>User info:</strong> {loan.user.firstName} {loan.user.lastName}
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserBookCard;
