import { test, expect } from "@playwright/test";
import { BookingPage } from "../pages/BookingPage";
import { LoginModal } from "../pages/LoginModal";
import { userAccount } from "../data/account";
import { HomePage } from "../pages/homePage";


test.describe("BOOKING TEST", () => {

  // ================= BEFORE EACH =================
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.open()
    await homePage.openLoginModal()
  // login với tk hợp lệ
    const loginModal = new LoginModal(page)
    await loginModal.login(userAccount.email, userAccount.password)
    await expect(homePage.avatarBtn).toBeVisible();

  // vào địa điểm cần muốn tới 
    await page.goto("https://demo5.cybersoft.edu.vn/rooms/ho-chi-minh")
  // chọn phòng bất kỳ để vào trag detail
    await page.getByRole("link").filter({hasText: /phòng/i}).first().click();
    // đợi load trang detail
   
    await expect(page).toHaveURL("https://demo5.cybersoft.edu.vn/room-detail/1")
});

 
  test("TC_BK_001 - Booking thành công", async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.selectDate(31,31);

    await bookingPage.increaseGuest(2);

    await bookingPage.clickBooking();

    await bookingPage.confirmBooking();
    await expect(bookingPage.message).toBeVisible({ timeout: 30000 });
    

  });



  test("TC_BK_002 - Booking trùng lịch", async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await page.goto("https://demo5.cybersoft.edu.vn/room-detail/1");

    await bookingPage.selectDate(31, 31);
    await bookingPage.increaseGuest(2);

    await bookingPage.clickBooking();
    await bookingPage.confirmBooking();
    const message = page.locator(".ant-notification-notice-description");
    await expect(message).toBeVisible({ timeout: 60000 }  );
    // fail vì dữ liệu test vẫn thực hiện booking thành công nê không thể test trùng lịch
  
  });   
  // test("TC_BK_003 - Booking thất bại ngày đã qua", async ({ page }) => {
  //   const bookingPage = new BookingPage(page);

  //   await page.goto("https://demo5.cybersoft.edu.vn/room-detail/1");

  //   await bookingPage.selectDate(15, 17);
  //   await bookingPage.increaseGuest(2);

  //   await bookingPage.clickBooking();
  //   await bookingPage.confirmBooking();
  //   const message = page.locator(".ant-notification-notice-description");
  //   await expect(message).toBeVisible({ timeout: 30000 });
  // }) // bị khoá button chọn phòng những ngày đã qua
  

  
  test("TC_BK_004 - Vượt số khách", async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await page.goto("https://demo5.cybersoft.edu.vn/room-detail/1");

    await bookingPage.selectDate(31,31);
    await bookingPage.increaseGuest(3);
  
    const message = page.locator(".ant-message-custom-content").last();

    await expect(message).toBeVisible({ timeout: 60000 });

    await expect(message).toContainText(/tối đa/i);
  });

  test("TC_BK_005 - Refresh reset dữ liệu", async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await page.goto("https://demo5.cybersoft.edu.vn/room-detail/1");

    await bookingPage.selectDate(31, 31);
    await bookingPage.increaseGuest(2);

    await page.reload();

    await expect(page.locator("text=Nhận phòng")).toBeVisible();
  });
  

    
})
test("TC_BK_006 - Chưa login", async ({ page }) => {
    //
    const bookingPage = new BookingPage(page);
    await page.goto("https://demo5.cybersoft.edu.vn/room-detail/1");
    await bookingPage.selectDate(31, 31);
    await bookingPage.increaseGuest(2);
    await bookingPage.clickBooking();
    await bookingPage.confirmBooking();
    await expect(page.getByText(/vui lòng đăng nhập/i)).toBeVisible();
  })
