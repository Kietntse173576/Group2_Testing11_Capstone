// tests/fixtures/adminFixture.ts
import { test as base, expect } from '@playwright/test'
import { HomePage } from '../../pages/homePage'
import { LoginModal } from '../../pages/loginModal'
import { AdminPage } from '../../pages/AdminPage'
import { adminAccount } from '../../data/account'

type AdminFixtures = {
  adminPage: AdminPage
}

export const test = base.extend<AdminFixtures>({
  adminPage: async ({ page }, use) => {
    // Login + vào trang admin
    const homePage = new HomePage(page)
    await homePage.open()
    await homePage.openLoginModal()

    const loginModal = new LoginModal(page)
    await loginModal.login(adminAccount.email, adminAccount.password)

    await homePage.avatarBtn.click()

    const adminMenuItem = page.getByRole('link', { name: /To page Admin/i })
    await expect(adminMenuItem).toBeVisible()
    await adminMenuItem.click()

    // Trả về adminPage đã sẵn sàng
    const adminPage = new AdminPage(page)
    await use(adminPage)
  }
})

export { expect }