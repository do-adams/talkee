/**
 * Vitest setup function
 */
export function setup(): void {
  // Fixes build issues for Vuetify 3: https://github.com/vuetifyjs/vuetify/issues/14749#issuecomment-1481017103
  global.CSS = {
    supports: (str: string) => false,
    escape: (str: string) => str
  }
}
