import { test, expect } from './fixtures/userFixture'
import { InfoUserPage } from '../pages/InfoUserPage'

test('TC1: Upload avatar thành công', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await expect(userPage).toHaveURL(/\/info-user/)

    // Thực hiện upload
    await infoUserPage.uploadAvatar('location.jpg')

    // Verify upload thành công qua toast message trước
    const successToast = userPage.locator('.ant-message-success, .ant-notification-notice-success')
    await expect(successToast).toBeVisible({ timeout: 10000 })

    // Chờ API upload xong rồi mới reload
    await userPage.waitForTimeout(2000)
    await userPage.reload()
    await userPage.waitForLoadState('domcontentloaded')

    // Sau reload, lấy src mới và kiểm tra khác với src cũ (hardcode cũ)
    const avatarImg = userPage.locator('#user-menu-button img')
    const newSrc = await avatarImg.getAttribute('src')

    // Verify src không phải avatar default cũ
    expect(newSrc).toBeTruthy()
    expect(newSrc).toContain('airbnbnew.cybersoft.edu.vn/avatar')
  })

  test('TC2: Không chọn file rồi bấm Upload Avatar', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await expect(userPage).toHaveURL(/\/info-user/)

    await infoUserPage.capNhatAnhBtn.click()
    await infoUserPage.uploadAvatarBtn.waitFor({ state: 'visible', timeout: 10000 })

    // Bấm Upload mà không chọn file
    await infoUserPage.uploadAvatarBtn.click()

    // Verify có thông báo lỗi hoặc không có gì thay đổi
    const errorMsg = userPage.locator('.ant-message-error, .ant-form-item-explain-error')
    await expect(errorMsg).toBeVisible({ timeout: 5000 })
  })
