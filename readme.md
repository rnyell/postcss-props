# postcss-props

**postcss-props** allows you to create and reuse custom CSS declarations, similar to CSS custom properties but for entire declaration blocks.

The plugin has two main entities: `@props` and `@dump()`; `@props` is an at-rule to define an identifier with a declaration block (property-value pairs) which can be accessed by `@dump` to insert (_dump_) your styles into a selector.


## Installation

```sh
npm install postcss-props --save-dev
```

## Configuration

```js
// postcss.config.js
import postcssProps from "postcss-props";

export default {
  plugins: [
    postcssProps({/* options */}),
  ],
};
```


## Suntax

```css
/* define declarations */
@props identifier {
  /* styles (property-value pairs) */
}

div {
  /* insert your declarations */
  @dump (identifier);
  /* other styles */
}
```

## Example

```css
@props btn {
  padding: 0.5rem 0.75rem;
  width: 12rem;
  font-size: 90%;
  font-weight: 600;
  border-radius: 0.5rem;
}

button {
  @dump (btn);
  display: inline-flex;
  gap: 5px;
}
```

Output:

```css
button {
  padding: 0.5rem 0.75rem;
  width: 12rem;
  font-size: 90%;
  font-weight: 600;
  border-radius: 0.5rem;
  display: inline-flex;
  gap: 5px;
}
```

By default, `@props` & `@dump` are removed from the final output, however you can change this bahavior in config and choose to include them in the output.

Note that you can't nest rules (selectors with declaration block) inside props:

```css
@props base {
  margin: 0;

  /* this throws an error */
  main {
    /*...*/
  }
}
```

## options

#### `strictMode`

type: `Boolean`

default: `false`

When enabled, it prevents generating the output file, and errors are thrown.

Issues that do not throw errors but instead produce warnings:
  - declaraing empty props without declarations
  - using not defined identifiers in `@dump`
  - using `@dump` without argument


#### `keepProps`

type: `Boolean`

default: `false`

#### `keepDumps`

type: `Boolean`

default: `false`

To control whether `@props` or `@dump` should be kept in the output or not. By default they are removed.

## Limitations

1. Duplicated @props definitions will override previous ones with the same name. In the future versions they will be merged.

```css
@props a {
  color: red;
}

@props a {
  color: blue;
}

div {
  @dump (a); /* color will be blue */
}
```

2. Currently you can't nest at-rules and pseudo selectors inside `@props`.

```css
/* focus & @media will be ignored */
@props btn {
  &:focus {
    outline: 1px solid;
  }

  @media (width < 480px) {
    padding: 0.25rem;
  }
}
```

## Note

Before choosing this plugin, you might want to consider these alternatives:

- [postcss-mixins](https://www.npmjs.com/package/postcss-mixins) - SASS-like mixins
- [postcss-apply](https://www.npmjs.com/package/postcss-apply) - Similar functionality using `@apply`
- [postcss-define-property](https://www.npmjs.com/package/postcss-define-property) - Custom property definitions

## Roadmap

- [x] Throw error when using not defined identifier
- [x] Warning for props with empty declaration
- [ ] Merge props with smae names
- [ ] Props inheritance (`@props primaryBtn extends btn`)
- [ ] Media queries support within `@props`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
