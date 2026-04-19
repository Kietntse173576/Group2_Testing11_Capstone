// import { test, expect } from './fixtures/adminFixture'
// import { AddRoomModal } from '../pages/AddRoomModal'

// test.describe('Admin - Quản lý Room', () => {

//   test('TC1: Truy cập trang quản lý room', async ({ page, adminPage }) => {
//     await adminPage.roomManagementMenu.click()
//     await expect(page).toHaveURL(/\/admin\/room/)
//   })

//   test('TC2: Thêm phòng mới thành công', async ({ page, adminPage }) => {
//     const addRoomModal = new AddRoomModal(page)

//     await adminPage.roomManagementMenu.click()
//     await page.waitForLoadState('networkidle')

//     await page.locator('button:has-text("Thêm phòng mới")').click()

//     await page.waitForSelector('.ant-modal-content', { timeout: 10000 })
//     await expect(page.locator('p:has-text("Thêm phòng thuê")')).toBeVisible()

//     await addRoomModal.fillForm({
//       tenPhong: 'Phòng test Playwright',
//       moTa: 'Mô tả phòng test',
//       tenViTri: 'Quận 1',
//       soKhach: '2',
//       soPhongNgu: '1',
//       soGiuongNgu: '1',
//       soPhongTam: '1',
//       giaPhong: '500000',
//       fileName: 'location.jpg',
//     })

//     await addRoomModal.submit()

//     await expect(page.locator('.ant-modal-content')).toBeHidden({ timeout: 10000 })
//   })

//   test("TC3: BUG - không có quyền cập nhật phòng", async ({ page, adminPage }) => {
//     const addRoomModal = new AddRoomModal(page)
  
//     // 👉 Gắn tag BUG vào report
//     test.info().annotations.push({
//       type: 'bug',
//       description: 'Không có quyền nhưng vẫn cho phép update phòng (hoặc không show error)'
//     })
  
//     await adminPage.roomManagementMenu.click()
//     await page.waitForLoadState('networkidle')
  
//     await addRoomModal.clickEditBtn(0)
  
//     await expect(page.locator('p:has-text("Cập nhật phòng thuê")')).toBeVisible()
  
//     await addRoomModal.fillUpdateAndSubmit({
//       tenPhong: 'Phòng đã cập nhật',
//       moTa: 'Mô tả đã cập nhật',
//       soKhach: '3',
//       giaPhong: '600000',
//     })
  
   
  
//     const updatedText = page.locator('text=Phòng đã cập nhật')
  
//     // BUG expectation: KHÔNG được update thành công
//     await expect(updatedText).toHaveCount(0)
  
//     // optional: modal vẫn còn hoặc không có change
//     await expect(page.locator('.ant-modal-content')).toBeVisible()
//   })


//   test("TC4: Xoá phòng thành công", async ({ page, adminPage }) => {
//     await adminPage.roomManagementMenu.click()
//     await page.waitForLoadState('networkidle')

//     const firstRow = page.locator('tbody tr').first()
//     await firstRow.waitFor({ state: 'visible' })
  
//     const rowText = await firstRow.innerText()
  

//     const deleteBtn = firstRow.locator('button[aria-label="Delete"]')
//     await deleteBtn.click()
  
//     // Chờ popup confirm xuất hiện
//     const popup = page.locator('div.ant-modal-content')
//     await expect(popup.locator('p:has-text("Xác nhận xoá Phòng")')).toBeVisible()

//     const confirmDeleteBtn = popup.locator('button:has-text("Xoá")')
//     await confirmDeleteBtn.click()

//     await page.waitForTimeout(1000)
  

//     await expect(
//       page.locator('tbody tr').filter({ hasText: rowText })
//     ).toHaveCount(0)
//   })
// })


import { test, expect } from './fixtures/adminFixture'
import { AddRoomModal } from '../pages/AddRoomModal'
import { CsvRow, readCsv } from './utils/readCsv'

test.describe('Admin - Quản lý Room', () => {

  test('TC1: Truy cập trang quản lý room', async ({ page, adminPage }) => {
    await adminPage.roomManagementMenu.click()
    await expect(page).toHaveURL(/\/admin\/room/)
  })

  test('TC2: Thêm phòng mới thành công', async ({ page, adminPage }) => {
    const addRoomModal = new AddRoomModal(page)

    await adminPage.roomManagementMenu.click()
    // await page.waitForLoadState('networkidle')
    await page.waitForLoadState("domcontentloaded")
    await page.locator('button:has-text("Thêm phòng mới")').click()
    await page.waitForSelector('.ant-modal-content', { timeout: 10000 })
    await expect(page.locator('p:has-text("Thêm phòng thuê")')).toBeVisible()

    await addRoomModal.fillForm({
      tenPhong: 'Phòng test Playwright',
      moTa: 'Mô tả phòng test',
      tenViTri: 'Quận 1',
      soKhach: '2',
      soPhongNgu: '1',
      soGiuongNgu: '1',
      soPhongTam: '1',
      giaPhong: '500000',
      fileName: 'location.jpg',
    })

    await addRoomModal.submit()
    await expect(page.locator('.ant-modal-content')).toBeHidden({ timeout: 10000 })
  })

  const updateDatas: CsvRow[] = readCsv('tests/data/room_update_data.csv')
  for (const testData of updateDatas) {
    const title = `TC3: Cập nhật phòng | tenPhong=${testData.tenPhong} => ${testData.expectedResult}`
    const isBug = testData.expectedResult === 'fail'

    test(title, async ({ page, adminPage }) => {
      test.setTimeout(50000) // phải đặt đầu tiên
      if (isBug) test.fail()

      const addRoomModal = new AddRoomModal(page)

      await adminPage.roomManagementMenu.click()
      // await page.waitForLoadState('networkidle')
      
    await page.waitForLoadState("domcontentloaded")
      await addRoomModal.clickEditBtn(0)
      await expect(page.locator('p:has-text("Cập nhật phòng thuê")')).toBeVisible()

      await addRoomModal.fillUpdateAndSubmit({
        tenPhong: testData.tenPhong,
        moTa: testData.moTa,
        soKhach: testData.soKhach,
        giaPhong: testData.giaPhong,
      })

      await page.waitForTimeout(2000)
      await expect(page.locator('.ant-modal-content')).toBeHidden({ timeout: 5000 })
    })
  }
})