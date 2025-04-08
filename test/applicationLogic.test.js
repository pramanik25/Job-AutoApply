// test/applicationLogic.test.js
describe('Application Logic', () => {
    beforeEach(() => {
      chrome.storage.local.clear();
    });
  
    test('Skill matching algorithm', async () => {
      const matcher = new SkillMatcher(['JavaScript', 'React']);
      const description = 'Seeking frontend developer with React experience';
      expect(matcher.matchSkills(description)).toBe(true);
    });
  });