import type {
	UserType,
	AuthorType,
	AuthorsType,
	BookType,
	BookPhysicalType,
	CategoryType,
	LoanType,
	FeeType,
	ReservationType,
	CategoryCountType,
	FeeCountType,
	LoanCountType,
} from "../../types/DbTypes";

const mockUser: UserType = {
	userId: 1,
	firstName: "Jan",
	lastName: "Kowalski",
	email: "jan.kowalski@example.com",
	role: "USER",
};

const mockAuthor: AuthorType = {
	id: 1,
	firstName: "Robert C.",
	lastName: "Martin",
	bio: "Robert Cecil Martin, colloquially known as 'Uncle Bob', is an American software engineer and author.",
};

const mockBookAuthors: AuthorsType = {
	id: 1,
	authors: [mockAuthor],
};

const mockBook: BookType = {
	id: 1,
	title: "Clean Code",
	description: "A handbook of agile software craftsmanship",
	isbn: "9780132350884",
	publishedYear: 2008,
	authors: mockBookAuthors,
	coverImageUrl:
		"https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg",
};

const mockBookPhysical: BookPhysicalType = {
	id: 1,
	inventoryCode: "INV-2026-0021",
	status: "AVAILABLE",
	book: mockBook,
};

const mockCategory: CategoryType = {
	id: 1,
	name: "Programming",
};

const mockCategories: CategoryType[] = [
	mockCategory,
	{ id: 2, name: "Software Engineering" },
	{ id: 3, name: "Architecture" },
	{ id: 4, name: "Design Patterns" },
	{ id: 5, name: "Agile" },
];

const mockLoan: LoanType = {
	id: 1,
	bookPhysical: mockBookPhysical,
	loanDate: new Date("2026-08-30T04:42:43.95786"),
	returnDate: new Date("2026-08-30T05:27:36.492792"),
	dueDate: new Date("2026-09-13T10:00:00"),
	status: "RETURNED",
	user: mockUser,
};

const mockFee: FeeType = {
	amount: 10.0,
	createdAt: new Date("2026-08-30T04:42:43.95786"),
	id: 1,
	loan: mockLoan,
	paidAt: null,
	status: "CANCELLED",
	user: mockUser,
};

const mockReservation: ReservationType = {
	id: 1,
	user: mockUser,
	copyId: mockBookPhysical.id,
	reservedAt: new Date("2026-08-30T04:42:43.95786"),
	expiresAt: new Date("2026-09-13T10:00:00"),
	bookPhysical: mockBookPhysical,
};

//fill mock data arrays with multiple copies of the mock data with different ids
const mockUsers: UserType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockUser,
	userId: i + 1,
}));

const mockAuthors: AuthorType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockAuthor,
	id: i + 1,
}));

const mockBooks: BookType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockBook,
	id: i + 1,
	title: `Clean Code ${i + 1}`,
	categories: [mockCategories[i % mockCategories.length]],
}));

const mockBookPhysicals: BookPhysicalType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockBookPhysical,
	id: i + 1,
	inventoryCode: `INV-2026-00${i + 1}`,
	status: i % 2 === 0 ? "AVAILABLE" : "BORROWED",
}));

const mockLoans: LoanType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockLoan,
	id: i + 1,
	bookPhysical: mockBookPhysicals[i],
	status: i % 2 === 0 ? "BORROWED" : "RETURNED",
}));

const mockFees: FeeType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockFee,
	id: i + 1,
	amount: 10.0 + i * 5, // Different amounts for each fee
	// Different createdAt dates for each fee, -1 day for each subsequent fee
	createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
	loan: mockLoans[i],
	status: i % 2 === 0 ? "PAID" : "UNPAID",
}));

const mockReservations: ReservationType[] = Array.from({ length: 5 }, (_, i) => ({
	...mockReservation,
	id: i + 1,
	userId: mockUsers[i].userId,
	copyId: mockBookPhysicals[i].id,
}));

//=============================================
const mockCategoriesCount: CategoryCountType[] = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	name: `Category ${i + 1}`,
	numberOfBooks: i * 10,
}));

const mockFeesCount: FeeCountType[] = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	firstName: `FirstN ${i + 1}`,
	lastName: `LastN${i + 1}`,
	numberOfFees: i * 5,
	numberOfFeesUnpaid: i * 2,
	numberOfFeesPaid: i * 2,
	numberOfFeesCancelled: i,
}));

const mockLoansCount: LoanCountType[] = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	firstName: `FirstN ${i + 1}`,
	lastName: `LastN${i + 1}`,
	numberOfLoans: i * 3,
}));

//========

//export as MockData object
const MockData = {
	mockUsers,
	mockAuthors,
	mockCategories,
	mockBooks,
	mockBookPhysicals,
	mockLoans,
	mockFees,
	mockReservations,
	mockCategoriesCount,
	mockFeesCount,
	mockLoansCount,
};

export { MockData };
