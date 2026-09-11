import React from "react";

import type { LoanResponse } from "../../types/DbTypes";
import UserDataCard from "./UserDataCard";
import BookDataCard from "../dashboards/CRUDs/Book/BookDataCard";
import LoanActionButtons from "../dashboards/CRUDs/Loan/LoanActionButtons";
import { useAuth } from "../../context/AuthContext";

function formatDateTime(dateRaw?: string | number | Date | null): string {
	if (!dateRaw) return "-";

	return new Date(dateRaw).toLocaleString("pl-PL", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

const LoanDataCard = ({ loanData }: { loanData: LoanResponse | null }) => {
	console.log("Loan data:", loanData);

	const userRole = useAuth().role;

	return (
		<div>
			<div>
				<table className="table table-striped table-hover shadow">
					<thead>
						<tr>
							{userRole !== "USER" && (
								<>
									<th>User ID</th>
									<th>Loan ID</th>
								</>
							)}

							<th>Inventory Code</th>
							<th>Reservation Date</th>
							<th>Expire Date</th>
							<th>Loan Date ▲</th>
							<th>Due Date</th>
							<th>Return Date</th>
							<th>Status</th>
							{userRole !== "USER" && <th>Actions</th>}
						</tr>
					</thead>
					<tbody>
						<tr>
							{userRole !== "USER" && (
								<>
									<td>{loanData?.user?.id || "-"}</td>
									<td>{loanData?.loanId || "-"}</td>
								</>
							)}
							<td>{loanData?.copy.inventoryCode || "-"}</td>
							<td>{formatDateTime(loanData?.reservedAt)}</td>
							<td>{formatDateTime(loanData?.expiresAt)}</td>
							<td>{formatDateTime(loanData?.loanDate)}</td>
							<td>{formatDateTime(loanData?.dueDate)}</td>
							<td>{formatDateTime(loanData?.returnDate)}</td>
							<td>{loanData?.status || "-"}</td>
							{userRole !== "USER" && (
								<td className="text-nowrap">
									<LoanActionButtons
										loanId={loanData?.loanId ?? null}
										loanStatus={loanData?.status}
									/>
								</td>
							)}
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<UserDataCard userData={loanData?.user || null} />
			</div>
			<div>
				<BookDataCard bookData={loanData?.copy.book || null} />
			</div>
		</div>
	);
};

export default LoanDataCard;
