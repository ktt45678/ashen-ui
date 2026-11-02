# Changelog

## 0.1.1

- The `material` variants of ProgressBar and ProgressSpinner now follow Angular Material. The
  bar is a 4px square track with the two-bar indeterminate animation. The spinner has no track
  and a 2px default stroke.
- Removed `--sn-progress-bar-stop-dot-size`, `--sn-progress-spinner-material-rotate-duration`
  and `--sn-progress-spinner-material-arc-duration`. New tokens:
  `--sn-progress-bar-material-{duration,height,radius,easing}` and
  `--sn-progress-spinner-material-{duration,easing,value-transition}`.
- Button's `loadingVariant="material"` spinner uses the same animation as the ProgressSpinner
  `material` variant. `--sn-button-spinner-material-rotate-duration` and
  `--sn-button-spinner-material-arc-duration` are replaced by
  `--sn-button-spinner-material-duration`.
- Popover's `top` and `bottom` positions fall back to end alignment, so a panel opened near the
  inline-end edge of the screen stays on screen.
- Confirm dialogs (`sn-confirm-dialog` and `DialogService.confirm()`) drop the header and footer
  dividers. Their panel gets the `sn-dialog-panel--confirm` class. Tune the spacing with
  `--sn-confirm-dialog-gutter` or `--sn-confirm-dialog-{header,body,footer}-padding`.
- On screens narrower than 600px, dialogs use less padding and footer buttons share the row
  equally. The smaller paddings are set on `:root`, so a theme's own dialog paddings still win. The panel height is capped with `dvh` so mobile browser bars do not cover it.

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
