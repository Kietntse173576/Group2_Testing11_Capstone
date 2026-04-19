import { test, expect } from './fixtures/userFixture'
import { InfoUserPage } from '../pages/InfoUserPage'

test.describe('User - Chỉnh sửa hồ sơ', () => {

  test('TC1: Mở modal chỉnh sửa hồ sơ thành công', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await infoUserPage.openChinhSuaHoSo()


    await expect(userPage.locator('.ant-modal-title')).toHaveText('Chỉnh sửa hồ sơ')


    await expect(infoUserPage.emailInput).toBeVisible()
    await expect(infoUserPage.nameInput).toBeVisible()
    await expect(infoUserPage.phoneInput).toBeVisible()
    await expect(infoUserPage.birthdayInput).toBeVisible()
  })

  test('TC2: Cập nhật họ tên thành công', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await infoUserPage.openChinhSuaHoSo()

    await infoUserPage.fillChinhSuaHoSo({
      name: 'Playwright Test User',
    })

    await infoUserPage.submitChinhSua()


    await expect(infoUserPage.editModal).toBeHidden({ timeout: 10000 })

 
    await expect(userPage.locator('text=Playwright Test User').first()).toBeVisible({ timeout: 5000 })
  })

  test('TC3: Cập nhật số điện thoại và giới tính', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await infoUserPage.openChinhSuaHoSo()

    await infoUserPage.fillChinhSuaHoSo({
      phone: '0912345678',
      gioiTinh: 'Nam',
    })

    await infoUserPage.submitChinhSua()

    await expect(infoUserPage.editModal).toBeHidden({ timeout: 10000 })
  })

  test('TC4: Để trống họ tên - không được cập nhật', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await infoUserPage.openChinhSuaHoSo()


    await infoUserPage.nameInput.clear()

    await infoUserPage.submitChinhSua()


    await expect(infoUserPage.editModal).toBeVisible()


    const errorMsg = userPage.locator('.ant-form-item-explain-error')
    await expect(errorMsg).toBeVisible({ timeout: 5000 })
  })

  test('TC5: Cập nhật email thành công', async ({ userPage }) => {
    const infoUserPage = new InfoUserPage(userPage)

    await infoUserPage.goToDashboard()
    await infoUserPage.openChinhSuaHoSo()

    // Đổi sang email mới
    await infoUserPage.emailInput.clear()
    await infoUserPage.emailInput.fill('newemail@gmail.com')
    await infoUserPage.submitChinhSua()
    await expect(infoUserPage.editModal).toBeHidden({ timeout: 10000 })


    await infoUserPage.openChinhSuaHoSo()
    await infoUserPage.emailInput.clear()
    await infoUserPage.emailInput.fill('taodeptry123@gmail.com') 
    await infoUserPage.submitChinhSua()
    await expect(infoUserPage.editModal).toBeHidden({ timeout: 10000 })
})
})