import React from "react";
import ReturnButton from "../../../common/ReturnButton";
import FeeItemsTable from "../../Tables/FeeItemsTable";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const ViewFeeUserCount = ({ id, onBack, onReload, showMessage }: Props) => {
	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<ReturnButton onBack={onBack} onReload={onReload} />

				<h2>Users Fee Counts</h2>
			</div>

			<div>
				<FeeItemsTable mode="admin" userId={id} />
			</div>
		</div>
	);
};

export default ViewFeeUserCount;
