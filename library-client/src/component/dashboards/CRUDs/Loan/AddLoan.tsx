import React from "react";
import ReturnButton from "../../../common/ReturnButton";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const AddLoan = ({ onBack, onReload, showMessage }: Props) => {
	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<ReturnButton onBack={onBack} onReload={onReload} />

				<h2>Loan Data</h2>
			</div>
			<div>user select</div>
			<div>book select</div>
			<div>add book to users cart</div>
		</div>
	);
};

export default AddLoan;
