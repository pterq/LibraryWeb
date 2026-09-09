import React from "react";

import type { LoanResponse } from "../../types/DbTypes";
import UserDataCard from "./UserDataCard";
import BookDataCard from "../dashboards/CRUDs/Book/BookDataCard";
import LoanActionButtons from "../dashboards/CRUDs/Loan/LoanActionButtons";

const LoanDataCard = ({ loanData }: { loanData: LoanResponse | null }) => {
	console.log("Loan data:", loanData);

	return (
		<div>
			<div>
				<table className="table table-striped table-hover shadow">
					<thead>
						<tr>
							<th>Loan ID</th>
							<th>Inventory Code</th>
							<th>Reservation Date</th>
							<th>Expire Date</th>
							<th>Loan Date ▲</th>
							<th>Due Date</th>
							<th>Return Date</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{loanData?.loanId || "-"}</td>
							<td>{loanData?.copy.inventoryCode || "-"}</td>
							<td>
								{loanData?.reservedAt
									? new Date(loanData.reservedAt).toLocaleDateString()
									: "-"}
							</td>
							<td>
								{loanData?.expiresAt
									? new Date(loanData.expiresAt).toLocaleDateString()
									: "-"}
							</td>
							<td>
								{loanData?.loanDate
									? new Date(loanData.loanDate).toLocaleDateString()
									: "-"}
							</td>
							<td>
								{loanData?.dueDate
									? new Date(loanData.dueDate).toLocaleDateString()
									: "-"}
							</td>
							<td>
								{loanData?.returnDate
									? new Date(loanData.returnDate).toLocaleDateString()
									: "-"}
							</td>
							<td>{loanData?.status || "-"}</td>
							<td className="text-nowrap">
								<LoanActionButtons
									loanId={loanData?.loanId ?? null}
									loanStatus={loanData?.status}
								/>
							</td>
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
