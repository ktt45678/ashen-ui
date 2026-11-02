# Changelog

## 0.1.0

First public release. Each component and directive ships in its own entry point
(`ashen-ui/button`, `ashen-ui/dialog`, ...), next to `ashen-ui/core`, `ashen-ui/utils`,
`ashen-ui/cdk` and `ashen-ui/testing`. Requires Angular 22.

Changes for apps that used pre-release builds:

- Buttons are shorter. The `md` vertical padding went from `0.75rem` to `0.5rem`, with a new
  min-height.
- A button with a single child is no longer made square automatically. Set `iconOnly` on
  buttons that hold only an icon.
- Overlay exit durations now live in CSS, as `--sn-<component>-exit-duration` tokens.
- The unused `--sn-grid-*` tokens were removed.
