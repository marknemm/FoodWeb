import { Injectable } from '@angular/core';

/**
 * Manages app-wide (light/dark) theming.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemingService {

  /**
   * Applies theming based off of the configured device theme.
   */
  applyTheming(): void {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this._setTheme(prefersDark.matches ? 'dark' : 'light');

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) =>
      this._setTheme(mediaQuery.matches ? 'dark' : 'light')
    );
  }

  /**
   * Sets the theme that should be used.
   * @param dark true if the dark theme should be set, false if light.
   */
  private _setTheme(theme: 'dark' | 'light') {
    const isDark = (theme === 'dark');
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
  }
}
