import { test, expect } from './fixtures/userFixture'

test.describe('User - Đăng nhập', () => {

  test('TC1: Đăng nhập thành công với tài khoản user', async ({ userPage }) => {
  

    const avatar = userPage.locator('nav button').filter({ has: userPage.locator('img') }).first()
    await expect(avatar).toBeVisible()


    await expect(userPage.locator('a[href="/admin"]')).toHaveCount(0)
  })
})