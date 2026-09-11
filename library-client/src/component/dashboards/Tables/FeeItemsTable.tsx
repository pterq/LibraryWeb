import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { FeeResponseDTO, FeeStatusType, UserType, LoanResponse } from "../../../types/DbTypes";

import apiFees from "../../../api/apiFees";
import apiUsers from "../../../api/apiUsers";
import apiLoans from "../../../api/apiLoans";

import SearchBar from "../../common/SearchBar";
import TableAlert from "../../common/TableAlert";
import { useAuth } from "../../../context/AuthContext";

import ViewFee from "../../dashboards/CRUDs/Fee/ViewFee";
import AddFee from "../../dashboards/CRUDs/Fee/AddFee";
import DeleteButton from "../admin-components/DeleteButton";
import ViewLoan from "../CRUDs/Loan/ViewLoan";

function formatDateTime(dateRaw?: string | number | Date): string {
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

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "add" }
	| { mode: "loan"; id: number };

const FeeItemsTable = ({
	userId = null,
	mode = "user",
}: {
	userId?: number | null;
	mode?: "user" | "admin";
}) => {
	const selectedUserId = userId ?? null;
	const userRole = useAuth().role ?? "USER";

	const [fees, setFees] = useState<any[]>([]);
	const [users, setUsers] = useState<UserType[]>([]);
	const [loans, setLoans] = useState<LoanResponse[]>([]);
	const [loading, setLoading] = useState(true);

	const { notifyCartChanged } = useAuth();
	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	// ============================
	// Load users & loans first
	// ============================

	useEffect(() => {
		reloadUsers();
		reloadLoans();
	}, [notifyCartChanged]);

	const reloadUsers = async () => {
		try {
			const data = await apiUsers.getUsers();
			setUsers(data);
		} catch (error) {
			console.error("Failed to reload users:", error);
		}
	};

	const reloadLoans = async () => {
		try {
			const data = await apiLoans.getLoans();
			setLoans(data);
		} catch (error) {
			console.error("Failed to reload loans:", error);
		}
	};

	// ============================
	// Load fees AFTER users & loans
	// ============================

	useEffect(() => {
		if (users.length > 0 && loans.length > 0) {
			reloadFees();
		}
	}, [users, loans, mode, selectedUserId]);

	const enrichFees = (fees: FeeResponseDTO[]) => {
		return fees.map((fee) => {
			const user = users.find((u) => u.id === fee.userId) ?? null;
			const loan = loans.find((l) => l.loanId === fee.loanId) ?? null;

			return {
				...fee,
				user,
				loan,
			};
		});
	};

	const reloadFees = async () => {
		try {
			const data = await apiFees.getFees();

			const filtered =
				mode === "admin" ? data : data.filter((fee) => fee.userId === selectedUserId);

			const enriched = enrichFees(filtered);

			setFees(enriched);
			setLoading(false);
		} catch (err) {
			console.error("Error loading fees:", err);
		}
	};

	// ============================
	// Search / Filter / Sort
	// ============================

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FeeStatusType | "ALL">("ALL");
	const statusOptions: FeeStatusType[] = ["PAID", "PENDING", "CANCELLED"];

	const [sortConfig, setSortConfig] = useState<{
		key: keyof FeeResponseDTO | "user" | "loan";
		direction: "asc" | "desc";
	} | null>(null);

	const isFiltered = search !== "" || filter !== "ALL" || sortConfig !== null;

	const requestSort = (key: keyof FeeResponseDTO | "user" | "loan") => {
		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof FeeResponseDTO | "user" | "loan") => {
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const processedFees = useMemo(() => {
		let data = [...fees];

		if (filter !== "ALL") {
			data = data.filter((fee) => fee.status === filter);
		}

		if (search) {
			const lower = search.toLowerCase();

			data = data.filter((fee) => {
				const fullName =
					`${fee.user?.firstName ?? ""} ${fee.user?.lastName ?? ""}`.toLowerCase();
				const bookTitle = fee.loan?.copy?.book?.title?.toLowerCase() ?? "";
				const authors =
					fee.loan?.copy?.book?.authors
						?.map(
							(a: { firstName: string; lastName: string }) =>
								`${a.firstName} ${a.lastName}`,
						)
						.join(" ")
						.toLowerCase() ?? "";

				return (
					fullName.includes(lower) ||
					bookTitle.includes(lower) ||
					authors.includes(lower) ||
					String(fee.id).includes(lower) ||
					String(fee.loan?.loanId).includes(lower)
				);
			});
		}

		if (sortConfig) {
			data.sort((a, b) => {
				let aVal: any = "";
				let bVal: any = "";

				switch (sortConfig.key) {
					case "id":
						aVal = a.id;
						bVal = b.id;
						break;

					case "user":
						aVal = `${a.user?.firstName} ${a.user?.lastName}`;
						bVal = `${b.user?.firstName} ${b.user?.lastName}`;
						break;

					case "amount":
						aVal = a.amount;
						bVal = b.amount;
						break;

					case "loan":
						aVal = a.loan?.loanId;
						bVal = b.loan?.loanId;
						break;

					case "createdAt":
						aVal = new Date(a.createdAt).getTime();
						bVal = new Date(b.createdAt).getTime();
						break;

					case "paidAt":
						aVal = a.paidAt ? new Date(a.paidAt).getTime() : -Infinity;
						bVal = b.paidAt ? new Date(b.paidAt).getTime() : -Infinity;
						break;

					default:
						aVal = a[sortConfig.key];
						bVal = b[sortConfig.key];
				}

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
				}

				return sortConfig.direction === "asc"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}

		return data;
	}, [fees, filter, search, sortConfig]);

	// ============================
	// ACTION HANDLERS
	// ============================

	const handleFeePaid = async (feeId: number) => {
		try {
			const updated = await apiFees.markPaid(feeId);

			setFees((prev) => prev.map((fee) => (fee.id === feeId ? { ...fee, ...updated } : fee)));
		} catch (err) {
			console.error("Error marking fee as paid:", err);
		}
	};

	const handleDeleteFee = async (id: number) => {
		const feeToDelete = fees.find((fee) => fee.id === id);
		const displayName = feeToDelete
			? `${feeToDelete.id} / ${feeToDelete.user.firstName} ${feeToDelete.user.lastName}`.trim()
			: "Unknown fee";

		try {
			await apiFees.deleteFeeById(id);
			showMessage(`Fee for user "${displayName}" has been deleted.`);
			reloadFees();
		} catch (error) {
			if ((error as { response?: { status?: number } })?.response?.status === 409) {
				showMessage(
					`Failed to delete fee for user "${displayName}": it has associated constraints.`,
					"danger",
				);
				return;
			}

			showMessage(`Failed to delete fee "${displayName}".`, "danger");
			console.error(error);
		}
	};

	// ============================
	// CRUD VIEW
	// ============================

	if (crud.mode === "view") {
		return (
			<ViewLoan
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadFees}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddFee
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadFees}
				showMessage={showMessage}
			/>
		);
	}

	// ============================
	// Render
	// ============================

	if (loading) {
		return <div className="alert alert-info py-2">Loading fees...</div>;
	}

	return (
		<>
			<SearchBar
				search={search}
				setSearch={setSearch}
				placeholder="Search fee by user, fee ID, loan ID or book title"
			/>

			{message && (
				<div
					className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
					role="alert"
				>
					{message}
				</div>
			)}

			<div className="d-flex justify-content-end mb-3">
				{userRole === "" && (
					<button
						className="btn btn-sm btn-primary me-2"
						onClick={() => setCrud({ mode: "add" })}
					>
						Add Fee
					</button>
				)}
				<button
					className="btn btn-secondary btn-sm"
					disabled={!isFiltered}
					onClick={() => {
						setSearch("");
						setFilter("ALL");
						setSortConfig(null);
					}}
				>
					Clear filters
				</button>
			</div>

			{mode === "admin" ? (
				<table className="table table-striped table-hover shadow">
					<thead>
						<tr>
							<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>

							<th onClick={() => requestSort("user")}>
								ID / User {getSortIcon("user")}
							</th>

							<th onClick={() => requestSort("loan")}>
								Book / Authors / Inventory Code {getSortIcon("loan")}
							</th>

							<th onClick={() => requestSort("createdAt")}>
								Created At {getSortIcon("createdAt")}
							</th>

							<th onClick={() => requestSort("amount")}>
								Amount {getSortIcon("amount")}
							</th>

							<th onClick={() => requestSort("paidAt")}>
								Paid At {getSortIcon("paidAt")}
							</th>

							<th scope="col" onClick={() => requestSort("status")}>
								<div className="d-flex align-items-center gap-2">
									<span>Status</span>
									<select
										className="form-select form-select-sm py-0 me-2"
										style={{ width: "auto" }}
										value={filter}
										onChange={(e) =>
											setFilter(e.target.value as FeeStatusType | "ALL")
										}
									>
										<option value="ALL">All</option>
										{statusOptions.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
								</div>
							</th>

							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{processedFees.map((fee, index) => (
							<tr key={fee.id}>
								<td>{index + 1}</td>

								<td>
									{fee.user?.id} / {fee.user?.firstName} {fee.user?.lastName}
								</td>

								<td>
									{fee.loan?.copy?.book?.title} / (
									{fee.loan?.copy?.book?.authors
										?.map(
											(a: { firstName: string; lastName: string }) =>
												`${a.firstName} ${a.lastName}`,
										)
										.join(", ")}
									) / {fee.loan?.copy?.inventoryCode}
								</td>

								<td>{formatDateTime(fee.createdAt)}</td>

								<td>{fee.amount.toFixed(2)} zł</td>

								<td>{fee.paidAt ? formatDateTime(fee.paidAt) : "-"}</td>

								<td>{fee.status}</td>

								<td>
									<button
										className="btn btn-sm btn-primary me-2"
										onClick={() => setCrud({ mode: "view", id: fee.id })}
									>
										Details
									</button>

									<button
										className="btn btn-sm btn-success me-2"
										disabled={
											fee.status === "PAID" || fee.status === "CANCELLED"
										}
										onClick={() => handleFeePaid(fee.id)}
									>
										Mark as Paid
									</button>

									<DeleteButton
										id={fee.id}
										name={`${fee.loan?.copy?.book?.title} / ${fee.user?.firstName} ${fee.user?.lastName}`}
										entityName="fee"
										onDelete={() => handleDeleteFee(fee.id)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<table className="table table-striped table-hover shadow">
					<thead>
						<tr>
							<th onClick={() => requestSort("id")}># {getSortIcon("id")}</th>

							<th onClick={() => requestSort("loan")}>
								Book / Authors / Inventory Code {getSortIcon("loan")}
							</th>

							<th onClick={() => requestSort("createdAt")}>
								Created At {getSortIcon("createdAt")}
							</th>

							<th onClick={() => requestSort("amount")}>
								Amount(PLN) {getSortIcon("amount")}
							</th>

							<th onClick={() => requestSort("paidAt")}>
								Paid At {getSortIcon("paidAt")}
							</th>

							<th scope="col" onClick={() => requestSort("status")}>
								<div className="d-flex align-items-center gap-2">
									<span>Status</span>
									<select
										className="form-select form-select-sm py-0 me-2"
										style={{ width: "auto" }}
										value={filter}
										onChange={(e) =>
											setFilter(e.target.value as FeeStatusType | "ALL")
										}
									>
										<option value="ALL">All</option>
										{statusOptions.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
								</div>
							</th>

							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{processedFees.map((fee, index) => (
							<tr key={fee.id}>
								<td>{index + 1}</td>

								<td>
									{fee.loan?.copy?.book?.title} / (
									{fee.loan?.copy?.book?.authors
										?.map(
											(a: { firstName: string; lastName: string }) =>
												`${a.firstName} ${a.lastName}`,
										)
										.join(", ")}
									) / {fee.loan?.copy?.inventoryCode}
								</td>

								<td>{formatDateTime(fee.createdAt)}</td>

								<td>{fee.amount.toFixed(2)} zł</td>

								<td>{formatDateTime(fee.paidAt)}</td>

								<td>{fee.status}</td>

								<td>
									<button
										className="btn btn-sm btn-primary me-2"
										onClick={() => setCrud({ mode: "view", id: fee.loanId })}
									>
										Details
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<TableAlert count={processedFees.length} message="No items found." />
		</>
	);
};

export default FeeItemsTable;
