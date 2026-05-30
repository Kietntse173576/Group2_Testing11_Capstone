import { RoomDetailPage } from '../pages/RoomDetailPage'
import { test, expect } from './fixtures/userFixture'

test.describe('User - Đánh giá phòng', () => {

  test('TC1: Đánh giá 5 sao và bình luận thành công', async ({ userPage }) => {
    const roomDetailPage = new RoomDetailPage(userPage)

    await roomDetailPage.goToRoomDetail()

    // Scroll xuống phần rating để đảm bảo visible
    await roomDetailPage.ratingStars.first().scrollIntoViewIfNeeded()

    await roomDetailPage.danhGia(5, 'Phòng rất tuyệt vời, view đẹp, sạch sẽ, dịch vụ tốt!')

    // Verify submit thành công - comment xuất hiện hoặc toast hiện ra
    const successToast = userPage.locator('.ant-message-success, .ant-notification-notice-success')
    const newComment = userPage.locator('text=Phòng rất tuyệt vời, view đẹp, sạch sẽ, dịch vụ tốt!')

    await expect(successToast.or(newComment).first()).toBeVisible({ timeout: 10000 })
  })

  test('TC2: Đánh giá 3 sao và bình luận', async ({ userPage }) => {
    const roomDetailPage = new RoomDetailPage(userPage)

    await roomDetailPage.goToRoomDetail()
    await roomDetailPage.ratingStars.first().scrollIntoViewIfNeeded()

    await roomDetailPage.danhGia(3, 'Phòng ổn, vị trí thuận tiện nhưng tiếng ồn hơi nhiều.')

    const successToast = userPage.locator('.ant-message-success, .ant-notification-notice-success')
    const newComment = userPage.locator('text=Phòng ổn, vị trí thuận tiện nhưng tiếng ồn hơi nhiều.')

    await expect(successToast.or(newComment).first()).toBeVisible({ timeout: 10000 })
  })

  test('TC3: Submit bình luận không cần chọn sao', async ({ userPage }) => {
    const roomDetailPage = new RoomDetailPage(userPage)
    await roomDetailPage.goToRoomDetail()
    await roomDetailPage.ratingStars.first().scrollIntoViewIfNeeded()

    // Chỉ điền comment, không chọn sao — app cho phép
    await roomDetailPage.commentInput.fill('Bình luận không kèm đánh giá sao.')
    await roomDetailPage.submitBtn.click()

    // Verify submit thành công
    const successToast = userPage.locator('.ant-message-success, .ant-notification-notice-success')
    const newComment = userPage.locator('text=Bình luận không kèm đánh giá sao.')

    await expect(successToast.or(newComment).first()).toBeVisible({ timeout: 10000 })
})

test('TC4: Submit không nhập bình luận - hiển thị thông báo lỗi', async ({ userPage }) => {
    const roomDetailPage = new RoomDetailPage(userPage)
    await roomDetailPage.goToRoomDetail()
    await roomDetailPage.ratingStars.first().scrollIntoViewIfNeeded()

    // Chỉ chọn sao, không điền comment
    await roomDetailPage.chonSoSao(4)
    await roomDetailPage.submitBtn.click()

    // App hiển thị đúng thông báo này
    const errorMsg = userPage.locator('text=Bạn chưa có nội dung đánh giá')
    await expect(errorMsg).toBeVisible({ timeout: 5000 })
})
})