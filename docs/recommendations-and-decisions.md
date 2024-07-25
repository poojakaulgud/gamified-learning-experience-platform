# Recommendations and Decisions

## Table of Contents

- [Decision Table](#decision-table)
- [Decision Analysis](#decision-analysis)
  - [Language](#language)
  - [Framework](#framework)
  - [Meta-framework](#meta-framework)
  - [Component Library](#component-library)
  - [A11y](#a11y)
  - [CSS Library](#css-library)
  - [Code Structure](#code-structure)
  - [Linting](#linting)
  - [API Tooling](#api-tooling)
    - [Data Fetching](#data-fetching)
    - [Localization](#localization)
    - [Security tools](#security-tools)
    - [Forms](#forms)
    - [State Management](#state-management)
  - [Unit Testing](#unit-testing)
  - [E2E Testing](#e2e-testing)
  - [Error Handling](#error-handling)
- [Development Workflow](#development-workflow)
  - [PR Process](#pr-process)
  - [Merge Process](#merge-process)
  - [Deployment Process](#deployment-process)
    - [Standard Deployment](#standard-deployments)
    - [HotFix Deployments](#hotfix-deployments)
  - [CI/CD Pipelines](#cicd-pipelines)

## Decision Table

<!-- Don't look at this with your naked eyes. -->
| Name                                                            | Decision/Recommendation                               | Included in this kit? |
|-----------------------------------------------------------------|-------------------------------------------------------|-----------------------|
| Select Language                                                 | [Typescript](#language)                               | ✅                    |
| Select UI Framework                                             | [React](#framework)                                   | ✅                    |
| Select UI Library                                               | [NextJS](#meta-framework)                             | ✅                    |
| Select Component Library                                        | [NextUI](#component-library)                          | ❌                    |
| Select Accessibility Tooling                                    | [Deque, react-axe, eslint-plugin-jsx-a11y](#a11y)     | ✅                    |
| Select CSS Approach & Library                                   | [Tailwind, CSS Modules](#css-library)                 | ✅                    |
| Determine code organization/structure                           | [Dictated by meta-framework](#code-structure)         | ✅                    |
| Determine Git Branching Strategy                                | [GitHub Flow](#merge-process)                         | ❌                    |
| Determine Commit Messaging standard                             | [Conventional Commits](#commit-message-standards)     | ✅                    |
| Select Linting Library                                          | [ESLint, Prettier](#linting)                          | ✅                    |
| Select State Management Library & Approach                      | [Redux](#state-management)                            | ❌                    |
| Select API Implementation Tooling                               | [n/a](#api-tooling)                                   | ❌                    |
| Select Unit Testing Framework                                   | [Vitest](#unit-testing)                               | ✅                    |
| Select e2e Testing Framework                                    | [Cypress, Playwright](#e2e-testing)                   | ❌                    |
| Determine localization/internationalization library             | [i18next, Locize](#localization)                      | ❌                    |
| Select Security Tooling                                         | [Snyk](#security-tools)                               | ❌                    |
| Select tools to enforce coding standards (Linting & Pre-commit) | [Husky](#merge-process)                               | ✅                    |
| Establish error handling tooling/approach                       | [NextJS Error files, React Suspense](#error-handling) | ❌                    |
| Select logging library                                          | [Pino, Winston](#logging)                             | ❌                    |
| Select analytics library                                        | [Google Analytics](#analytics)                        | ❌                    |
| CI/CD                                                           | [CI/CD](#cicd-pipelines)                              | ❌                    |
| Deployment Process                                              | [Standard Deployment](#standard-deployments)          | ❌                    |
| Hotfix Deployment Process                                       | [Hot Fix Deployment](#hotfix-deployments)             | ❌                    |
| Feature Flag approach                                           | [Feature Flag](#feature-flag-approach)                | ❌                    |

<!-- Table End -->

## Decision Analysis

### Language

When it comes to the front end, there aren't a lot of options for languages. [Typescript](https://www.typescriptlang.org/) creates a lot of overhead but affords type safety and improves overall developer experience.

### Framework

There are no shortage of frontend UI frameworks for developers to choose from, but [React](https://react.dev/) is both a framework and an ecosystem that many frontend developers are comfortable with.

### Meta-framework

[NextJS](https://nextjs.org/) is familiar to many React devs. It also takes much of the extra guesswork about tooling out of the equation. Additionally, it affords a coherent and agreed-upon structure to the project, it provides routing, granular rendering/caching, image processing, etc.

### Component Library

Method favors a "headless" approach where accessibility and functionality are readily available but the overhead of overwriting styles is not necessary. Individual components should be opt-in and easily styled to fit the client's needs. Accessibility should be a primary concern. As such, [HeadlessUI](https://headlessui.com/) and [NextUI](https://nextui.org/) are our big contenders. HeadlessUI is an appealing alternative, however there are not many available components to choose from. NextUI is our preference as it offers great flexibility, good integration with Tailwind, accessibility (being built on [react-aria](https://react-spectrum.adobe.com/react-aria/)), and a robust number of component options. That said, it is not included in the project as it can be pulled in on an as-needed, component-by-component basis.

### A11y

Accessibility is an extremely important concern for most projects. Attempting to go back and rework an existing project to be accessible is generally a frustrating process, so we favor enforcing it early. A lot of the a11y assessment _should_ be happening in the design phase for visual concerns, and it's up to the developers to implement accessible code. Reinforcing it in our tooling is a great way to start. We favor [Deque's suite of tools](https://github.com/dequelabs/axe-core), namely [the axe Accessibility Linter VSCode plugin](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter), the [@axe-core/react package](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react#axe-corereact), and the [eslint-plugin-jsx-a11y package](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#readme).

### CSS Library

There are many approaches to CSS to choose from. We are in favor of moving away from the "CSS-in-JS" model that was popular in the last few years (styled-components, Emotion, etc) and looking to the speed and ease of writing styles using Tailwind. However, one common complaint is how cumbersome and illegible it can make markup, so CSS Modules can be used with the `apply` directive to leverage Tailwind but keep the styles neat and classes semantic to address that concern.

### Code Structure

For the most part, the framework you use will dictate the overall code structure. NextJS and most of the current generation of Javascript component libraries use file-based routing, where page folders and files are nested underneath a `/pages` or `/routes` directory. In this project, we are the App Router that Next has implemented as of v13, so routing takes place under `/src/app`. We provide scaffolding for a basic structure. Beyond that, we don't prescribe a particular method, and only suggest that you are consistent with whichever method you choose to use.

### Linting

The current reigning linter in the Javascript ecosystem is [ESLint](https://www.eslint.org/) so that is our choice. We use [Prettier](https://prettier.io/) for formatting.

### API Tooling

Almost all projects at one point or another will need to connect and interface with external APIs. There are lots of options and ways to handle data fetching within an application and certain packages will meet your criteria and others may not. This section gives recommendations for some of the tools we have experience with that have made aspects of a project easier to maintain.

#### Data Fetching

A great default option would be [TanStack Query (formally react-query)](https://tanstack.com/query/v3). TanStack Query is a "batteries included" [state management](#state-management) and data fetching library that gives you everything out of the box without any other dependencies. A similar package that comes batteries included is [SWR](https://swr.vercel.app/). Both TanStack Query and SWR are hook based API and state management libraries to be considered when you need a robust solution for data fetching and caching without including other dependencies or state management tools.

Another alternative, not as robust, would be [Axios](https://axios-http.com/). Axios is a lightweight HTTP client that can be configured with sensible defaults to easily manage HTTP requests if data storage is not a requirement. Since Axios is merely a HTTP client it can still be coupled with the above solutions as well.

Other tooling that can be leveraged for DX purposes is [Postman](https://www.postman.com/) and [Swagger](https://swagger.io/). Both are great solutions for designing, documenting, and testing APIs. Especially when we may not manage the APIs we are interfacing with, both solutions can be used to keep developers up to date on latest APIs and how to interface with them.

#### State Management

As we do not recommend that a project begin with a particular state management library, none is included in this starter kit.

State management is an important piece of the application puzzle but is highly dependent upon the unique requirements of the project. In the context of this Next.js-based starter kit, leveraging Next's server-side data fetching and rendering capabilities as the primary mode of data handling is the recommended approach and can work well for many situations. However, if additional client-side caching or state management is necessary, here are a few recommendations and use cases.

##### Tanstack Query

As mentioned above, [TanStack Query](https://tanstack.com/query/latest) is a data fetching & caching library that can replace more robust client-side state management in many cases. Some primary benefits include easy data synchronization between client and server, deduping, pagination, lazy loading & caching, eager updating, etc. Its [hydration functionality](https://tanstack.com/query/latest/docs/framework/react/guides/ssr#server-rendering-and-hydration) works well with Next.js to create a client-side cache from server-fetched data. For applications driven by backend data, this is currently the gold standard of modern development.

##### React Context

React's [context API](https://react.dev/reference/react/hooks#context-hooks) is a great solution for handling client-side state where leveraging a cache is arduous & complex, or the data does not originate from the server. A common use case is a user's dark mode preference. It's also handy for avoiding excessive prop drilling or handling data for complex parts of an application.

Generally speaking, Context is not recommended for use as a global store due to its inefficient rerendering - poor app performance can be introduced. While steps can be taken to mitigate the issue, optimizations built into the next section of tooling likely make them a more appropriate solution.

##### State Management Libraries

Tanstack Query is a multi-purpose library and has largely removed the need for a dedicated state management solution. However, if the team feels that Tanstack does not fully capture the needs of the application, here are several options that are battle-tested and well-maintained:

[Redux Toolkit](https://redux-toolkit.js.org/introduction/why-rtk-is-redux-today), is a library with one single source of truth and very explicit modes of manipulating that data. Toolkit builds on the old redux methodology by reducing boilerplate code, adding libraries like redux-thunk by default, etc. React Toolkit includes query tools and other APIs that can be leveraged on top of the data store layer if needed, all from one library.

[Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) and its spinoff [Jotai](https://jotai.org/) are two other popular libraries for global state management. They feel more like react hooks in implementation and require even less boilerplate. While different in-store implementations, the philosophies are very similar. For more information on why Jotai was created, see [this Zustand issue](https://github.com/pmndrs/zustand/issues/132#issuecomment-690788029).

###### Concluding Thoughts on State Management

All of these state solutions have their place and work well with Next.js. For a broader discussion on state libraries in the modern React ecosystem, start with these articles:

- [The new wave of React state management](https://frontendmastery.com/posts/the-new-wave-of-react-state-management/)
- [React State Management in 2024](https://dev.to/nguyenhongphat0/react-state-management-in-2024-5e7l)


#### Localization

If your project needs to translate the copy in an app to multiple languages, check out [i18next](https://www.i18next.com/).

You can have multiple files with your copy in different languages. As the user toggles their language selection, i18next will use the specified language file to display the correct text. There's a version of this package made for Next.js in particular called [next-i18next](https://github.com/i18next/next-i18next). The documentation for `i18next` can guide you through set up and more advanced usage.

Keep in mind that this package does not translate copy for you. Check out [Locize](https://locize.com/) if you need a starting point for translations. Ideally, you want to get all of the translations in-house to avoid the risk of incorrect translations and longer lead times.

#### Security tools

A great place to start understanding your security needs is the [OWASP Top 10](https://owasp.org/www-project-top-ten/). This highlights the most common security vulnerabilities online and you can make sure your project doesn't leave room for any of these.

Some tools you can use to help include:

- A SAST (static application security testing) tool like [Snyk Code](https://snyk.io/product/snyk-code/) is a good starting point. This scans your code for any known package vulnerabilities or code issues. It can be run as part of your `pre-commit` checks or in your CI/CD pipeline as part of the deploy process.
- A DAST (dynamic application security testing) tool like [Codename SCNR](https://ecsypno.com/pages/codename-scnr) can be used to check for vulnerabilities in a test environment where your project is running. This will find areas in your app that are susceptible to things like blind SQL injection and cross-site scripting.

If your product is heavily regulated by laws and regulations, it's important to keep track of your software supply chain. The software supply chain includes all of the tools and services you use to build your software. This is usually an area that goes under the radar and attackers are able to take advantage of it. Many times, organizations that work for the government are required to keep up with their supply chain but it is something that will help any organization remain secure.

Supply chain attacks look for things like developer vulnerabilities, process vulnerabilities, and codebase vulnerabilities. The way to handle these need to be included in your normal development processes. Here are some of the steps you can take to secure your software supply chain:

- **Create a software bill of material (SBOM).** This is how you can keep track of the licenses for the packages and services you use. You can also keep track of the origin country of the tools for compliance with government regulations. It gives you insights into the security practices your tools use as well.
- **Only use verified sources.** Don't use packages that aren't verified by a reputable source. You can look at the vendor's tests and risk assessment reports, but do your own on top of them. Always implement the principle of least privilege when you give tools in your supply chain access to internal tools and data.
- **Integrate security checks in your CI/CD pipeline.** Include SAST and DAST tools in your pipeline to check for any CVEs that exist in your packages, tools, code, and APIs. Also check for IAM misconfigurations in your cloud platform and make sure none of your credentials are exposed.

#### Forms

When it comes to forms, there are many options. The traditional way of creating a form with React would involve a controlled form with a rerender on every user input. Many libraries also handle forms in a similar manner. While we are not including it in the starter, if you find yourself needing to reach for a form management library, our recommendation is [react-hook-form](https://react-hook-form.com/). It works using uncontrolled components with refs, increasing performance and minimizing rerenders. It also makes it easy to bring in a validation library. For that, we also recommend [Zod](https://zod.dev/), which allows you to declare a complex schema using concise, chainable syntax. Then, you can validate your forms against your Zod schema using a resolver.

### Unit Testing

We recommend [Vitest](https://vitest.dev/) for its ease of setup and speed.

### E2E Testing

The QA team recommends using either [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/). They are very similar in regard to the usage and design and continue to be well maintained from a community standpoint. One added benefit of Playwright is the integration of [Zephyr](https://smartbear.com/test-management/zephyr/), which is a test management and reporting suite that integrates with Jira, so all of your tests and reporting is easily accessible to the entire project team.

_*NOTE:* the Zephyr integration is connected to Method's Jira instance and not available if using a client's Jira instance._

### Error Handling

Error Handling is a critical aspect of software development that involves anticipating, detecting, and resolving problems that may occur during the execution of a program. [NextJS provides documentation](https://nextjs.org/docs/app/building-your-application/routing/error-handling) on how to handle runtime errors within the `app` directory as well as handling [global errors](https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs) which serves as a fallback at the root of the application. The NextJs error handling approach uses React Error Boundries under the hood. You can also leverage the React [Suspense](https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) API in development which will automatically throw any errors to the closest error boundary (which should exist in your `app` directory structure).

As far as reporting goes, recommended tools would be [Sentry](https://sentry.io/welcome/) and [LogRocket](https://logrocket.com/). Both offer a multitude of reporting capabilities for your project needs and are relatively easy to integrate into any application.

### Logging
#### Pino
[Pino](https://getpino.io/#/) is a high-performance logger designed with very [low overhead](https://getpino.io/#/?id=low-overhead). It's primary focus is on speed and efficiency which makes it exceptionally suited for high-throughput applications. Notably, [Pino](https://getpino.io/#/) leverages NodeJS' [Worker Threads](https://nodejs.org/api/worker_threads.html#worker-threads) thus enhancing its capabilities for efficient parallel processing.

#### Winston
[Winston](https://github.com/winstonjs/winston) is a versatile and feature-rich logging library for NodeJS applications. It offers a flexible and customizable logging experience which includes support for profiling to track process durations as well as multiple transports for logging data to various destinations such as the console, local files, or services like [Better Stack](https://betterstack.com/).

*- Both of the above options were very easy to set up and get running.*

### Analytics
#### Google Analytics
Google Analytics is a robust analytics service designed to track and report website traffic as well as offer valuable insights into user behavior and interaction patterns. The packages listed below have been created to integrate Google Analytics into Next.js, enabling developers to not only capture page views but also send custom event tracking data based on user interactions.

- [@next/third-parties](https://www.npmjs.com/package/@next/third-parties) is a collection of components and utilities that can be used to efficiently load third-party libraries into your Next.js application.
- [nextjs-google-analytics](https://www.npmjs.com/package/nextjs-google-analytics) is a package that enables developers to easily integrate a tracking component for monitoring page views and sending custom events to track user interactions.

### Feature Flag Approach
There are times you'll want to release features to production without giving all of the users access immediately. With feature flags, you can slowly roll out new features to specific groups of users. That way you can do some initial testing with small groups to work out anything you can only test in production.

#### Recommended tools and process

There are two tools that we recommend for feature flagging: [Launch Darkly](https://docs.launchdarkly.com/home?_gl=1*11pcs5d*_gcl_au*NjI1MTE4NDExLjE3MTUzNjgzMzQ.) and [Split](https://help.split.io/hc/en-us/categories/360001538072-Feature-flagging-configuration) These give you out of the box functionality to add and remove feature flags and different groups in a nice UI.

You can also implement your own feature flags by passing props to different components based on a user's credentials. Keep in mind that you will have to go back and clean up the feature flags as they are enabled or disabled if you go with this approach. That can be more tedious when you reach a point that you have a number of feature flags in your code. Many times this leads to a team creating their own take on a feature flagging solution. This is an approach you can take, but it is more time consuming and likely less robust than one of the suggested tools.


## Development Workflow

### PR Process

The goal of our PR process is to _facilitate the shipment of code._ With that in mind, it should be the entire team’s goal to get it out the door as fast as reasonably possible, while still maintaining a high standard.

#### Takeaways & Action Items

- PR Slack Channel: **\_\_\_**
- Expectation for review turnaround: **\_\_\_** mins/hours/days
- Method for determining reviewer: **\_\_\_**

#### The Author’s Responsibilities

- PRs should be as small as possible
- The author of the PR is responsible for giving a reviewer all the information they need to review the submission at their fingertips. There should be no need to go dumpster diving for Jira tasks and Figma designs. There should be a clear description of what the submission accomplishes. The author’s goal here is to make it easy for your teammates to approve their submission.
- The author should nominate 2 reviewers.
- The author should post in an agreed-upon Slack channel when their PR has been created for team visibility and `@` the selected reviewers. Our team’s agreed-upon channel is #**\_**.

#### The Reviewer’s Responsibilities

- When nominated, reviews should be swift. Our team agrees that every PR should be reviewed within **\_** mins/hours/days.
- If there is some reason a reviewer cannot review the author’s code in a timely fashion, they should promptly respond and facilitate getting another reviewer in to take their place.
- The reviewer should strive to keep their feedback simple, actionable, neutral, and positive. They should refrain from using judgmental or condescending language. When in doubt, err on the side of kindness.
- Reviews should be given with the approach of facilitating getting code merged, not to act as a goalie or gatekeeper of the codebase.
- Reviewers should feel free to be open with praise. The process of reviewing code is an inherently critical one. Call out the good stuff, too.
- If both reviewers feel unqualified to review a passage of code or feel that a section could use a 3rd set of eyes, they can request somebody with expertise to weigh in to _review that section_.

#### The Team’s Responsibilities

- The team should create a plan for handling reviews equitably. Round robin, slackbot, automation, name drawn from hat, lotto-style ball machine thing, magic 8 ball, the method doesn't matter. The important thing is that it’s fair and everyone agrees. Our team has agreed to utilize **\_\_\_**.
- No single team member is responsible for the majority of reviews, and no team member is exempt from reviewing their teammates’ work, unless by team agreement. In general, nobody’s time is more valuable than anyone else’s.
- Everyone on the team contributes to preventing an atmosphere where PRs languish. This means if a developer is requested to review a PR, they should do so in the agreed-upon timeframe. If that is not done, all team members should be empowered to be proactive in resolving the delay.

### Merge Process

We use [Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) to enforce pre-commit standards.

#### Protected branches

There should be at least 2 protected branches: `main` and `develop`.

The `main` branch is the one that will hold the code that is in production.
The `develop` branch is the one that will hold the changes that developer's are working on before they are released to production.

#### Feature branches

There will be individual branches for each feature or ticket.

If you have a larger epic that spans multiple tickets and all of them need to be merged together before the feature can be released, you should have a feature branch the smaller tickets can be based off of.

Here's an example of the merge flow can look like this:

- Create feature branch (`feat-user-card`) based off of `develop`
- Create ticket branches (`tick-2384/form`, `tick-2385/api-calls`, `tick-2386/tests`) based off the feature branch (`feat-user-card`)
- Merge ticket branches into feature branch until all work is complete
- Once the feature branch has been thoroughly tested, then it can be merged to `develop`
- Once `develop` has been deployed and tested, then the changes can be merged to `main`

If you have tickets that aren't large enough to go to a feature branch, the merge flow can be like this:

- Create the ticket branch (`tick-4245/bug-fixes`)
- Merge to `develop` and test
- Merge to `main`

#### Commit message standards

This repo has been configured to run a pre-commit message check to keep the messages consistent. You have to include one of the following keywords in your commit message to clarify what it is: `chore|docs|feat|fix|BREAKING CHANGE|revert|style|test|wip`

Here are a few example messages:

- feat: updated modal fields
- chore: added docs
- BREAKING CHANGE: released new version

##### See also:
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Github Flow](https://docs.github.com/en/get-started/using-github/github-flow)

### Deployment Process
#### Standard Deployments
This lays out how we approach the deployment process.

After you have gone through the [merge process](./merge-process.md) and the code has been merged to `develop`, you should have a CI/CD pipeline set up to automatically deploy the changes to a `develop` environment. You should test the new code thoroughly here before merging from `develop` to `main`. This is when you'll run your integration tests and have a QA team check that the functionality meets Product requirements. You may even bring in some of the Product owners to do user acceptance testing to confirm that features are working as expected.

Once you are ready to deploy the changes to production, merge `develop` to `main` and wait for the CI/CD pipeline to finish the deployment. Then do a quick smoke test to make sure the changes are available and working as expected before making an annoucement that everything is ready for users.

#### Hotfix deployments

If you have a situation where a hot fix is necessary, start by looking at the logs and the last commit because this is likely where the issue is. Stay calm and go through the same debugging process you would in any other environment. A hotfix will not go through the same QA process as your normal bug fixes and feature deployments. At this point it's up to you and the dev team to test the specific issue that's happening.

Consider getting together as a group in this case so that several people can verify the fix together. Including QA and Product in that group will help you verify other functionality so you have full confidence that the hotfix you're about to push doesn't cause more issues.

### CI/CD Pipelines

Clean, stable CI/CD pipelines are critical to the development process and increase the DX of the project when done correctly and efficiently making downstream deployments much easier and simpler.

#### High Level CI/CD Steps
- Pipelines should be trunk based (based off of a single main branch)
    - NO ENVIRONMENT BRANCHES IN PIPELINES (can still have dev branch, but wont have pipeline support)
        - We need to have artifacts/release of a certain version and this goes against that (12 factor apps, etc…)
- Build Pipelines
    - Build Stages
        - ensure nextjs cache is setup
        - ensure npm/pnpm/yarn cache is setup
    - Test Stages
        - Unit tests
    - Security Scanning (dependent on client but should include at least free tools)
        - Open source scanning
            - ex. Snyk or npm audit (free)
        - Static code analysis
- PR pipelines
    - Same as build plus
    - Preview environments being stood up
    - End to end tests against preview env
- Release pipelines
    - Same as build plus
    - Create tag of repo
    - publish to artifact repository if available (depends on client)
        - reason for this is artifact repos have extra security around changing bundles
    - Goes out to dev, stg, then prod (environments depend on team)


#### Preferred CI/CD Tooling

- Pipelines
    - [Github actions](https://docs.github.com/en/actions), [CircleCI](https://circleci.com/)
        - main reason is shared actions/orbs which are plug and play pre-written "orbs" you can use in your pipelines from verified third parties
    - We should avoid using Jenkins unless required by client
- Code analysis/open source scanning
    - [SonarQube](https://www.sonarsource.com/products/sonarqube/)
    - [snyk](https://snyk.io/)
    - [GitHub enhance security scanning](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) (must use github actions or azure devops)
