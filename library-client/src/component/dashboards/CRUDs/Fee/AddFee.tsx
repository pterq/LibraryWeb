import React from "react";
import ReturnButton from "../../../common/ReturnButton";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const AddFee = ({ onBack, onReload, showMessage }: Props) => {
	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<ReturnButton onBack={onBack} onReload={onReload} />

				<h2>Add Fee to Users Loan</h2>
			</div>
			<div>select loan</div>
		</div>
	);
};

export default AddFee;
