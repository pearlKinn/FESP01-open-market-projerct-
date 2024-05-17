import { axiosInstance } from "@/utils";

export async function getProductBookmark(
	productId?: string | number,
): Promise<Bookmark | undefined> {
	try {
		const response = await axiosInstance.get(
			`/bookmarks/products/${productId}`,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}
