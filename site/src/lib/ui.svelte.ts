export const uiManager = $state({
	isMenuOpen: false,
	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
	}
});
