import axiosClient from "./axiosClient";
import type { AuthorType, AuthorForm } from "../types/DbTypes";

const AUTHORS_ENDPOINT = "/authors";

//===============================================================================
//Author

export const getAuthors = async () => {
	try {
		const response = await axiosClient.get<AuthorType[]>(AUTHORS_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch authors:", error);
		throw error;
	}
};

export const addAuthor = async (author: AuthorForm) => {
	try {
		const response = await axiosClient.post<AuthorType>(AUTHORS_ENDPOINT, author);
		return response.data;
	} catch (error) {
		console.error("Failed to add author:", error);
		throw error;
	}
};

export const getAuthorById = async (id: number) => {
	try {
		const response = await axiosClient.get<AuthorType>(`${AUTHORS_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch author with id ${id}:`, error);
		throw error;
	}
};

export const updateAuthorById = async (id: number, author: AuthorType) => {
	try {
		const response = await axiosClient.put<AuthorType>(`${AUTHORS_ENDPOINT}/${id}`, author);
		return response.data;
	} catch (error) {
		console.error(`Failed to update author with id ${id}:`, error);
		throw error;
	}
};

export const deleteAuthorById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${AUTHORS_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete author with id ${id}:`, error);
		throw error;
	}
};

export const searchAuthors = async (query: string) => {
	try {
		const response = await axiosClient.get<AuthorType[]>(
			`${AUTHORS_ENDPOINT}/search?query=${query}`,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to search authors with query "${query}":`, error);
		throw error;
	}
};

const apiAuthors = {
	getAuthors,
	getAuthorById,
	addAuthor,
	updateAuthorById,
	deleteAuthorById,
	searchAuthors,
};

export default apiAuthors;
