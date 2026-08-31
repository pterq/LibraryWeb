{
	/*
[
    {
        "amount": 12.50,
        "createdAt": "2026-08-30T05:32:21.277376",
        "id": 3,
        "loan": {
            "copy": {
                "book": {
                    "bookAuthors": [],
                    "category": null,
                    "description": "A handbook of agile software craftsmanship",
                    "id": 2,
                    "isbn": "9780132350884",
                    "publishedYear": 2008,
                    "title": "Clean Code"
                },
                "createdAt": "2026-08-30T04:29:26.669671",
                "id": 3,
                "inventoryCode": "INV-2026-0021",
                "status": "AVAILABLE",
                "updatedAt": "2026-08-30T05:27:36.476013"
            },
            "dueDate": "2026-09-13T10:00:00",
            "id": 1,
            "loanDate": "2026-08-30T04:42:43.95786",
            "returnDate": "2026-08-30T05:27:36.492792",
            "status": "RETURNED",
            "user": {
                "createdAt": "2026-08-30T04:20:00.16212",
                "email": "jan.kowalski@example.com",
                "firstName": "Jan",
                "id": 1,
                "lastName": "Kowalski",
                "passwordHash": "hashed_password_123",
                "phone": "+48123456789",
                "role": "USER",
                "updatedAt": "2026-08-30T04:20:00.16212"
            }
        },
        "paidAt": null,
        "status": "CANCELLED",
        "user": {
            "createdAt": "2026-08-30T04:20:00.16212",
            "email": "jan.kowalski@example.com",
            "firstName": "Jan",
            "id": 1,
            "lastName": "Kowalski",
            "passwordHash": "hashed_password_123",
            "phone": "+48123456789",
            "role": "USER",
            "updatedAt": "2026-08-30T04:20:00.16212"
        }
    }
]	

*/
}

import type { LoanType } from "./LoanType";
import type { UserType } from "./UserType";

export type FeeType = {
	amount: number;
	createdAt: string;
	id: number;
	loan: LoanType;
	paidAt: string | null;
	status: "PAID" | "UNPAID" | "CANCELLED";
	user: UserType;
};
