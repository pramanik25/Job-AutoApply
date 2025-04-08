// utils/skillMatcher.js

/**
 * A class to match user skills against job descriptions.
 * It extracts potential skills from a job description and compares them
 * against a user's skill set to determine a match score.
 */
export class SkillMatcher {
  /**
   * Creates an instance of SkillMatcher.
   * @param {string[]} [userSkills=[]] - An array of skills the user possesses.
   */
  constructor(userSkills = []) {
    // Normalize user skills to lowercase and trim whitespace for consistent matching.
    // Use a Set for efficient lookup (O(1) average time complexity for `has`).
    this.userSkills = new Set(userSkills.map(skill => skill.toLowerCase().trim()));

    // A predefined set of common technical skills keywords.
    // IMPORTANT: This list is basic and needs significant expansion and refinement
    // for real-world application. Consider variations, synonyms, and broader categories.
    // It's also beneficial to load this from a configuration file or database.
    this.commonSkillsKeywords = new Set([
      // Programming Languages
      'javascript', 'typescript', 'python', 'java', 'c#', 'csharp', 'c++', 'php', 'ruby', 'go', 'golang', 'swift', 'kotlin', 'scala', 'rust', 'perl', 'lua', 'objective-c', 'dart', 'elixir', 'haskell',

      // Frontend Frameworks/Libraries
      'react', 'react.js', 'reactjs', 'angular', 'angularjs', 'vue', 'vue.js', 'vuejs', 'svelte', 'jquery', 'ember', 'backbone', 'next.js', 'nuxtjs', 'gatsby',

      // Backend Frameworks/Libraries
      'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring', 'springboot', 'spring boot', '.net', 'dotnet', 'asp.net', 'laravel', 'symfony', 'ruby on rails', 'rails', 'phoenix', 'gin', 'ktor',

      // Mobile Development
      'android', 'ios', 'react native', 'flutter', 'xamarin', 'swiftui', 'jetpack compose',

      // Databases
      'sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'microsoft sql server', 'mssql', 'oracle', 'mongodb', 'mongo', 'nosql', 'redis', 'memcached', 'cassandra', 'elasticsearch', 'dynamodb', 'firebase', 'couchbase',

      // Web Technologies & Concepts
      'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'json', 'xml', 'yaml', 'rest', 'restful', 'graphql', 'api', 'apis', 'soap', 'websocket', 'web sockets', 'http', 'https', 'oauth', 'jwt', 'seo', 'accessibility', 'a11y', 'pwa', 'webassembly', 'wasm',

      // Cloud Platforms & Services
      'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud platform', 'heroku', 'digitalocean', 'firebase', 'lambda', 'azure functions', 'google cloud functions', 'ec2', 's3', 'rds', 'ecs', 'eks', 'gke', 'kubernetes', 'k8s', 'docker', 'serverless', 'cloudfront', 'cloudwatch', 'iam', 'vpc',

      // DevOps & Infrastructure
      'ci/cd', 'cicd', 'jenkins', 'gitlab ci', 'github actions', 'travis ci', 'circleci', 'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'nginx', 'apache', 'linux', 'unix', 'bash', 'powershell', 'networking', 'security', 'monitoring', 'logging', 'prometheus', 'grafana', 'datadog', 'splunk', 'elk stack',

      // Testing
      'testing', 'unit testing', 'integration testing', 'e2e testing', 'jest', 'mocha', 'chai', 'jasmine', 'cypress', 'selenium', 'playwright', 'junit', 'pytest', 'rspec', 'phpunit',

      // Tools & Methodologies
      'git', 'github', 'gitlab', 'bitbucket', 'svn', 'jira', 'confluence', 'agile', 'scrum', 'kanban', 'lean', 'design patterns', 'data structures', 'algorithms', 'oop', 'functional programming', 'microservices', ' TDD', 'BDD',

      // Data Science / ML
      'machine learning', 'ml', 'deep learning', 'artificial intelligence', 'ai', 'data science', 'pandas', 'numpy', 'scipy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'jupyter', ' R ', 'big data', 'hadoop', 'spark', 'kafka', 'data analysis', 'data visualization',

      // Others
      'webpack', 'babel', 'npm', 'yarn', 'maven', 'gradle', 'composer', 'pip', 'ui', 'ux', 'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator'
      // Add many more relevant skills, tools, technologies, and variations (e.g., "node js", "c sharp")
    ]);
  }

  /**
   * Extracts potential technical skills from a given text.
   * This is a simplified implementation using keyword matching and basic multi-word checks.
   * For more robust extraction, consider NLP libraries (like spaCy, NLTK - if using Python backend,
   * or compromise.js, natural for Node.js) or more sophisticated regex.
   *
   * @param {string} text - The text content (e.g., job description) to extract skills from. Should be pre-normalized (e.g., lowercase).
   * @returns {Set<string>} A set of unique skills found in the text.
   * @private
   */
  _extractSkills(text) {
    const foundSkills = new Set();
    if (!text) {
      return foundSkills;
    }

    // 1. Simple Word Tokenization and Check against known keywords and user skills
    // Split by spaces and common punctuation, remove empty strings.
    const words = text.split(/[\s.,;!?()"'{}[\]<>+/-]+/);

    words.forEach(word => {
      const cleanWord = word.trim();
      if (cleanWord.length > 1) { // Avoid single characters unless specific (like 'c', 'r' which are handled below)
        // Check if the exact word is a known skill or a user skill
        if (this.commonSkillsKeywords.has(cleanWord) || this.userSkills.has(cleanWord)) {
          foundSkills.add(cleanWord);
        }
        // Handle cases like C# directly
        if (cleanWord === 'c#') foundSkills.add('c#'); // Ensure canonical form
        if (cleanWord === 'c++') foundSkills.add('c++');
        if (cleanWord === '.net') foundSkills.add('.net');
      }
    });

    // 2. Check for specific multi-word phrases or variations (Case-insensitive due to pre-lowercasing)
    // This part is crucial but hard to make exhaustive without advanced NLP.
    // Add canonical forms if variations are found.
    if (text.includes("node.js") || text.includes("node js")) foundSkills.add("node.js");
    if (text.includes("c#") || text.includes("c sharp")) foundSkills.add("c#");
    if (text.includes("react.js") || text.includes("reactjs")) foundSkills.add("react"); // Normalize to 'react' or 'react.js' consistently
    if (text.includes("vue.js") || text.includes("vuejs")) foundSkills.add("vue"); // Normalize
    if (text.includes("angular js") || text.includes("angular.js")) foundSkills.add("angularjs"); // Distinguish legacy AngularJS
    if (text.includes("spring boot")) foundSkills.add("springboot"); // Normalize or use "spring boot"
    if (text.includes("amazon web services")) foundSkills.add("aws");
    if (text.includes("google cloud platform") || text.includes("google cloud")) foundSkills.add("gcp");
    if (text.includes("microsoft azure")) foundSkills.add("azure");
    if (text.includes("ruby on rails")) foundSkills.add("rails");
    if (text.includes("sql server")) foundSkills.add("microsoft sql server");
    if (text.includes("unit test") || text.includes("unit tests")) foundSkills.add("unit testing");
    if (text.includes("integration test") || text.includes("integration tests")) foundSkills.add("integration testing");
    if (text.includes("ci/cd") || text.includes("ci cd") || text.includes("continuous integration") || text.includes("continuous deployment") || text.includes("continuous delivery")) foundSkills.add("ci/cd");
    if (text.includes("machine learning")) foundSkills.add("machine learning");
    if (text.includes("data science")) foundSkills.add("data science");
    if (text.includes("artificial intelligence")) foundSkills.add("artificial intelligence");
    if (text.includes("react native")) foundSkills.add("react native");
    if (text.includes("web services")) foundSkills.add("api"); // Often used interchangeably with API/REST

    // Ensure single char languages like 'r' or 'c' are checked carefully if needed
    // (simple word splitting might miss them or misinterpret)
    if (/\Wc\W/.test(" " + text + " ") && !text.includes("objective-c")) { // Check for standalone 'c' surrounded by non-word chars
       // Ambiguous: Could be C language, could be unrelated. Requires context.
       // Maybe add if userSkills explicitly has 'c'? Or only if commonSkillsKeywords has 'c'?
       // For now, let's avoid adding standalone 'c' due to ambiguity unless explicitly C++ or C# etc.
    }
     if (/\Wr\W/.test(" " + text + " ")) { // Check for standalone 'r'
        if(this.commonSkillsKeywords.has('r') || this.userSkills.has('r')) {
           foundSkills.add('r'); // Add if it's a known skill (like R language)
        }
    }


    // Attempt to remove less specific skills if more specific ones are present
    // Example: if 'react' is found, maybe remove 'javascript' if 'react' implies JS?
    // This is complex and rule-based, can lead to errors. For now, keep all found.
    // if (foundSkills.has('react') || foundSkills.has('angular') || foundSkills.has('vue')) {
    //     foundSkills.delete('javascript'); // Example of potential refinement
    // }
    // if (foundSkills.has('django') || foundSkills.has('flask')) {
    //     foundSkills.delete('python'); // Example
    // }

    return foundSkills;
  }

  /**
   * Checks if the job description is a potential match based on the user's skills
   * and a minimum threshold ratio.
   *
   * @param {string} jobDescription - The full text of the job description.
   * @param {number} [threshold=0.4] - The minimum ratio of (matched skills) / (total skills found in job description)
   *                                   required to consider it a match (value between 0 and 1).
   * @param {boolean} [logDetails=false] - Whether to log the matching details to the console.
   * @returns {boolean} True if the ratio of matched skills meets or exceeds the threshold, false otherwise.
   */
  matchSkills(jobDescription, threshold = 0.4, logDetails = false) {
    // Basic validation
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim() === '') {
      console.warn("SkillMatcher: Job description is empty or invalid.");
      return false;
    }
    if (this.userSkills.size === 0) {
      console.warn("SkillMatcher: No user skills provided to match against.");
      return false;
    }

    // Normalize the job description text
    const descriptionText = jobDescription.toLowerCase();

    // Extract potential skills mentioned in the job description
    const jobSkillsFound = this._extractSkills(descriptionText);

    // If no relevant skills could be extracted from the job description, we cannot determine a match.
    if (jobSkillsFound.size === 0) {
      if (logDetails) {
          console.warn("SkillMatcher: Could not extract any relevant skills from the provided job description.");
      }
      // Depending on requirements, you might return true if userSkills is not empty,
      // assuming any job is potentially relevant if skill extraction fails.
      // However, returning false is safer to indicate a lack of positive confirmation.
      return false;
    }

    // Find the intersection: skills that are both in the job description AND in the user's skills
    const matchedSkills = [...jobSkillsFound].filter(skill => this.userSkills.has(skill));

    // Calculate the match ratio
    // Ratio = (Number of skills the user has that are mentioned in the job) / (Total number of skills mentioned in the job)
    const matchRatio = matchedSkills.length / jobSkillsFound.size;

    // Log details if requested
    if (logDetails) {
      console.log(`--- Skill Match Analysis ---`);
      console.log(`User Skills (${this.userSkills.size}):`, [...this.userSkills]);
      console.log(`Job Skills Found (${jobSkillsFound.size}):`, [...jobSkillsFound]);
      console.log(`Matched Skills (${matchedSkills.length}):`, matchedSkills);
      console.log(`Match Ratio: ${matchedSkills.length} / ${jobSkillsFound.size} = ${matchRatio.toFixed(3)}`);
      console.log(`Threshold: ${threshold}`);
      console.log(`Match Result: ${matchRatio >= threshold}`);
      console.log(`--------------------------`);
    }

    // Return true if the match ratio meets or exceeds the specified threshold
    return matchRatio >= threshold;
  }

  /**
   * Adds a new skill to the user's skill set.
   * Normalizes the skill before adding.
   * @param {string} skill - The skill to add.
   */
  addUserSkill(skill) {
    if (skill && typeof skill === 'string') {
      this.userSkills.add(skill.toLowerCase().trim());
    }
  }

    /**
   * Removes a skill from the user's skill set.
   * Normalizes the skill before attempting removal.
   * @param {string} skill - The skill to remove.
   * @returns {boolean} True if the skill was present and removed, false otherwise.
   */
  removeUserSkill(skill) {
    if (skill && typeof skill === 'string') {
      return this.userSkills.delete(skill.toLowerCase().trim());
    }
    return false;
  }

  /**
   * Gets the current set of user skills.
   * @returns {Set<string>} The set of user skills.
   */
  getUserSkills() {
    return new Set(this.userSkills); // Return a copy to prevent external modification
  }
}

// --- Example Usage ---
/*
const mySkills = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'Git', 'Docker', 'AWS Basics'];
const matcher = new SkillMatcher(mySkills);

const jobDesc1 = `
We are looking for a Senior Frontend Developer proficient in React, Redux, and modern JavaScript (ES6+).
Experience with TypeScript, testing frameworks (Jest/React Testing Library), and CSS-in-JS is a plus.
You should be familiar with Git workflows and RESTful APIs. Basic Node.js knowledge is beneficial.
Needs HTML5 and CSS3 expertise.
`;

const jobDesc2 = `
Seeking a Python developer with strong experience in Django or Flask.
Must know SQL databases like PostgreSQL or MySQL.
Knowledge of Docker, Celery, and cloud platforms (AWS preferred) is highly desirable.
Understanding of REST APIs is required. We use Git for version control.
`;

const jobDesc3 = `
Entry-level position for a web assistant. Needs good communication skills.
Knowledge of Microsoft Office suite is helpful.
`;

console.log("Job 1 Match:", matcher.matchSkills(jobDesc1, 0.5, true)); // Should likely match (React, JS, Node.js, HTML, CSS, Git, SQL/REST?)
console.log("\nJob 2 Match:", matcher.matchSkills(jobDesc2, 0.5, true)); // Should likely NOT match well (Python/Django vs JS focus)
console.log("\nJob 3 Match:", matcher.matchSkills(jobDesc3, 0.5, true)); // Should not match (No tech skills)

matcher.addUserSkill('python');
matcher.addUserSkill('django');
console.log("\nJob 2 Match (after adding Python/Django):", matcher.matchSkills(jobDesc2, 0.5, true)); // Should match better now
*/