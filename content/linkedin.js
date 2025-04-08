// content/linkedin.js
import { getSelector, safeQuerySelector, safeQuerySelectorAll } from '../utils/selectorManager.js'; // Use relative path for Webpack

class LinkedInJobProcessor {
    constructor() {
        this.platform = 'linkedin';
        this.jobDetails = null;
        this.observer = null; // MutationObserver
        this.processing = false; // Prevent multiple simultaneous processes
        this.checkInterval = null; // Fallback check interval

        console.log("LinkedIn Job Processor Initialized");
        this.init();
    }

    init() {
        // Use MutationObserver to detect when job details load (LinkedIn loads dynamically)
        const targetNodeSelector = getSelector(this.platform, 'jobViewContainer');
        const targetNode = safeQuerySelector(targetNodeSelector);

        if (targetNode) {
            this.setupObserver(targetNode);
            // Initial check in case content is already loaded
            this.attemptProcessJob();
        } else {
            console.warn(`Target node (${targetNodeSelector}) not found immediately. Using interval fallback.`);
            // Fallback: Check periodically if target node appears
            this.checkInterval = setInterval(() => {
                const node = safeQuerySelector(targetNodeSelector);
                if (node) {
                    clearInterval(this.checkInterval);
                    this.checkInterval = null;
                    this.setupObserver(node);
                    this.attemptProcessJob(); // Try processing once the container is found
                }
            }, 1000); // Check every second

             // Timeout fallback after a reasonable period
            setTimeout(() => {
                if(this.checkInterval) {
                    clearInterval(this.checkInterval);
                    console.error("LinkedIn job container not found after timeout.");
                }
            }, 15000); // Stop checking after 15 seconds
        }
         // Listen for notifications from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'showNotification') {
                alert(`[Job AutoApply] ${message.level.toUpperCase()}: ${message.message}`);
            }
            // Keep the channel open for other listeners if needed, though unlikely here
            // return true;
        });
    }

    setupObserver(targetNode) {
        const config = { childList: true, subtree: true };
        this.observer = new MutationObserver((mutationsList, observer) => {
            // Check if relevant content (like title or apply button) has appeared or changed
             for(const mutation of mutationsList) {
                 if (mutation.type === 'childList' || mutation.type === 'subtree') {
                     // Be efficient: Check only if necessary elements might have loaded
                      if (safeQuerySelector(getSelector(this.platform, 'jobTitle')) &&
                          safeQuerySelector(getSelector(this.platform, 'jobDescriptionContainer'))) {
                            this.attemptProcessJob();
                            // Maybe disconnect observer if job is processed? Or keep observing for changes?
                            // observer.disconnect(); // Disconnect if you only process once per load
                            break; // Stop checking mutations for this batch
                      }
                 }
             }

        });
        this.observer.observe(targetNode, config);
        console.log("MutationObserver setup on:", targetNode);
    }

    attemptProcessJob() {
        // Debounce or prevent re-processing if already running
        if (this.processing) {
            return;
        }
        this.processing = true;
        console.log("Attempting to process job...");

        // Add a small delay to allow dynamic content to potentially settle
        setTimeout(async () => {
            try {
                const jobData = this.extractJobDetails();
                if (!jobData?.title || !jobData?.description) {
                    console.log("Job details not fully loaded yet.");
                    this.processing = false; // Reset flag
                    return; // Wait for more mutations or next check
                }

                this.jobDetails = jobData; // Store details once extracted
                console.log("Extracted Job Details:", this.jobDetails);

                 // Check if already applied before doing anything else
                 const hasAppliedResponse = await chrome.runtime.sendMessage({
                     type: 'hasApplied',
                     jobIdentifier: this.jobDetails.link
                 });

                 if (hasAppliedResponse?.applied) {
                     console.log(`Already applied to ${this.jobDetails.link}. Skipping.`);
                     this.showStatusMessage("Already applied to this job.", "info");
                     this.processing = false;
                     // Consider disconnecting observer here if processing is truly finished for this page view
                     // if(this.observer) this.observer.disconnect();
                     return;
                 }


                if (await this.isFresherJob()) {
                    console.log("Job identified as potential fresher role.");
                    const matchResponse = await chrome.runtime.sendMessage({
                        type: 'skillCheck',
                        jobData: this.jobDetails
                    });

                    if (matchResponse && matchResponse.match) {
                        console.log("Skills match. Attempting to start application.");
                        this.triggerApplyFlow();
                    } else if (matchResponse && matchResponse.reason) {
                         console.log(`Skill check skipped: ${matchResponse.reason}`);
                         // Optionally save if skill check skipped due to no user skills?
                    }
                    else {
                        console.log("Skills do not match threshold. Saving job.");
                        this.saveJob();
                    }
                } else {
                    console.log("Job does not appear to be a fresher role.");
                    // Optionally: Save non-fresher jobs too? Or just ignore?
                }
            } catch (error) {
                console.error("Error processing job:", error);
                this.showStatusMessage(`Error processing job: ${error.message}`, "error");
            } finally {
                 // Reset processing flag AFTER async operations complete
                this.processing = false;
            }
        }, 500); // Short delay (adjust as needed)
    }

    extractJobDetails() {
        const titleElement = safeQuerySelector(getSelector(this.platform, 'jobTitle'));
        const descriptionElement = safeQuerySelector(getSelector(this.platform, 'jobDescriptionContainer'));
        const easyApplyButton = safeQuerySelector(getSelector(this.platform, 'easyApplyButton'));

        // Get description text, handling potential HTML structure within
        const description = descriptionElement ? descriptionElement.innerText || descriptionElement.textContent : null;

        return {
            title: titleElement?.innerText?.trim(),
            description: description?.trim(),
            link: window.location.href,
            isEasyApply: !!easyApplyButton, // Check if the specific Easy Apply button exists
            platform: this.platform,
            extractedAt: new Date().toISOString()
        };
    }

    async isFresherJob() {
        if (!this.jobDetails?.description) return false;

        // Improved Regex: handles "0-1", "0 - 1", "1 year", "entry level", "entry-level", "graduate" etc.
        // Case-insensitive matching
        const expPattern = /\b(0\s*-\s*1|zero\s*-\s*one|0\s*to\s*1)\s+years?\b|\b(entry-?level|fresher|graduate|intern)\b|\b(no|0|1)\s+years?\s+(of\s+)?experience\b|\bexperience\s+not\s+required\b/i;

        // Check title as well? Sometimes titles indicate entry level.
        const title = this.jobDetails.title?.toLowerCase() || '';
        const description = this.jobDetails.description.toLowerCase();

        const titleMatch = /\b(junior|jr|entry|graduate|intern)\b/i.test(title);
        const descriptionMatch = expPattern.test(description);

        // Avoid matching if keywords like "senior", "sr", "lead", "manager", or higher year counts are present
        const excludePattern = /\b(senior|sr|lead|principal|manager|director|vp)\b|\b([2-9]|[1-9]\d+)\+?\s+years?\s+(of\s+)?experience\b/i;
        if (excludePattern.test(title) || excludePattern.test(description)) {
            console.log("Excluding job due to seniority keywords or higher experience requirement.");
            return false;
        }


        return titleMatch || descriptionMatch;
    }

    triggerApplyFlow() {
        if (!this.jobDetails) return;

        // Check again if it's an easy apply job before triggering
        const easyApplyButton = safeQuerySelector(getSelector(this.platform, 'easyApplyButton'));
         if (easyApplyButton && this.jobDetails.isEasyApply) {
            console.log("Easy Apply button found. Sending message to background to start application.");
            // Send message to background script to inject the autoFill function
            chrome.runtime.sendMessage({
                type: 'startApplication',
                provider: this.platform,
                tabId: null, // Background script will get the sender tab ID automatically
                jobLink: this.jobDetails.link // Send job link for logging/checking
            }).then(response => {
                if (response?.error) {
                    this.showStatusMessage(`Error starting application: ${response.error}`, "error");
                } else if(response?.success) {
                    this.showStatusMessage("Application process initiated.", "info");
                     // Optional: click the Easy Apply button *after* confirming background started
                     // easyApplyButton.click(); // Uncomment cautiously if needed
                }
            }).catch(error => {
                 console.error("Error sending startApplication message:", error);
                 this.showStatusMessage(`Error initiating application: ${error.message}`, "error");
            });
         } else {
             console.log("Not an Easy Apply job or button not found. Saving instead.");
             this.saveJob(); // Save if not easy apply
         }
    }

    async saveJob() {
        if (!this.jobDetails) return;
        console.log("Sending message to background to save job.");
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'saveJob',
                jobData: this.jobDetails
            });
             if (response?.success) {
                 this.showStatusMessage(`Job "${this.jobDetails.title}" saved.`, "success");
             } else {
                  this.showStatusMessage(`Failed to save job: ${response?.error || 'Unknown reason'}`, "error");
             }
        } catch (error) {
             console.error("Error sending saveJob message:", error);
             this.showStatusMessage(`Error saving job: ${error.message}`, "error");
        }
    }

    // Simple UI feedback (can be improved with a proper UI element)
    showStatusMessage(message, level = "info") { // levels: info, success, error, warning
        console.log(`[Status - ${level.toUpperCase()}] ${message}`);
        // Optional: Inject a temporary div or use notifications
        // Example: alert(`[Job AutoApply - ${level.toUpperCase()}] ${message}`);
    }

     // Cleanup logic if needed when the script is detached or page navigates
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
            console.log("MutationObserver disconnected.");
        }
         if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
         }
    }
}

// Instantiate the processor when the script runs
let processor = new LinkedInJobProcessor();

// Note: Content scripts can be re-injected under some navigation scenarios.
// Basic handling to avoid multiple instances (might need more robust solution):
// if (!window.linkedInProcessorInstance) {
//     window.linkedInProcessorInstance = new LinkedInJobProcessor();
// }