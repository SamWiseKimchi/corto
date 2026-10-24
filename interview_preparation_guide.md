# Pet Circle

## Pet-Profile State-Sync and Personalisation

1. **Architectural Complexity:** Features a state-sync layer designed to connect separate, mutually agnostic modules without coupling them.
2. **Product & UX Impact:** personalized results driving search relevance and user discovery based on pet preferences
3. **Architecture:** Uses React/Preact-compat, TypeScript, feature flags (Unleash), and A/B experimentation (Optimizely), JSP

---

### 1. Situation & Context

- **The Problem:** Pet Circle needed to personalize product recommendations and search results based on dynamic pet profile attributes (species, age, dietary needs) to improve results for relevant products
- **Key Challenge + Complexity:** Finding an elegant solution to share state between frontend modules that are agnostic to one another and has no elegant way to share state within preact/react, ensuring that updating the state from one module would instantly update the component state in another.

### 2. Task

- **Scope & Ownership:** Led the frontend component creation, setup experiments, updated payload and schema validation rules to match the api contract, and designed the decoupled state-sync layer.
- **Team & Stakeholders:** Worked closely with product managers, UX designers, and backend services.

### 3. Action

- **User Experience & Interaction:**
  - Created 3 variations of a profile picker modal, to be used on product collection page body and in the root header
  - Implemented responsive loading states, skeleton screens, and fallback states to prevent jarring layout shifts during asynchronous data fetches
  - Keyboard/Accessibility support + return focus on dismiss modal
- **Frontend Engineering Architecture:**
  - **State Synchronization:** Designed an event-driven / pub-sub state synchronization bridge using standard browser APIs that allowed distinct web apps on the same page to communicate pet context safely without sharing internal component state.
  - **TypeScript & React:** schema validation for api query params + local storage data
  - **Deployment & Strategy:** Wrapped component rollouts in Unleash feature flags for zero-downtime releases and tracked conversion metrics via Optimizely A/B tests.

### 4. Result & Reflection

- **Outcomes:** Successfully deployed personalized recommendation carousels/products through user's pet profile component, comparing different variations of the component via experiments/feature flags to decide on which design to use.
- **Reflections & Future Improvements:**
  - _What went well:_ components that showed chosen profile / profile pickers all synced. Experimentation resulted in certain variant of the component being used after comparing interaction %.
  - _What to approach differently now:_ Look into moving the chosen profile information onto backend whilst also keeping servers stateless, rather than keeping locally. The AC did not strictly require persistence of chosen profile. Additionally setting up custom hooks with usesyncexternalstore to handle pub-sub behaviour around local storage.

---

## Phase 3: Targeted Discussion Preparation

### 1. Design & User Experience

- **Handling Asynchronous UX:** How did you address layout shift (CLS) and slow network responses when loading personalized recommendations?
- **Design System Integration:** How did you ensure the dynamic recommendation components remained consistent with Pet Circle’s broader design system library?
- **Accessibility (a11y):** How were dynamic updates (e.g., changing pet profiles on the fly) made accessible to screen readers using ARIA live regions or focus management?

### 2. Frontend Engineering

- **State Management Architecture:** What exact mechanism did you use for the state-sync layer (e.g., custom DOM events, RxJS, Broadcast Channel, Shared Worker)? Why was that chosen over a centralized store?
- **Type Safety:** How were contract schemas between the Constructor API payloads and your React component props typed and validated?
- **Performance & Experimentation:** How did you manage feature flag hygiene in code to ensure Unleash and Optimizely logic didn't clutter the production React component trees long-term?

### 3. Collaboration, Ownership & Outcomes

- **Cross-Team Adoption:** How did you onboard and support other frontend developers using your shared components or state-sync layer?
- **A/B Testing Alignment:** How did you collaborate with data/product teams to ensure Optimizely experiment variants were statistically sound and correctly tracked?
- **Trade-Offs:** What was a technical compromise you made to meet launch deadlines, and how did you manage the technical debt afterward?

---

## Phase 4: Practical Interview Prep Checklist

- [ ] **Visual Artifacts:** Prepare 2–3 anonymized screenshots, UI flows, or a simple architecture sketch illustrating how the decoupled state-sync layer communicates between codebases.
- [ ] **Quantified Metrics:** Note down any key metrics available (e.g., percentage lift in engagement, performance scores, or time saved for developers consuming the sync layer).
- [ ] **Questions to Ask the Interviewers:**
  1. _Engineering Culture:_ How do your frontend teams balance technical debt refactoring with shipping feature-flagged experiments?
  2. _Architecture:_ What are the current biggest architectural challenges facing your frontend ecosystem?
  3. _Collaboration:_ How do product, design, and engineering interact when designing new core UI platform components?
