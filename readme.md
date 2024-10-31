# postcss-props

**postcss-props** allows you to extend the capability of building custom and reusable declarations alongside of native custom properties.

The plugin has two main entities to use: `@props` and `@dump()`.

`@props` is an at-rule that you can define an identifier with a declaration block (property-value pairs) which can be accessed by `@dump` to _dump_ your styles into a selector. The combination of these two do a similar job with CSS variables in which you can declare a property prefixed by `--` and then use `var()` to refer the value it contains; however by postcss-props you can define the whole declarations instead of a single property-value. So probably we can refer this plugin as "Custom Declarations"!

### Suntax:

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

### Example

```css
@props buttons {
  padding: 0.5rem 0.75rem;
  width: 12rem;
  font-size: 90%;
  font-weight: 600;
  background-color: var(--primary);
  border-radius: 0.5rem;
}

.btn {
  @dump (buttons);
  display: inline-flex;
  gap: 5px;
}
```

The output looks like this:

```css
.btn {
  padding: 0.5rem 0.75rem;
  width: 12rem;
  font-size: 90%;
  font-weight: 600;
  background-color: var(--primary);
  border-radius: 0.5rem;
  display: inline-flex;
  gap: 5px;
}
```

`@props` is removed for final output, however you can change this bahavior in config and choose to include it in the output file.

## Notes

[postcss-apply](https://www.npmjs.com/package/postcss-apply)
[postcss-mixins](https://www.npmjs.com/package/postcss-mixins)
[postcss-define-property](https://www.npmjs.com/package/postcss-define-property)


- The identifier is a UTF-8 string.

- Defining props with same names is not an error (however you'll receive a warning) but the latest props will override the entire pre-defined props.

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

- Currently you can't nest other rules (including other `@props`) inside `@props`.

```css
@props btn {
  padding: 0.5rem;
  text-align: center;

  /* focus will be ignored */
  &:focus {
    outline: 1px solid;
  }

  /* at-rules */
  @media (width < 480px) {
    padding: 0.25rem;
  }
}
```

## TODOS

It would be fun if props could extend each others.

```css
@props btn {
  font: inherit;
  color: inherit;
  background-color: unset;
}

@props primary-btn extends btn {
  padding: 0.5rem 0.75rem;
  height: var(--h-12);
  font-size: 0.875rem;
  backgound-color: var(--primary);
}
```

---

Since we have `var(--p)`, the dump can be similar in syntax for consistency, not being an at-rule: `dump(--f)`.

```css
/*
--------------------------------------------
🟣 alternative syntax:
using {@var | @let | @decl} instead of @props

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
🟣 alternative syntax:
--flexDisplay {
  display: flex;
  align-items: center;
  gap: 10px;
}

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
🟣 alternative, SASS-like syntax:
@mixin flexDisplay {
  //...
}

.container {
  @dump flexDisplay;
}
--------------------------------------------
*/
```
