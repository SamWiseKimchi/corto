# Corto

## Pet Circle - Pet-Profile State-Sync and Personalisation

1. **Architectural Complexity:** Features a state-sync layer designed to connect separate, mutually agnostic modules without coupling them.
2. **Product & UX Impact:** personalized results driving search relevance and user discovery based on pet preferences
3. **Architecture:** Uses React/Preact-compat, TypeScript, feature flags (Unleash), and A/B experimentation (Optimizely), JSP

---

### 1. Situation & Context

- **The Problem:**
  Pet Circle needed to personalize product recommendations and search results based on dynamic pet profile attributes (species, age, dietary needs) to improve results for relevant products
- **Key Challenge + Complexity:**
  - Sharing state between modules that are agnostic to one another and can't share state through reference/common ancestor
  - Updating state from one module should instantly update the component state in another.
  - Limited space on the header (esp mobile) + surfaced layout bugs within desktop/table required re-designing of the header to include the new profile selector component

### 2. Task

- **Scope & Ownership:**
  - Ownership of Frontend component creation, header layout re-implementation
  - Setup experiments
  - Updated payload and schema validation rules to match the api contract
  - Designed the decoupled state-sync layer
- **Team & Stakeholders:**
  - Worked closely with PM to run experiments
  - UX designers to re design the header and new profile picker component UX/UI
  - Backend devs for api contract updates.

### 3. Action

- **User Experience & Interaction:**
  - Created 3 variations of a profile picker modal, to be used on product collection page body and in the root header
  - Implemented responsive loading states, skeleton screens, and fallback states to prevent jarring layout shifts during asynchronous data fetches
  - Keyboard/Accessibility support + return focus on dismiss modal
  - Fixed header responsive layout issues for all devices
- **Frontend Engineering Architecture:**
  - **State Synchronization:**
    - Designed an event-driven / pub-sub state synchronization bridge using standard browser APIs that allowed distinct web apps on the same page to communicate pet context safely without sharing internal component state.
    - custom hook to handle event listeners to pub-sub to changes to localstorage
  - **TypeScript & React:**
    - schema validation for api query params + local storage data
    - header component re-design to allow for responsive layout for mobile/tablet designs
  - **Deployment & Strategy:**
    - Wrapped component rollouts in Unleash feature flags for zero-downtime releases and tracked conversion metrics via Optimizely A/B tests.

### 4. Result & Reflection

- **Outcomes:**
  - Successfully deployed personalized recommendations through user's pet profile component, comparing different variations of the component via experiments/feature flags to decide on which design to use.
- **Reflections & Future Improvements:**
  - _What went well:_
    - Components that showed chosen profile / profile pickers all synced.
    - Experimentation resulted in certain variant of the component being used after comparing interaction %.
    - Header redesigned to better handle responsive layouts to show new component with limited space.
  - _What to approach differently now:_
    - Setting up custom hooks with usesyncexternalstore to handle pub-sub behaviour around local storage (preact version did not support usesyncexternalstore at the time so would require version update + regression tests)
    - using libraries such as useSWR to handle local storage pub sub behavior - would require a technical doc proposal to be signed off
    - The responsive layouts weren't well implemented prior to starting the work, was only captured after starting the work.
    - The issues around separated modules due to how JSP and preact was setup was an uknown issue. Was surfaced in implementation stages where state management became a blocker.

---

### 1. Design & User Experience

- **Handling Asynchronous UX:**
  - Skeletons built into the JSP SSR dom elements and into Shared UI components to handle CLS/layout shifts + loading states
  - Error states also considered on request level and component level - disabled component + dyantrace for error logs
- **Design System Integration:**
  - only the payload contents would change, product recommendation components would remain the same
  - profile picker built out on shared UI repo and imported in
  - header would contain same contents with additional component with responsive layout
- **Accessibility (a11y):**
  - focus handling for modals
  - aria labels for profile buttons etc

### 2. Frontend Engineering

- **State Management Architecture:**
  - local storage as the profile selection information did not need to live on backend - was not required to persist to other device logins
  - web api events as the different parts of the dom were agnostic to one another, prevented access to common store.
- **Type Safety:**
  - zod for schema validation for new payload structure containing profile info
- **Performance & Experimentation:**
  - negligible performance impact on FE
  - feature flag hygiene - removed post experiment after variant was decided on

### 3. Collaboration, Ownership & Outcomes

- **Design:**
  - worked closely to address UI issues of introducing new component into the header for smaller viewports which would break
  - provided suggestions and recieved signoff on updated UI suggestions
- **A/B Testing Alignment:**
  - delivered experiment + once exeperiment results were collated by PM, then work on rolling out the final feature + cleanup feature flags
- **Trade-Offs:**
  - no tradeoffs, only limitations due to nature of AC and architecture
