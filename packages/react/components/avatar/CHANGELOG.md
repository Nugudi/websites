# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### BREAKING CHANGES

- **AvatarGroup**: Removed `spacing` prop from AvatarGroup component. The component now uses fixed overlap spacing based on the `size` prop. This change simplifies the API and ensures consistent visual behavior across all usages.
  - Migration: Remove any `spacing` prop usage from `<AvatarGroup>` components in your code
  - The overlap effect is now automatically determined by the component's size