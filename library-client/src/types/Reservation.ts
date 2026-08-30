export interface Reservation {
	id: number;
	title: string;
	authors: string[];
	reservedAt: string;
	expiresAt: string;
	bookId: number;
	coverImageUrl: string;
}
