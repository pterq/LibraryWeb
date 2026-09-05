import { useEffect, useMemo, useState } from "react";

import type { UserType } from "../../../types/DbTypes";
import SearchBar from "../../common/SearchBar";

import { getUsers } from "../../../api/api";
import TableAlert from "../../common/TableAlert";

const UsersDashboard = () => {
	const [users, setUsers] = useState<UserType[]>([]);

	useEffect(() => {
		getUsers()
			.then((data) => {
				setUsers(data);
				console.log("Fetched users:", data);
			})
			.catch(console.error);
	}, []);

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"ALL" | UserType["role"]>("ALL");
	const [feeFilter, setFeeFilter] = useState<"ALL" | "YES" | "NO">("ALL");

	const [sortConfig, setSortConfig] = useState<{
		key: keyof UserType;
		direction: "asc" | "desc";
	} | null>(null);

	const roleOptions = useMemo(() => Array.from(new Set(users.map((user) => user.role))), [users]);

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

	return (
		<div className="container-fluid">
			<h1>Users Dashboard</h1>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search user" />

			<div className="d-flex justify-content-end mb-3">
				<button
					className="btn btn-primary btn-sm me-2"
					onClick={() => (window.location.href = `/user/add`)}
				>
					Add User
				</button>
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
			<table className="table table-striped">
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

						{/* 🔥 WĄSKA KOLUMNA EMAIL */}
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
										setFilter(e.target.value as "ALL" | UserType["role"])
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
							<td>
								<button
									className="btn btn-sm btn-primary"
									onClick={() => (window.location.href = `/user/view/${user.id}`)}
								>
									View Details
								</button>
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
