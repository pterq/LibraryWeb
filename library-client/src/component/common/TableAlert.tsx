type TableAlertProps = {
	count: number;
	message?: string;
	className?: string;
};

const TableAlert = ({
	count,
	message = "No records found.",
	className = "mt-3",
}: TableAlertProps) => {
	if (count !== 0) {
		return null;
	}

	return <div className={`alert alert-info ${className}`}>{message}</div>;
};

export default TableAlert;
