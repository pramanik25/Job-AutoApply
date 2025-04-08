// utils/storageManager.js
const USER_DATA_KEY = 'userData';
const SAVED_JOBS_KEY = 'savedJobs';
const APPLIED_JOBS_KEY = 'appliedJobs'; // Track applied jobs to avoid duplicates

export class StorageManager {
  async getUserData() {
    try {
      const { [USER_DATA_KEY]: data } = await chrome.storage.local.get(USER_DATA_KEY);
      // Provide default structure if data is missing or incomplete
      return {
        name: data?.name || '',
        email: data?.email || '',
        skills: data?.skills || [],
        resume: data?.resume || null, // { name: string, content: ArrayBuffer, type: string }
      };
    } catch (error) {
      console.error("Error getting user data:", error);
      return { name: '', email: '', skills: [], resume: null }; // Return default on error
    }
  }

  async saveUserData(data) {
    try {
      await chrome.storage.local.set({ [USER_DATA_KEY]: data });
      console.log("User data saved:", data);
    } catch (error) {
      console.error("Error saving user data:", error);
      // Optional: Notify user of save failure
    }
  }

  async saveJob(job) {
    try {
      const { [SAVED_JOBS_KEY]: jobs = [] } = await chrome.storage.local.get(SAVED_JOBS_KEY);
      // Avoid duplicates based on a unique identifier (e.g., link or a generated ID)
      if (!jobs.some(savedJob => savedJob.link === job.link)) {
          jobs.push({ ...job, savedAt: new Date().toISOString() });
          await chrome.storage.local.set({ [SAVED_JOBS_KEY]: jobs });
          console.log("Job saved:", job);
      } else {
          console.log("Job already saved:", job.link);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  }

  async getSavedJobs() {
    try {
      const { [SAVED_JOBS_KEY]: jobs } = await chrome.storage.local.get(SAVED_JOBS_KEY);
      return jobs || [];
    } catch (error) {
      console.error("Error getting saved jobs:", error);
      return [];
    }
  }

   async logAppliedJob(jobIdentifier) { // Use job URL or a unique ID
    try {
      const { [APPLIED_JOBS_KEY]: applied = [] } = await chrome.storage.local.get(APPLIED_JOBS_KEY);
      if (!applied.includes(jobIdentifier)) {
          applied.push(jobIdentifier);
          await chrome.storage.local.set({ [APPLIED_JOBS_KEY]: applied });
          console.log("Logged applied job:", jobIdentifier);
      }
    } catch (error) {
      console.error("Error logging applied job:", error);
    }
  }

  async hasApplied(jobIdentifier) {
     try {
        const { [APPLIED_JOBS_KEY]: applied = [] } = await chrome.storage.local.get(APPLIED_JOBS_KEY);
        return applied.includes(jobIdentifier);
     } catch (error) {
        console.error("Error checking applied status:", error);
        return false; // Fail safe: assume not applied if error occurs
     }
  }
}