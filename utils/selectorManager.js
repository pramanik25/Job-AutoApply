// utils/selectorManager.js

// Store selectors centrally. Add more as needed.
// IMPORTANT: These WILL change. Keep them updated. Consider adding error reporting if selectors fail.
const SELECTORS = {
    linkedin: {
      jobViewContainer: 'main.scaffold-layout__main', // A container to observe for changes
      jobTitle: '.jobs-unified-top-card__job-title',
      jobDescriptionContainer: '.jobs-description__content .jobs-box__html-content', // More specific
      easyApplyButton: '.jobs-apply-button--top-card button.jobs-apply-button', // Check specific button
      // Add selectors for application form fields
      formInputByName: (name) => `.jobs-easy-apply-form-section__grouping input[name="${name}"]`, // Example
      formFileInput: 'input[type="file"][name="file"]', // Example, adjust based on actual form
      formSubmitButton: 'button[aria-label="Submit application"]', // **USE WITH CAUTION**
    },
    indeed: {
      jobViewContainer: '#viewjob-container', // A container to observe for changes
      jobTitle: '.jobsearch-JobInfoHeader-title',
      jobDescriptionContainer: '#jobDescriptionText',
      applyButton: '#indeedApplyButton, .indeed-apply-button', // Handle variations
      // Add selectors for Indeed application forms (these vary greatly)
      formInputByLabel: (label) => `input[aria-label*="${label}" i], input[placeholder*="${label}" i]`, // Example heuristic
      formFileInput: 'input[type="file"]', // Generic, likely needs refinement
      formSubmitButton: 'button.ia-continueButton, button#form-action-submit', // Example, **USE WITH CAUTION**
    }
    // Add other platforms if needed
  };
  
  export function getSelector(platform, key, args) {
    const platformSelectors = SELECTORS[platform];
    if (!platformSelectors) {
      console.error(`Selectors not defined for platform: ${platform}`);
      return null;
    }
  
    const selectorOrFn = platformSelectors[key];
    if (!selectorOrFn) {
      console.error(`Selector key "${key}" not found for platform: ${platform}`);
      return null;
    }
  
    // If it's a function, call it with args (e.g., for dynamic selectors)
    if (typeof selectorOrFn === 'function') {
      try {
        return selectorOrFn(args);
      } catch (error) {
          console.error(`Error generating selector for ${platform}.${key} with args:`, args, error);
          return null;
      }
    }
  
    // Otherwise, return the static selector string
    return selectorOrFn;
  }
  
  // Helper to safely querySelector
  export function safeQuerySelector(selector) {
      if (!selector) return null;
      try {
          return document.querySelector(selector);
      } catch (error) {
          console.error(`Error querying selector "${selector}":`, error);
          return null;
      }
  }
  
  // Helper to safely querySelectorAll
  export function safeQuerySelectorAll(selector) {
      if (!selector) return [];
      try {
          return document.querySelectorAll(selector);
      } catch (error) {
          console.error(`Error querying selectorAll "${selector}":`, error);
          return [];
      }
  }