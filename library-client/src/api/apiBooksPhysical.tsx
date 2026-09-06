import axiosClient from "./axiosClient";
import type { BookPhysicalResponse, BookPhysicalForm } from "../types/DbTypes";

//endpoints
const BOOK_COPY_ENDPOINT = "/copies";

//===============================================================================
//BookCopy

const getBookCopies = async () => {
	try {
		const response = await axiosClient.get<BookPhysicalResponse[]>(BOOK_COPY_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch book copies:", error);
		throw error;
	}
};

const addBookCopy = async (bookCopy: BookPhysicalForm) => {
	try {
		const response = await axiosClient.post<BookPhysicalResponse>(BOOK_COPY_ENDPOINT, bookCopy);
		return response.data;
	} catch (error) {
		console.error("Failed to add book copy:", error);
		throw error;
	}
};

const getBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookPhysicalResponse>(`${BOOK_COPY_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book copy with id ${id}:`, error);
		throw error;
	}
};

const updateBookCopyById = async (id: number, bookCopy: BookPhysicalForm) => {
	try {
		const response = await axiosClient.put<BookPhysicalResponse>(
			`${BOOK_COPY_ENDPOINT}/${id}`,
			bookCopy,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book copy with id ${id}:`, error);
		throw error;
	}
};

const deleteBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${BOOK_COPY_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete book copy with id ${id}:`, error);
		throw error;
	}
};

const apiBooksPhysical = {
	getBookCopies,
	addBookCopy,
	getBookCopyById,
	updateBookCopyById,
	deleteBookCopyById,
};

export default apiBooksPhysical;
