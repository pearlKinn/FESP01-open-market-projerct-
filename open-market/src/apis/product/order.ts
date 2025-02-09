import { axiosInstance } from "@/utils";

export async function getProductOrder(productId?: string) {
	try {
		if (productId === undefined) {
			throw new Error("productId is required");
		}
		const response = await axiosInstance.get<OrderListResponse>(`/orders`);
		const userOrder = response.data.item.find(
			(order) => order.products[0]._id === +productId,
		);

		return userOrder;
	} catch (error) {
		console.error(error);
	}
}
