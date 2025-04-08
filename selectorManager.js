// selectorManager.js
export const PLATFORM_SELECTORS = {
    linkedin: {
      jobTitle: { 
        selector: '.jobs-unified-top-card__job-title',
        updatedAt: '2023-07-20' 
      },
      // ... other selectors
    },
    indeed: {
      // ... indeed selectors
    }
  };
  
  export function getSelector(platform, elementType) {
    return PLATFORM_SELECTORS[platform]?.[elementType]?.selector || null;
  }
  