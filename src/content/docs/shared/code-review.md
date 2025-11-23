---
title: Code Review
description: Code review guidelines and standards for all projects.
---

# Code Review

This page documents code review guidelines and standards for all projects. Code reviews are essential for maintaining code quality and sharing knowledge.

## Review Objectives

Code reviews serve multiple purposes:

1. **Code Quality**: Ensure code meets standards and best practices
2. **Bug Prevention**: Catch bugs before they reach production
3. **Knowledge Sharing**: Share knowledge across the team
4. **Consistency**: Maintain consistent coding style
5. **Security**: Identify security vulnerabilities
6. **Performance**: Spot performance issues early

## Review Checklist

### Functionality

- [ ] Does the code work as intended?
- [ ] Are edge cases handled?
- [ ] Are error cases handled?
- [ ] Does it integrate properly with existing code?
- [ ] Are there any side effects?

### Code Quality

- [ ] Is the code readable and maintainable?
- [ ] Does it follow project conventions?
- [ ] Are naming conventions followed?
- [ ] Is code properly organized?
- [ ] Are there any code smells?
- [ ] Is code DRY (Don't Repeat Yourself)?

### Performance

- [ ] Are there any performance issues?
- [ ] Are there unnecessary operations?
- [ ] Are resources properly disposed?
- [ ] Are there memory leaks?
- [ ] Is the code optimized appropriately?

### Security

- [ ] Are inputs validated?
- [ ] Are sensitive data handled securely?
- [ ] Are there security vulnerabilities?
- [ ] Are API keys/secrets properly managed?
- [ ] Is authentication/authorization correct?

### Testing

- [ ] Are tests included?
- [ ] Do tests cover the new functionality?
- [ ] Are edge cases tested?
- [ ] Do tests pass?
- [ ] Is test coverage adequate?

## Review Process

### Timeline

- **Small PRs** (< 200 lines): Review within 24 hours
- **Medium PRs** (200-500 lines): Review within 48 hours
- **Large PRs** (> 500 lines): Review within 72 hours

**Note:** Break large PRs into smaller ones when possible.

### Reviewers

- At least **one approval** required before merging
- For critical changes, require **two approvals**
- Author should not approve their own PR

### Review Steps

1. **Initial Review**: Reviewer reads through the code
2. **Comments**: Reviewer adds comments for issues/questions
3. **Discussion**: Author and reviewer discuss comments
4. **Changes**: Author addresses feedback
5. **Re-review**: Reviewer checks if changes address concerns
6. **Approval**: Reviewer approves when satisfied

## Review Comments

### Comment Types

**Must Fix:**
- Critical bugs
- Security issues
- Breaking changes
- Code that doesn't work

**Should Fix:**
- Code quality issues
- Performance concerns
- Best practice violations
- Style inconsistencies

**Suggestion:**
- Alternative approaches
- Potential improvements
- Nice-to-have changes

**Question:**
- Clarification needed
- Understanding check
- Design decisions

### Writing Good Comments

**Be Constructive:**
```
Good: "Consider extracting this logic into a separate method for better reusability."

Bad: "This is wrong."
```

**Be Specific:**
```
Good: "The null check on line 45 should use the null-conditional operator (?.) instead."

Bad: "Fix this."
```

**Suggest Solutions:**
```
Good: "This could be simplified using a switch expression: switch (type) { case A: return 1; ... }"

Bad: "This is too complex."
```

**Explain Why:**
```
Good: "Using async/await here would prevent blocking the UI thread during the API call."

Bad: "Use async."
```

## Responding to Reviews

### Acknowledge Comments

- Thank reviewers for their time
- Acknowledge all comments (even if you disagree)
- Ask for clarification if needed

### Address Feedback

- Fix "Must Fix" items immediately
- Consider "Should Fix" items seriously
- Evaluate "Suggestions" and implement if valuable
- Answer "Questions" clearly

### Push Updates

- Push updates as you address feedback
- Don't wait until all comments are addressed
- Mark resolved comments as resolved
- Request re-review when ready

### Disagreements

If you disagree with a review comment:

1. **Discuss**: Have a respectful discussion
2. **Explain**: Explain your reasoning
3. **Compromise**: Find a middle ground if possible
4. **Escalate**: Involve team lead if needed

## Best Practices

### For Reviewers

- **Review Promptly**: Don't delay reviews
- **Be Respectful**: Focus on code, not person
- **Be Constructive**: Provide helpful feedback
- **Be Specific**: Point to exact issues
- **Suggest Solutions**: Don't just point out problems
- **Ask Questions**: If something is unclear, ask
- **Approve When Ready**: Don't request unnecessary changes

### For Authors

- **Self-Review First**: Review your own code before requesting review
- **Write Clear PRs**: Provide context and explanation
- **Keep PRs Small**: Easier to review and understand
- **Respond Promptly**: Address feedback quickly
- **Be Open to Feedback**: Accept constructive criticism
- **Ask Questions**: If feedback is unclear, ask for clarification

### General

- **Focus on Code**: Review the code, not the author
- **Be Professional**: Maintain respectful communication
- **Learn from Reviews**: Use reviews as learning opportunities
- **Share Knowledge**: Explain your reasoning
- **Celebrate Good Code**: Acknowledge well-written code

## Review Tools

### GitHub/GitLab PR Reviews

- Inline comments on specific lines
- File-level comments
- Approval/request changes
- Discussion threads

### Code Review Checklist

Use the checklist above as a template for reviews.

### Automated Checks

- Linters (catch style issues)
- Tests (ensure functionality)
- CI/CD (verify builds)
- Security scanners (find vulnerabilities)

## Summary

- Review for functionality, quality, performance, security, and testing
- Review within 24-72 hours depending on PR size
- Write constructive, specific comments
- Address feedback promptly and professionally
- Focus on code quality and knowledge sharing
- Use reviews as learning opportunities
