// content/indeed.js
import { getSelector, safeQuerySelector, safeQuerySelectorAll } from '../utils/selectorManager.js';

class IndeedJobProcessor {
    constructor() {
        this.platform = 'indeed';
        this.jobDetails = null;
        this.processing = false; // Prevent multiple simultaneous processes

        console.log("Indeed Job Processor Initialized");
        // Indeed might load more statically, but observation or polling might still be needed
        // depending on the specific page structure (e.g., jobs loaded in modals).
        this.init();
    }

    async init() {
         // Wait a moment for initial page load elements
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Attempting to process Indeed job...");
        this.attemptProcessJob(); // Indeed might be ready sooner

         // Listen for notifications from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'showNotification') {
                alert(`[Job AutoApply] ${message.level.toUpperCase()}: ${message.message}`);
            }
        });

        // Future: Consider MutationObserver if needed for dynamic content updates on Indeed job pages
    }

    async attemptProcessJob() {
         if (this.processing) return;
         this.processing = true;

         try {
            this.jobDetails = this.extractJobDetails();
            if (!this.jobDetails?.title || !this.jobDetails?.description) {
                console.log("Indeed job details not found or incomplete.");
                this.processing = false;
                return;
            }
            console.log("Extracted Indeed Job Details:", this.jobDetails);

            // Check if already applied
            const hasAppliedResponse = await chrome.runtime.sendMessage({
                type: 'hasApplied',
                jobIdentifier: this.jobDetails.link
            });
            if (hasAppliedResponse?.applied) {
                console.log(`Already applied to Indeed job ${this.jobDetails.link}. Skipping.`);
                this.showStatusMessage("Already applied to this job.", "info");
                this.processing = false;
                return;
            }


            if (await this.isFresherJob()) {
                console.log("Indeed job identified as potential fresher role.");
                const matchResponse = await chrome.runtime.sendMessage({
                    type: 'skillCheck',
                    jobData: this.jobDetails
                });

                 if (matchResponse && matchResponse.match) {
                    console.log("Skills match. Attempting to start Indeed application.");
                    this.triggerApplyFlow();
                 } else if (matchResponse && matchResponse.reason) {
                     console.log(`Skill check skipped: ${matchResponse.reason}`);
                 }
                 else {
                    console.log("Skills do not match threshold. Saving Indeed job.");
                    this.saveJob();
                 }
            } else {
                console.log("Indeed job does not appear to be a fresher role.");
            }
         } catch (error) {
             console.error("Error processing Indeed job:", error);
             this.showStatusMessage(`Error processing Indeed job: ${error.message}`, "error");
         } finally {
             this.processing = false;
         }
    }


    extractJobDetails() {
        const titleElement = safeQuerySelector(getSelector(this.platform, 'jobTitle'));
        const descriptionElement = safeQuerySelector(getSelector(this.platform, 'jobDescriptionContainer'));
        const applyButton = safeQuerySelector(getSelector(this.platform, 'applyButton'));

        const description = descriptionElement ? descriptionElement.innerText || descriptionElement.textContent : null;

        return {
            title: titleElement?.innerText?.trim(),
            description: description?.trim(),
            // Indeed URLs can be complex, try to get a stable one if possible
            link: window.location.href,
            // Indeed apply check is complex (button text, iframe presence etc.)
            isEasyApply: !!applyButton, // Basic check, may need refinement
            platform: this.platform,
            extractedAt: new Date().toISOString()
        };
    }

     // Use the same fresher logic (or adapt if needed for Indeed patterns)
    async isFresherJob() {
         if (!this.jobDetails?.description) return false;
        const expPattern = /\b(0\s*-\s*1|zero\s*-\s*one|0\s*to\s*1)\s+years?\b|\b(entry-?level|fresher|graduate|intern)\b|\b(no|0|1)\s+years?\s+(of\s+)?experience\b|\bexperience\s+not\s+required\b/i;
        const title = this.jobDetails.title?.toLowerCase() || '';
        const description = this.jobDetails.description.toLowerCase();
        const titleMatch = /\b(junior|jr|entry|graduate|intern)\b/i.test(title);
        const descriptionMatch = expPattern.test(description);
        const excludePattern = /\b(senior|sr|lead|principal|manager|director|vp)\b|\b([2-9]|[1-9]\d+)\+?\s+years?\s+(of\s+)?experience\b/i;
        if (excludePattern.test(title) || excludePattern.test(description)) {
            console.log("Excluding job due to seniority keywords or higher experience requirement.");
            return false;
        }
        return titleMatch || descriptionMatch;
    }

    triggerApplyFlow() {
         if (!this.jobDetails) return;

        const applyButton = safeQuerySelector(getSelector(this.platform, 'applyButton'));
        if (applyButton && this.jobDetails.isEasyApply) {
             console.log("Indeed Apply button found. Sending message to background.");
             chrome.runtime.sendMessage({
                 type: 'startApplication',
                 provider: this.platform,
                 tabId: null, // Background gets sender tab ID
                 jobLink: this.jobDetails.link
             }).then(response => {
                 if (response?.error) {
                     this.showStatusMessage(`Error starting Indeed application: ${response.error}`, "error");
                 } else if(response?.success) {
                     this.showStatusMessage("Indeed application process initiated.", "info");
                     // Indeed often opens applications in an iframe or new tab.
                     // Clicking might be necessary HERE to open the form that the autofill script targets.
                     // applyButton.click(); // Test carefully! This might navigate away or open modal.
                 }
             }).catch(error => {
                 console.error("Error sending startApplication message for Indeed:", error);
                 this.showStatusMessage(`Error initiating Indeed application: ${error.message}`, "error");
             });
        } else {
             console.log("Not an Indeed Apply job or button not found. Saving instead.");
             this.saveJob();
        }
    }

    async saveJob() {
         if (!this.jobDetails) return;
         console.log("Sending message to background to save Indeed job.");
          try {
            const response = await chrome.runtime.sendMessage({
                type: 'saveJob',
                jobData: this.jobDetails
            });
             if (response?.success) {
                 this.showStatusMessage(`Indeed job "${this.jobDetails.title}" saved.`, "success");
             } else {
                  this.showStatusMessage(`Failed to save Indeed job: ${response?.error || 'Unknown reason'}`, "error");
             }
        } catch (error) {
             console.error("Error sending saveJob message for Indeed:", error);
             this.showStatusMessage(`Error saving Indeed job: ${error.message}`, "error");
        }
    }

    showStatusMessage(message, level = "info") {
        console.log(`[Status - ${level.toUpperCase()}] ${message}`);
        // alert(`[Job AutoApply - ${level.toUpperCase()}] ${message}`);
    }
}

// Instantiate
let indeedProcessor = new IndeedJobProcessor();

// if (!window.indeedProcessorInstance) {
//     window.indeedProcessorInstance = new IndeedJobProcessor();
// }