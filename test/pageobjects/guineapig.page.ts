/**
 * Guinea Pig Page Object
 * Page object for the WebdriverIO Guinea Pig demo app Forms screen
 */
class GuineaPigPage {
    /**
     * Selectors for Guinea Pig app elements (Forms screen)
     */
    public get nameInput() {
        return $('~text-input');
    }

    public get inputTextResult() {
        return $('~input-text-result');
    }

    public get activeButton() {
        return $('~button-Active');
    }

    public get switchElement() {
        return $('~switch');
    }

    /**
     * Methods to interact with the page
     */
    public async setName(name: string) {
        await this.nameInput.setValue(name);
    }

    public async clickSubmit() {
        await this.activeButton.click();
    }

    public async getInputTextResult() {
        return await this.inputTextResult.getText();
    }

    public async clickSwitch() {
        await this.switchElement.click();
    }

    public async isSwitchActive(): Promise<boolean> {
        return (await this.switchElement.getAttribute('checked')) === 'true';
    }

    public async open() {
        // Navigate to Forms screen by clicking the Forms tab
        const formsTab = await $('~Forms');
        await formsTab.click();
        // Small pause to ensure screen is ready
        await browser.pause(500);
    }

    // Aliases for compatibility with test code
    public get toast() {
        return this.inputTextResult;
    }

    public get checkbox() {
        return this.switchElement;
    }
}

export default new GuineaPigPage();
