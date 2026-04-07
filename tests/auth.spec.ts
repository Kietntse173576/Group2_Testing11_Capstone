import test, { expect } from '@playwright/test'
import { HomePage } from '../pages/homePage'
import { LoginModal } from '../pages/loginModal'
import {adminAccount} from '../data/account' // import dữ liệu account

test.describe('Authentication login tests', () => {
    test('Login with valid admin account', async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.open()
        await homePage.openLoginModal()

        // login với account hợp lệ
        const loginModal = new LoginModal(page)
        await loginModal.login(adminAccount.email, adminAccount.password)

        // xác nhận login thành công bằng cách kiểm tra avatar hiển thị
        // case 1: hiển thị name của user ở header
        await expect(homePage.avatarBtn).toContainText(adminAccount.name)

        // case 2: kiểm tra xuất hiện menu To page admin ở user menu
        await homePage.avatarBtn.click()
        const adminMenuItem = page.getByRole('link', {name: 'To page admin'})
        await expect(adminMenuItem).toBeVisible()
    })
})