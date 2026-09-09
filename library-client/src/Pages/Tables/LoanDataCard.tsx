import React from "react";

import type { UserType, LoanResponse } from "../../types/DbTypes";

const LoanDataCard = ({ loanData }: { loanData: LoanResponse | null }) => {
	console.log("Loan data:", loanData);

	return <div>LoanDataCard</div>;
};

export default LoanDataCard;
