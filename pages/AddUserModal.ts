

import { Locator, Page, expect } from '@playwright/test'

export class AddUserModal {
    readonly page: Page

    readonly addModal: Locator
    readonly updateModal: Locator

    readonly nameInput: Locator
    readonly emailInput: Locator
    readonly phoneInput: Locator
    readonly passwordInput: Locator
    readonly genderSelect: Locator
    readonly birthdayInput: Locator
    readonly adminRole: Locator
    readonly userRole: Locator
    readonly submitBtn: Locator

    readonly updateNameInput: Locator
    readonly updatePhoneInput: Locator
    readonly updateBtn: Locator

    constructor(page: Page) {
        this.page = page

        // ✅ Scope theo ant-modal-wrap (wrap bao ngoài, không bị duplicate display issue)
        this.addModal = page.locator('.ant-modal-wrap').filter({ hasText: 'Thêm người dùng' })
        this.updateModal = page.locator('.ant-modal-wrap').filter({ hasText: 'Cập nhật người dùng' })

        // Inputs scope trong addModal
        this.nameInput = this.addModal.locator('#name')
        this.emailInput = this.addModal.locator('#email')
        this.phoneInput = this.addModal.locator('#phone')
        this.passwordInput = this.addModal.locator('#password')
        this.genderSelect = this.addModal.locator('#gender')
        this.birthdayInput = this.addModal.locator('#birthday')
        this.adminRole = this.addModal.getByText('Admin', { exact: true })
        this.userRole = this.addModal.getByText('User', { exact: true })
        this.submitBtn = this.addModal.getByRole('button', { name: 'Thêm người dùng' })

        // Inputs scope trong updateModal
        this.updateNameInput = this.updateModal.locator('#name')
        this.updatePhoneInput = this.updateModal.locator('#phone')
        this.updateBtn = this.updateModal.getByRole('button', { name: 'Cập nhật' })
    }

    async waitForAddModal() {
        await expect(this.addModal).toBeVisible({ timeout: 10000 })
    }

    async waitForUpdateModal() {
        await expect(this.updateModal).toBeVisible({ timeout: 10000 })
    }

    async fillForm(data: {
        name: string
        email: string
        phone: string
        password: string
        gender: 'Nam' | 'Nữ'
        birthday: string
        role: 'Admin' | 'User'
    }) {
        await this.waitForAddModal()

        await this.nameInput.fill('')
        await this.nameInput.fill(data.name)
        await this.emailInput.fill(data.email)
        await this.phoneInput.fill(data.phone)
        await this.passwordInput.fill(data.password)

        // Gender
        await this.genderSelect.click()
        const dropdown = this.page.locator('.ant-select-dropdown:visible')
        await expect(dropdown).toBeVisible()
        await dropdown.getByText(data.gender, { exact: true }).click()

        // Birthday
        await this.birthdayInput.click()
        const day = data.birthday.split('-')[2]
        const dayCell = this.page.locator('.ant-picker-cell')
            .filter({ hasText: new RegExp(`^${day}$`) })
            .first()
        await expect(dayCell).toBeVisible()
        await dayCell.click()

        // Role
        if (data.role === 'Admin') {
            await this.adminRole.click()
        } else {
            await this.userRole.click()
        }
    }

    async submit() {
        await this.submitBtn.click()
    }

    async updateUser(data: {
        name?: string
        phone?: string
    }) {
        await this.waitForUpdateModal()

        if (data.name) {
            await this.updateNameInput.fill('')
            await this.updateNameInput.fill(data.name)
        }

        if (data.phone) {
            await this.updatePhoneInput.fill('')
            await this.updatePhoneInput.fill(data.phone)
        }
    }

    async submitUpdate() {
        await this.updateBtn.click()
    }
}