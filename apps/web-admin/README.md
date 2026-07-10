# Web admin (`apps/web-admin`)

Placeholder scaffold for the web administration portal. No framework or runnable scripts are configured yet; `package.json` is currently empty.

## Purpose

Supports lodge and district operations:

- member administration
- mentor assignment management
- dashboard and analytics views
- reporting/export workflows
- configuration and support tooling (role-controlled)

## Architectural note

This portal is a client over the same backend API used by Android.
It must not duplicate or redefine backend business rules.

## Current status

Do not infer an implementation stack from this folder. Select and document the frontend stack through the design stage before adding dependencies or generated framework files.
