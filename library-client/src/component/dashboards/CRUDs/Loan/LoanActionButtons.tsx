import React from "react";
import apiLoans, { setLoanOverdue } from "../../../../api/apiLoans";
import { useAuth } from "../../../../context/AuthContext";

const LoanActionButtons = ({
	loanId,
	loanStatus,
}: {
	loanId: number | null;
	loanStatus?: string;
}) => {
	const { showToast, notifyCartChanged } = useAuth();
	const isReserved = loanStatus === "RESERVED";
	const isActive = loanStatus === "ACTIVE";

	const handleRent = () => {
		if (!isReserved) return;

		console.log(`Loan status: ${loanStatus}`);
		console.log(`Renting loan with ID: ${loanId}`);

		apiLoans
			.setLoanBorrow(loanId!)
			.then(() => {
				showToast("Book rented successfully.");
				notifyCartChanged();
			})
			.catch(() => {
				showToast("Failed to rent book.");
			});
	};

	const handleReturn = () => {
		if (!isActive) return;

		console.log(`Loan status: ${loanStatus}`);
		console.log(`Returning loan with ID: ${loanId}`);

		apiLoans
			.setLoanReturn(loanId!)
			.then(() => {
				showToast("Book returned successfully.");
				notifyCartChanged();
			})
			.catch(() => {
				showToast("Failed to return book.");
			});
	};

	const handleSetOverdue = () => {
		if (!isActive) return;

		console.log(`Loan status: ${loanStatus}`);
		console.log(`Overdue loan with ID: ${loanId} as overdue`);

		apiLoans;
		setLoanOverdue(loanId!)
			.then(() => {
				showToast("Book marked as overdue successfully.");
				notifyCartChanged();
			})
			.catch(() => {
				showToast("Failed to mark book as overdue.");
			});
	};

	const handleRemoveFromCart = () => {
		if (!isReserved) return;
		if (!loanId) return;

		apiLoans
			.deleteLoanById(loanId)
			.then(() => {
				showToast("Book removed from cart.");
				notifyCartChanged();
			})
			.catch(() => {
				showToast("Failed to remove book from cart.");
			});

		console.log(`Loan status: ${loanStatus}`);
		console.log(`Removing from users' cart loan with ID: ${loanId} from cart`);
	};

	return (
		<>
			<button
				className={`btn btn-sm btn-success me-1 ${!isReserved ? "btn-disabled" : ""}`}
				onClick={handleRent}
				disabled={!isReserved}
			>
				Rent
			</button>

			<button
				className={`btn btn-sm btn-warning me-1 ${!isActive ? "btn-disabled" : ""}`}
				onClick={handleReturn}
				disabled={!isActive}
			>
				Return
			</button>

			<button
				className={`btn btn-sm btn-danger me-1 ${!isActive ? "btn-disabled" : ""}`}
				onClick={handleSetOverdue}
				disabled={!isActive}
			>
				Set Overdue
			</button>

			<button
				className={`btn btn-sm btn-info me-1 ${!isReserved ? "btn-disabled" : ""}`}
				onClick={handleRemoveFromCart}
				disabled={!isReserved}
			>
				Remove from Cart
			</button>
		</>
	);
};

export default LoanActionButtons;
