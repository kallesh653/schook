// PWA Install Service
class PWAInstallService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstallable = false;

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      console.log('PWA install prompt available');

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa-installable', {
        detail: { installable: true }
      }));
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.deferredPrompt = null;
      this.isInstallable = false;

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    });
  }

  // Check if PWA is installable
  canInstall() {
    return this.isInstallable && this.deferredPrompt !== null;
  }

  // Trigger install prompt
  async install() {
    if (!this.canInstall()) {
      return false;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);

      // Reset the deferred prompt
      this.deferredPrompt = null;
      this.isInstallable = false;

      return outcome === 'accepted';
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  }

  // Check if app is already installed
  isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')
    );
  }
}

export default new PWAInstallService();
