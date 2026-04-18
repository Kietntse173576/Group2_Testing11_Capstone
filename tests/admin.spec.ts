
import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/homePage'
import { LoginModal } from '../pages/loginModal'
import { adminAccount } from '../data/account'
import { AdminPage } from '../pages/AdminPage'
import { AddUserModal } from '../pages/AddUserModal'
import { AddLocationPage } from '../pages/AddLocationPage'

test.describe('Admin page', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.open()
    await homePage.openLoginModal()

    const loginModal = new LoginModal(page)
    await loginModal.login(adminAccount.email, adminAccount.password)

    await homePage.avatarBtn.click()

    const adminMenuItem = page.getByRole('link', { name: /To page Admin/i })
    await expect(adminMenuItem).toBeVisible()
    await adminMenuItem.click()
  })

  test('test case 1: kiểm tra URL sau khi vào trang admin', async ({ page }) => {
    const adminPage = new AdminPage(page)

    await expect(page).toHaveURL(/\/admin$/)
    await expect(adminPage.userManagementMenu).toBeVisible()
    await expect(adminPage.locationManagementMenu).toBeVisible()
    await expect(adminPage.roomManagementMenu).toBeVisible()
    await expect(adminPage.bookingManagementMenu).toBeVisible()
  })

  test('test case 2: thêm và cập nhật người dùng vừa tạo', async ({ page }) => {
    const adminPage = new AdminPage(page)
    const addUserModal = new AddUserModal(page)

    const uniqueEmail = `test${Date.now()}@gmail.com`

    await adminPage.addUserBtn.click()

    await addUserModal.fillForm({
      name: 'Nguyen Van A',
      email: uniqueEmail,
      phone: '0903123123',
      password: '123456',
      gender: 'Nam',
      birthday: '2000-10-10',
      role: 'Admin'
    })

    await addUserModal.submit()

    await adminPage.clickEditBtnByEmail(uniqueEmail)

    await addUserModal.updateUser({
      name: 'Nguyen Van B',
      phone: '0909999999'
    })

    await addUserModal.submitUpdate()
  })

  // ✅ TEST CASE 4: DELETE USER BẤT KỲ
 // ✅ TEST CASE 4: DELETE USER BẤT KỲ

  // 🔥 TEST CASE 5: DELETE + VERIFY ROW BIẾN MẤT
  // test('test case 3: xoá user bất kỳ (có verify)', async ({ page }) => {
  //   const adminPage = new AdminPage(page)
  
  //   await adminPage.goToLastPage()
  
  //   // Lấy text row đầu tiên TRƯỚC khi xoá
  //   const firstRow = page.locator('tbody tr').first()
  //   await firstRow.waitFor({ state: 'visible' })
  //   const rowText = await firstRow.innerText()
  
  //   await adminPage.deleteAnyUser()
  
  //   // Verify row đó đã biến mất
  //   await expect(page.locator('tbody tr').filter({ hasText: rowText })).toHaveCount(0)
  // })

  test('test case 3: xoá user bất kỳ (có verify)', async ({ page }) => {
    const adminPage = new AdminPage(page)
  
    // ✅ Chờ modal cũ đóng hẳn (nếu TC2 vừa chạy xong còn sót)
    await page.waitForSelector('.ant-modal-content', { state: 'hidden', timeout: 10000 }).catch(() => null)
  
    await adminPage.goToLastPage()
  
    // Lấy text row đầu tiên TRƯỚC khi xoá
    const firstRow = page.locator('tbody tr').first()
    await firstRow.waitFor({ state: 'visible' })
    const rowText = await firstRow.innerText()
  
    await adminPage.deleteAnyUser()
  
    // Verify row đó đã biến mất
    await expect(page.locator('tbody tr').filter({ hasText: rowText })).toHaveCount(0)
  })

  test('test case 4: truy cập quản lý vị trí và mở form thêm vị trí', async ({ page }) => {
    const adminPage = new AdminPage(page)
  
    // Click menu "Quản lý vị trí"
    await adminPage.locationManagementMenu.click()
  
    // Verify URL đúng
    await expect(page).toHaveURL(/\/admin\/location/)
  
    // Chờ nút thêm vị trí hiển thị
    await expect(adminPage.addLocationBtn).toBeVisible()
  
    // Click nút thêm vị trí
    await adminPage.addLocationBtn.click()
  })
  test("TC5: Thêm vị trí mới thành công", async ({ page }) => {
    // ✅ Dùng đúng URL
    await page.goto("https://demo5.cybersoft.edu.vn/admin/location");
    await page.waitForLoadState("networkidle");
  
    // Click button thêm vị trí mới
    await page.locator('button:has-text("Thêm vị trí mới")').click();
  
    // Chờ popup xuất hiện
    await page.waitForSelector(".ant-modal-content", { timeout: 10000 });
  
    const addLocationPage = new AddLocationPage(page);
  
    await addLocationPage.fillAllAndSubmit({
      tenViTri: "Văn phòng Hà Nội",
      tinhThanh: "Hà Nội",
      quocGia: "Việt Nam",
      fileName: "location.jpg",
    });
  
    const uploadFileCount = await addLocationPage.fileInput.evaluate((el) => {
      const input = el as HTMLInputElement;
      return input.files ? input.files.length : 0;
    });
    expect(uploadFileCount).toBeGreaterThan(0);
  });

  test("TC6: Cập nhật vị trí bất kỳ", async ({ page }) => {
    // ✅ Đặt test.fail() ở đầu — đây là known bug
    test.fail()
  
    const adminPage = new AdminPage(page)
    const addLocationPage = new AddLocationPage(page)
  
    await adminPage.locationManagementMenu.click()
    await page.waitForLoadState("networkidle")
  
    await addLocationPage.clickEditBtn(0)
  
    await addLocationPage.fillUpdateAndSubmit({
      tenViTri: "Vị trí đã cập nhật",
      tinhThanh: "Hồ Chí Minh",
      quocGia: "Việt Nam",
      fileName: "location.jpg",
    })
  
    await page.waitForTimeout(2000)
  
    // Verify bug: modal không đóng + có thông báo lỗi
    await expect(page.locator('.ant-modal-content')).toBeVisible()
    
    const errorMsg = page.locator('.ant-message-notice-error').first()
    await expect(errorMsg).toBeVisible()
    const errorText = await errorMsg.innerText()
    console.log("BUG confirmed — Thông báo lỗi:", errorText)
    await page.screenshot({ path: "test-results/bug-TC6-update-location.png" })
  })

  
})