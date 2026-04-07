# apps/web-admin

Web administration portal.

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
