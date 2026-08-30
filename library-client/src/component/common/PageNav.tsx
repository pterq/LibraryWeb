import React from "react";

interface PageNavProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const PageNav: React.FC<PageNavProps> = ({ page, totalPages, onPageChange }) => {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className="d-flex justify-content-center mb-5">
			<nav aria-label="Page navigation">
				<ul className="pagination">
					{/* Poprzednia */}
					<li className={`page-item ${page === 1 ? "disabled" : ""}`}>
						<button className="page-link" onClick={() => onPageChange(page - 1)}>
							&laquo;
						</button>
					</li>

					{/* Numery stron */}
					{pages.map((p) => (
						<li key={p} className={`page-item ${p === page ? "active" : ""}`}>
							<button className="page-link" onClick={() => onPageChange(p)}>
								{p}
							</button>
						</li>
					))}

					{/* Następna */}
					<li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
						<button className="page-link" onClick={() => onPageChange(page + 1)}>
							&raquo;
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default PageNav;
