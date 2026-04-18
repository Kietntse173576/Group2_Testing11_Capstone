import { test, expect } from './fixtures/adminFixture'
import { AddUserModal } from '../pages/AddUserModal'

test.describe('Admin - Quản lý người dùng', () => {

  test('TC1: Kiểm tra URL và menu admin', async ({ page, adminPage }) => {
    await expect(page).toHaveURL(/\/admin$/)
    await expect(adminPage.userManagementMenu).toBeVisible()
    await expect(adminPage.locationManagementMenu).toBeVisible()
  })

  test('TC2: Thêm người dùng mới', async ({ page, adminPage }) => {
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
  })

  test('TC3: Cập nhật người dùng vừa tạo', async ({ page, adminPage }) => {
    const addUserModal = new AddUserModal(page)
    const uniqueEmail = `test${Date.now()}@gmail.com`

    // Tạo user trước
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

    // Sau đó cập nhật
    await adminPage.clickEditBtnByEmail(uniqueEmail)
    await addUserModal.updateUser({ name: 'Nguyen Van B', phone: '0909999999' })
    await addUserModal.submitUpdate()
  })

  test('TC4: Xoá user bất kỳ (có verify)', async ({ page, adminPage }) => {
    await page.waitForSelector('.ant-modal-content', { state: 'hidden', timeout: 10000 }).catch(() => null)
    await adminPage.goToLastPage()

    const firstRow = page.locator('tbody tr').first()
    await firstRow.waitFor({ state: 'visible' })
    const rowText = await firstRow.innerText()

    await adminPage.deleteAnyUser()

    await expect(page.locator('tbody tr').filter({ hasText: rowText })).toHaveCount(0)
  })
})