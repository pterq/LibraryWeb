import type { FeeType } from "../../types/DbTypes";

//get fee id from url params
import { useParams } from "react-router-dom";
import { MockData } from "../../types/MockData";

const fees = MockData.mockFees;

const FeeCard = () => {
	const { id } = useParams<{ id: string }>();
	const fee: FeeType | undefined = fees.find((f) => f.id === parseInt(id || "", 10));

	if (!fee) {
		return <div>Fee not found</div>;
	}

	return (
		<div>
			{/*back link*/}
			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Return
			</button>

			<h2>Fee info and payment</h2>
			{/*<p>Fee ID: {fee.id}</p> */}
			<p>Book Title: {fee.loan.bookPhysical.book.title}</p>
			<p>
				Author:{" "}
				{fee.loan.bookPhysical.book.authors.authors
					.map((a) => `${a.firstName} ${a.lastName}`)
					.join(", ")}
			</p>

			<p>Amount: {fee.amount.toFixed(2)} zł</p>
			<p>Status: {fee.status}</p>

			{fee.status === "PAID" && (
				<p>Paid at: {fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : "N/A"}</p>
			)}
			<p>Fee issue date: {new Date(fee.createdAt).toLocaleDateString()}</p>

			{/* Add payment button or form here */}
			{fee.status === "UNPAID" && (
				<div className="d-flex align-items-center">
					<button className="btn btn-primary">Pay Online</button>
					<span className="ms-2">or pay in person at the library</span>
				</div>
			)}
		</div>
	);
};

export default FeeCard;
