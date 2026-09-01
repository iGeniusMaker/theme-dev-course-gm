const lockScroll = (() => {
  let originalBodyOverflow = "";
  let originalBodyPaddingRight = "";

  function lock() {
    originalBodyOverflow = document.body.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
  }

  function unlock() {
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
  }

  return {
    lock,
    unlock,
  };
})();

class MobileNav extends HTMLElement {
  constructor() {
    super();
    this.toggleButton = null;
    this.mobileNavigationPanel = null;
    this.mobileNavigationOverlay = null;

    this.bindEvents();
  }

  bindEvents() {
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMobileNavigationPanel =
      this.closeMobileNavigationPanel.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }
  connectedCallback() {
    this.toggleButton = this.querySelector(".mobile-navigation__toggle");
    this.mobileNavigationPanel = this.querySelector(".mobile-navigation");
    this.mobileNavigationOverlay = this.querySelector(
      ".mobile-navigation__overlay",
    );

    this.toggleButton.addEventListener("click", this.toggleMenu);
    this.mobileNavigationOverlay.addEventListener(
      "click",
      this.closeMobileNavigationPanel,
    );
    document.addEventListener("keydown", this.onKeydown);
  }

  toggleMenu() {
    this.mobileNavigationPanel.classList.toggle("is-open");
    this.mobileNavigationOverlay.classList.toggle("is-open");
    const isOpen = this.mobileNavigationPanel.classList.contains("is-open");
    this.toggleButton.setAttribute("aria-expanded", isOpen);

    if (isOpen) {
      lockScroll.lock();
    } else {
      lockScroll.unlock();
    }
  }

  closeMobileNavigationPanel() {
    this.mobileNavigationPanel.classList.remove("is-open");
    this.mobileNavigationOverlay.classList.remove("is-open");
    this.toggleButton.setAttribute("aria-expanded", false);
    lockScroll.unlock();
  }

  onKeydown(e) {
    if (
      e.key.toUpperCase() !== "ESCAPE" ||
      !this.mobileNavigationPanel.classList.contains("is-open")
    )
      return;

    this.closeMobileNavigationPanel();
  }

  disconnectedCallback() {
    this.toggleButton.removeEventListener("click", this.toggleMenu);
    this.mobileNavigationOverlay.removeEventListener(
      "click",
      this.closeMobileNavigationPanel,
    );
    document.removeEventListener("keydown", this.onKeydown);
    console.log("Disconnected");
  }
}

customElements.define("mobile-nav", MobileNav);
