export interface ReservationType {
	id: number;
	userId: number;
	copyId: number;
	reservedAt: string;
	expiresAt: string;
}

{
	/*
Table reservations {
  id integer [pk, increment]
  user_id integer [ref: > users.id]
  copy_id integer [ref: > books_physical.id]
  reserved_at datetime [not null]
  expires_at datetime [not null]
}
	*/
}
