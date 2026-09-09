import React from "react";
import LoanItemsTable from "../../Tables/LoanItemsTable";
import ReturnButton from "../../../common/ReturnButton";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const ViewLoanUserCount = ({ id, onBack, onReload, showMessage }: Props) => {
	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<ReturnButton onBack={onBack} onReload={onReload} />

				<h2>Users Loan Counts</h2>
			</div>

			<div>
				<LoanItemsTable mode="admin" userId={id} />
			</div>
		</div>
	);
};

export default ViewLoanUserCount;
