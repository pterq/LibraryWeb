import React from "react";
import type { LoanResponse } from "../../../../types/DbTypes";
import { useEffect, useState } from "react";
import LoanDataCard from "../../../common/LoanDataCard";
import apiLoans from "../../../../api/apiLoans";
import ReturnButton from "../../../common/ReturnButton";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const ViewLoan = ({ id, onBack, onReload, showMessage }: Props) => {
	const [data, setData] = useState<LoanResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			console.log("Loading user data for ID:", id);

			try {
				const loan = await apiLoans.getLoanByLoanId(id);
				if (!active) return;

				console.log("Fetching loan data:", loan);

				setData(loan);
			} catch {
				if (active) setError("Failed to load loan.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id]);

	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<ReturnButton onBack={onBack} onReload={onReload} />

				<h2>Loan Data</h2>
			</div>
			<div>
				<LoanDataCard loanData={data} />
			</div>
		</div>
	);
};

export default ViewLoan;
