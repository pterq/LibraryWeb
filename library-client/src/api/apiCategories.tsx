import axiosClient from "./axiosClient";
import type { CategoryType, CategoriesWithCountsType, CategoryForm } from "../types/DbTypes";

//endpoints
const CATEGORIES_ENDPOINT = "/categories";

//===============================================================================
//Category

export const getCategories = async () => {
	try {
		const response = await axiosClient.get<CategoryType[]>(CATEGORIES_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		throw error;
	}
};

export const getCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.get<CategoryType>(`${CATEGORIES_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch category with id ${id}:`, error);
		throw error;
	}
};

export const addCategory = async (category: CategoryForm) => {
	try {
		const response = await axiosClient.post<CategoryType>(CATEGORIES_ENDPOINT, category);
		return response.data;
	} catch (error) {
		console.error("Failed to add category:", error);
		throw error;
	}
};

export const updateCategoryById = async (id: number, category: CategoryForm) => {
	try {
		const response = await axiosClient.put<CategoryType>(
			`${CATEGORIES_ENDPOINT}/${id}`,
			category,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update category with id ${id}:`, error);
		throw error;
	}
};

export const deleteCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${CATEGORIES_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete category with id ${id}:`, error);
		throw error;
	}
};

export const getCategoriesWithCounts = async () => {
	try {
		const response = await axiosClient.get<CategoriesWithCountsType[]>(
			`${CATEGORIES_ENDPOINT}/counts`,
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories with counts:", error);
		throw error;
	}
};

const apiCategories = {
	getCategories,
	getCategoryById,
	addCategory,
	updateCategoryById,
	deleteCategoryById,
	getCategoriesWithCounts,
};

export default apiCategories;
