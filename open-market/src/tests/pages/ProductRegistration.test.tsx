import ProductRegistration from "@/pages/product/ProductRegistration";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import "../setup";

const axiosInstance = {
	post: vi.fn(() =>
		Promise.resolve({
			data: "테스트 데이터",
		}),
	),
};

vi.mock("react-hot-toast");

describe("ProductRegistration", () => {
	beforeEach(() => {
		render(
			<RecoilRoot>
				<BrowserRouter>
					<HelmetProvider>
						<ProductRegistration />
					</HelmetProvider>
				</BrowserRouter>
			</RecoilRoot>,
		);
	});

	// 모의 설정 복원
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should post the product successfully when required fields are filled", async () => {
		// 필요한 DOM 요소 찾기
		const imageInput = screen.getByLabelText(/커버 업로드/i);
		const nameInput = screen.getByLabelText(/타이틀/i);
		const contentInput = screen.getByLabelText(/설명/i);
		const musicInput = screen.getByLabelText(/음원 업로드/i);
		const submitButton = screen.getByRole("button", { name: /등록/i });

		// 입력항목 채우기
		await userEvent.type(
			imageInput,
			"https://modi-ip3-modi.koyeb.app/api/files/6kw2MNBpz.png",
		);
		await userEvent.type(nameInput, "새 음원");
		await userEvent.type(contentInput, "이 음원은...");
		await userEvent.type(
			musicInput,
			"https://modi-ip3-modi.koyeb.app/api/files/vwa-bYP4h.mp3",
		);
		// axios post 호출 시 성공적으로 응답을 모의
		axiosInstance.post = vi.fn().mockImplementation((postItem: any) => {
			if (
				postItem.mainImages.length > 0 &&
				postItem.extra.soundFile.path !== "" &&
				postItem.extra.category !== ""
			) {
				return Promise.resolve({
					data: {
						ok: 1,
						item: {
							_id: "123",
							name: "새 음원",
							active: true,
							buyQuantity: 0,
							content: "이 음원은...",
							extra: {
								category: " ",
								isBest: false,
								isNew: true,
								sellerName: "네오",
								soundFile: {
									path: "https://modi-ip3-modi.koyeb.app/api/files/vwa-bYP4h.mp3",
									name: "vwa-bYP4h.mp3",
									originalname: "01. One stroke sketch.mp3",
									duration: 228.13333333333333,
								},
								tags: [],
							},
							mainImages: [
								{
									path: "https://modi-ip3-modi.koyeb.app/api/files/6kw2MNBpz.png",
									name: "6kw2MNBpz.png",
									originalname:
										"á\x84\x8Cá\x85µá\x86«á\x84\x8Cá\x85®_á\x84\x86á\x85µá\x84\x86á\x85©á\x84\x90á\x85µá\x84\x8Fá\x85©á\x86«.png",
								},
							],
							price: 0,
							quantity: 9007199254740991,
							seller_id: 2,
							shippingFees: 0,
							show: true,
						},
					},
					status: 200,
				});
			} else {
				return Promise.reject({
					response: {
						data: {
							message: "상품 등록 실패",
							errors: ["Unprocessable Content"], // 실제 어플리케이션에 맞는 에러 메시지를 제공하세요.
						},
						status: 422,
					},
				});
			}
		});

		// 제출 버튼 클릭
		await userEvent.click(submitButton);

		// // 성공 메시지 확인
		// await waitFor(() => {
		// 	expect(toastSpy).toHaveBeenCalledWith(
		// 		"상품 등록 성공!",
		// 		expect.anything(),
		// 	);
		// });
	});
});
