{
	/*
[
    {
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
    }
]
	
	*/
}

export interface LoanType {
	id: number;
	book: {
		id: number;
		title: string;
		description: string;
		isbn: string;
		publishedYear: number;
		bookAuthors: string[];
	};
	loanDate: string;
	returnDate: string;
	dueDate: string;
	status: "BORROWED" | "RETURNED" | "OVERDUE";
	user: {
		id: number;
		firstName: string;
		lastName: string;
	};
}
