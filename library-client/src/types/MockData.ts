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
	LoanStatusType,
	FeeStatusType,
	BookPhysicalStatusType,
	UserRoleType,
	ReservastionsType,
	ReservationCountType,
} from "./DbTypes";

const mockUser: UserType = {
	id: 1,
	firstName: "Jan",
	lastName: "Kowalski",
	email: "jan.kowalski@example.com",
	phone: "123-456-7890",
	role: "USER",
	hasFee: false,
};

const mockAuthor: AuthorType = {
	id: 1,
	firstName: "Robert C.",
	lastName: "Martin",
	biography:
		"Robert Cecil Martin, colloquially known as 'Uncle Bob', is an American software engineer and author.",
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
	{ id: 6, name: "Databases" },
	{ id: 7, name: "Networking" },
	{ id: 8, name: "Security" },
];

const mockLoan: LoanType = {
	id: 1,
	copy: mockBookPhysical,
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
	copy: mockBookPhysical.id,
	reservedAt: new Date("2026-08-30T04:42:43.95786"),
	expiresAt: new Date("2026-09-13T10:00:00"),
	bookPhysical: mockBookPhysical,
};

//=================================================================

//fill mock data arrays with multiple copies of the mock data with different ids
const mockUsers: UserType[] = Array.from({ length: 5 }, (_, i) => ({
	firstName: `FUs${i + 1}`,
	lastName: `NUs${i + 1}${i + 1}`,
	email: `user${i + 1}@example.com`,
	// all 3 roles have to be represented
	role: i % 3 === 0 ? "USER" : i % 3 === 1 ? "ADMIN" : "LIBRARIAN",
	phone: `123-456-78${i + 10}`,
	userId: i + 1,
	hasFee: i % 2 === 0,
}));

const mockAuthors: AuthorType[] = Array.from({ length: 15 }, (_, i) => ({
	firstName: `FAu ${i + 1}`,
	lastName: `NAu${i + 1}${i + 1}`,
	bio: `Bio of author ${i + 1}`,
	id: i + 1,
}));

const mockAuthorsArray: AuthorsType[] = Array.from({ length: 15 }, (_, i) => ({
	id: i + 1,
	authors: [mockAuthors[i]],
}));

const mockBooks: BookType[] = Array.from({ length: 15 }, (_, i) => ({
	authors: mockAuthorsArray[i],
	description: `Description of Clean Code ${i + 1}`,
	isbn: `978013235088${i + 1}`,
	publishedYear: 2008,
	id: i + 1,
	title: `Clean Code ${i + 1}`,
	categories: [mockCategories[i % mockCategories.length]],
	coverImageUrl: `https://books.google.com/books/content?id=NwxLAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
}));

const mockBookPhysicals: BookPhysicalType[] = Array.from({ length: 15 }, (_, i) => ({
	book: mockBooks[i],
	id: i + 1,
	inventoryCode: `INV-2026-00${i + 1}`,
	status: i % 3 === 0 ? "AVAILABLE" : i % 3 === 1 ? "BORROWED" : "RESERVED",
}));

const mockLoans: LoanType[] = Array.from({ length: 15 }, (_, i) => ({
	...mockLoan,
	id: i + 1,
	user: mockUsers[(i * 3) % mockUsers.length],
	bookPhysical: mockBookPhysicals[i],
	status: i % 3 === 0 ? "BORROWED" : i % 3 === 1 ? "RETURNED" : "OVERDUE",
}));

const mockFees: FeeType[] = Array.from({ length: 15 }, (_, i) => ({
	...mockFee,
	id: i + 1,
	amount: 10.0 + i * 5, // Different amounts for each fee
	// Different createdAt dates for each fee, -1 day for each subsequent fee
	createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
	loan: mockLoans[(i * 3) % mockLoans.length],
	user: mockUsers[(i * 3) % mockUsers.length],
	status: i % 3 === 0 ? "PAID" : i % 3 === 1 ? "UNPAID" : "CANCELLED",
}));

const mockReservations: ReservastionsType = {
	reservations: Array.from({ length: 15 }, (_, i) => ({
		id: i + 1,
		user: mockUsers[(i * 3) % mockUsers.length],
		copyId: mockBookPhysicals[i].id,
		reservedAt: new Date(
			new Date("2026-08-30T04:42:43.95786").getTime() + i * 24 * 60 * 60 * 1000,
		),
		expiresAt: new Date(new Date("2026-09-13T10:00:00").getTime() + i * 24 * 60 * 60 * 1000),
		bookPhysical: mockBookPhysicals[i],
	})),
};

//=============================================
const mockCategoriesCount: CategoryCountType[] = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	name: mockCategories[i].name,
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
	user: mockUsers[(i * 3) % mockUsers.length],
}));

const mockLoansCount: LoanCountType[] = Array.from({ length: 5 }, (_, i) => ({
	loanId: i + 1,
	firstName: `FirstN ${i + 1}`,
	lastName: `LastN${i + 1}`,
	numberOfLoans: i * 3,
	// 3 loans per user
	user: mockUsers[(i * 3) % mockUsers.length],
}));

const mockReservationsCount: ReservationCountType[] = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	firstName: `FirstN ${i + 1}`,
	lastName: `LastN${i + 1}`,
	numberOfReservations: i * 2,
	user: mockUsers[(i * 3) % mockUsers.length],
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
	mockReservationsCount,
};

export { MockData };
