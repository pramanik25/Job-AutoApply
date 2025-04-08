// background/sw.js
import { StorageManager } from '../utils/storageManager.js';
import { SkillMatcher } from '../utils/skillMatcher.js';

const storage = new StorageManager();

// --- Error Handling ---
function handleError(error, context) {
  console.error(`[Error] ${context}:`, error);
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('assets/icons/icon48.png'), // Use getURL for extension path
    title: `AutoApply Error: ${context}`,
    message: error.message || 'An unknown error occurred.',
    priority: 2
  });
}

// --- Message Listener ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Use a wrapper for async operations and error handling
  const asyncHandler = async () => {
    try {
      console.log('Received message:', request.type, 'from', sender.tab?.id || 'popup');
      switch (request.type) {
        case 'skillCheck': {
          if (!request.jobData?.description) {
            throw new Error("Missing job description for skill check.");
          }
          const userData = await storage.getUserData();
          if (!userData.skills || userData.skills.length === 0) {
              console.log("User has no skills defined. Skipping skill check.");
              return { match: false, reason: "No user skills." };
          }
          const matcher = new SkillMatcher(userData.skills);
          const matchResult = matcher.matchSkills(request.jobData.description);
          return { match: matchResult }; // Send response back
        }

        case 'saveJob': {
          if (!request.jobData?.link) {
              throw new Error("Missing job link for saving.");
          }
          await storage.saveJob(request.jobData);
          // Optionally send confirmation back or show notification
          chrome.notifications.create({
              type: 'basic',
              iconUrl: chrome.runtime.getURL('assets/icons/icon48.png'),
              title: 'Job Saved',
              message: `Job "${request.jobData.title || 'Unknown'}" saved for later.`,
              priority: 0
          });
          return { success: true }; // Indicate success
        }

        case 'startApplication': {
          if (!request.provider || !request.tabId) {
            throw new Error("Missing provider or tabId for starting application.");
          }
          await handleApplicationFlow(request.provider, request.tabId, request.jobLink); // Pass jobLink
          return { success: true }; // Indicate the process started
        }

        case 'getSavedData': { // For popup to load data
            const userData = await storage.getUserData();
            const savedJobs = await storage.getSavedJobs();
            return { userData, savedJobs };
        }

        case 'saveUserData': { // For popup to save data
            if (!request.userData) {
                throw new Error("Missing user data for saving.");
            }
            await storage.saveUserData(request.userData);
            return { success: true };
        }

         case 'logAppliedJob': { // Content script reports successful application attempt
            if (!request.jobIdentifier) {
                throw new Error("Missing job identifier for logging application.");
            }
            await storage.logAppliedJob(request.jobIdentifier);
            return { success: true };
         }

         case 'hasApplied': { // Content script checks before applying
            if (!request.jobIdentifier) {
                throw new Error("Missing job identifier for checking application status.");
            }
            const applied = await storage.hasApplied(request.jobIdentifier);
            return { applied };
         }


        default:
          console.warn('Unknown message type received:', request.type);
          return { error: 'Unknown message type' }; // Indicate error
      }
    } catch (error) {
      handleError(error, `Processing message ${request.type}`);
      // Ensure a response is sent even on error for promises waiting
      return { error: error.message || 'Failed to process request.' };
    }
  };

  // Execute the async handler and manage sendResponse
  asyncHandler().then(sendResponse);

  // Return true to indicate that sendResponse will be called asynchronously
  return true;
});

// --- Application Flow Logic ---
async function handleApplicationFlow(provider, tabId, jobLink) {
  try {
    console.log(`Starting application flow for ${provider} on tab ${tabId}`);
    const userData = await storage.getUserData();

    // Basic check for essential data
    if (!userData.name || !userData.email || !userData.resume) {
        handleError(new Error("User profile (name, email, resume) is incomplete."), "Application Flow Start");
        // Optionally notify the specific tab
        chrome.tabs.sendMessage(tabId, { type: 'showNotification', message: 'Cannot apply: Profile incomplete. Please check extension settings.', level: 'error' }).catch(e => console.warn("Could not send message to tab", e));
        return;
    }

     // Check if already applied via storage BEFORE injecting script
    if (jobLink && await storage.hasApplied(jobLink)) {
        console.log(`Already attempted application for ${jobLink}. Skipping.`);
         chrome.tabs.sendMessage(tabId, { type: 'showNotification', message: 'Application already attempted for this job.', level: 'info' }).catch(e => console.warn("Could not send message to tab", e));
        return;
    }


    // Inject the content script function to perform the autofill
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: autoFillApplication, // This function will run in the content script context
      args: [userData, provider, jobLink] // Pass necessary data including jobLink
    });

    console.log(`Executed autoFill script for ${provider} on tab ${tabId}`);

  } catch (error) {
    handleError(error, `Application Flow for ${provider}`);
     // Notify the specific tab about the failure
     chrome.tabs.sendMessage(tabId, { type: 'showNotification', message: `Failed to start application: ${error.message}`, level: 'error' }).catch(e => console.warn("Could not send message to tab", e));
  }
}

// --- Auto-Fill Function (to be injected) ---
// IMPORTANT: This function runs in the PAGE's context, NOT the service worker's.
// It CANNOT access service worker variables directly or use chrome.* APIs (unless explicitly passed).
// It uses DOM manipulation based on the `provider`.
function autoFillApplication(userData, provider, jobLink) {
    console.log(`[Content Script] Starting autoFillApplication for ${provider}`, userData);

    // Helper to fill input safely
    const fillInput = (selector, value) => {
        try {
            const input = document.querySelector(selector);
            if (input && value) {
                input.value = value;
                // Dispatch input and change events to simulate user interaction, required by some frameworks (React, Vue etc.)
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`[Content Script] Filled ${selector} with ${value.substring(0,15)}...`);
            } else if (!input) {
                 console.warn(`[Content Script] Input not found: ${selector}`);
            }
        } catch (error) {
            console.error(`[Content Script] Error filling input ${selector}:`, error);
        }
    };

    // Helper to handle file input
    const handleFileInput = (selector, resumeData) => {
        try {
            const fileInput = document.querySelector(selector);
            if (fileInput && resumeData?.content && resumeData?.name && resumeData?.type) {
                const dataTransfer = new DataTransfer();
                // Convert ArrayBuffer back to Blob/File
                const resumeBlob = new Blob([resumeData.content], { type: resumeData.type });
                const resumeFile = new File([resumeBlob], resumeData.name, { type: resumeData.type });

                dataTransfer.items.add(resumeFile);
                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
                console.log(`[Content Script] Attached resume "${resumeData.name}" to ${selector}`);
            } else if (!fileInput) {
                 console.warn(`[Content Script] File input not found: ${selector}`);
            } else if (!resumeData?.content) {
                 console.warn(`[Content Script] Resume content missing for ${selector}`);
            }
        } catch (error) {
            console.error(`[Content Script] Error handling file input ${selector}:`, error);
        }
    };

    // Platform-specific strategies
    const strategies = {
        linkedin: () => {
            console.log('[Content Script] Applying LinkedIn strategy...');
            // Use selectorManager logic adapted for injection context (cannot import directly)
            // These selectors need to be maintained carefully!
            fillInput('input[id*="name" i][type="text"]', userData.name); // More robust selector
            fillInput('input[id*="email" i][type="email"]', userData.email);
            fillInput('input[id*="phone" i][type="tel"]', userData.phone); // Assuming phone is in userData

            // Add more fields: location, custom questions (very difficult) etc.

            handleFileInput('input[type="file"][name*="resume" i]', userData.resume); // Common pattern

            // **DO NOT AUTO-SUBMIT** - Requires user action
            console.log('[Content Script] LinkedIn form filled (partially). Please review and submit.');
            alert('Job form pre-filled. Please review carefully and submit manually.'); // Notify user

            // Log attempt AFTER filling (even if not submitted by script)
            chrome.runtime.sendMessage({ type: 'logAppliedJob', jobIdentifier: jobLink });
        },
        indeed: () => {
            console.log('[Content Script] Applying Indeed strategy...');
            // Indeed forms are highly variable (iframes, different structures)
            // This requires significant effort and robust selectors/logic

            // Example (likely needs adjustment)
            fillInput('input#input-firstName', userData.name?.split(' ')[0]); // Assuming first name
            fillInput('input#input-lastName', userData.name?.split(' ').slice(1).join(' ')); // Assuming last name
            fillInput('input#input-email', userData.email);
            fillInput('input#input-phone', userData.phone);

            handleFileInput('input#resume-upload-input', userData.resume); // Example selector

            // **DO NOT AUTO-SUBMIT** - Requires user action
            console.log('[Content Script] Indeed form filled (partially). Please review and submit.');
            alert('Job form pre-filled. Please review carefully and submit manually.'); // Notify user

             // Log attempt AFTER filling (even if not submitted by script)
            chrome.runtime.sendMessage({ type: 'logAppliedJob', jobIdentifier: jobLink });
        }
    };

    if (strategies[provider]) {
        strategies[provider]();
    } else {
        console.error(`[Content Script] Unknown provider: ${provider}`);
    }
}

// --- Optional: Add listeners for extension install/update ---
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    console.log('Extension installed.');
    // Setup default settings or open onboarding page
  } else if (details.reason === 'update') {
    console.log('Extension updated to version:', chrome.runtime.getManifest().version);
    // Perform migration tasks if necessary
  }
});

console.log("Service Worker started."); // Log SW startup