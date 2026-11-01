# Checked — Gemini Project Instructions

## 1. Project Overview

**Checked** is a React Native checklist and notes application designed to help users manage everyday tasks through a simple, lightweight mobile experience.

- **Repository:** https://github.com/kriteshtimsina/checked
- **Application name:** Checked
- **Package identifier:** `com.kriteshtimsina.checklist`
- **Expo SDK:** 53
- **Platform:** iOS and Android

## 2. Technology Stack

- React Native
- Expo SDK 53
- TypeScript
- Expo Router
- Expo Dev Client
- React Native components
- Expo ecosystem packages

Always inspect `package.json` and the existing configuration before assuming a dependency or version is available.

## 3. Existing Application Features

The application currently includes:

- Onboarding experience.
- Dashboard with Checklist and Notes tabs.
- Swipeable tab navigation.
- Bottom-sheet interface for adding items.
- Checklist management.
- Notes management.
- Settings screen.
- Customizable application icon.
- Theme customization.
- Vibration preferences.

Preserve all existing functionality when implementing new features.

## 4. General Development Rules

### Understand Before Changing

- Inspect existing implementations before creating new ones.
- Follow the established project architecture and coding conventions.
- Reuse existing components, hooks, utilities and services wherever appropriate.
- Avoid unnecessary dependencies and architectural complexity.
- Do not duplicate existing functionality.
- Do not rewrite working implementations without a clear technical reason.

### TypeScript

- Use TypeScript throughout the application.
- Avoid `any` unless absolutely necessary.
- Prefer explicit types and interfaces.
- Maintain strict type safety.
- Avoid unnecessary type assertions.

### React Native and Expo

- Follow Expo SDK 53 compatibility requirements.
- Before installing Expo packages, use `npx expo install`.
- Do not upgrade Expo SDK or React Native unless explicitly required and approved.
- Consult the official Expo documentation for SDK-specific APIs.
- Consider both iOS and Android behavior.

### UI and UX

- Follow the existing visual design system.
- Maintain consistency across screens.
- Respect the existing theme and appearance settings.
- Support light and dark themes where applicable.
- Maintain accessibility.
- Avoid unnecessary UI complexity.
- Preserve existing navigation and interaction patterns.

### State and Persistence

- Inspect the current state management and persistence implementation before making changes.
- Reuse existing storage mechanisms.
- Avoid introducing another persistence solution without justification.
- Ensure application data survives restarts where expected.

## 5. Notification Implementation Guidelines

The current development objective is to introduce a reliable notification system.

### Initial Scope

Prioritize local notifications using Expo Notifications.

Potential features:

1. Individual checklist item reminders.
2. Daily reminders.
3. Upcoming task notifications.
4. Overdue task reminders.

Do not implement all features simultaneously. Follow an incremental implementation plan.

### Architecture Requirements

- Keep notification logic separate from UI components.
- Use a dedicated notification service where appropriate.
- Centralize permission handling.
- Handle notification scheduling and cancellation consistently.
- Prevent duplicate scheduled notifications.
- Associate scheduled notifications with their corresponding checklist items.
- Cancel or update notifications when checklist items are completed, deleted or rescheduled.
- Respect user notification preferences.
- Handle notification taps and navigation appropriately.

### Reliability

- Do not schedule notifications directly during component rendering.
- Ensure scheduling operations are idempotent.
- Handle permission denial gracefully.
- Account for application restarts.
- Avoid relying exclusively on in-memory state.
- Handle invalid or past reminder dates.
- Test behavior on physical iOS and Android devices.

### Compatibility

- Verify package compatibility with Expo SDK 53.
- Do not install incompatible packages.
- Do not upgrade the Expo SDK without explicit approval.
- Verify development build requirements before implementing native functionality.

## 6. Testing Requirements

Before considering an implementation complete:

- Run the existing project type checks.
- Run linting and relevant tests.
- Test the feature on iOS.
- Test the feature on Android.
- Test permission acceptance and denial.
- Test application restart behavior.
- Test duplicate scheduling prevention.
- Test notification cancellation.
- Test notification interactions.
- Verify that existing checklist and notes functionality remains unaffected.

Do not claim tests have passed unless they were actually executed.

## 7. Git and Change Management

- Never overwrite unrelated user changes.
- Inspect `git status` before making significant modifications.
- Do not discard, reset or revert user changes without permission.
- Keep changes focused and logically grouped.
- Do not commit or push changes unless explicitly requested.
- Explain significant architectural decisions.

## 8. Agent Working Protocol

When given a development task:

1. Inspect the relevant existing code.
2. Understand dependencies and related functionality.
3. Explain the proposed implementation briefly.
4. Identify files that need modification.
5. Implement in small, logical phases.
6. Run appropriate checks and tests.
7. Report modified files, implementation decisions and test results.

If an important architectural decision is unclear, ask before proceeding.

Do not invent project structure, existing functionality, dependencies or implementation details.

## 9. Documentation References

Use official documentation when necessary:

- Expo: https://docs.expo.dev/
- Expo Notifications: https://docs.expo.dev/versions/v53.0.0/sdk/notifications/
- React Native: https://reactnative.dev/docs/getting-started
- Expo Router: https://docs.expo.dev/router/introduction/

Always prioritize documentation corresponding to the project's installed SDK version.
