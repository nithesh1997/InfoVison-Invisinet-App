# [How to Contribute](#)

Invisinet is a cybersecurity company that helps businesses protect their data and systems from cyberattacks. The user interfaces of their Invisigate and Certificate Generation Application are critical for easy interaction. Our team is still working on making the contribution process for these projects as easy and transparent as possible. This document aims to clarify the contribution process and answer any questions you may have.

<!-- ## [Code Of Conduct](#code-of-conduct)

We are open to, and grateful for, any contributions made by the community. By contributing to Invisinet, you agree to abide by the [code of conduct](). -->

## [Versioning](#versioning)

Our team follows 👉 [Semantic Versioning](https://semver.org/).

That means that with a version number x.y.z:

- When releasing critical bug fixes, we make a patch release by changing the z number (ex: 3.1.15 to 3.1.16).

- When releasing new features or non-critical fixes, we make a minor release by changing the y number (ex: 3.1.15 to 3.2.0).

- When releasing breaking changes, we make a major release by changing the x number (ex: 3.1.15 to 4.0.0).

Major releases can also contain new features, and any release can include bug fixes.

Minor releases are the most common type of release.

## [Branch Organization](#branch-organization)

We use a modified version of the GitFlow branching strategy. This strategy uses a `master` branch for production code, a `develop` branch for ongoing development, and `feature-*` branches for new features. We also use `release-*` branches for preparing releases, and `hotfix-*` branches for fixing critical bugs.

Here is a brief explanation of each branch:

**Master branch:** This branch contains the production code. Only merged commits are allowed on this branch.

**Develop branch:** This branch contains the code that is currently being developed. All new features should be developed on this branch.

**Feature branch:** This branch is used to develop a new feature. Once the feature is complete, it should be merged into the develop branch.

**Release branch:** This branch is used to prepare a release. It is created from the develop branch and contains all of the changes that are ready to be released.

**Hotfix branch:** This branch is used to fix critical bugs. It is created from the Master branch and contains only the changes that are needed to fix the bug.

**Learn more about GitFlow:** [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)

## [Conventional Commit](#conventional-commit)

Our Team Follows 👉 [Guide](https://www.conventionalcommits.org/en/v1.0.0/)

Conventional Commits is a lightweight convention for writing commit messages. It uses a standard format that makes it easy to understand the purpose of a commit and to generate changelogs and release notes.

The Conventional Commits format is:

```SH
<type>[optional scope]: <description>
[optional body]
[optional footer]
```

The `type` is a short word that describes the type of change that was made. The most common types are:

`feat`: A new feature

`fix`: A bug fix

`docs`: Documentation changes

`style`: Changes that do not affect the meaning of the code (such as formatting)

`refactor`: A code change that improves the structure of the code without changing its functionality

`test`: A test-related change

`chore`: A non-code change (such as updating dependencies)

The scope is an optional part of the commit message that can be used to specify the affected area of the code. For example, if the commit fixes a bug in the user module, the scope would be user.

The description is a brief summary of the change that was made. It should be clear and concise, and it should not contain any code.

The body is an optional part of the commit message that can be used to provide more detail about the change. It can include code, links, or other information that is relevant to the change.

The footer is an optional part of the commit message that can be used to specify breaking changes or other important information.

Here are some examples of Conventional Commit messages:

```SH
feat: add new user registration form
fix: fix bug in login page
docs: update documentation for new features
style: improve formatting of code
refactor: refactor code to improve readability
test: add new unit tests
chore: update dependencies
```

## [Contribution Prerequisites](#contribution-prerequisites)

- You have `Node` installed at **LTS** and `Npm`.

- You are familiar with `Git`.

- Follow `README.md` for Development Workflow

- Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
