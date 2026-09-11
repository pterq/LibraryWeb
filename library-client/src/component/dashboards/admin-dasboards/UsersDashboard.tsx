import { useEffect, useMemo, useState } from "react";

import type { UserRoleType, UserType } from "../../../types/DbTypes";
import SearchBar from "../../common/SearchBar";

import apiUsers from "../../../api/apiUsers";
import TableAlert from "../../common/TableAlert";

import ViewUser from "../CRUDs/User/ViewUser";
import EditUser from "../CRUDs/User/EditUser";
import AddUser from "../CRUDs/User/AddUser";
import DeleteButton from "../admin-components/DeleteButton";
import { useAuth } from "../../../context/AuthContext";

type CrudState =
	| { mode: "dashboard" }
	| { mode: "view"; id: number }
	| { mode: "edit"; id: number }
	| { mode: "add" };

const UsersDashboard = () => {
	const userRole = useAuth().role ?? "USER";

	const [crud, setCrud] = useState<CrudState>({ mode: "dashboard" });
	const [users, setUsers] = useState<UserType[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "danger">("success");

	useEffect(() => {
		reloadUsers();
	}, []);

	const reloadUsers = () => {
		apiUsers
			.getUsers()
			.then((data) => {
				setUsers(data);
				console.log("Fetched users:", data);
			})
			.catch(console.error);
	};

	const showMessage = (text: string, type: "success" | "danger" = "success") => {
		setMessage(text);
		setMessageType(type);
		setTimeout(() => setMessage(null), 3000);
	};

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | UserType["role"]>("ALL");
	const [feeFilter, setFeeFilter] = useState<"ALL" | "YES" | "NO">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof UserType;
		direction: "asc" | "desc";
	} | null>(null);

	const roleOptions: UserRoleType[] = ["ADMIN", "LIBRARIAN", "USER"];

	const isFiltered =
		search !== "" || filter !== "ALL" || sortConfig !== null || feeFilter !== "ALL";

	const requestSort = (key: keyof UserType) => {
		if (key === "role") return;

		let direction: "asc" | "desc" = "asc";

		if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key, direction });
	};

	const getSortIcon = (key: keyof UserType) => {
		if (key === "role") return "";
		if (!sortConfig || sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "▲" : "▼";
	};

	const filteredAndSortedUsers = useMemo(() => {
		let data = [...users];

		if (filter !== "ALL") {
			data = data.filter((user) => user.role === filter);
		}

		if (feeFilter !== "ALL") {
			data = data.filter((user) =>
				feeFilter === "YES" ? user.hasFee === true : user.hasFee === false,
			);
		}

		if (search.trim() !== "") {
			const normalizedSearch = search.toLowerCase();
			data = data.filter(
				(user) =>
					user.firstName.toLowerCase().includes(normalizedSearch) ||
					user.lastName.toLowerCase().includes(normalizedSearch) ||
					user.email.toLowerCase().includes(normalizedSearch),
			);
		}

		if (sortConfig) {
			data.sort((a, b) => {
				const aVal = String(a[sortConfig.key]).toLowerCase();
				const bVal = String(b[sortConfig.key]).toLowerCase();

				return sortConfig.direction === "asc"
					? aVal.localeCompare(bVal)
					: bVal.localeCompare(aVal);
			});
		}

		return data;
	}, [users, filter, search, sortConfig, feeFilter]);

	const handleDelete = async (id: number) => {
		const userToDelete = users.find((user) => user.id === id);
		const displayName = userToDelete
			? `${userToDelete.firstName} ${userToDelete.lastName}`.trim()
			: "Unknown user";

		try {
			await apiUsers.deleteUserById(id);
			showMessage(`User "${displayName}" has been deleted.`);
			reloadUsers();
		} catch (error) {
			if ((error as { response?: { status?: number } })?.response?.status === 409) {
				showMessage(
					`Failed to delete user "${displayName}": it is still assigned to books.`,
					"danger",
				);
				return;
			}

			showMessage(`Failed to delete user "${displayName}".`, "danger");
			console.error(error);
		}
	};

	// -----------------------------
	// RENDER CRUD
	// -----------------------------
	if (crud.mode === "view") {
		return (
			<ViewUser
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadUsers}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "edit") {
		return (
			<EditUser
				id={crud.id}
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadUsers}
				showMessage={showMessage}
			/>
		);
	}

	if (crud.mode === "add") {
		return (
			<AddUser
				onBack={() => setCrud({ mode: "dashboard" })}
				onReload={reloadUsers}
				showMessage={showMessage}
			/>
		);
	}

	return (
		<div className="container-fluid">
			<h1>Users Dashboard</h1>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search user" />

			{message && (
				<div
					className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
					role="alert"
				>
					{message}
				</div>
			)}

			<div className="d-flex justify-content-end mb-3">
				{userRole === "ADMIN" && (
					<button
						className="btn btn-primary btn-sm me-2"
						onClick={() => setCrud({ mode: "add" })}
					>
						Add User
					</button>
				)}
				<button
					className="btn btn-secondary btn-sm"
					disabled={!isFiltered}
					onClick={() => {
						setSearch("");
						setSortConfig(null);
						setFilter("ALL");
						setFeeFilter("ALL");
					}}
				>
					Clear filters
				</button>
			</div>

			{/* Users table */}
			<table className="table table-striped table-hover shadow">
				<thead>
					<tr>
						<th scope="col" onClick={() => requestSort("id")}>
							# {getSortIcon("id")}
						</th>

						<th scope="col" onClick={() => requestSort("id")}>
							User ID {getSortIcon("id")}
						</th>

						<th scope="col" onClick={() => requestSort("firstName")}>
							First Name {getSortIcon("firstName")}
						</th>

						<th scope="col" onClick={() => requestSort("lastName")}>
							Last Name {getSortIcon("lastName")}
						</th>

						{/* WĄSKA KOLUMNA EMAIL */}
						<th
							scope="col"
							onClick={() => requestSort("email")}
							style={{ width: "180px" }}
						>
							Email {getSortIcon("email")}
						</th>

						<th scope="col" style={{ width: "1%" }}>
							Phone
						</th>

						<th scope="col" onClick={() => requestSort("role")}>
							<div className="d-flex align-items-center gap-2">
								<span>Role</span>
								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={filter}
									onChange={(e) =>
										setFilter(e.target.value as "ALL" | UserRoleType)
									}
								>
									<option value="ALL">All</option>
									{roleOptions.map((role) => (
										<option key={role} value={role}>
											{role}
										</option>
									))}
								</select>
							</div>
						</th>
						<th scope="col">
							<div className="d-flex align-items-center gap-2">
								<span>Has Unpaid Fees</span>

								<select
									className="form-select form-select-sm py-0"
									style={{ width: "auto" }}
									value={feeFilter}
									onChange={(e) =>
										setFeeFilter(e.target.value as "ALL" | "YES" | "NO")
									}
								>
									<option value="ALL">All</option>
									<option value="YES">Yes</option>
									<option value="NO">No</option>
								</select>
							</div>
						</th>

						<th scope="col">Actions</th>
					</tr>
				</thead>

				<tbody>
					{filteredAndSortedUsers.map((user, index) => (
						<tr key={user.id}>
							<td>
								{sortConfig?.key === "id" && sortConfig?.direction === "desc"
									? filteredAndSortedUsers.length - index
									: index + 1}
							</td>
							<td>{user.id}</td>
							<td>{user.firstName}</td>
							<td>{user.lastName}</td>

							<td
								className="text-nowrap"
								style={{
									maxWidth: "180px",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{user.email}
							</td>

							<td className="text-nowrap">{user.phone}</td>
							<td className="text-nowrap">{user.role}</td>
							<td>{user.hasFee ? "Yes" : "No"}</td>

							<td className="text-nowrap">
								<button
									className="btn btn-sm btn-primary me-2"
									onClick={() => setCrud({ mode: "view", id: user.id })}
								>
									View
								</button>

								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => setCrud({ mode: "edit", id: user.id })}
								>
									Edit
								</button>

								{userRole === "ADMIN" && (
									<DeleteButton
										id={user.id}
										name={`${user.firstName} ${user.lastName}`}
										entityName="user"
										onDelete={() => handleDelete(user.id)}
									/>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<TableAlert count={filteredAndSortedUsers.length} message="No users found." />
		</div>
	);
};

export default UsersDashboard;
