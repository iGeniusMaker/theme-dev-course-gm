import { lockScroll, unlockScroll } from "@theme/scroll-lock";

class MobileNav extends HTMLElement {
  constructor() {
    super();

    this.toggleMenu = this.toggleMenu.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.closeMobileNavigationPanel =
      this.closeMobileNavigationPanel.bind(this);
    this._toggleButton = null;
    this._mobileNavigationPanel = null;
    this._mobileNavigationOverlay = null;
  }

  connectedCallback() {
    this._toggleButton = this.querySelector(".mobile-navigation__toggle");
    this._mobileNavigationPanel = this.querySelector(".mobile-navigation");
    this._mobileNavigationOverlay = this.querySelector(
      ".mobile-navigation__overlay",
    );

    this._toggleButton.addEventListener("click", this.toggleMenu);
    this._mobileNavigationOverlay.addEventListener(
      "click",
      this.closeMobileNavigationPanel,
    );
    document.addEventListener("keydown", this.onKeydown);
  }

  toggleMenu() {
    this._mobileNavigationPanel.classList.toggle("is-open");
    this._mobileNavigationOverlay.classList.toggle("is-open");

    const isOpen = this._mobileNavigationPanel.classList.contains("is-open");

    this._toggleButton.setAttribute("aria-expanded", isOpen);
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }

  closeMobileNavigationPanel() {
    this._mobileNavigationPanel.classList.remove("is-open");
    this._mobileNavigationOverlay.classList.remove("is-open");
    this._toggleButton.setAttribute("aria-expanded", false);
    unlockScroll();
  }

  onKeydown(e) {
    if (
      e.key.toUpperCase() !== "ESCAPE" ||
      !this._mobileNavigationPanel.classList.contains("is-open")
    )
      return;
    this.closeMobileNavigationPanel();
  }

  disconnectedCallback() {
    this._toggleButton.removeEventListener("click", this.toggleMenu);
    this._mobileNavigationOverlay.removeEventListener(
      "click",
      this.closeMobileNavigationPanel,
    );
    document.removeEventListener("keydown", this.onKeydown);
  }
}

customElements.define("mobile-nav", MobileNav);
