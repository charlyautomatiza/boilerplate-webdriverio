/**
 * Guinea Pig Page Object
 * Page object for the WebdriverIO Guinea Pig demo app
 */
class GuineaPigPage {
    /**
     * Selectors for Guinea Pig app elements
     */
    public get nameInput() {
        return $('~input-text-result');
    }

    public get submitButton() {
        return $('~button-submit');
    }

    public get toast() {
        return $('~toast-text');
    }

    public get checkbox() {
        return $('~checkbox');
    }

    /**
     * Methods to interact with the page
     */
    public async setName(name: string) {
        await this.nameInput.setValue(name);
    }

    public async clickSubmit() {
        await this.submitButton.click();
    }

    public async getToastText() {
        return await this.toast.getText();
    }

    public async clickCheckbox() {
        await this.checkbox.click();
    }

    public async isCheckboxChecked() {
        return await this.checkbox.isSelected();
    }

    public async open() {
        // The app should already be open via the capability in wdio.conf.ts
        // This method can be used to navigate to specific screens if needed
        await browser.pause(1000); // Small pause to ensure app is ready
    }
}

export default new GuineaPigPage();
