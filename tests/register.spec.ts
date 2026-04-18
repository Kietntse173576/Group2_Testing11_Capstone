import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';

test('Đăng ký tài khoản thành công', async ({ page }) => {
    const registerPage = new RegisterPage(page);
  
    const uniqueEmail = `test_${Date.now()}@gmail.com`;
  
    await registerPage.register({
      name: 'Tuần Kiệt Test',
      email: uniqueEmail,
      password: 'Test@123456',
      phone: '0987654321',
      birthday: '1995-05-20',
      gender: 'male'
    });
  
    // ✅ verify login modal xuất hiện
    await expect(registerPage.loginModalTitle).toBeVisible();
  });