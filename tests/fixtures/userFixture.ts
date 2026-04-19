import { test as base, expect } from '@playwright/test'
import { HomePage } from '../../pages/homePage'
import { LoginModal } from '../../pages/loginModal'
import { userAccount } from '../../data/account'

type UserFixtures = {
  userPage: any
}

export const test = base.extend<UserFixtures>({
  userPage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await homePage.open()
    await homePage.openLoginModal()

    const loginModal = new LoginModal(page)
    await loginModal.login(userAccount.email, userAccount.password)

    // Chờ login xong
    await page.waitForURL(/demo5\.cybersoft\.edu\.vn/, { timeout: 15000 })

    await use(page)
  }
})

export { expect }