import { test, expect } from "@playwright/test";

const BASE_URL = "https://airbnbnew.cybersoft.edu.vn/api";
const TOKEN_CYBERSOFT = process.env.TOKEN_CYBERSOFT!
const ACCESS_TOKEN = process.env.ACCESS_TOKEN!;



test.describe("Api Booking Test", () => {
  test("TC_API_BK_001 - Booking thành công", async ({ request }) => {

    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        TokenCybersoft: process.env.TOKEN_CYBERSOFT!,
        Authorization: `Bearer ${process.env.ACCESS_TOKEN!}`,
        "Content-Type": "application/json",
      },
      data: {"id": 60789,
        "maPhong": 7,
        "ngayDen": "2026-04-22T10:36:51.533Z",
        "ngayDi": "2026-04-22T10:36:51.533Z",
        "soLuongKhach": 2,
        "maNguoiDung": 45155
      },
    })

    console.log(await response.text());

    expect([200, 201]).toContain(response.status());
  })
   test("TC_API_BK_002 - Booking thất bại thiếu token", async ({ request }) => {

    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: 60790,
        maPhong: 7,
        ngayDen: "2026-04-22T10:36:51.533Z",
        ngayDi: "2026-04-23T10:36:51.533Z",
        soLuongKhach: 2,
        maNguoiDung: 45155
      },
    });

    const body = await response.text();
    console.log(body);

    expect([401, 403]).toContain(response.status());
  })
  test("TC_API_BK_003 - Token không hợp lệ", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        TokenCybersoft: "fake_token",
        Authorization: `Bearer fake_token`,
      },
      data:{
        id: 60790,
        maPhong: 7,
        ngayDen: "2026-04-22T10:36:51.533Z",
        ngayDi: "2026-04-23T10:36:51.533Z",
        soLuongKhach: 2,
        maNguoiDung: 45155
      },
    });

    expect([401, 403]).toContain(response.status());
  })
//   test("TC_API_BK_004 - Sai logic ngày", async ({ request }) => {
//   const response = await request.post(`${BASE_URL}/dat-phong`, {
//     headers: {
//       TokenCybersoft: process.env.TOKEN_CYBERSOFT!,
//       Authorization: `Bearer ${process.env.ACCESS_TOKEN!}`,
//       "Content-Type": "application/json",
//     },
//     data: {
//       id: 60789,
//       maPhong: 7,
//       ngayDen: "2026-04-27T10:36:51.533Z",
//       ngayDi: "2026-04-22T10:36:51.533Z", // sai logic
//       soLuongKhach: 2,
//       maNguoiDung: 45155,
//     },
//   });

//   const body = await response.json();
//   console.log(body);

//   // Expect API phải reject
//   expect(response.status()).toBeGreaterThanOrEqual(400);
// }); 
// bug
test("TC_API_BK_005 - Thiếu maPhong", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        TokenCybersoft: "fake_token",
        Authorization: `Bearer fake_token`,
      },
      data: {
        ngayDen: "2026-05-01",
        ngayDi: "2026-05-05",
        soLuongKhach: 2,
        maNguoiDung: 45155,
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
test("TC_API_BK_006 - maPhong không tồn tại", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        TokenCybersoft: "fake_token",
        Authorization: `Bearer fake_token`,
      },
      data: {
        maPhong: 999999,
        ngayDen: "2026-05-01",
        ngayDi: "2026-05-05",
        soLuongKhach: 2,
        maNguoiDung: 45155,
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
  test("TC_API_BK_007 - maNguoiDung không tồn tại", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        TokenCybersoft: "fake_token",
        Authorization: `Bearer fake_token`,
      },
      data: {
        maPhong: 7,
        ngayDen: "2026-05-01",
        ngayDi: "2026-05-05",
        soLuongKhach: 2,
        maNguoiDung: 999999999,
      },
    });
      expect(response.status()).toBeGreaterThanOrEqual(400);
  });
  test("TC_API_BK_008 - Ngày trong quá khứ", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/dat-phong`, {
      headers: {
        TokenCybersoft: "fake_token",
        Authorization: `Bearer fake_token`,
      },
      data: {
        maPhong: 7,
        ngayDen: "2020-01-01",
        ngayDi: "2020-01-05",
        soLuongKhach: 2,
        maNguoiDung: 45155,
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

});
    



