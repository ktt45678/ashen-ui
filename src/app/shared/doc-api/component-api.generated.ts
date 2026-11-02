export const COMPONENT_API = {
  "icon": {
    "slug": "icon",
    "importPath": "ashen-ui/icon",
    "surfaces": [
      {
        "symbol": "Icon",
        "kind": "component",
        "selector": "sn-icon",
        "inputs": [
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "IconSize",
            "required": false,
            "default": "'md'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "fill",
            "bindingName": "fill",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "weight",
            "bindingName": "weight",
            "type": "number",
            "required": false,
            "default": "300",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "grad",
            "bindingName": "grad",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "set",
            "bindingName": "set",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loadingFallback",
            "bindingName": "loadingFallback",
            "type": "SnIconLoadingFallback",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "IconSize": {
        "name": "IconSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      },
      "SnIconLoadingFallback": {
        "name": "SnIconLoadingFallback",
        "values": [
          {
            "value": "empty",
            "description": "Render nothing until the icon font or sprite has loaded."
          },
          {
            "value": "placeholder",
            "description": "Hold a blank box of the icon's size, so the layout does not shift when it arrives."
          },
          {
            "value": "text",
            "description": "Show the raw ligature text, which is what an unstyled page falls back to anyway."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-icon-button-icon-size",
        "default": "var(--sn-icon-button-icon-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-icon-button-icon-size-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-button-icon-size-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-button-icon-size-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-button-icon-size-xs",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-color",
        "default": "inherit",
        "source": "component"
      },
      {
        "name": "--sn-icon-fill",
        "default": "0",
        "source": "component"
      },
      {
        "name": "--sn-icon-font-family",
        "default": "'Material Symbols Outlined Variable'",
        "source": "component"
      },
      {
        "name": "--sn-icon-grad",
        "default": "0",
        "source": "component"
      },
      {
        "name": "--sn-icon-loading-placeholder-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-icon-loading-placeholder-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-icon-loading-placeholder-size",
        "default": "var(--sn-icon-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-icon-loading-text-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-icon-opsz",
        "default": "24",
        "source": "component"
      },
      {
        "name": "--sn-icon-size-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-size-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-size-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-icon-weight",
        "default": "300",
        "source": "component"
      }
    ],
    "intl": []
  },
  "button": {
    "slug": "button",
    "importPath": "ashen-ui/button",
    "surfaces": [
      {
        "symbol": "Button",
        "kind": "component",
        "selector": "button[snButton], a[snButton]",
        "inputs": [
          {
            "category": "inputs",
            "name": "variant",
            "bindingName": "variant",
            "type": "ButtonVariant",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "color",
            "bindingName": "color",
            "type": "ButtonColor",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "ButtonSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "shape",
            "bindingName": "shape",
            "type": "ButtonShape",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loading",
            "bindingName": "loading",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loadingVariant",
            "bindingName": "loadingVariant",
            "type": "ButtonLoadingVariant",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "iconOnly",
            "bindingName": "iconOnly",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Sizes a non-icon variant as a square (a circle with `shape=\"pill\"`) around a\nlone icon, so an outlined or text button can carry just an icon. Give the\nbutton an `aria-label`. The icon variants are already square."
          },
          {
            "category": "inputs",
            "name": "iconPosition",
            "bindingName": "iconPosition",
            "type": "'start' | 'end'",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "ButtonVariant": {
        "name": "ButtonVariant",
        "values": [
          {
            "value": "base",
            "description": "Filled, the default call to action."
          },
          {
            "value": "raised",
            "description": "Filled with an elevation shadow."
          },
          {
            "value": "outlined",
            "description": "Transparent with a coloured border, for a secondary action beside a base button."
          },
          {
            "value": "text",
            "description": "No border or fill until hovered, for the lowest-emphasis action in a group."
          },
          {
            "value": "icon",
            "description": "Square, icon-only, transparent."
          },
          {
            "value": "icon-filled",
            "description": "Square, icon-only, filled."
          },
          {
            "value": "icon-outlined",
            "description": "Square, icon-only, with a border."
          },
          {
            "value": "icon-text",
            "description": "Square, icon-only, no fill until hovered."
          }
        ]
      },
      "ButtonColor": {
        "name": "ButtonColor",
        "values": [
          {
            "value": "primary",
            "description": ""
          },
          {
            "value": "secondary",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "info",
            "description": ""
          },
          {
            "value": "none",
            "description": "Paints nothing of its own, so the surrounding theme or a `--sn-button-*` override supplies the colour."
          }
        ]
      },
      "ButtonSize": {
        "name": "ButtonSize",
        "values": [
          {
            "value": "xs",
            "description": ""
          },
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      },
      "ButtonShape": {
        "name": "ButtonShape",
        "values": [
          {
            "value": "default",
            "description": ""
          },
          {
            "value": "pill",
            "description": ""
          }
        ]
      },
      "ButtonLoadingVariant": {
        "name": "ButtonLoadingVariant",
        "values": [
          {
            "value": "default",
            "description": "The library spinner."
          },
          {
            "value": "material",
            "description": "The Material-style spinner, matching `ProgressSpinner` in `material` variant."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-button-accent",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-button-accent-active",
        "default": "var(--sn-color-primary-active)",
        "source": "component"
      },
      {
        "name": "--sn-button-accent-hover",
        "default": "var(--sn-color-primary-hover)",
        "source": "component"
      },
      {
        "name": "--sn-button-active-bg",
        "default": "var(--sn-button-solid-active-bg)",
        "source": "component"
      },
      {
        "name": "--sn-button-bg",
        "default": "var(--sn-button-solid-bg)",
        "source": "component"
      },
      {
        "name": "--sn-button-border-radius",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-disabled-bg",
        "default": "var(--sn-disabled-bg)",
        "source": "component"
      },
      {
        "name": "--sn-button-disabled-border",
        "default": "var(--sn-disabled-border)",
        "source": "component"
      },
      {
        "name": "--sn-button-disabled-text",
        "default": "var(--sn-disabled-text)",
        "source": "component"
      },
      {
        "name": "--sn-button-font-size-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-font-size-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-font-size-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-font-size-xs",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-horizontal-padding-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-horizontal-padding-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-horizontal-padding-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-horizontal-padding-xs",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-hover-bg",
        "default": "var(--sn-button-solid-hover-bg)",
        "source": "component"
      },
      {
        "name": "--sn-button-icon-size-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-icon-size-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-icon-size-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-icon-size-xs",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-line-height",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-min-height-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-min-height-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-min-height-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-min-height-xs",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-soft-active-bg",
        "default": "var(--sn-button-soft-bg)",
        "source": "component"
      },
      {
        "name": "--sn-button-soft-bg",
        "default": "var(--sn-color-primary-soft)",
        "source": "component"
      },
      {
        "name": "--sn-button-solid-active-bg",
        "default": "var(--sn-color-primary-solid-active)",
        "source": "component"
      },
      {
        "name": "--sn-button-solid-bg",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-button-solid-hover-bg",
        "default": "var(--sn-color-primary-solid-hover)",
        "source": "component"
      },
      {
        "name": "--sn-button-solid-text",
        "default": "var(--sn-text-on-primary)",
        "source": "component"
      },
      {
        "name": "--sn-button-spinner-material-arc-duration",
        "default": "1.4s",
        "source": "component"
      },
      {
        "name": "--sn-button-spinner-material-rotate-duration",
        "default": "1.6s",
        "source": "component"
      },
      {
        "name": "--sn-button-spinner-rotate-duration",
        "default": "0.8s",
        "source": "component"
      },
      {
        "name": "--sn-button-text",
        "default": "var(--sn-button-solid-text)",
        "source": "component"
      },
      {
        "name": "--sn-button-vertical-padding-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-vertical-padding-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-vertical-padding-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-button-vertical-padding-xs",
        "default": null,
        "source": null
      }
    ],
    "intl": []
  },
  "split-button": {
    "slug": "split-button",
    "importPath": "ashen-ui/split-button",
    "surfaces": [
      {
        "symbol": "SplitButton",
        "kind": "component",
        "selector": "sn-split-button",
        "inputs": [
          {
            "category": "inputs",
            "name": "variant",
            "bindingName": "variant",
            "type": "ButtonVariant",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "color",
            "bindingName": "color",
            "type": "ButtonColor",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "ButtonSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "menuFor",
            "bindingName": "menuFor",
            "type": "Menu",
            "required": true,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "dropdownAriaLabel",
            "bindingName": "dropdownAriaLabel",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "clicked",
            "bindingName": "clicked",
            "type": "MouseEvent",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "ButtonVariant": {
        "name": "ButtonVariant",
        "values": [
          {
            "value": "base",
            "description": "Filled, the default call to action."
          },
          {
            "value": "raised",
            "description": "Filled with an elevation shadow."
          },
          {
            "value": "outlined",
            "description": "Transparent with a coloured border, for a secondary action beside a base button."
          },
          {
            "value": "text",
            "description": "No border or fill until hovered, for the lowest-emphasis action in a group."
          },
          {
            "value": "icon",
            "description": "Square, icon-only, transparent."
          },
          {
            "value": "icon-filled",
            "description": "Square, icon-only, filled."
          },
          {
            "value": "icon-outlined",
            "description": "Square, icon-only, with a border."
          },
          {
            "value": "icon-text",
            "description": "Square, icon-only, no fill until hovered."
          }
        ]
      },
      "ButtonColor": {
        "name": "ButtonColor",
        "values": [
          {
            "value": "primary",
            "description": ""
          },
          {
            "value": "secondary",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "info",
            "description": ""
          },
          {
            "value": "none",
            "description": "Paints nothing of its own, so the surrounding theme or a `--sn-button-*` override supplies the colour."
          }
        ]
      },
      "ButtonSize": {
        "name": "ButtonSize",
        "values": [
          {
            "value": "xs",
            "description": ""
          },
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-split-button-divider",
        "default": "rgba(255, 255, 255, 0.25)",
        "source": "component"
      },
      {
        "name": "--sn-split-button-trigger-padding-inline",
        "default": "0.5rem",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "split-button",
        "key": "more",
        "englishDefault": "More actions"
      }
    ]
  },
  "form-field": {
    "slug": "form-field",
    "importPath": "ashen-ui/form-field",
    "surfaces": [
      {
        "symbol": "FormFieldPrefix",
        "kind": "directive",
        "selector": "[snPrefix]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "FormFieldSuffix",
        "kind": "directive",
        "selector": "[snSuffix]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "FormFieldError",
        "kind": "component",
        "selector": "sn-error",
        "inputs": [
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The message's `id`, which the control's `aria-describedby` points at."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "FormFieldHint",
        "kind": "component",
        "selector": "sn-hint",
        "inputs": [
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The hint's `id`, which the control's `aria-describedby` points at."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "FormFieldLabel",
        "kind": "component",
        "selector": "sn-label",
        "inputs": [
          {
            "category": "inputs",
            "name": "required",
            "bindingName": "required",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "for",
            "bindingName": "for",
            "type": "string",
            "required": false,
            "default": null,
            "description": "Id of the control this label names. Defaults to the enclosing field's\ncontrol id; set it to point at a control that carries its own `id`."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "FormField",
        "kind": "component",
        "selector": "sn-form-field",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "floatLabel",
            "bindingName": "floatLabel",
            "type": "SnFloatLabel",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "subscriptSizing",
            "bindingName": "subscriptSizing",
            "type": "SnSubscriptSizing",
            "required": false,
            "default": "'fixed'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "autoDisplayErrors",
            "bindingName": "autoDisplayErrors",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": "Controls when projected `sn-error` messages are shown. Default (`true`):\nerrors stay hidden until the control enters its error state (invalid AND\ntouched/dirty, or the form submitted). Set `[autoDisplayErrors]=\"false\"` to\nmanage visibility yourself (render `sn-error` only when you want it, e.g. inside `@if`).\n\nAuto mode only engages for controls that report their state (`snInputText`,\n`sn-input-password`, `sn-textarea`); with any other control the field falls\nback to showing every rendered `sn-error`."
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "SnFloatLabel": {
        "name": "SnFloatLabel",
        "values": [
          {
            "value": "auto",
            "description": "Label rests over the control and floats into the outline on focus or once the control has a value."
          },
          {
            "value": "always",
            "description": "Label stays floated in the outline, so the placeholder is visible from the start."
          }
        ]
      },
      "SnSubscriptSizing": {
        "name": "SnSubscriptSizing",
        "values": [
          {
            "value": "fixed",
            "description": "Always reserves one line under the control, so a row of fields keeps its height when an error appears."
          },
          {
            "value": "dynamic",
            "description": "Takes no space until there is a hint or error to show, and the layout shifts when one appears."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-form-field-affix-button-padding",
        "default": "0.25rem",
        "source": "component"
      },
      {
        "name": "--sn-form-field-affix-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-affix-gap",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-affix-padding",
        "default": "var(--sn-input-spacing-md)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-affix-width",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-error-color",
        "default": "var(--sn-color-invalid)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-error-font-size",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-error-font-weight",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-error-size",
        "default": "var(--sn-form-field-error-font-size)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-floating-label-font-size",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-gap",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-hint-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-hint-font-size",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-hint-font-weight",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-hint-size",
        "default": "var(--sn-form-field-hint-font-size)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-label-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-label-font-size",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-label-font-weight",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-label-shift",
        "default": "calc( var(--sn-form-field-prefix-gutter) - var(--sn-input-spacing-md) )",
        "source": "component"
      },
      {
        "name": "--sn-form-field-label-size",
        "default": "var(--sn-form-field-label-font-size)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-label-weight",
        "default": "var(--sn-form-field-label-font-weight)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-outline-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-outline-grow",
        "default": "0px",
        "source": "component"
      },
      {
        "name": "--sn-form-field-prefix-gutter",
        "default": "max( var(--sn-form-field-affix-width), var(--sn-form-field-prefix-width, 0px) )",
        "source": "component"
      },
      {
        "name": "--sn-form-field-prefix-width",
        "default": "0px",
        "source": "component"
      },
      {
        "name": "--sn-form-field-required-color",
        "default": "var(--sn-color-invalid)",
        "source": "component"
      },
      {
        "name": "--sn-form-field-subscript-gap",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-subscript-line-height",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-subscript-padding-x",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-form-field-suffix-gutter",
        "default": "max( var(--sn-form-field-affix-width), var(--sn-form-field-suffix-width, 0px) )",
        "source": "component"
      },
      {
        "name": "--sn-form-field-suffix-width",
        "default": "0px",
        "source": "component"
      },
      {
        "name": "--sn-form-field-wrapper-gap",
        "default": "var(--sn-form-field-gap)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "input-text": {
    "slug": "input-text",
    "importPath": "ashen-ui/input-text",
    "surfaces": [
      {
        "symbol": "InputText",
        "kind": "directive",
        "selector": "input[snInputText]",
        "inputs": [
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "InputTextSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "invalid",
            "bindingName": "invalid",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The input's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the input, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "InputTextSize": {
        "name": "InputTextSize",
        "values": [
          {
            "value": "xs",
            "description": ""
          },
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-input-text-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-border",
        "default": "var(--sn-input-border)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-border-radius",
        "default": "var(--sn-input-border-radius)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-error-border",
        "default": "var(--sn-border-invalid)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-focus-border",
        "default": "var(--sn-border-focus)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-font-size",
        "default": "var(--sn-input-font-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-padding",
        "default": "var(--sn-input-spacing-md)",
        "source": "component"
      },
      {
        "name": "--sn-input-text-placeholder",
        "default": "var(--sn-input-placeholder)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "input-mask": {
    "slug": "input-mask",
    "importPath": "ashen-ui/input-mask",
    "surfaces": [
      {
        "symbol": "InputMask",
        "kind": "directive",
        "selector": "input[snMask]",
        "inputs": [
          {
            "category": "inputs",
            "name": "snMask",
            "bindingName": "snMask",
            "type": "string",
            "required": true,
            "default": null,
            "description": "The mask pattern, e.g. `(999) 999-9999`."
          },
          {
            "category": "inputs",
            "name": "placeholderChar",
            "bindingName": "placeholderChar",
            "type": "string",
            "required": false,
            "default": "'_'",
            "description": "Character standing in for an unfilled slot in the placeholder."
          },
          {
            "category": "inputs",
            "name": "unmask",
            "bindingName": "unmask",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Report the value without the mask's literals: `5551234567` rather than\n`(555) 123-4567`. Affects the model only; the element still shows the mask."
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | null | undefined",
            "required": false,
            "default": "undefined",
            "description": "The element's own placeholder. Declared here so a bound `[placeholder]`\nwins over the mask template instead of being overwritten by it."
          },
          {
            "category": "inputs",
            "name": "showMaskPlaceholder",
            "bindingName": "showMaskPlaceholder",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": "Show the mask template as the placeholder. Ignored if the element has its own."
          },
          {
            "category": "inputs",
            "name": "autoClear",
            "bindingName": "autoClear",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [],
    "intl": []
  },
  "textarea": {
    "slug": "textarea",
    "importPath": "ashen-ui/textarea",
    "surfaces": [
      {
        "symbol": "Textarea",
        "kind": "directive",
        "selector": "textarea[snTextarea]",
        "inputs": [
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "TextareaSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "invalid",
            "bindingName": "invalid",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The textarea's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the textarea, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "TextareaSize": {
        "name": "TextareaSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-textarea-default-min-height",
        "default": "4.5rem",
        "source": "component"
      },
      {
        "name": "--sn-textarea-min-height",
        "default": "var(--sn-textarea-default-min-height, 4.5rem)",
        "source": "component"
      },
      {
        "name": "--sn-textarea-padding-block",
        "default": "var(--sn-input-spacing-sm)",
        "source": "component"
      },
      {
        "name": "--sn-textarea-resize",
        "default": "vertical",
        "source": "component"
      }
    ],
    "intl": []
  },
  "checkbox": {
    "slug": "checkbox",
    "importPath": "ashen-ui/checkbox",
    "surfaces": [
      {
        "symbol": "Checkbox",
        "kind": "component",
        "selector": "sn-checkbox",
        "inputs": [
          {
            "category": "inputs",
            "name": "indeterminate",
            "bindingName": "indeterminate",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "CheckboxSize",
            "required": false,
            "default": "'md'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "checked",
            "bindingName": "checked",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "CheckboxSize": {
        "name": "CheckboxSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-checkbox-border",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-border-radius",
        "default": "0.25rem",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-check-motion",
        "default": "0.15s ease-out",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-checked-bg",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-checked-border",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-gap",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-icon-color",
        "default": "var(--sn-text-on-primary)",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-icon-size-lg",
        "default": "1.25rem",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-icon-size-md",
        "default": "1rem",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-icon-size-sm",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-label-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-label-size",
        "default": "var(--sn-label-size, var(--sn-text-sm))",
        "source": "component"
      },
      {
        "name": "--sn-checkbox-size-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-checkbox-size-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-checkbox-size-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-checkbox-transition",
        "default": "var(--sn-motion-slow, 0.2s ease)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "toggle": {
    "slug": "toggle",
    "importPath": "ashen-ui/toggle",
    "surfaces": [
      {
        "symbol": "Toggle",
        "kind": "component",
        "selector": "sn-toggle",
        "inputs": [
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "ToggleSize",
            "required": false,
            "default": "'md'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "checked",
            "bindingName": "checked",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "ToggleSize": {
        "name": "ToggleSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-toggle-button-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-active-selected",
        "default": "var(--sn-selected-bg-hover)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-hover",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-hover-selected",
        "default": "var(--sn-selected-bg-hover)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-selected",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-border",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-border-selected",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-icon-size",
        "default": "1.125rem",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-min-height",
        "default": "var(--sn-input-min-height-md)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-padding-x",
        "default": "1.125rem",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-padding-y",
        "default": "0.5rem",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-radius",
        "default": "var(--sn-input-border-radius, var(--sn-radius-md))",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-text",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-text-selected",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-transition",
        "default": "var(--sn-motion-slow, 0.2s ease)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-label-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-label-gap",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-label-size",
        "default": "var(--sn-label-size, var(--sn-text-sm))",
        "source": "component"
      },
      {
        "name": "--sn-toggle-thumb-bg",
        "default": "rgb(255, 255, 255)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-thumb-offset",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-thumb-size",
        "default": "var(--sn-toggle-thumb-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-thumb-size-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-thumb-size-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-thumb-size-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-bg",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-track-bg-checked",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-track-bg-checked-hover",
        "default": "var(--sn-toggle-track-bg-checked)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-track-bg-hover",
        "default": "var(--sn-toggle-track-bg)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-track-border-radius",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-height-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-height-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-height-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-w",
        "default": "var(--sn-toggle-track-width-md)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-track-width-lg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-width-md",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-track-width-sm",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-toggle-transition",
        "default": "var(--sn-motion-slow, 0.2s ease)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "toggle-button": {
    "slug": "toggle-button",
    "importPath": "ashen-ui/toggle-button",
    "surfaces": [
      {
        "symbol": "ToggleButton",
        "kind": "directive",
        "selector": "button[snToggleButton]",
        "inputs": [
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "ToggleButtonSize",
            "required": false,
            "default": "'md'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "selected",
            "bindingName": "selected",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "ToggleButtonSize": {
        "name": "ToggleButtonSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-toggle-button-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-active-selected",
        "default": "var(--sn-selected-bg-hover)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-hover",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-hover-selected",
        "default": "var(--sn-selected-bg-hover)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-bg-selected",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-border",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-border-selected",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-icon-size",
        "default": "1.125rem",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-min-height",
        "default": "var(--sn-input-min-height-md)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-padding-x",
        "default": "1.125rem",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-padding-y",
        "default": "0.5rem",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-radius",
        "default": "var(--sn-input-border-radius, var(--sn-radius-md))",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-text",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-text-selected",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-toggle-button-transition",
        "default": "var(--sn-motion-slow, 0.2s ease)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "radio-group": {
    "slug": "radio-group",
    "importPath": "ashen-ui/radio-group",
    "surfaces": [
      {
        "symbol": "RadioGroup",
        "kind": "component",
        "selector": "sn-radio-group",
        "inputs": [
          {
            "category": "inputs",
            "name": "direction",
            "bindingName": "direction",
            "type": "'vertical' | 'horizontal'",
            "required": false,
            "default": "'vertical'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "name",
            "bindingName": "name",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "ModelSignal<unknown>",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "outputs": []
      },
      {
        "symbol": "Radio",
        "kind": "component",
        "selector": "sn-radio",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": true,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-radio-button-border",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-checked-border",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-dot-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-dot-size",
        "default": "var(--sn-radio-button-dot-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-gap",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-label-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-label-size",
        "default": "var(--sn-label-size)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-size",
        "default": "var(--sn-radio-button-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-radio-button-transition",
        "default": "var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-radio-group-gap",
        "default": null,
        "source": null
      }
    ],
    "intl": []
  },
  "select-button": {
    "slug": "select-button",
    "importPath": "ashen-ui/select-button",
    "surfaces": [
      {
        "symbol": "SelectButton",
        "kind": "component",
        "selector": "sn-select-button",
        "inputs": [
          {
            "category": "inputs",
            "name": "multiple",
            "bindingName": "multiple",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "ModelSignal<unknown>",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "outputs": []
      },
      {
        "symbol": "SelectOption",
        "kind": "directive",
        "selector": "button[snSelectOption]",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": true,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-select-button-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-select-button-min-height",
        "default": "var(--sn-input-min-height-md)",
        "source": "component"
      },
      {
        "name": "--sn-select-button-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "input-number": {
    "slug": "input-number",
    "importPath": "ashen-ui/input-number",
    "surfaces": [
      {
        "symbol": "InputNumberStepper",
        "kind": "component",
        "selector": "sn-input-number-stepper",
        "inputs": [
          {
            "category": "inputs",
            "name": "for",
            "bindingName": "for",
            "type": "InputNumber",
            "required": true,
            "default": null,
            "description": "The input to step, e.g. `<input snInputNumber #qty=\"snInputNumber\">` then `[for]=\"qty\"`."
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "InputNumber",
        "kind": "directive",
        "selector": "input[snInputNumber]",
        "inputs": [
          {
            "category": "inputs",
            "name": "min",
            "bindingName": "min",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "max",
            "bindingName": "max",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "step",
            "bindingName": "step",
            "type": "number",
            "required": false,
            "default": "1",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-input-number-stepper-active-bg",
        "default": "var(--sn-color-primary-solid-active)",
        "source": "component"
      },
      {
        "name": "--sn-input-number-stepper-bg",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-input-number-stepper-color",
        "default": "var(--sn-text-on-primary)",
        "source": "component"
      },
      {
        "name": "--sn-input-number-stepper-hover-bg",
        "default": "var(--sn-color-primary-solid-hover)",
        "source": "component"
      },
      {
        "name": "--sn-input-number-stepper-icon-size",
        "default": "var(--sn-icon-size-sm)",
        "source": "component"
      },
      {
        "name": "--sn-input-number-stepper-width",
        "default": "var(--sn-control-height-md)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "input-password": {
    "slug": "input-password",
    "importPath": "ashen-ui/input-password",
    "surfaces": [
      {
        "symbol": "InputPassword",
        "kind": "component",
        "selector": "sn-input-password",
        "inputs": [
          {
            "category": "inputs",
            "name": "meter",
            "bindingName": "meter",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "invalid",
            "bindingName": "invalid",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "InputPasswordSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showPasswordLabel",
            "bindingName": "showPasswordLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "hidePasswordLabel",
            "bindingName": "hidePasswordLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "InputPasswordSize": {
        "name": "InputPasswordSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-input-password-meter-gap",
        "default": "var(--sn-space-2)",
        "source": "component"
      },
      {
        "name": "--sn-input-password-meter-height",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-input-password-meter-label-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-input-password-meter-radius",
        "default": "9999px",
        "source": "component"
      },
      {
        "name": "--sn-input-password-meter-track-bg",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-input-password-meter-transition",
        "default": "width 200ms ease, background 200ms ease",
        "source": "component"
      },
      {
        "name": "--sn-input-password-toggle-bg-hover",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-input-password-toggle-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-input-password-toggle-hover-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-input-password-toggle-size",
        "default": "2rem",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "password",
        "key": "placeholder",
        "englishDefault": "Password"
      },
      {
        "group": "password",
        "key": "show",
        "englishDefault": "Show password"
      },
      {
        "group": "password",
        "key": "hide",
        "englishDefault": "Hide password"
      },
      {
        "group": "password",
        "key": "strengthWeak",
        "englishDefault": "Weak"
      },
      {
        "group": "password",
        "key": "strengthFair",
        "englishDefault": "Fair"
      },
      {
        "group": "password",
        "key": "strengthGood",
        "englishDefault": "Good"
      },
      {
        "group": "password",
        "key": "strengthStrong",
        "englishDefault": "Strong"
      }
    ]
  },
  "input-group": {
    "slug": "input-group",
    "importPath": "ashen-ui/input-group",
    "surfaces": [
      {
        "symbol": "InputGroupAddon",
        "kind": "component",
        "selector": "sn-input-group-addon",
        "inputs": [
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "InputGroup",
        "kind": "component",
        "selector": "sn-input-group",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-input-group-addon-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-input-group-addon-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-input-group-addon-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-input-group-addon-font-size",
        "default": "var(--sn-input-font-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-input-group-addon-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-input-group-addon-padding",
        "default": "0 0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-input-group-border-radius",
        "default": "var(--sn-input-border-radius)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "input-tags": {
    "slug": "input-tags",
    "importPath": "ashen-ui/input-tags",
    "surfaces": [
      {
        "symbol": "InputTags",
        "kind": "component",
        "selector": "sn-input-tags",
        "inputs": [
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "invalid",
            "bindingName": "invalid",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "InputTagsSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "string[]",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "InputTagsSize": {
        "name": "InputTagsSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-input-tags-field-min-width",
        "default": "8rem",
        "source": "component"
      },
      {
        "name": "--sn-input-tags-gap",
        "default": "var(--sn-space-1)",
        "source": "component"
      },
      {
        "name": "--sn-input-tags-min-height",
        "default": "var(--sn-input-min-height-md)",
        "source": "component"
      },
      {
        "name": "--sn-input-tags-padding",
        "default": "var(--sn-input-spacing-md)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "input-tags",
        "key": "addTag",
        "englishDefault": "Add tag"
      }
    ]
  },
  "slider": {
    "slug": "slider",
    "importPath": "ashen-ui/slider",
    "surfaces": [
      {
        "symbol": "Slider",
        "kind": "component",
        "selector": "sn-slider",
        "inputs": [
          {
            "category": "inputs",
            "name": "orientation",
            "bindingName": "orientation",
            "type": "SliderOrientation",
            "required": false,
            "default": "'horizontal'",
            "description": "Which way the track runs. A vertical slider fills from the bottom, and its\nlength comes from `--sn-slider-length` rather than from the container."
          },
          {
            "category": "inputs",
            "name": "min",
            "bindingName": "min",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "max",
            "bindingName": "max",
            "type": "number",
            "required": false,
            "default": "100",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "step",
            "bindingName": "step",
            "type": "number",
            "required": false,
            "default": "1",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "buffered",
            "bindingName": "buffered",
            "type": "number | null | undefined",
            "required": false,
            "default": "null",
            "description": "How far the loaded range extends, in the slider's own units. Drawn as a\nsecond bar behind the fill, like a video player's buffered segment."
          },
          {
            "category": "inputs",
            "name": "showValue",
            "bindingName": "showValue",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "formatValue",
            "bindingName": "formatValue",
            "type": "((v: number) => string) | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "SliderOrientation": {
        "name": "SliderOrientation",
        "values": [
          {
            "value": "horizontal",
            "description": ""
          },
          {
            "value": "vertical",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-slider-buffer-bg",
        "default": "color-mix(in srgb, var(--sn-color-primary) 30%, transparent)",
        "source": "component"
      },
      {
        "name": "--sn-slider-fill-bg",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-slider-focus-ring",
        "default": "0 0 0 3px color-mix(in srgb, var(--sn-color-primary) 30%, transparent)",
        "source": "component"
      },
      {
        "name": "--sn-slider-length",
        "default": "10rem",
        "source": "component"
      },
      {
        "name": "--sn-slider-thumb-bg",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-slider-thumb-size",
        "default": "1.25rem",
        "source": "component"
      },
      {
        "name": "--sn-slider-track-bg",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-slider-track-height",
        "default": "0.5rem",
        "source": "component"
      },
      {
        "name": "--sn-slider-value-gap",
        "default": "1rem",
        "source": "component"
      },
      {
        "name": "--sn-slider-value-min-width",
        "default": "3rem",
        "source": "component"
      }
    ],
    "intl": []
  },
  "listbox": {
    "slug": "listbox",
    "importPath": "ashen-ui/listbox",
    "surfaces": [
      {
        "symbol": "ListOption",
        "kind": "component",
        "selector": "sn-list-option",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabledInput",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Listbox",
        "kind": "component",
        "selector": "sn-listbox",
        "inputs": [
          {
            "category": "inputs",
            "name": "multiple",
            "bindingName": "multiple",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "checkmark",
            "bindingName": "checkmark",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Mark selected options with a trailing check icon."
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabelledby",
            "bindingName": "ariaLabelledby",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "ModelSignal<unknown>",
            "required": false,
            "default": "null",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-listbox-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-listbox-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-listbox-border-radius",
        "default": "var(--sn-select-border-radius, 0.375rem)",
        "source": "component"
      },
      {
        "name": "--sn-listbox-check-icon-size",
        "default": "12px",
        "source": "component"
      },
      {
        "name": "--sn-listbox-check-size",
        "default": "1rem",
        "source": "component"
      },
      {
        "name": "--sn-listbox-font-size",
        "default": "var(--sn-select-font-size, 0.875rem)",
        "source": "component"
      },
      {
        "name": "--sn-listbox-max-height",
        "default": "15rem",
        "source": "component"
      },
      {
        "name": "--sn-listbox-option-icon-size",
        "default": "1rem",
        "source": "component"
      },
      {
        "name": "--sn-listbox-option-padding",
        "default": "var(--sn-select-option-padding, 0.5rem 0.75rem)",
        "source": "component"
      },
      {
        "name": "--sn-listbox-option-selected-bg",
        "default": "var(--sn-select-option-selected-bg, var(--sn-selected-bg))",
        "source": "component"
      },
      {
        "name": "--sn-listbox-option-selected-text",
        "default": "var(--sn-select-option-selected-text, var(--sn-selected-text))",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "listbox",
        "key": "label",
        "englishDefault": "Options"
      }
    ]
  },
  "select": {
    "slug": "select",
    "importPath": "ashen-ui/select",
    "surfaces": [
      {
        "symbol": "Select",
        "kind": "component",
        "selector": "sn-select",
        "inputs": [
          {
            "category": "inputs",
            "name": "checkmark",
            "bindingName": "checkmark",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Mark the selected option with a trailing check icon."
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "clearable",
            "bindingName": "clearable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "clearLabel",
            "bindingName": "clearLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "panelWidth",
            "bindingName": "panelWidth",
            "type": "'trigger' | 'auto'",
            "required": false,
            "default": "'trigger'",
            "description": "`'trigger'` keeps the panel as wide as the trigger. `'auto'` uses the trigger\nwidth as the minimum, so a panel class can make it wider (a multi-column list)."
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": false,
            "default": "null",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-select-arrow-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-select-arrow-icon-size",
        "default": "20px",
        "source": "component"
      },
      {
        "name": "--sn-select-border-radius",
        "default": "0.375rem",
        "source": "component"
      },
      {
        "name": "--sn-select-button-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-select-button-min-height",
        "default": "var(--sn-input-min-height-md)",
        "source": "component"
      },
      {
        "name": "--sn-select-button-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-gap",
        "default": "var(--sn-space-1)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-hover-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-icon-size",
        "default": "var(--sn-icon-size-sm)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-inset-inline-end",
        "default": "calc(var(--sn-select-padding-inline-end) + var(--sn-select-arrow-icon-size) + var(--sn-select-clear-gap))",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-size",
        "default": "var(--sn-icon-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-select-clear-transition",
        "default": "background-color var(--sn-motion-base), color var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-select-font-size",
        "default": "0.875rem",
        "source": "component"
      },
      {
        "name": "--sn-select-min-height",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-select-option-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-padding",
        "default": "0.5rem 0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-select-option-padding-x",
        "default": "0.875rem",
        "source": "component"
      },
      {
        "name": "--sn-select-option-padding-y",
        "default": "0.5rem",
        "source": "component"
      },
      {
        "name": "--sn-select-option-selected-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-selected-color",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-selected-hover-bg",
        "default": "var(--sn-selected-bg-hover)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-selected-text",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-select-option-transition",
        "default": "background-color var(--sn-motion-fast, 150ms ease), color var(--sn-motion-fast, 150ms ease)",
        "source": "component"
      },
      {
        "name": "--sn-select-padding",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-select-padding-inline-end",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-select-panel-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-select-panel-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-select-panel-exit-duration",
        "default": "0.12s",
        "source": "component"
      },
      {
        "name": "--sn-select-panel-max-height",
        "default": "15rem",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "select",
        "key": "placeholder",
        "englishDefault": "Select…"
      },
      {
        "group": "select",
        "key": "clear",
        "englishDefault": "Clear selection"
      }
    ]
  },
  "multi-select": {
    "slug": "multi-select",
    "importPath": "ashen-ui/multi-select",
    "surfaces": [
      {
        "symbol": "MultiSelect",
        "kind": "component",
        "selector": "sn-multi-select",
        "inputs": [
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "maxChips",
            "bindingName": "maxChips",
            "type": "number",
            "required": false,
            "default": "3",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "unknown[]",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-multi-select-chip-padding-v",
        "default": "0.375rem",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "select",
        "key": "placeholder",
        "englishDefault": "Select…"
      },
      {
        "group": "select",
        "key": "clear",
        "englishDefault": "Clear selection"
      }
    ]
  },
  "autocomplete": {
    "slug": "autocomplete",
    "importPath": "ashen-ui/autocomplete",
    "surfaces": [
      {
        "symbol": "AutoCompleteOptionTemplate",
        "kind": "directive",
        "selector": "ng-template[snAutoCompleteOption]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "AutoCompleteSelectedValueTemplate",
        "kind": "directive",
        "selector": "ng-template[snAutoCompleteSelectedValue]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "AutoCompleteSummaryTemplate",
        "kind": "directive",
        "selector": "ng-template[snAutoCompleteSummary]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "AutoComplete",
        "kind": "component",
        "selector": "sn-autocomplete",
        "inputs": [
          {
            "category": "inputs",
            "name": "suggestions",
            "bindingName": "suggestions",
            "type": "readonly T[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "optionLabel",
            "bindingName": "optionLabel",
            "type": "string | ((option: T) => string) | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "compareWith",
            "bindingName": "compareWith",
            "type": "(left: T, right: T) => boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "multiple",
            "bindingName": "multiple",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "unique",
            "bindingName": "unique",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "hideSelected",
            "bindingName": "hideSelected",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Drop already-selected suggestions from the panel instead of showing them as\nselected rows that toggle off when picked again."
          },
          {
            "category": "inputs",
            "name": "checkmark",
            "bindingName": "checkmark",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": "Mark selected suggestions with a trailing check icon."
          },
          {
            "category": "inputs",
            "name": "removable",
            "bindingName": "removable",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": "Give each selected-value chip a remove button."
          },
          {
            "category": "inputs",
            "name": "hideValuesOnFocus",
            "bindingName": "hideValuesOnFocus",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Hide the selected-value chips while the field has focus, to free typing room."
          },
          {
            "category": "inputs",
            "name": "keepPlaceholder",
            "bindingName": "keepPlaceholder",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Keep showing the placeholder after the selected values, instead of clearing it once there are any."
          },
          {
            "category": "inputs",
            "name": "filter",
            "bindingName": "filter",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "completeOnFocus",
            "bindingName": "completeOnFocus",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showEmptyMessage",
            "bindingName": "showEmptyMessage",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": "Show a row with `emptyMessage` when a typed search has no suggestions,\ninstead of keeping the panel closed. After a `complete` event it waits for\n`suggestions` to change, so a pending server search does not flash it."
          },
          {
            "category": "inputs",
            "name": "emptyMessage",
            "bindingName": "emptyMessage",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": "Text of the empty row. Defaults to `SnCommonIntl.emptyMessage`."
          },
          {
            "category": "inputs",
            "name": "maxSelectedLabels",
            "bindingName": "maxSelectedLabels",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "removeAriaLabel",
            "bindingName": "removeAriaLabel",
            "type": "string | ((label: string) => string) | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "virtual",
            "bindingName": "virtual",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "optionHeight",
            "bindingName": "optionHeight",
            "type": "number",
            "required": false,
            "default": "36",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "overscan",
            "bindingName": "overscan",
            "type": "number",
            "required": false,
            "default": "4",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "hasMore",
            "bindingName": "hasMore",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loadMoreThreshold",
            "bindingName": "loadMoreThreshold",
            "type": "number",
            "required": false,
            "default": "10",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "T | string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "models",
            "name": "values",
            "bindingName": "values",
            "type": "readonly T[]",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": [
          {
            "category": "outputs",
            "name": "selected",
            "bindingName": "selected",
            "type": "T",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "removed",
            "bindingName": "removed",
            "type": "T",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "complete",
            "bindingName": "complete",
            "type": "AutoCompleteCompleteEvent",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "loadMore",
            "bindingName": "loadMore",
            "type": "AutoCompleteLoadMoreEvent",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-autocomplete-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-border",
        "default": "1px solid var(--sn-input-border)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-border",
        "default": "1px solid transparent",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-color",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-gap",
        "default": "var(--sn-space-1)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-padding",
        "default": "var(--sn-space-1) var(--sn-space-2)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-chip-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-empty-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-empty-font-size",
        "default": "inherit",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-empty-padding",
        "default": "var(--sn-select-option-padding, 0.5rem 0.75rem)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-focus-border",
        "default": "var(--sn-border-focus)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-gap",
        "default": "var(--sn-space-1)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-input-padding",
        "default": "var(--sn-autocomplete-padding)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-min-height",
        "default": "var(--sn-input-min-height-md)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-padding",
        "default": "var(--sn-space-1)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-radius",
        "default": "var(--sn-input-border-radius)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-remove-color",
        "default": "currentColor",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-remove-hover-color",
        "default": "var(--sn-color-error)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-remove-size",
        "default": "var(--sn-icon-size-sm)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-summary-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-summary-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-summary-font-size",
        "default": "var(--sn-autocomplete-chip-font-size)",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-summary-padding",
        "default": "0",
        "source": "component"
      },
      {
        "name": "--sn-autocomplete-summary-radius",
        "default": "0",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "common",
        "key": "close",
        "englishDefault": "Close"
      },
      {
        "group": "common",
        "key": "next",
        "englishDefault": "Next"
      },
      {
        "group": "common",
        "key": "previous",
        "englishDefault": "Previous"
      },
      {
        "group": "common",
        "key": "loading",
        "englishDefault": "Loading"
      },
      {
        "group": "common",
        "key": "emptyMessage",
        "englishDefault": "No results found."
      }
    ]
  },
  "tree-select": {
    "slug": "tree-select",
    "importPath": "ashen-ui/tree-select",
    "surfaces": [
      {
        "symbol": "TreeSelect",
        "kind": "component",
        "selector": "sn-tree-select",
        "inputs": [
          {
            "category": "inputs",
            "name": "nodes",
            "bindingName": "nodes",
            "type": "readonly TreeNode[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "string | null",
            "required": false,
            "default": "null",
            "description": ""
          },
          {
            "category": "models",
            "name": "expandedKeys",
            "bindingName": "expandedKeys",
            "type": "readonly string[]",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": [
          {
            "category": "outputs",
            "name": "nodeSelect",
            "bindingName": "nodeSelect",
            "type": "{ key: string; node: TreeNode }",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-tree-select-icon-size",
        "default": "16px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "select",
        "key": "placeholder",
        "englishDefault": "Select…"
      },
      {
        "group": "select",
        "key": "clear",
        "englishDefault": "Clear selection"
      }
    ]
  },
  "cascade-select": {
    "slug": "cascade-select",
    "importPath": "ashen-ui/cascade-select",
    "surfaces": [
      {
        "symbol": "CascadeSelect",
        "kind": "component",
        "selector": "sn-cascade-select",
        "inputs": [
          {
            "category": "inputs",
            "name": "options",
            "bindingName": "options",
            "type": "readonly CascadeOption[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": false,
            "default": "null",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-cascade-select-icon-size",
        "default": "16px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "select",
        "key": "placeholder",
        "englishDefault": "Select…"
      },
      {
        "group": "select",
        "key": "clear",
        "englishDefault": "Clear selection"
      }
    ]
  },
  "date-picker": {
    "slug": "date-picker",
    "importPath": "ashen-ui/date-picker",
    "surfaces": [
      {
        "symbol": "DatePicker",
        "kind": "component",
        "selector": "sn-date-picker",
        "inputs": [
          {
            "category": "inputs",
            "name": "minDate",
            "bindingName": "minDate",
            "type": "Date | null | undefined",
            "required": false,
            "default": "undefined",
            "description": "The earliest selectable date, inclusive and compared by day.\n\nAn existing `value` outside the range is left alone rather than corrected.\nThe range says what a user may pick; what the model already holds is the\napp's business, and a validator is where it belongs."
          },
          {
            "category": "inputs",
            "name": "maxDate",
            "bindingName": "maxDate",
            "type": "Date | null | undefined",
            "required": false,
            "default": "undefined",
            "description": "The latest selectable date, inclusive and compared by day."
          },
          {
            "category": "inputs",
            "name": "placeholder",
            "bindingName": "placeholder",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "formatDate",
            "bindingName": "formatDate",
            "type": "((d: Date) => string) | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "id",
            "bindingName": "id",
            "type": "string",
            "required": false,
            "default": null,
            "description": "The control's `id`. Defaults to one generated by the enclosing\n`sn-form-field`, whose `sn-label` points at it; set it to use your own and\nthe label follows."
          },
          {
            "category": "inputs",
            "name": "ariaDescribedby",
            "bindingName": "aria-describedby",
            "type": "string",
            "required": false,
            "default": "undefined",
            "description": "Extra ids describing the control, merged with the field's hint and error ids."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "Date | null",
            "required": false,
            "default": "null",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-date-picker-cell-height",
        "default": "34px",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-cell-radius",
        "default": "var(--sn-select-border-radius, 0.375rem)",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-cell-selected-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-cell-selected-color",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-day-height",
        "default": "28px",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-nav-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-nav-size",
        "default": "26px",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-panel-padding",
        "default": "10px",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-panel-width",
        "default": "16.5rem",
        "source": "component"
      },
      {
        "name": "--sn-date-picker-primary",
        "default": "var(--sn-color-primary)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "date-picker",
        "key": "locale",
        "englishDefault": "undefined"
      },
      {
        "group": "date-picker",
        "key": "placeholder",
        "englishDefault": "Select date"
      },
      {
        "group": "date-picker",
        "key": "label",
        "englishDefault": "Choose date"
      },
      {
        "group": "date-picker",
        "key": "previous",
        "englishDefault": "Previous"
      },
      {
        "group": "date-picker",
        "key": "next",
        "englishDefault": "Next"
      },
      {
        "group": "date-picker",
        "key": "chooseMonth",
        "englishDefault": "Choose month"
      },
      {
        "group": "date-picker",
        "key": "chooseYear",
        "englishDefault": "Choose year"
      },
      {
        "group": "date-picker",
        "key": "firstDayOfWeek",
        "englishDefault": "0"
      }
    ]
  },
  "color-picker": {
    "slug": "color-picker",
    "importPath": "ashen-ui/color-picker",
    "surfaces": [
      {
        "symbol": "ColorArea",
        "kind": "component",
        "selector": "sn-color-area",
        "inputs": [
          {
            "category": "inputs",
            "name": "height",
            "bindingName": "height",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "ColorEyeDropper",
        "kind": "component",
        "selector": "sn-color-eye-dropper",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "ColorInput",
        "kind": "component",
        "selector": "sn-color-input",
        "inputs": [
          {
            "category": "inputs",
            "name": "format",
            "bindingName": "format",
            "type": "ColorInputFormat",
            "required": false,
            "default": "'hex'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "ColorPicker",
        "kind": "component",
        "selector": "sn-color-picker",
        "inputs": [
          {
            "category": "inputs",
            "name": "popover",
            "bindingName": "popover",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showAlpha",
            "bindingName": "showAlpha",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showEyeDropper",
            "bindingName": "showEyeDropper",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showPreview",
            "bindingName": "showPreview",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showInput",
            "bindingName": "showInput",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": "Popover mode only: show the hex field next to the swatch. Set false for a swatch-only trigger."
          },
          {
            "category": "inputs",
            "name": "disabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": []
      },
      {
        "symbol": "ColorSlider",
        "kind": "component",
        "selector": "sn-color-slider",
        "inputs": [
          {
            "category": "inputs",
            "name": "channel",
            "bindingName": "channel",
            "type": "ColorSliderChannel",
            "required": false,
            "default": "'hue'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "orientation",
            "bindingName": "orientation",
            "type": "ColorSliderOrientation",
            "required": false,
            "default": "'horizontal'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "length",
            "bindingName": "length",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "ColorInputFormat": {
        "name": "ColorInputFormat",
        "values": [
          {
            "value": "hex",
            "description": ""
          },
          {
            "value": "rgb",
            "description": ""
          }
        ]
      },
      "ColorSliderChannel": {
        "name": "ColorSliderChannel",
        "values": [
          {
            "value": "hue",
            "description": ""
          },
          {
            "value": "alpha",
            "description": ""
          },
          {
            "value": "brightness",
            "description": ""
          },
          {
            "value": "saturation",
            "description": ""
          }
        ]
      },
      "ColorSliderOrientation": {
        "name": "ColorSliderOrientation",
        "values": [
          {
            "value": "horizontal",
            "description": ""
          },
          {
            "value": "vertical",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-color-picker-panel-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-color-picker-panel-exit-duration",
        "default": "0.12s",
        "source": "component"
      },
      {
        "name": "--sn-color-picker-panel-width",
        "default": "14rem",
        "source": "component"
      },
      {
        "name": "--sn-color-picker-preview-height",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-color-picker-slider-height",
        "default": "1.5rem",
        "source": "global"
      },
      {
        "name": "--sn-color-picker-sv-area-height",
        "default": "10rem",
        "source": "global"
      },
      {
        "name": "--sn-color-picker-swatch-height",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-color-picker-swatch-width",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-color-picker-width",
        "default": "14rem",
        "source": "global"
      }
    ],
    "intl": [
      {
        "group": "color-picker",
        "key": "open",
        "englishDefault": "Open color picker"
      },
      {
        "group": "color-picker",
        "key": "area",
        "englishDefault": "Saturation and brightness"
      },
      {
        "group": "color-picker",
        "key": "sliderHue",
        "englishDefault": "Hue"
      },
      {
        "group": "color-picker",
        "key": "sliderAlpha",
        "englishDefault": "Alpha"
      },
      {
        "group": "color-picker",
        "key": "sliderBrightness",
        "englishDefault": "Brightness"
      },
      {
        "group": "color-picker",
        "key": "sliderSaturation",
        "englishDefault": "Saturation"
      },
      {
        "group": "color-picker",
        "key": "eyeDropper",
        "englishDefault": "Pick color from screen"
      },
      {
        "group": "color-picker",
        "key": "inputHex",
        "englishDefault": "Hex color"
      },
      {
        "group": "color-picker",
        "key": "inputRed",
        "englishDefault": "Red"
      },
      {
        "group": "color-picker",
        "key": "inputGreen",
        "englishDefault": "Green"
      },
      {
        "group": "color-picker",
        "key": "inputBlue",
        "englishDefault": "Blue"
      }
    ]
  },
  "card": {
    "slug": "card",
    "importPath": "ashen-ui/card",
    "surfaces": [
      {
        "symbol": "CardContent",
        "kind": "component",
        "selector": "sn-card-content",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CardFooter",
        "kind": "component",
        "selector": "sn-card-footer",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CardHeader",
        "kind": "component",
        "selector": "sn-card-header",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CardSubtitle",
        "kind": "component",
        "selector": "sn-card-subtitle",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CardTitle",
        "kind": "component",
        "selector": "sn-card-title",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Card",
        "kind": "component",
        "selector": "sn-card",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-card-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-card-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-card-border-color",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-card-border-radius",
        "default": "var(--sn-radius-tile)",
        "source": "component"
      },
      {
        "name": "--sn-card-border-width",
        "default": "1px",
        "source": "component"
      },
      {
        "name": "--sn-card-content-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-card-content-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-card-content-padding",
        "default": "var(--sn-space-3) var(--sn-space-4)",
        "source": "component"
      },
      {
        "name": "--sn-card-footer-border-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-card-footer-gap",
        "default": "var(--sn-space-2)",
        "source": "component"
      },
      {
        "name": "--sn-card-footer-padding",
        "default": "10px var(--sn-space-4)",
        "source": "component"
      },
      {
        "name": "--sn-card-header-padding",
        "default": "0",
        "source": "component"
      },
      {
        "name": "--sn-card-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-sm))",
        "source": "component"
      },
      {
        "name": "--sn-card-subtitle-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-card-subtitle-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-card-subtitle-margin-top",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-card-subtitle-padding",
        "default": "0 var(--sn-space-4)",
        "source": "component"
      },
      {
        "name": "--sn-card-title-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-card-title-font-family",
        "default": "var(--sn-font-display)",
        "source": "component"
      },
      {
        "name": "--sn-card-title-font-size",
        "default": "var(--sn-text-md)",
        "source": "component"
      },
      {
        "name": "--sn-card-title-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-card-title-padding",
        "default": "var(--sn-space-3) var(--sn-space-4) 0",
        "source": "component"
      }
    ],
    "intl": []
  },
  "panel": {
    "slug": "panel",
    "importPath": "ashen-ui/panel",
    "surfaces": [
      {
        "symbol": "Panel",
        "kind": "component",
        "selector": "sn-panel",
        "inputs": [
          {
            "category": "inputs",
            "name": "header",
            "bindingName": "header",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "toggleable",
            "bindingName": "toggleable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "expandLabel",
            "bindingName": "expandLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "collapseLabel",
            "bindingName": "collapseLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "collapsed",
            "bindingName": "collapsed",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-panel-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-panel-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-panel-border-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-panel-border-radius",
        "default": "var(--sn-radius-tile)",
        "source": "component"
      },
      {
        "name": "--sn-panel-border-width",
        "default": "1px",
        "source": "component"
      },
      {
        "name": "--sn-panel-content-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-panel-content-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-panel-content-padding",
        "default": "12px 14px",
        "source": "component"
      },
      {
        "name": "--sn-panel-content-transition-duration",
        "default": "var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-panel-header-border-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-panel-header-gap",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-panel-header-padding",
        "default": "10px 14px",
        "source": "component"
      },
      {
        "name": "--sn-panel-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-panel-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-panel-title-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-panel-title-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-panel-title-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-panel-toggle-border-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-panel-toggle-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-panel-toggle-icon-transition",
        "default": "transform var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-panel-toggle-size",
        "default": "24px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "panel",
        "key": "expand",
        "englishDefault": "Expand"
      },
      {
        "group": "panel",
        "key": "collapse",
        "englishDefault": "Collapse"
      }
    ]
  },
  "expansion-panel": {
    "slug": "expansion-panel",
    "importPath": "ashen-ui/expansion-panel",
    "surfaces": [
      {
        "symbol": "Accordion",
        "kind": "component",
        "selector": "sn-accordion",
        "inputs": [
          {
            "category": "inputs",
            "name": "multiple",
            "bindingName": "multiple",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "ExpansionPanel",
        "kind": "component",
        "selector": "sn-expansion-panel",
        "inputs": [
          {
            "category": "inputs",
            "name": "header",
            "bindingName": "header",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabledInput",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "expanded",
            "bindingName": "expanded",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-accordion-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-accordion-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-accordion-border-color",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-accordion-border-radius",
        "default": "var(--sn-radius-tile)",
        "source": "component"
      },
      {
        "name": "--sn-accordion-border-width",
        "default": "1px",
        "source": "component"
      },
      {
        "name": "--sn-accordion-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-sm))",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-expanded-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-font-weight",
        "default": "var(--sn-font-weight-medium)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-gap",
        "default": "10px",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-padding",
        "default": "10px 14px",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-button-transition",
        "default": "background-color var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-content-border-color",
        "default": "var(--sn-border-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-content-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-content-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-content-padding",
        "default": "12px 14px",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-content-transition-duration",
        "default": "var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-separator-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-toggle-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-expansion-panel-toggle-transition",
        "default": "transform var(--sn-motion-slow)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "tabs": {
    "slug": "tabs",
    "importPath": "ashen-ui/tabs",
    "surfaces": [
      {
        "symbol": "Tab",
        "kind": "component",
        "selector": "sn-tab",
        "inputs": [
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": false,
            "default": "undefined",
            "description": "A stable identity for this tab, so `sn-tabs` can be driven by\n`[(value)]` instead of by position. Leave it off and the tab is\nreachable by index only."
          },
          {
            "category": "inputs",
            "name": "disabledInput",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Tabs",
        "kind": "component",
        "selector": "sn-tabs",
        "inputs": [
          {
            "category": "inputs",
            "name": "scrollable",
            "bindingName": "scrollable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Let the tab list scroll when it outgrows its container, instead of the\nbuttons squeezing. Adds a scroll control at each end."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "selectedIndex",
            "bindingName": "selectedIndex",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "unknown",
            "required": false,
            "default": "undefined",
            "description": "The selected tab's `value`, for apps that identify a tab by something\nstable rather than by its position. Interchangeable with `selectedIndex`:\nwriting either moves the selection and the other follows.\n\nA value no tab declares is kept but ignored, so a value that arrives\nbefore its tab still takes effect once the tab appears. A tab with no\n`value` of its own leaves this untouched when it is selected."
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-tab-button-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-disabled-color",
        "default": "var(--sn-text-disabled)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-font-weight",
        "default": "var(--sn-font-weight-medium)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-padding",
        "default": "8px 14px",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-selected-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-selected-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-tab-button-transition",
        "default": "color var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-border-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-icon-size",
        "default": "17px",
        "source": "component"
      },
      {
        "name": "--sn-tabs-indicator-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-indicator-height",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-tabs-indicator-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-indicator-transition-duration",
        "default": "var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-panel-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-panel-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tabs-panel-padding",
        "default": "14px 2px",
        "source": "component"
      },
      {
        "name": "--sn-tabs-scroll-icon-size",
        "default": "18px",
        "source": "component"
      }
    ],
    "intl": []
  },
  "splitter": {
    "slug": "splitter",
    "importPath": "ashen-ui/splitter",
    "surfaces": [
      {
        "symbol": "SplitterPanel",
        "kind": "component",
        "selector": "sn-splitter-panel",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Splitter",
        "kind": "component",
        "selector": "sn-splitter",
        "inputs": [
          {
            "category": "inputs",
            "name": "layout",
            "bindingName": "layout",
            "type": "'horizontal' | 'vertical'",
            "required": false,
            "default": "'horizontal'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "minSize",
            "bindingName": "minSize",
            "type": "number",
            "required": false,
            "default": "15",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "step",
            "bindingName": "step",
            "type": "number",
            "required": false,
            "default": "10",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "resizeLabel",
            "bindingName": "resizeLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "size",
            "bindingName": "size",
            "type": "number",
            "required": false,
            "default": "50",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-splitter-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-splitter-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-splitter-gutter-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-splitter-gutter-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-splitter-gutter-size",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-splitter-handle-bg",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-splitter-handle-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-splitter-handle-short",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-splitter-handle-thin",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-splitter-radius",
        "default": "var(--sn-radius-tile)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "splitter",
        "key": "resize",
        "englishDefault": "Resize panels"
      }
    ]
  },
  "tooltip": {
    "slug": "tooltip",
    "importPath": "ashen-ui/tooltip",
    "surfaces": [
      {
        "symbol": "TooltipContainer",
        "kind": "component",
        "selector": "sn-tooltip-container",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Tooltip",
        "kind": "directive",
        "selector": "[snTooltip]",
        "inputs": [
          {
            "category": "inputs",
            "name": "snTooltip",
            "bindingName": "snTooltip",
            "type": "TooltipContent",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snTooltipPosition",
            "bindingName": "snTooltipPosition",
            "type": "TooltipPosition",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snTooltipShowDelay",
            "bindingName": "snTooltipShowDelay",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snTooltipHideDelay",
            "bindingName": "snTooltipHideDelay",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snTooltipDisabled",
            "bindingName": "snTooltipDisabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "TooltipPosition": {
        "name": "TooltipPosition",
        "values": [
          {
            "value": "top",
            "description": ""
          },
          {
            "value": "bottom",
            "description": ""
          },
          {
            "value": "left",
            "description": ""
          },
          {
            "value": "right",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-tooltip-bg",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-border-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-color",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-enter-duration",
        "default": "0.15s",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-exit-duration",
        "default": "0.15s",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-font-size",
        "default": "var(--sn-text-2xs)",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-font-weight",
        "default": "var(--sn-font-weight-medium)",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-gap",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-max-width",
        "default": "20rem",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-padding",
        "default": "4px 8px",
        "source": "component"
      },
      {
        "name": "--sn-tooltip-shadow",
        "default": "var(--sn-shadow-sm)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "popover": {
    "slug": "popover",
    "importPath": "ashen-ui/popover",
    "surfaces": [
      {
        "symbol": "PopoverClose",
        "kind": "directive",
        "selector": "[snPopoverClose]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "PopoverContent",
        "kind": "directive",
        "selector": "ng-template[snPopoverContent]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "PopoverPanel",
        "kind": "component",
        "selector": "sn-popover-panel",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "PopoverTrigger",
        "kind": "directive",
        "selector": "[snPopoverTrigger]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Popover",
        "kind": "component",
        "selector": "sn-popover",
        "inputs": [
          {
            "category": "inputs",
            "name": "position",
            "bindingName": "position",
            "type": "PopoverPosition",
            "required": false,
            "default": "'bottom'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "offsetX",
            "bindingName": "offsetX",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "offsetY",
            "bindingName": "offsetY",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "open",
            "bindingName": "open",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "PopoverPosition": {
        "name": "PopoverPosition",
        "values": [
          {
            "value": "bottom",
            "description": ""
          },
          {
            "value": "top",
            "description": ""
          },
          {
            "value": "left",
            "description": ""
          },
          {
            "value": "right",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-popover-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-popover-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-popover-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-popover-border-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-popover-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-popover-enter-duration",
        "default": "0.15s",
        "source": "component"
      },
      {
        "name": "--sn-popover-exit-duration",
        "default": "0.12s",
        "source": "component"
      },
      {
        "name": "--sn-popover-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-popover-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-popover-min-width",
        "default": "12rem",
        "source": "component"
      },
      {
        "name": "--sn-popover-padding",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-popover-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-overlay))",
        "source": "component"
      }
    ],
    "intl": []
  },
  "dialog": {
    "slug": "dialog",
    "importPath": "ashen-ui/dialog",
    "surfaces": [
      {
        "symbol": "DialogClose",
        "kind": "directive",
        "selector": "[snDialogClose]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "SnDialogConfirm",
        "kind": "component",
        "selector": "sn-dialog-confirm",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "SnDialogContainer",
        "kind": "component",
        "selector": "sn-dialog-container",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "DialogFooter",
        "kind": "directive",
        "selector": "[snDialogFooter]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "DialogTitle",
        "kind": "directive",
        "selector": "[snDialogTitle]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Dialog",
        "kind": "component",
        "selector": "sn-dialog",
        "inputs": [
          {
            "category": "inputs",
            "name": "title",
            "bindingName": "title",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "DialogSize",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "closeLabel",
            "bindingName": "closeLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "open",
            "bindingName": "open",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "DialogSize": {
        "name": "DialogSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-dialog-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-dialog-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-dialog-body-color",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-dialog-body-font-size",
        "default": "0.875rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-body-padding",
        "default": "0 1.5rem 1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-dialog-border-radius",
        "default": "0.5rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-close-radius",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-dialog-close-size",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-dialog-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-dialog-container-padding",
        "default": "1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-enter-duration",
        "default": "0.15s",
        "source": "component"
      },
      {
        "name": "--sn-dialog-exit-duration",
        "default": "0.15s",
        "source": "component"
      },
      {
        "name": "--sn-dialog-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-dialog-footer-border",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-dialog-footer-gap",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-footer-padding",
        "default": "1rem 1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-footer-slot-padding-top",
        "default": "1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-fullscreen-border-radius",
        "default": "0",
        "source": "component"
      },
      {
        "name": "--sn-dialog-header-border",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-dialog-header-padding",
        "default": "0.5rem 1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-max-width-large",
        "default": "48rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-max-width-medium",
        "default": "32rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-max-width-small",
        "default": "24rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-modal))",
        "source": "component"
      },
      {
        "name": "--sn-dialog-title-font-size",
        "default": "1.25rem",
        "source": "component"
      },
      {
        "name": "--sn-dialog-title-font-weight",
        "default": "600",
        "source": "component"
      },
      {
        "name": "--sn-dialog-untitled-body-margin-top",
        "default": null,
        "source": null
      }
    ],
    "intl": [
      {
        "group": "confirm",
        "key": "header",
        "englishDefault": "Confirm"
      },
      {
        "group": "confirm",
        "key": "accept",
        "englishDefault": "Yes"
      },
      {
        "group": "confirm",
        "key": "reject",
        "englishDefault": "Cancel"
      },
      {
        "group": "dialog",
        "key": "close",
        "englishDefault": "Close"
      }
    ]
  },
  "drawer": {
    "slug": "drawer",
    "importPath": "ashen-ui/drawer",
    "surfaces": [
      {
        "symbol": "DrawerClose",
        "kind": "directive",
        "selector": "[snDrawerClose]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "DrawerFooter",
        "kind": "directive",
        "selector": "[snDrawerFooter]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "DrawerTitle",
        "kind": "directive",
        "selector": "[snDrawerTitle]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Drawer",
        "kind": "component",
        "selector": "sn-drawer",
        "inputs": [
          {
            "category": "inputs",
            "name": "title",
            "bindingName": "title",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "position",
            "bindingName": "position",
            "type": "DrawerPosition",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "width",
            "bindingName": "width",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "height",
            "bindingName": "height",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "mask",
            "bindingName": "mask",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "lockScroll",
            "bindingName": "lockScroll",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "closeLabel",
            "bindingName": "closeLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "open",
            "bindingName": "open",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {
      "DrawerPosition": {
        "name": "DrawerPosition",
        "values": [
          {
            "value": "start",
            "description": "Logical: the inline start edge, so it follows the reading direction and flips under RTL."
          },
          {
            "value": "end",
            "description": "Logical: the inline end edge, so it follows the reading direction and flips under RTL."
          },
          {
            "value": "left",
            "description": "Physical: always the left edge, whatever the direction."
          },
          {
            "value": "right",
            "description": "Physical: always the right edge, whatever the direction."
          },
          {
            "value": "top",
            "description": ""
          },
          {
            "value": "bottom",
            "description": ""
          },
          {
            "value": "fullscreen",
            "description": "Covers the whole viewport."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-drawer-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-drawer-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-drawer-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-drawer-close-radius",
        "default": "var(--sn-radius-sm, 0.25rem)",
        "source": "component"
      },
      {
        "name": "--sn-drawer-close-size",
        "default": "2rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-drawer-content-padding",
        "default": "1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-enter-duration",
        "default": "0.2s",
        "source": "component"
      },
      {
        "name": "--sn-drawer-exit-duration",
        "default": "0.2s",
        "source": "component"
      },
      {
        "name": "--sn-drawer-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-drawer-footer-padding",
        "default": "1.25rem 1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-header-border",
        "default": "1px solid var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-drawer-header-padding",
        "default": "1.25rem 1.5rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-height",
        "default": "40vh",
        "source": "component"
      },
      {
        "name": "--sn-drawer-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-modal))",
        "source": "component"
      },
      {
        "name": "--sn-drawer-title-font-size",
        "default": "1.125rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-title-font-weight",
        "default": "600",
        "source": "component"
      },
      {
        "name": "--sn-drawer-viewport-gutter",
        "default": "3rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-width",
        "default": "20rem",
        "source": "component"
      },
      {
        "name": "--sn-drawer-z-index",
        "default": "1000",
        "source": "global"
      }
    ],
    "intl": [
      {
        "group": "drawer",
        "key": "close",
        "englishDefault": "Close"
      }
    ]
  },
  "confirm-dialog": {
    "slug": "confirm-dialog",
    "importPath": "ashen-ui/confirm-dialog",
    "surfaces": [
      {
        "symbol": "ConfirmDialog",
        "kind": "component",
        "selector": "sn-confirm-dialog",
        "inputs": [
          {
            "category": "inputs",
            "name": "header",
            "bindingName": "header",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "message",
            "bindingName": "message",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "severity",
            "bindingName": "severity",
            "type": "ConfirmDialogSeverity",
            "required": false,
            "default": "'primary'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "acceptLabel",
            "bindingName": "acceptLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rejectLabel",
            "bindingName": "rejectLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "open",
            "bindingName": "open",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": [
          {
            "category": "outputs",
            "name": "accept",
            "bindingName": "accept",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "reject",
            "bindingName": "reject",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "ConfirmDialogSeverity": {
        "name": "ConfirmDialogSeverity",
        "values": [
          {
            "value": "primary",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-confirm-dialog-actions-gap",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-confirm-dialog-actions-margin-top",
        "default": "1.25rem",
        "source": "component"
      },
      {
        "name": "--sn-confirm-dialog-body-gap",
        "default": "var(--sn-space-3, 0.75rem)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-dialog-icon-font-size",
        "default": "1.375rem",
        "source": "component"
      },
      {
        "name": "--sn-confirm-dialog-icon-size",
        "default": "var(--sn-confirm-dialog-icon-font-size, 1.375rem)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "confirm",
        "key": "header",
        "englishDefault": "Confirm"
      },
      {
        "group": "confirm",
        "key": "accept",
        "englishDefault": "Yes"
      },
      {
        "group": "confirm",
        "key": "reject",
        "englishDefault": "Cancel"
      }
    ]
  },
  "confirm-popup": {
    "slug": "confirm-popup",
    "importPath": "ashen-ui/confirm-popup",
    "surfaces": [
      {
        "symbol": "ConfirmPopupPanel",
        "kind": "component",
        "selector": "sn-confirm-popup-panel",
        "inputs": [],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "acceptClicked",
            "bindingName": "acceptClicked",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "rejectClicked",
            "bindingName": "rejectClicked",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      },
      {
        "symbol": "ConfirmPopupTrigger",
        "kind": "directive",
        "selector": "[snConfirmPopupTrigger]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "ConfirmPopup",
        "kind": "component",
        "selector": "sn-confirm-popup",
        "inputs": [
          {
            "category": "inputs",
            "name": "message",
            "bindingName": "message",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "severity",
            "bindingName": "severity",
            "type": "ConfirmPopupSeverity",
            "required": false,
            "default": "'primary'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "acceptLabel",
            "bindingName": "acceptLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rejectLabel",
            "bindingName": "rejectLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "position",
            "bindingName": "position",
            "type": "ConfirmPopupPosition",
            "required": false,
            "default": "'bottom'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "offsetX",
            "bindingName": "offsetX",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "offsetY",
            "bindingName": "offsetY",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "open",
            "bindingName": "open",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "outputs": [
          {
            "category": "outputs",
            "name": "accept",
            "bindingName": "accept",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "reject",
            "bindingName": "reject",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "ConfirmPopupSeverity": {
        "name": "ConfirmPopupSeverity",
        "values": [
          {
            "value": "primary",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          }
        ]
      },
      "ConfirmPopupPosition": {
        "name": "ConfirmPopupPosition",
        "values": [
          {
            "value": "bottom",
            "description": ""
          },
          {
            "value": "top",
            "description": ""
          },
          {
            "value": "left",
            "description": ""
          },
          {
            "value": "right",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-confirm-popup-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-body-gap",
        "default": "var(--sn-space-2, 0.5rem)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-border-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-enter-duration",
        "default": "0.15s",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-exit-duration",
        "default": "0.12s",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-footer-gap",
        "default": "var(--sn-space-2, 0.5rem)",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-icon-size",
        "default": "1.125rem",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-padding",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-overlay))",
        "source": "component"
      },
      {
        "name": "--sn-confirm-popup-width",
        "default": "16rem",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "confirm",
        "key": "header",
        "englishDefault": "Confirm"
      },
      {
        "group": "confirm",
        "key": "accept",
        "englishDefault": "Yes"
      },
      {
        "group": "confirm",
        "key": "reject",
        "englishDefault": "Cancel"
      }
    ]
  },
  "carousel": {
    "slug": "carousel",
    "importPath": "ashen-ui/carousel",
    "surfaces": [
      {
        "symbol": "CarouselItem",
        "kind": "component",
        "selector": "sn-carousel-item",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CarouselNoSwipe",
        "kind": "directive",
        "selector": "[snCarouselNoSwipe]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CarouselPrev",
        "kind": "directive",
        "selector": "[snCarouselPrev]",
        "inputs": [
          {
            "category": "inputs",
            "name": "target",
            "bindingName": "snCarouselPrev",
            "type": "SnCarouselTarget | '' | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CarouselNext",
        "kind": "directive",
        "selector": "[snCarouselNext]",
        "inputs": [
          {
            "category": "inputs",
            "name": "target",
            "bindingName": "snCarouselNext",
            "type": "SnCarouselTarget | '' | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "CarouselPagination",
        "kind": "component",
        "selector": "sn-carousel-pagination",
        "inputs": [
          {
            "category": "inputs",
            "name": "carousel",
            "bindingName": "carousel",
            "type": "SnCarouselTarget | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Carousel",
        "kind": "component",
        "selector": "sn-carousel",
        "inputs": [
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "options",
            "bindingName": "options",
            "type": "SnCarouselOptions | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "activeIndex",
            "bindingName": "activeIndex",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-carousel-btn-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-carousel-btn-bg-hover",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-carousel-btn-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-carousel-btn-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-carousel-btn-size",
        "default": "32px",
        "source": "component"
      },
      {
        "name": "--sn-carousel-dot-active-bg",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-carousel-dot-active-width",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-carousel-dot-bg",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-carousel-dot-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-carousel-dot-size",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-carousel-gap",
        "default": "0px",
        "source": "component"
      },
      {
        "name": "--sn-carousel-slide-basis",
        "default": "100%",
        "source": "component"
      },
      {
        "name": "--sn-carousel-transition",
        "default": "transform var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-carousel-vertical-height",
        "default": "260px",
        "source": "component"
      },
      {
        "name": "--sn-carousel-viewport-radius",
        "default": "var(--sn-radius-tile)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "carousel",
        "key": "label",
        "englishDefault": "Carousel"
      },
      {
        "group": "carousel",
        "key": "previous",
        "englishDefault": "Previous slide"
      },
      {
        "group": "carousel",
        "key": "next",
        "englishDefault": "Next slide"
      }
    ]
  },
  "timeline": {
    "slug": "timeline",
    "importPath": "ashen-ui/timeline",
    "surfaces": [
      {
        "symbol": "TimelineItem",
        "kind": "component",
        "selector": "sn-timeline-item",
        "inputs": [
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "color",
            "bindingName": "color",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Timeline",
        "kind": "component",
        "selector": "sn-timeline",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-timeline-axis-width",
        "default": "26px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-connector-margin",
        "default": "4px 0",
        "source": "component"
      },
      {
        "name": "--sn-timeline-connector-min-height",
        "default": "14px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-connector-width",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-content-pb",
        "default": "var(--sn-space-4)",
        "source": "component"
      },
      {
        "name": "--sn-timeline-dot-border",
        "default": "3px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-dot-size",
        "default": "12px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-gap",
        "default": "var(--sn-space-3)",
        "source": "component"
      },
      {
        "name": "--sn-timeline-icon-inner",
        "default": "14px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-icon-size",
        "default": "26px",
        "source": "component"
      },
      {
        "name": "--sn-timeline-item-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "divider": {
    "slug": "divider",
    "importPath": "ashen-ui/divider",
    "surfaces": [
      {
        "symbol": "Divider",
        "kind": "component",
        "selector": "sn-divider",
        "inputs": [
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "vertical",
            "bindingName": "vertical",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-divider-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-divider-gap",
        "default": "0.625rem",
        "source": "component"
      },
      {
        "name": "--sn-divider-label-size",
        "default": "var(--sn-text-2xs, 0.625rem)",
        "source": "component"
      },
      {
        "name": "--sn-divider-margin",
        "default": "0.75rem",
        "source": "component"
      },
      {
        "name": "--sn-divider-vertical-margin",
        "default": "0.75rem",
        "source": "component"
      }
    ],
    "intl": []
  },
  "badge": {
    "slug": "badge",
    "importPath": "ashen-ui/badge",
    "surfaces": [
      {
        "symbol": "Badge",
        "kind": "component",
        "selector": "sn-badge",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "string | number",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "color",
            "bindingName": "color",
            "type": "BadgeColor",
            "required": false,
            "default": "'primary'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "dot",
            "bindingName": "dot",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "overlay",
            "bindingName": "overlay",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "BadgeColor": {
        "name": "BadgeColor",
        "values": [
          {
            "value": "primary",
            "description": ""
          },
          {
            "value": "secondary",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "info",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-badge-bg",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-badge-dot-size",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-badge-height",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-badge-min-width",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-badge-padding",
        "default": "0 5px",
        "source": "component"
      },
      {
        "name": "--sn-badge-ring",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-badge-text",
        "default": "var(--sn-text-on-primary)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "tag": {
    "slug": "tag",
    "importPath": "ashen-ui/tag",
    "surfaces": [
      {
        "symbol": "Tag",
        "kind": "component",
        "selector": "sn-tag",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "severity",
            "bindingName": "severity",
            "type": "TagSeverity",
            "required": false,
            "default": "'primary'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "TagSeverity": {
        "name": "TagSeverity",
        "values": [
          {
            "value": "primary",
            "description": ""
          },
          {
            "value": "secondary",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "info",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-tag-bg",
        "default": "color-mix(in srgb, var(--sn-tag-color) 14%, transparent)",
        "source": "component"
      },
      {
        "name": "--sn-tag-border-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tag-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-tag-gap",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-tag-icon-size",
        "default": "13px",
        "source": "component"
      },
      {
        "name": "--sn-tag-padding",
        "default": "2px 8px",
        "source": "component"
      }
    ],
    "intl": []
  },
  "chip": {
    "slug": "chip",
    "importPath": "ashen-ui/chip",
    "surfaces": [
      {
        "symbol": "Chip",
        "kind": "component",
        "selector": "sn-chip",
        "inputs": [
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "removable",
            "bindingName": "removable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "selected",
            "bindingName": "selected",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "removeAriaLabel",
            "bindingName": "removeAriaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "removed",
            "bindingName": "removed",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-chip-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-chip-border",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-chip-border-width",
        "default": "1px",
        "source": "component"
      },
      {
        "name": "--sn-chip-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-chip-font-weight",
        "default": "var(--sn-font-weight-medium)",
        "source": "component"
      },
      {
        "name": "--sn-chip-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-chip-icon-size",
        "default": "14px",
        "source": "component"
      },
      {
        "name": "--sn-chip-label-line-height",
        "default": "1",
        "source": "component"
      },
      {
        "name": "--sn-chip-label-offset",
        "default": "-1px",
        "source": "component"
      },
      {
        "name": "--sn-chip-padding",
        "default": "4px 10px",
        "source": "component"
      },
      {
        "name": "--sn-chip-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-chip-remove-icon-size",
        "default": "12px",
        "source": "component"
      },
      {
        "name": "--sn-chip-remove-opacity",
        "default": "0.7",
        "source": "component"
      },
      {
        "name": "--sn-chip-remove-size",
        "default": "14px",
        "source": "component"
      },
      {
        "name": "--sn-chip-selected-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-chip-selected-border",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-chip-selected-text",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-chip-text",
        "default": "var(--sn-selected-text)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "avatar": {
    "slug": "avatar",
    "importPath": "ashen-ui/avatar",
    "surfaces": [
      {
        "symbol": "AvatarGroup",
        "kind": "component",
        "selector": "sn-avatar-group",
        "inputs": [
          {
            "category": "inputs",
            "name": "max",
            "bindingName": "max",
            "type": "number",
            "required": false,
            "default": "0",
            "description": "Avatars to show before the counter takes over. `0` shows them all."
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "AvatarSize",
            "required": false,
            "default": "'md'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "shape",
            "bindingName": "shape",
            "type": "AvatarShape",
            "required": false,
            "default": "'circle'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "moreAriaLabel",
            "bindingName": "moreAriaLabel",
            "type": "string",
            "required": false,
            "default": null,
            "description": "Overrides the counter's `aria-label`."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Avatar",
        "kind": "component",
        "selector": "sn-avatar",
        "inputs": [
          {
            "category": "inputs",
            "name": "image",
            "bindingName": "image",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": "Full name. Initials are derived from it, and it labels the avatar."
          },
          {
            "category": "inputs",
            "name": "initials",
            "bindingName": "initials",
            "type": "string",
            "required": false,
            "default": "''",
            "description": "Initials to render instead of deriving them from `label`."
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": "Glyph for the last step of the fallback chain. Defaults to the registry's `user`."
          },
          {
            "category": "inputs",
            "name": "alt",
            "bindingName": "alt",
            "type": "string",
            "required": false,
            "default": null,
            "description": "Overrides `label` for assistive technology, including the image's `alt`."
          },
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "AvatarSize",
            "required": false,
            "default": null,
            "description": "Falls back to the enclosing group, then to `'md'`."
          },
          {
            "category": "inputs",
            "name": "shape",
            "bindingName": "shape",
            "type": "AvatarShape",
            "required": false,
            "default": null,
            "description": "Falls back to the enclosing group, then to `'circle'`."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "AvatarSize": {
        "name": "AvatarSize",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          },
          {
            "value": "xl",
            "description": ""
          }
        ]
      },
      "AvatarShape": {
        "name": "AvatarShape",
        "values": [
          {
            "value": "circle",
            "description": ""
          },
          {
            "value": "square",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-avatar-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-avatar-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-avatar-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-avatar-ring",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-avatar-ring-width",
        "default": "0px",
        "source": "component"
      },
      {
        "name": "--sn-avatar-size",
        "default": "2.5rem",
        "source": "component"
      },
      {
        "name": "--sn-avatar-text",
        "default": "var(--sn-text-muted)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "skeleton": {
    "slug": "skeleton",
    "importPath": "ashen-ui/skeleton",
    "surfaces": [
      {
        "symbol": "Skeleton",
        "kind": "component",
        "selector": "sn-skeleton",
        "inputs": [
          {
            "category": "inputs",
            "name": "shape",
            "bindingName": "shape",
            "type": "SkeletonShape",
            "required": false,
            "default": "'rect'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SkeletonAnimation",
            "required": false,
            "default": "'shimmer'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "width",
            "bindingName": "width",
            "type": "string | number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "height",
            "bindingName": "height",
            "type": "string | number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "SkeletonShape": {
        "name": "SkeletonShape",
        "values": [
          {
            "value": "text",
            "description": "A text line: full width, line height, pill ends."
          },
          {
            "value": "rect",
            "description": "A rectangle with the surface radius, for cards and images."
          },
          {
            "value": "circle",
            "description": "A circle, for avatars."
          },
          {
            "value": "tile",
            "description": "A square with the surface radius, for thumbnails."
          }
        ]
      },
      "SkeletonAnimation": {
        "name": "SkeletonAnimation",
        "values": [
          {
            "value": "shimmer",
            "description": "A highlight sweeping across the placeholder."
          },
          {
            "value": "pulse",
            "description": "The whole placeholder fading in and out."
          },
          {
            "value": "none",
            "description": "Static, no animation."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-skeleton-animation-duration",
        "default": "1.4s",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-circle-size",
        "default": "2.5rem",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-rect-height",
        "default": "4rem",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-rect-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-rendered-height",
        "default": "auto",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-rendered-radius",
        "default": "0",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-rendered-width",
        "default": "var(--sn-skeleton-width)",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-shimmer-color",
        "default": "rgba(255, 255, 255, 0.45)",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-text-height",
        "default": "0.875rem",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-text-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-tile-radius",
        "default": "var(--sn-radius-tile)",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-tile-size",
        "default": "96px",
        "source": "component"
      },
      {
        "name": "--sn-skeleton-width",
        "default": "100%",
        "source": "component"
      }
    ],
    "intl": []
  },
  "menu": {
    "slug": "menu",
    "importPath": "ashen-ui/menu",
    "surfaces": [
      {
        "symbol": "ContextMenuTrigger",
        "kind": "directive",
        "selector": "[snContextMenuTriggerFor]",
        "inputs": [
          {
            "category": "inputs",
            "name": "menu",
            "bindingName": "snContextMenuTriggerFor",
            "type": "Menu | undefined",
            "required": false,
            "default": "undefined",
            "description": "The menu to open on right-click or the context menu key."
          },
          {
            "category": "inputs",
            "name": "offsetX",
            "bindingName": "offsetX",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "offsetY",
            "bindingName": "offsetY",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "MenuItem",
        "kind": "component",
        "selector": "button[snMenuItem]",
        "inputs": [
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "shortcut",
            "bindingName": "shortcut",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "danger",
            "bindingName": "danger",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "isDisabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "MenuSeparator",
        "kind": "component",
        "selector": "sn-menu-separator",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "MenuTrigger",
        "kind": "directive",
        "selector": "[snMenuTriggerFor]",
        "inputs": [
          {
            "category": "inputs",
            "name": "menu",
            "bindingName": "snMenuTriggerFor",
            "type": "Menu | undefined",
            "required": false,
            "default": "undefined",
            "description": "The menu to open on click or keyboard activation."
          },
          {
            "category": "inputs",
            "name": "offsetX",
            "bindingName": "offsetX",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "offsetY",
            "bindingName": "offsetY",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Menu",
        "kind": "component",
        "selector": "sn-menu",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "SubmenuTrigger",
        "kind": "directive",
        "selector": "[snSubmenuTriggerFor]",
        "inputs": [
          {
            "category": "inputs",
            "name": "menu",
            "bindingName": "snSubmenuTriggerFor",
            "type": "Menu",
            "required": true,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-menu-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-menu-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-menu-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-menu-border-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-menu-exit-duration",
        "default": "0.12s",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-border-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-danger-color",
        "default": "var(--sn-color-error)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-disabled-opacity",
        "default": "var(--sn-disabled-opacity)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-font-weight",
        "default": "500",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-gap",
        "default": "10px",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-icon-size",
        "default": "17px",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-line-height",
        "default": "1",
        "source": "component"
      },
      {
        "name": "--sn-menu-item-padding",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-menu-min-width",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-menu-padding",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-menu-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-overlay))",
        "source": "component"
      },
      {
        "name": "--sn-menu-submenu-icon-size",
        "default": "16px",
        "source": "component"
      }
    ],
    "intl": []
  },
  "context-menu": {
    "slug": "context-menu",
    "importPath": "ashen-ui/context-menu",
    "surfaces": [],
    "types": {},
    "tokens": [],
    "intl": []
  },
  "breadcrumb": {
    "slug": "breadcrumb",
    "importPath": "ashen-ui/breadcrumb",
    "surfaces": [
      {
        "symbol": "BreadcrumbItem",
        "kind": "component",
        "selector": "sn-breadcrumb-item",
        "inputs": [
          {
            "category": "inputs",
            "name": "href",
            "bindingName": "href",
            "type": "string | null",
            "required": false,
            "default": "null",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "routerLink",
            "bindingName": "routerLink",
            "type": "string | readonly unknown[] | UrlTree | null",
            "required": false,
            "default": "null",
            "description": "Router navigation target. Wins over `href` and needs `provideRouter`."
          },
          {
            "category": "inputs",
            "name": "queryParams",
            "bindingName": "queryParams",
            "type": "Params | null",
            "required": false,
            "default": "null",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "fragment",
            "bindingName": "fragment",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Breadcrumb",
        "kind": "component",
        "selector": "sn-breadcrumb",
        "inputs": [
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-breadcrumb-current-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-current-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-gap",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-icon-gap",
        "default": "5px",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-icon-size",
        "default": "15px",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-link-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-link-padding",
        "default": "3px 6px",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-link-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-link-transition",
        "default": "color var(--sn-motion-base), background-color var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-separator-color",
        "default": "var(--sn-text-disabled)",
        "source": "component"
      },
      {
        "name": "--sn-breadcrumb-separator-size",
        "default": "14px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "breadcrumb",
        "key": "label",
        "englishDefault": "Breadcrumb"
      }
    ]
  },
  "tab-nav": {
    "slug": "tab-nav",
    "importPath": "ashen-ui/tab-nav",
    "surfaces": [
      {
        "symbol": "TabLink",
        "kind": "directive",
        "selector": "[snTabLink]",
        "inputs": [
          {
            "category": "inputs",
            "name": "active",
            "bindingName": "active",
            "type": "boolean | undefined",
            "required": false,
            "default": "undefined",
            "description": "Force the active state. Leave unbound to follow `routerLinkActive`."
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "TabNav",
        "kind": "component",
        "selector": "nav[snTabNav]",
        "inputs": [
          {
            "category": "inputs",
            "name": "orientation",
            "bindingName": "orientation",
            "type": "TabNavOrientation",
            "required": false,
            "default": "'horizontal'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "scrollable",
            "bindingName": "scrollable",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": "Let a horizontal bar scroll instead of squeezing its links."
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "TabNavOrientation": {
        "name": "TabNavOrientation",
        "values": [
          {
            "value": "horizontal",
            "description": ""
          },
          {
            "value": "vertical",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-tab-link-active-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-active-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-active-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-font-weight",
        "default": "var(--sn-font-weight-medium)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-hover-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tab-link-padding",
        "default": "8px 14px",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-border-color",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-gap",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-indicator-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-indicator-height",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-indicator-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-indicator-transition-duration",
        "default": "var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-scroll-btn-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-scroll-btn-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-vertical-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-vertical-padding",
        "default": "8px 0",
        "source": "component"
      },
      {
        "name": "--sn-tab-nav-vertical-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "paginator": {
    "slug": "paginator",
    "importPath": "ashen-ui/paginator",
    "surfaces": [
      {
        "symbol": "PaginatorReport",
        "kind": "directive",
        "selector": "ng-template[snPaginatorReport]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Paginator",
        "kind": "component",
        "selector": "sn-paginator",
        "inputs": [
          {
            "category": "inputs",
            "name": "page",
            "bindingName": "page",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "totalRecords",
            "bindingName": "totalRecords",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rows",
            "bindingName": "rows",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rowsPerPageOptions",
            "bindingName": "rowsPerPageOptions",
            "type": "number[] | undefined",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "siblings",
            "bindingName": "siblings",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showEdges",
            "bindingName": "showEdges",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "pageLinkSize",
            "bindingName": "pageLinkSize",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "reportPosition",
            "bindingName": "reportPosition",
            "type": "'start' | 'end'",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "justify",
            "bindingName": "justify",
            "type": "PaginatorJustify",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showRowsLabel",
            "bindingName": "showRowsLabel",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showReport",
            "bindingName": "showReport",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "firstLabel",
            "bindingName": "firstLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "prevLabel",
            "bindingName": "prevLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "nextLabel",
            "bindingName": "nextLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "lastLabel",
            "bindingName": "lastLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "jumpLabel",
            "bindingName": "jumpLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rowsPerPageLabel",
            "bindingName": "rowsPerPageLabel",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "reportFormatter",
            "bindingName": "reportFormatter",
            "type": "PaginatorReportFormatter",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "pageChange",
            "bindingName": "pageChange",
            "type": "PageChangeEvent",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "PaginatorJustify": {
        "name": "PaginatorJustify",
        "values": [
          {
            "value": "between",
            "description": ""
          },
          {
            "value": "start",
            "description": ""
          },
          {
            "value": "center",
            "description": ""
          },
          {
            "value": "end",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-paginator-current-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-current-color",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-current-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-ellipsis-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-ellipsis-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-ellipsis-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-ellipsis-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-gap",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-page-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-page-height",
        "default": "32px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-page-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-page-min-width",
        "default": "36px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-page-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-panel-max-height",
        "default": "240px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-jump-panel-width",
        "default": "200px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-nav-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-nav-icon-size",
        "default": "var(--sn-icon-size-md)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-height",
        "default": "30px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-min-width",
        "default": "30px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-padding",
        "default": "0 6px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-page-transition",
        "default": "background-color var(--sn-motion-base), color var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-panel-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-panel-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-panel-border",
        "default": "none",
        "source": "component"
      },
      {
        "name": "--sn-paginator-panel-exit-duration",
        "default": "0.12s",
        "source": "component"
      },
      {
        "name": "--sn-paginator-panel-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-panel-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-overlay))",
        "source": "component"
      },
      {
        "name": "--sn-paginator-report-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-report-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-option-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-option-height",
        "default": "var(--sn-list-item-height)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-option-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-option-padding",
        "default": "0 12px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-option-selected-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-option-selected-color",
        "default": "var(--sn-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-panel-min-width",
        "default": "80px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-border",
        "default": "1px solid var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-gap",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-height",
        "default": "30px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-hover-border",
        "default": "1px solid var(--sn-border-focus)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-padding",
        "default": "0 8px",
        "source": "component"
      },
      {
        "name": "--sn-paginator-rows-trigger-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-select-font-size",
        "default": "var(--sn-select-font-size)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-select-padding",
        "default": "var(--sn-select-padding)",
        "source": "component"
      },
      {
        "name": "--sn-paginator-select-radius",
        "default": "var(--sn-select-border-radius)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "paginator",
        "key": "label",
        "englishDefault": "Pagination"
      },
      {
        "group": "paginator",
        "key": "first",
        "englishDefault": "First page"
      },
      {
        "group": "paginator",
        "key": "previous",
        "englishDefault": "Previous page"
      },
      {
        "group": "paginator",
        "key": "next",
        "englishDefault": "Next page"
      },
      {
        "group": "paginator",
        "key": "last",
        "englishDefault": "Last page"
      },
      {
        "group": "paginator",
        "key": "jump",
        "englishDefault": "Jump to page"
      },
      {
        "group": "paginator",
        "key": "rowsPerPage",
        "englishDefault": "Rows per page"
      }
    ]
  },
  "stepper": {
    "slug": "stepper",
    "importPath": "ashen-ui/stepper",
    "surfaces": [
      {
        "symbol": "Step",
        "kind": "component",
        "selector": "sn-step",
        "inputs": [
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "disabledInput",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "completedInput",
            "bindingName": "completed",
            "type": "boolean | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Stepper",
        "kind": "component",
        "selector": "sn-stepper",
        "inputs": [
          {
            "category": "inputs",
            "name": "linear",
            "bindingName": "linear",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "orientation",
            "bindingName": "orientation",
            "type": "'horizontal' | 'vertical'",
            "required": false,
            "default": "'horizontal'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string",
            "required": false,
            "default": null,
            "description": "`aria-label` of the step list. Defaults to `SnStepperIntl.label`."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "activeStep",
            "bindingName": "activeStep",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-stepper-connector-active-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-connector-color",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-connector-thickness",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-stepper-connector-transition",
        "default": "background-color var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-header-padding",
        "default": "0 10px",
        "source": "component"
      },
      {
        "name": "--sn-stepper-label-active-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-label-active-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-label-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-label-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-label-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-active-bg",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-active-border-color",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-active-color",
        "default": "var(--sn-text-on-primary)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-border-color",
        "default": "var(--sn-border-strong)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-border-width",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-completed-bg",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-completed-border-color",
        "default": "var(--sn-color-primary-solid)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-completed-color",
        "default": "var(--sn-text-on-primary)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-font-weight",
        "default": "var(--sn-font-weight-semibold)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-icon-size",
        "default": "15px",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-size",
        "default": "28px",
        "source": "component"
      },
      {
        "name": "--sn-stepper-marker-transition",
        "default": "background-color var(--sn-motion-slow), border-color var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-panel-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-panel-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-stepper-panel-padding",
        "default": "12px 0 12px 10px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "stepper",
        "key": "label",
        "englishDefault": "Progress steps"
      }
    ]
  },
  "menubar": {
    "slug": "menubar",
    "importPath": "ashen-ui/menubar",
    "surfaces": [
      {
        "symbol": "MenubarItem",
        "kind": "component",
        "selector": "sn-menubar-item",
        "inputs": [
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": true,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "menuFor",
            "bindingName": "menuFor",
            "type": "Menu",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "isDisabled",
            "bindingName": "disabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "activated",
            "bindingName": "activated",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      },
      {
        "symbol": "Menubar",
        "kind": "component",
        "selector": "sn-menubar",
        "inputs": [
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-menubar-backdrop-filter",
        "default": "var(--sn-backdrop-filter, none)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-bg",
        "default": "var(--sn-surface-panel)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-border",
        "default": "1px solid var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-border-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-gap",
        "default": "2px",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-arrow-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-bg",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-border-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-disabled-opacity",
        "default": "var(--sn-disabled-opacity)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-font-weight",
        "default": "500",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-icon-size",
        "default": "17px",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-open-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-menubar-item-padding",
        "default": "6px 10px",
        "source": "component"
      },
      {
        "name": "--sn-menubar-padding",
        "default": "4px 6px",
        "source": "component"
      },
      {
        "name": "--sn-menubar-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-sm))",
        "source": "component"
      }
    ],
    "intl": []
  },
  "progress-bar": {
    "slug": "progress-bar",
    "importPath": "ashen-ui/progress-bar",
    "surfaces": [
      {
        "symbol": "ProgressBar",
        "kind": "component",
        "selector": "sn-progress-bar",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "indeterminate",
            "bindingName": "indeterminate",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showValue",
            "bindingName": "showValue",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "variant",
            "bindingName": "variant",
            "type": "ProgressBarVariant",
            "required": false,
            "default": "'default'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "ProgressBarVariant": {
        "name": "ProgressBarVariant",
        "values": [
          {
            "value": "default",
            "description": "The library's own look."
          },
          {
            "value": "material",
            "description": "The Material look: a continuously accelerating indeterminate animation."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-progress-bar-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-indeterminate-duration",
        "default": "1.2s",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-material-duration",
        "default": "2.4s",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-material-height",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-stop-dot-size",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-track-bg",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-track-height",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-transition",
        "default": "width var(--sn-motion-slow)",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-value-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-value-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-progress-bar-value-min-width",
        "default": "34px",
        "source": "component"
      }
    ],
    "intl": []
  },
  "progress-spinner": {
    "slug": "progress-spinner",
    "importPath": "ashen-ui/progress-spinner",
    "surfaces": [
      {
        "symbol": "ProgressSpinner",
        "kind": "component",
        "selector": "sn-progress-spinner",
        "inputs": [
          {
            "category": "inputs",
            "name": "size",
            "bindingName": "size",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "strokeWidth",
            "bindingName": "strokeWidth",
            "type": "number",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "variant",
            "bindingName": "variant",
            "type": "ProgressSpinnerVariant",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "color",
            "bindingName": "color",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "ProgressSpinnerVariant": {
        "name": "ProgressSpinnerVariant",
        "values": [
          {
            "value": "default",
            "description": "The library's own look."
          },
          {
            "value": "material",
            "description": "The Material look: a continuously accelerating indeterminate animation."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-progress-spinner-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-progress-spinner-material-arc-duration",
        "default": "1.4s",
        "source": "component"
      },
      {
        "name": "--sn-progress-spinner-material-rotate-duration",
        "default": "1.6s",
        "source": "component"
      },
      {
        "name": "--sn-progress-spinner-rotate-duration",
        "default": "0.8s",
        "source": "component"
      },
      {
        "name": "--sn-progress-spinner-track-color",
        "default": "var(--sn-border)",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "common",
        "key": "close",
        "englishDefault": "Close"
      },
      {
        "group": "common",
        "key": "next",
        "englishDefault": "Next"
      },
      {
        "group": "common",
        "key": "previous",
        "englishDefault": "Previous"
      },
      {
        "group": "common",
        "key": "loading",
        "englishDefault": "Loading"
      },
      {
        "group": "common",
        "key": "emptyMessage",
        "englishDefault": "No results found."
      }
    ]
  },
  "message": {
    "slug": "message",
    "importPath": "ashen-ui/message",
    "surfaces": [
      {
        "symbol": "Message",
        "kind": "component",
        "selector": "sn-message",
        "inputs": [
          {
            "category": "inputs",
            "name": "severity",
            "bindingName": "severity",
            "type": "MessageSeverity",
            "required": false,
            "default": "'info'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "icon",
            "bindingName": "icon",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "closable",
            "bindingName": "closable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "simple",
            "bindingName": "simple",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Text-only variant - severity-tinted text with no icon, container, border or background."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "closed",
            "bindingName": "closed",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "MessageSeverity": {
        "name": "MessageSeverity",
        "values": [
          {
            "value": "info",
            "description": ""
          },
          {
            "value": "success",
            "description": ""
          },
          {
            "value": "warning",
            "description": ""
          },
          {
            "value": "error",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-message-bg",
        "default": "var(--sn-message-info-bg)",
        "source": "component"
      },
      {
        "name": "--sn-message-close-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-message-close-icon-size",
        "default": "15px",
        "source": "component"
      },
      {
        "name": "--sn-message-close-size",
        "default": "20px",
        "source": "component"
      },
      {
        "name": "--sn-message-color",
        "default": "var(--sn-color-info)",
        "source": "component"
      },
      {
        "name": "--sn-message-error-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-error-text",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-message-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-message-gap",
        "default": "10px",
        "source": "component"
      },
      {
        "name": "--sn-message-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-message-info-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-info-text",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-padding",
        "default": "10px 12px",
        "source": "component"
      },
      {
        "name": "--sn-message-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-message-success-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-success-text",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-text-color",
        "default": "var(--sn-message-info-text)",
        "source": "component"
      },
      {
        "name": "--sn-message-warning-bg",
        "default": null,
        "source": null
      },
      {
        "name": "--sn-message-warning-text",
        "default": null,
        "source": null
      }
    ],
    "intl": [
      {
        "group": "message",
        "key": "close",
        "englishDefault": "Close message"
      }
    ]
  },
  "meter-group": {
    "slug": "meter-group",
    "importPath": "ashen-ui/meter-group",
    "surfaces": [
      {
        "symbol": "MeterGroup",
        "kind": "component",
        "selector": "sn-meter-group",
        "inputs": [
          {
            "category": "inputs",
            "name": "max",
            "bindingName": "max",
            "type": "number",
            "required": false,
            "default": "100",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "showLegend",
            "bindingName": "showLegend",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Meter",
        "kind": "component",
        "selector": "sn-meter",
        "inputs": [
          {
            "category": "inputs",
            "name": "value",
            "bindingName": "value",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "label",
            "bindingName": "label",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "color",
            "bindingName": "color",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "unit",
            "bindingName": "unit",
            "type": "string",
            "required": false,
            "default": "'%'",
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-meter-group-bar-bg",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-bar-height",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-bar-radius",
        "default": "var(--sn-radius-pill)",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-gap",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-legend-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-legend-dot-size",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-legend-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-legend-gap",
        "default": "14px",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-legend-item-gap",
        "default": "6px",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-legend-value-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-meter-group-segment-transition",
        "default": "width var(--sn-motion-slow)",
        "source": "component"
      }
    ],
    "intl": []
  },
  "toast": {
    "slug": "toast",
    "importPath": "ashen-ui/toast",
    "surfaces": [
      {
        "symbol": "Toast",
        "kind": "component",
        "selector": "sn-toast",
        "inputs": [
          {
            "category": "inputs",
            "name": "position",
            "bindingName": "position",
            "type": "ToastPosition",
            "required": false,
            "default": null,
            "description": "Corner position for the toast stack. Defaults to `'top-right'`."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": "Extra classes via the SnClass pass-through system."
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animated",
            "bindingName": "animated",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "animation",
            "bindingName": "animation",
            "type": "SnShowHideAnimation | undefined",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      }
    ],
    "types": {
      "ToastPosition": {
        "name": "ToastPosition",
        "values": [
          {
            "value": "top-right",
            "description": ""
          },
          {
            "value": "top-left",
            "description": ""
          },
          {
            "value": "bottom-right",
            "description": ""
          },
          {
            "value": "bottom-left",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-toast-accent",
        "default": "var(--sn-color-info)",
        "source": "component"
      },
      {
        "name": "--sn-toast-bg",
        "default": "var(--sn-surface-elevated)",
        "source": "component"
      },
      {
        "name": "--sn-toast-border-color",
        "default": "transparent",
        "source": "component"
      },
      {
        "name": "--sn-toast-close-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-toast-close-icon-size",
        "default": "15px",
        "source": "component"
      },
      {
        "name": "--sn-toast-close-size",
        "default": "20px",
        "source": "component"
      },
      {
        "name": "--sn-toast-detail-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-toast-detail-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-toast-enter-duration",
        "default": "200ms",
        "source": "component"
      },
      {
        "name": "--sn-toast-exit-duration",
        "default": "150ms",
        "source": "component"
      },
      {
        "name": "--sn-toast-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-toast-gap",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-toast-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-toast-offset",
        "default": "14px",
        "source": "component"
      },
      {
        "name": "--sn-toast-padding",
        "default": "10px 12px",
        "source": "component"
      },
      {
        "name": "--sn-toast-radius",
        "default": "var(--sn-radius-md)",
        "source": "component"
      },
      {
        "name": "--sn-toast-shadow",
        "default": "var(--sn-glass-shadow, var(--sn-shadow-overlay))",
        "source": "component"
      },
      {
        "name": "--sn-toast-summary-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-toast-text-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-toast-width",
        "default": "20rem",
        "source": "component"
      },
      {
        "name": "--sn-toast-z",
        "default": "1200",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "toast",
        "key": "close",
        "englishDefault": "Close notification"
      }
    ]
  },
  "table": {
    "slug": "table",
    "importPath": "ashen-ui/table",
    "surfaces": [
      {
        "symbol": "TableCellDef",
        "kind": "directive",
        "selector": "ng-template[snCellDef]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "TableColumn",
        "kind": "component",
        "selector": "sn-column",
        "inputs": [
          {
            "category": "inputs",
            "name": "field",
            "bindingName": "field",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "header",
            "bindingName": "header",
            "type": "string",
            "required": false,
            "default": "''",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "width",
            "bindingName": "width",
            "type": "string",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "align",
            "bindingName": "align",
            "type": "'start' | 'center' | 'end' | 'left' | 'right'",
            "required": false,
            "default": "'start'",
            "description": "Any CSS `text-align` keyword. `start` and `end` follow the direction."
          },
          {
            "category": "inputs",
            "name": "sortable",
            "bindingName": "sortable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "sortValue",
            "bindingName": "sortValue",
            "type": "((row: T) => unknown) | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "type",
            "bindingName": "type",
            "type": "TableColumnType",
            "required": false,
            "default": "'data'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "sticky",
            "bindingName": "sticky",
            "type": "'start' | 'end' | 'left' | 'right' | undefined",
            "required": false,
            "default": "undefined",
            "description": "Pin the column to an edge while the table scrolls horizontally.\n\n`start` and `end` follow the reading direction; `left` and `right` name a\nphysical edge and stay there in either direction."
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "TableStyle",
        "kind": "directive",
        "selector": "table[snTable]",
        "inputs": [
          {
            "category": "inputs",
            "name": "striped",
            "bindingName": "striped",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "hover",
            "bindingName": "hover",
            "type": "boolean",
            "required": false,
            "default": "true",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "stack",
            "bindingName": "stack",
            "type": "TableStackBreakpoint | null",
            "required": false,
            "default": "null",
            "description": "Below this breakpoint (sm 640px, md 768px, lg 1024px) the header is hidden and\neach cell takes a full-width line. A `data-label` on a cell is shown before it."
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "TableSort",
        "kind": "directive",
        "selector": "[snTableSort]",
        "inputs": [],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "snSortChange",
            "bindingName": "snSortChange",
            "type": "TableSortState",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      },
      {
        "symbol": "TableSortHeader",
        "kind": "directive",
        "selector": "th[snSortHeader]",
        "inputs": [
          {
            "category": "inputs",
            "name": "snSortHeader",
            "bindingName": "snSortHeader",
            "type": "string",
            "required": true,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "TableExpansionDef",
        "kind": "directive",
        "selector": "ng-template[snExpansionDef]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "Table",
        "kind": "component",
        "selector": "sn-table",
        "inputs": [
          {
            "category": "inputs",
            "name": "striped",
            "bindingName": "striped",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "hover",
            "bindingName": "hover",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "emptyMessage",
            "bindingName": "emptyMessage",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loading",
            "bindingName": "loading",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Covers the rows with a busy overlay, e.g. while a server page loads."
          },
          {
            "category": "inputs",
            "name": "caption",
            "bindingName": "caption",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "layout",
            "bindingName": "layout",
            "type": "TableLayout",
            "required": false,
            "default": null,
            "description": "`table` (native, default) or `flex` (block/flexbox rows like Material's mat-table)."
          },
          {
            "category": "inputs",
            "name": "selectable",
            "bindingName": "selectable",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Single-selection by row click."
          },
          {
            "category": "inputs",
            "name": "selectionMode",
            "bindingName": "selectionMode",
            "type": "TableSelectionMode",
            "required": false,
            "default": "'none'",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rowClickSelection",
            "bindingName": "rowClickSelection",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "With `selectionMode=\"multiple\"`, let a row click select like a file list:\na plain click selects only that row, Ctrl/Cmd toggles it, and Shift selects\nthe range from the last plain or Ctrl click. The checkbox column keeps working."
          },
          {
            "category": "inputs",
            "name": "rowKey",
            "bindingName": "rowKey",
            "type": "(row: T) => unknown",
            "required": false,
            "default": null,
            "description": "Row identity used by selection and expansion. Defaults to the row reference."
          },
          {
            "category": "inputs",
            "name": "selectAllLabel",
            "bindingName": "selectAllLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "selectRowLabel",
            "bindingName": "selectRowLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "expandRowLabel",
            "bindingName": "expandRowLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "expandRowOnClick",
            "bindingName": "expandRowOnClick",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "When expansion is enabled, clicking anywhere on the row toggles it."
          },
          {
            "category": "inputs",
            "name": "stickyHeader",
            "bindingName": "stickyHeader",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "responsive",
            "bindingName": "responsive",
            "type": "boolean",
            "required": false,
            "default": null,
            "description": "Keep the table at its natural (content) width and scroll horizontally when\nit can't fit, instead of squeezing columns. Ideal for wide tables on narrow\nviewports. Override the floor with `--sn-table-min-width`."
          },
          {
            "category": "inputs",
            "name": "scrollHeight",
            "bindingName": "scrollHeight",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": "Max height of the scroll container (any CSS length)."
          },
          {
            "category": "inputs",
            "name": "server",
            "bindingName": "server",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "totalRecords",
            "bindingName": "totalRecords",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "virtual",
            "bindingName": "virtual",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rowHeight",
            "bindingName": "rowHeight",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "overscan",
            "bindingName": "overscan",
            "type": "unknown",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loadMoreThreshold",
            "bindingName": "loadMoreThreshold",
            "type": "number",
            "required": false,
            "default": "10",
            "description": "Emit `loadMore` when fewer than this many rows remain below the viewport."
          },
          {
            "category": "inputs",
            "name": "hasMore",
            "bindingName": "hasMore",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "rowReorder",
            "bindingName": "rowReorder",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "columnReorder",
            "bindingName": "columnReorder",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "defaultSort",
            "bindingName": "defaultSort",
            "type": "TableDefaultSort | null",
            "required": false,
            "default": "null",
            "description": "Sort to fall back to when the header cycle ends. Without it the third click\nclears the sort; with it, the third click restores this one."
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "value",
            "bindingName": "value",
            "type": "readonly T[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "models",
            "name": "selectedIndex",
            "bindingName": "selectedIndex",
            "type": "number | null",
            "required": false,
            "default": "null",
            "description": ""
          },
          {
            "category": "models",
            "name": "selection",
            "bindingName": "selection",
            "type": "T[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "models",
            "name": "expandedKeys",
            "bindingName": "expandedKeys",
            "type": "unknown[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "models",
            "name": "page",
            "bindingName": "page",
            "type": "number",
            "required": false,
            "default": "0",
            "description": ""
          },
          {
            "category": "models",
            "name": "pageSize",
            "bindingName": "pageSize",
            "type": "number | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "models",
            "name": "sortField",
            "bindingName": "sortField",
            "type": "string | null",
            "required": false,
            "default": "null",
            "description": "Column field currently sorted. Bind with `[(sortField)]` to read or set it from outside."
          },
          {
            "category": "models",
            "name": "sortOrder",
            "bindingName": "sortOrder",
            "type": "TableSortOrder",
            "required": false,
            "default": "null",
            "description": "Direction of the current sort. Bind with `[(sortOrder)]`."
          }
        ],
        "outputs": [
          {
            "category": "outputs",
            "name": "rowExpand",
            "bindingName": "rowExpand",
            "type": "{ row: T; expanded: boolean }",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "load",
            "bindingName": "load",
            "type": "TableLoadEvent",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "loadMore",
            "bindingName": "loadMore",
            "type": "TableLoadMoreEvent",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "rowReordered",
            "bindingName": "rowReordered",
            "type": "TableRowReorderEvent<T>",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "columnReordered",
            "bindingName": "columnReordered",
            "type": "TableColumnReorderEvent",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "rowClick",
            "bindingName": "rowClick",
            "type": "{ row: T; index: number }",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "sortChange",
            "bindingName": "sortChange",
            "type": "{ field: string | null; order: TableSortOrder }",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "TableColumnType": {
        "name": "TableColumnType",
        "values": [
          {
            "value": "data",
            "description": ""
          },
          {
            "value": "actions",
            "description": ""
          }
        ]
      },
      "TableStackBreakpoint": {
        "name": "TableStackBreakpoint",
        "values": [
          {
            "value": "sm",
            "description": ""
          },
          {
            "value": "md",
            "description": ""
          },
          {
            "value": "lg",
            "description": ""
          }
        ]
      },
      "TableLayout": {
        "name": "TableLayout",
        "values": [
          {
            "value": "table",
            "description": "Real `<table>` semantics and column sizing."
          },
          {
            "value": "flex",
            "description": "CSS grid/flex rows, which is what responsive column hiding and sticky columns need."
          }
        ]
      },
      "TableSelectionMode": {
        "name": "TableSelectionMode",
        "values": [
          {
            "value": "none",
            "description": "Rows are not selectable."
          },
          {
            "value": "single",
            "description": "One row at a time; picking another replaces the selection."
          },
          {
            "value": "multiple",
            "description": "Any number of rows, with a checkbox column and a select-all header box."
          }
        ]
      },
      "TableSortOrder": {
        "name": "TableSortOrder",
        "values": [
          {
            "value": "asc",
            "description": ""
          },
          {
            "value": "desc",
            "description": ""
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-table-caption-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-table-caption-font-size",
        "default": "var(--sn-text-lg)",
        "source": "component"
      },
      {
        "name": "--sn-table-caption-font-weight",
        "default": "var(--sn-font-weight-medium)",
        "source": "component"
      },
      {
        "name": "--sn-table-caption-padding",
        "default": "var(--sn-table-cell-padding)",
        "source": "component"
      },
      {
        "name": "--sn-table-cell-border",
        "default": "var(--sn-border-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-table-cell-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-table-cell-max-width",
        "default": "16rem",
        "source": "component"
      },
      {
        "name": "--sn-table-cell-padding",
        "default": "8px 12px",
        "source": "component"
      },
      {
        "name": "--sn-table-control-column-width",
        "default": "36px",
        "source": "component"
      },
      {
        "name": "--sn-table-empty-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-table-empty-padding",
        "default": "18px 12px",
        "source": "component"
      },
      {
        "name": "--sn-table-expand-button-size",
        "default": "24px",
        "source": "component"
      },
      {
        "name": "--sn-table-expand-icon-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-table-header-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-table-header-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-table-header-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-table-header-font-size",
        "default": "var(--sn-text-xs)",
        "source": "component"
      },
      {
        "name": "--sn-table-header-font-weight",
        "default": "600",
        "source": "component"
      },
      {
        "name": "--sn-table-header-letter-spacing",
        "default": "0.04em",
        "source": "component"
      },
      {
        "name": "--sn-table-header-sorted-color",
        "default": "var(--sn-color-primary)",
        "source": "component"
      },
      {
        "name": "--sn-table-header-text-transform",
        "default": "uppercase",
        "source": "component"
      },
      {
        "name": "--sn-table-loading-bg",
        "default": "var(--sn-surface-overlay)",
        "source": "component"
      },
      {
        "name": "--sn-table-loading-min-height",
        "default": "6rem",
        "source": "component"
      },
      {
        "name": "--sn-table-min-width",
        "default": "max-content",
        "source": "component"
      },
      {
        "name": "--sn-table-motion",
        "default": "var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-table-row-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-table-row-selected-bg",
        "default": "var(--sn-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-table-sort-gap",
        "default": "3px",
        "source": "component"
      },
      {
        "name": "--sn-table-sort-icon-inactive-opacity",
        "default": "0.35",
        "source": "component"
      },
      {
        "name": "--sn-table-sort-icon-size",
        "default": "13px",
        "source": "component"
      },
      {
        "name": "--sn-table-stack-cell-padding",
        "default": "4px 12px",
        "source": "component"
      },
      {
        "name": "--sn-table-stack-row-padding",
        "default": "4px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "common",
        "key": "close",
        "englishDefault": "Close"
      },
      {
        "group": "common",
        "key": "next",
        "englishDefault": "Next"
      },
      {
        "group": "common",
        "key": "previous",
        "englishDefault": "Previous"
      },
      {
        "group": "common",
        "key": "loading",
        "englishDefault": "Loading"
      },
      {
        "group": "common",
        "key": "emptyMessage",
        "englishDefault": "No results found."
      },
      {
        "group": "table",
        "key": "selectAll",
        "englishDefault": "Select all rows"
      },
      {
        "group": "table",
        "key": "selectRow",
        "englishDefault": "Select row"
      },
      {
        "group": "table",
        "key": "expandRow",
        "englishDefault": "Toggle row details"
      }
    ]
  },
  "tree": {
    "slug": "tree",
    "importPath": "ashen-ui/tree",
    "surfaces": [
      {
        "symbol": "Tree",
        "kind": "component",
        "selector": "sn-tree",
        "inputs": [
          {
            "category": "inputs",
            "name": "nodes",
            "bindingName": "nodes",
            "type": "readonly TreeNode[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "expandOnClick",
            "bindingName": "expandOnClick",
            "type": "TreeExpandOnClick",
            "required": false,
            "default": "'none'",
            "description": "Expand/collapse a parent node by clicking anywhere on the tree item:\n'none' (chevron only), 'single' (single click), 'double' (double click)."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "loadingKeys",
            "bindingName": "loadingKeys",
            "type": "readonly string[]",
            "required": false,
            "default": null,
            "description": "Keys whose children are being fetched. Shows a busy toggle and sets `aria-busy`."
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "selectedKey",
            "bindingName": "selectedKey",
            "type": "string | null",
            "required": false,
            "default": "null",
            "description": ""
          },
          {
            "category": "models",
            "name": "expandedKeys",
            "bindingName": "expandedKeys",
            "type": "readonly string[]",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": [
          {
            "category": "outputs",
            "name": "nodeSelect",
            "bindingName": "nodeSelect",
            "type": "{ key: string; node: TreeNode }",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "nodeExpand",
            "bindingName": "nodeExpand",
            "type": "{ key: string; node: TreeNode }",
            "required": false,
            "default": null,
            "description": "Fires on every user expand. For a `lazy` node, replace `nodes` with the loaded children."
          },
          {
            "category": "outputs",
            "name": "nodeCollapse",
            "bindingName": "nodeCollapse",
            "type": "{ key: string; node: TreeNode }",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {
      "TreeExpandOnClick": {
        "name": "TreeExpandOnClick",
        "values": [
          {
            "value": "none",
            "description": "Only the toggle arrow expands a node; clicking the label selects it."
          },
          {
            "value": "single",
            "description": "A single click on the node expands it."
          },
          {
            "value": "double",
            "description": "A double click on the node expands it, leaving single click for selection."
          }
        ]
      }
    },
    "tokens": [
      {
        "name": "--sn-tree-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-icon-size",
        "default": "17px",
        "source": "component"
      },
      {
        "name": "--sn-tree-loading-duration",
        "default": "1s",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-font-family",
        "default": "var(--sn-font-ui)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-gap",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-hover-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-motion",
        "default": "var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-padding-h",
        "default": "8px",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-padding-v",
        "default": "5px",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-selected-bg",
        "default": "var(--sn-select-option-selected-bg)",
        "source": "component"
      },
      {
        "name": "--sn-tree-node-selected-color",
        "default": "var(--sn-select-option-selected-text)",
        "source": "component"
      },
      {
        "name": "--sn-tree-select-icon-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-border",
        "default": "var(--sn-border-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-gap",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-muted-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-padding-h",
        "default": "12px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-padding-v",
        "default": "7px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-depth-indent",
        "default": "20px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-font-size",
        "default": "var(--sn-text-2xs)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-font-weight",
        "default": "600",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-letter-spacing",
        "default": "0.06em",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-text-transform",
        "default": "uppercase",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-node-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-node-icon-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-icon-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-motion",
        "default": "var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-size",
        "default": "18px",
        "source": "component"
      },
      {
        "name": "--sn-tree-toggle-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-toggle-icon-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-tree-toggle-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-toggle-size",
        "default": "18px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "tree",
        "key": "label",
        "englishDefault": "Tree"
      },
      {
        "group": "tree",
        "key": "expand",
        "englishDefault": "Expand"
      },
      {
        "group": "tree",
        "key": "collapse",
        "englishDefault": "Collapse"
      },
      {
        "group": "tree",
        "key": "tableLabel",
        "englishDefault": "Tree table"
      }
    ]
  },
  "tree-table": {
    "slug": "tree-table",
    "importPath": "ashen-ui/tree-table",
    "surfaces": [
      {
        "symbol": "TreeTable",
        "kind": "component",
        "selector": "sn-tree-table",
        "inputs": [
          {
            "category": "inputs",
            "name": "nodes",
            "bindingName": "nodes",
            "type": "readonly TreeTableNode[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "ariaLabel",
            "bindingName": "ariaLabel",
            "type": "string | undefined",
            "required": false,
            "default": "undefined",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snStyle",
            "bindingName": "snStyle",
            "type": "SnStyle",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snAttrs",
            "bindingName": "snAttrs",
            "type": "SnAttrs",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [
          {
            "category": "models",
            "name": "expandedKeys",
            "bindingName": "expandedKeys",
            "type": "readonly string[]",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "outputs": []
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-tree-table-cell-border",
        "default": "var(--sn-border-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-gap",
        "default": "4px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-muted-color",
        "default": "var(--sn-text-muted)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-padding-h",
        "default": "12px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-cell-padding-v",
        "default": "7px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-depth-indent",
        "default": "20px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-bg",
        "default": "var(--sn-surface-hover)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-font-size",
        "default": "var(--sn-text-2xs)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-font-weight",
        "default": "600",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-letter-spacing",
        "default": "0.06em",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-header-text-transform",
        "default": "uppercase",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-node-icon-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-node-icon-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-color",
        "default": "var(--sn-text-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-icon-size",
        "default": "16px",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-motion",
        "default": "var(--sn-motion-base)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-radius",
        "default": "var(--sn-radius-sm)",
        "source": "component"
      },
      {
        "name": "--sn-tree-table-toggle-size",
        "default": "18px",
        "source": "component"
      }
    ],
    "intl": [
      {
        "group": "tree",
        "key": "label",
        "englishDefault": "Tree"
      },
      {
        "group": "tree",
        "key": "expand",
        "englishDefault": "Expand"
      },
      {
        "group": "tree",
        "key": "collapse",
        "englishDefault": "Collapse"
      },
      {
        "group": "tree",
        "key": "tableLabel",
        "englishDefault": "Tree table"
      }
    ]
  },
  "infinite-scroll": {
    "slug": "infinite-scroll",
    "importPath": "ashen-ui/infinite-scroll",
    "surfaces": [
      {
        "symbol": "InfiniteScroll",
        "kind": "directive",
        "selector": "[snInfiniteScroll]",
        "inputs": [
          {
            "category": "inputs",
            "name": "distance",
            "bindingName": "distance",
            "type": "number",
            "required": false,
            "default": "100",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "throttle",
            "bindingName": "throttle",
            "type": "number",
            "required": false,
            "default": "150",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "scrollWindow",
            "bindingName": "scrollWindow",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "snInfiniteScrollDisabled",
            "bindingName": "snInfiniteScrollDisabled",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "scrolled",
            "bindingName": "scrolled",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "outputs",
            "name": "scrolledUp",
            "bindingName": "scrolledUp",
            "type": "void",
            "required": false,
            "default": null,
            "description": ""
          }
        ]
      }
    ],
    "types": {},
    "tokens": [],
    "intl": []
  },
  "virtual-scroller": {
    "slug": "virtual-scroller",
    "importPath": "ashen-ui/virtual-scroller",
    "surfaces": [
      {
        "symbol": "VirtualScrollerItemDef",
        "kind": "directive",
        "selector": "ng-template[snItemDef]",
        "inputs": [],
        "models": [],
        "outputs": []
      },
      {
        "symbol": "VirtualScroller",
        "kind": "component",
        "selector": "sn-virtual-scroller",
        "inputs": [
          {
            "category": "inputs",
            "name": "items",
            "bindingName": "items",
            "type": "readonly T[]",
            "required": false,
            "default": null,
            "description": ""
          },
          {
            "category": "inputs",
            "name": "itemHeight",
            "bindingName": "itemHeight",
            "type": "number",
            "required": false,
            "default": "36",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "height",
            "bindingName": "height",
            "type": "number",
            "required": false,
            "default": "240",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "overscan",
            "bindingName": "overscan",
            "type": "number",
            "required": false,
            "default": "4",
            "description": ""
          },
          {
            "category": "inputs",
            "name": "hasMore",
            "bindingName": "hasMore",
            "type": "boolean",
            "required": false,
            "default": "false",
            "description": "Emit `loadMore` while more items are available (infinite mode)."
          },
          {
            "category": "inputs",
            "name": "loadMoreThreshold",
            "bindingName": "loadMoreThreshold",
            "type": "number",
            "required": false,
            "default": "10",
            "description": "How many items from the end triggers `loadMore`."
          },
          {
            "category": "inputs",
            "name": "snClass",
            "bindingName": "snClass",
            "type": "SnClass",
            "required": false,
            "default": null,
            "description": ""
          }
        ],
        "models": [],
        "outputs": [
          {
            "category": "outputs",
            "name": "loadMore",
            "bindingName": "loadMore",
            "type": "VirtualScrollerLoadMoreEvent",
            "required": false,
            "default": null,
            "description": "Fires when scrolling approaches the end of the list (guarded per items length)."
          }
        ]
      }
    ],
    "types": {},
    "tokens": [
      {
        "name": "--sn-virtual-scroller-bg",
        "default": "var(--sn-input-bg)",
        "source": "component"
      },
      {
        "name": "--sn-virtual-scroller-border",
        "default": "var(--sn-border)",
        "source": "component"
      },
      {
        "name": "--sn-virtual-scroller-border-radius",
        "default": "var(--sn-select-border-radius)",
        "source": "component"
      },
      {
        "name": "--sn-virtual-scroller-item-border",
        "default": "var(--sn-border-subtle)",
        "source": "component"
      },
      {
        "name": "--sn-virtual-scroller-item-color",
        "default": "var(--sn-text)",
        "source": "component"
      },
      {
        "name": "--sn-virtual-scroller-item-font-size",
        "default": "var(--sn-text-sm)",
        "source": "component"
      },
      {
        "name": "--sn-virtual-scroller-item-padding",
        "default": "0 12px",
        "source": "component"
      }
    ],
    "intl": []
  }
} as const;
