import test, { expect } from '@playwright/test'
import { HomePage } from '../pages/homePage'
import { LoginModal } from '../pages/loginModal'
import {adminAccount} from '../data/account'
import { AdminPage } from '../pages/AdminPage'

test.describe('Admin page', () => {
    // berforeEach
    test.beforeEach(async ({page}) => {
        // 1. Mở trang chủ
        const homePage = new HomePage(page)
        await homePage.open()
        
        // 2. Mở popup login
        await homePage.openLoginModal()
        
        // 3. Login với account admin
        const loginModal = new LoginModal(page)
        await loginModal.login(adminAccount.email, adminAccount.password)

        // 4. Mở menu user và click vào menu To page admin
        await homePage.avatarBtn.click()
        const adminMenuItem = page.getByRole('link', {name: 'To page admin'})
        await adminMenuItem.click()
    })

    test("test case 1: kiểm tra URL sau khi vào trang admin", async ({page}) => {
        // xác nhận URL sau khi vào trang admin
        const adminPage = new AdminPage(page)
        await expect(page).toHaveURL(/\/admin$/) // URL phải kết thúc bằng /admin
        await expect(adminPage.userManagementMenu).toBeVisible() // kiểm tra hiển thị menu quản lý người dùng
        await expect(adminPage.locationManagementMenu).toBeVisible() // kiểm tra hiển thị menu quản lý vị trí
        await expect(adminPage.roomManagementMenu).toBeVisible() // kiểm tra hiển thị menu quản lý room
        await expect(adminPage.bookingManagementMenu).toBeVisible() // kiểm tra hiển thị menu quản lý booking
    })

})