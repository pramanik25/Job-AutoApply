// popup/popup.js

class PopupManager {
  constructor() {
      // DOM Elements
      this.nameInput = document.getElementById('name-input');
      this.emailInput = document.getElementById('email-input');
      this.phoneInput = document.getElementById('phone-input'); // Added phone
      this.skillInput = document.getElementById('skill-input');
      this.skillsContainer = document.getElementById('skills-container');
      this.resumeUpload = document.getElementById('resume-upload');
      this.resumeFilename = document.getElementById('resume-filename');
      this.removeResumeButton = document.getElementById('remove-resume');
      this.uploadProgress = document.getElementById('upload-progress');
      this.saveButton = document.getElementById('save-settings');
      this.statusMessage = document.getElementById('status-message');
      this.savedJobsList = document.getElementById('saved-jobs-list');

      // State
      this.userData = {
          name: '',
          email: '',
          phone: '', // Added phone
          skills: [],
          resume: null // { name: string, content: ArrayBuffer, type: string }
      };

      this.initEventListeners();
      this.loadSavedData();
  }

  async loadSavedData() {
      try {
          const response = await chrome.runtime.sendMessage({ type: 'getSavedData' });
          if (response && !response.error) {
               if (response.userData) {
                   this.userData = { ...this.userData, ...response.userData }; // Merge defaults with loaded data
                   this.nameInput.value = this.userData.name || '';
                   this.emailInput.value = this.userData.email || '';
                   this.phoneInput.value = this.userData.phone || ''; // Added phone
                   this.renderSkills();
                   this.updateResumeDisplay();
               }
               if (response.savedJobs) {
                  this.renderSavedJobs(response.savedJobs);
               } else {
                  this.savedJobsList.innerHTML = '<p>No jobs saved yet.</p>';
               }
          } else {
              this.showStatus(`Error loading data: ${response?.error || 'Unknown error'}`, true);
              this.renderSavedJobs([]); // Show empty state on error
          }
      } catch (error) {
          console.error("Error requesting saved data:", error);
          this.showStatus(`Error loading data: ${error.message}`, true);
          this.savedJobsList.innerHTML = '<p>Could not load saved jobs.</p>';
      }
  }

  renderSkills() {
      this.skillsContainer.innerHTML = ''; // Clear existing skills
      if (this.userData.skills && this.userData.skills.length > 0) {
          this.userData.skills.forEach(skill => {
              const skillChip = document.createElement('div');
              skillChip.className = 'skill-chip';
              skillChip.textContent = skill;

              const removeSpan = document.createElement('span');
              removeSpan.className = 'remove-skill';
              removeSpan.textContent = '×';
              removeSpan.dataset.skill = skill; // Store skill name for removal
              removeSpan.onclick = () => this.removeSkill(skill); // Add click handler directly

              skillChip.appendChild(removeSpan);
              this.skillsContainer.appendChild(skillChip);
          });
      } else {
           const placeholder = document.createElement('span');
           placeholder.className = 'placeholder-chip';
           placeholder.textContent = 'Add skills using the input above...';
           this.skillsContainer.appendChild(placeholder);
      }
  }

   renderSavedJobs(jobs) {
      this.savedJobsList.innerHTML = ''; // Clear previous list
      if (!jobs || jobs.length === 0) {
          this.savedJobsList.innerHTML = '<p>No jobs saved yet.</p>';
          return;
      }

      jobs.slice(-10).reverse().forEach(job => { // Show latest 10 jobs
          const jobItem = document.createElement('div');
          jobItem.className = 'job-item';

          const jobLink = document.createElement('a');
          jobLink.href = job.link || '#';
          jobLink.textContent = job.title || 'Unknown Title';
          jobLink.target = '_blank'; // Open in new tab
          jobLink.rel = 'noopener noreferrer';

          const jobInfo = document.createElement('span');
          const savedDate = job.savedAt ? new Date(job.savedAt).toLocaleDateString() : 'N/A';
          jobInfo.textContent = `Saved on: ${savedDate} | Platform: ${job.platform || 'Unknown'}`;


          jobItem.appendChild(jobLink);
          jobItem.appendChild(jobInfo);
          this.savedJobsList.appendChild(jobItem);
      });
  }


  addSkill(skill) {
      const trimmedSkill = skill.trim();
      if (trimmedSkill && !this.userData.skills.includes(trimmedSkill)) {
          this.userData.skills.push(trimmedSkill);
          this.renderSkills(); // Re-render the list
      }
  }

  removeSkill(skillToRemove) {
      this.userData.skills = this.userData.skills.filter(skill => skill !== skillToRemove);
      this.renderSkills(); // Re-render the list
  }

  updateResumeDisplay() {
      if (this.userData.resume && this.userData.resume.name) {
          this.resumeFilename.textContent = this.userData.resume.name;
          this.removeResumeButton.style.display = 'inline';
          this.resumeUpload.value = ''; // Clear file input visually
      } else {
          this.resumeFilename.textContent = 'No resume uploaded.';
          this.removeResumeButton.style.display = 'none';
      }
  }

  initEventListeners() {
      // Add Skill on Enter
      this.skillInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && this.skillInput.value.trim()) {
              e.preventDefault(); // Prevent form submission if inside a form
              this.addSkill(this.skillInput.value);
              this.skillInput.value = ''; // Clear input field
          }
      });

      // Save Settings Button
      this.saveButton.addEventListener('click', () => this.saveSettings());

      // Resume Upload Handling
      this.resumeUpload.addEventListener('change', (e) => this.handleResumeUpload(e));

      // Remove Resume Button
      this.removeResumeButton.addEventListener('click', () => {
          this.userData.resume = null;
          this.resumeUpload.value = ''; // Clear the file input
          this.updateResumeDisplay();
          this.showStatus('Resume removed. Save settings to confirm.', false, 'warning'); // Indicate action needed
      });
  }

  async handleResumeUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
          this.showStatus('Error: Resume file size exceeds 5MB limit.', true);
          this.resumeUpload.value = ''; // Clear the invalid selection
          return;
      }

      const reader = new FileReader();
      this.uploadProgress.style.display = 'block';
      this.uploadProgress.value = 0;

      reader.onprogress = (e) => {
          if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              this.uploadProgress.value = percent;
          }
      };

      reader.onloadend = (e) => {
          this.uploadProgress.style.display = 'none';
          if (e.target.readyState === FileReader.DONE) {
               // Store as ArrayBuffer
              this.userData.resume = {
                  name: file.name,
                  content: e.target.result, // This is the ArrayBuffer
                  type: file.type
              };
              this.updateResumeDisplay();
              this.showStatus('Resume ready. Save settings to confirm.', false, 'warning'); // Indicate action needed
          } else {
               this.showStatus('Error reading file.', true);
               this.userData.resume = null; // Clear if read failed
               this.updateResumeDisplay();
          }
      };

       reader.onerror = (e) => {
           this.uploadProgress.style.display = 'none';
           console.error("FileReader error:", reader.error);
           this.showStatus(`Error reading file: ${reader.error.message}`, true);
           this.userData.resume = null;
           this.updateResumeDisplay();
       };

      reader.readAsArrayBuffer(file); // Read as ArrayBuffer
  }

  async saveSettings() {
      this.showStatus('Saving...', false, 'info');
      this.saveButton.disabled = true;

      // Update userData object from inputs before saving
      this.userData.name = this.nameInput.value.trim();
      this.userData.email = this.emailInput.value.trim();
      this.userData.phone = this.phoneInput.value.trim(); // Added phone

       // Basic validation
      if (!this.userData.name || !this.userData.email) {
          this.showStatus('Name and Email are required.', true);
          this.saveButton.disabled = false;
          return;
      }
      // Simple email regex (adjust if needed)
      if (!/^\S+@\S+\.\S+$/.test(this.userData.email)) {
          this.showStatus('Invalid email format.', true);
           this.saveButton.disabled = false;
          return;
      }

      try {
          const response = await chrome.runtime.sendMessage({
              type: 'saveUserData',
              userData: this.userData
          });
          if (response?.success) {
              this.showStatus('Settings saved successfully!', false, 'success');
          } else {
              this.showStatus(`Error saving: ${response?.error || 'Unknown error'}`, true);
          }
      } catch (error) {
          console.error("Error sending saveUserData message:", error);
          this.showStatus(`Error saving: ${error.message}`, true);
      } finally {
          this.saveButton.disabled = false;
      }
  }

  showStatus(message, isError = false, level = null) { // level: info, success, error, warning
      this.statusMessage.textContent = message;
      this.statusMessage.className = ''; // Clear previous classes

      if (level === 'info') {
           // Default style, no specific class needed unless you add one
      } else if (isError || level === 'error') {
          this.statusMessage.classList.add('status-error');
      } else if (level === 'success') {
          this.statusMessage.classList.add('status-success');
      } else if (level === 'warning') {
          this.statusMessage.classList.add('status-warning'); // Add CSS for this if needed
          this.statusMessage.style.color = '#ffc107'; // Example warning color
      }


      // Clear message after a delay, unless it's a persistent error/warning?
       setTimeout(() => {
           if (this.statusMessage.textContent === message) { // Only clear if message hasn't changed
               this.statusMessage.textContent = '';
               this.statusMessage.className = '';
           }
       }, isError ? 5000 : 3000); // Show errors longer
  }
}

// Initialize the popup manager when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});