# Sanity Studio v3: Typed examples of complex custom inputs

I'd like to turn this into a guide. If I haven't done this already, bug me on [Slack](https://slack.sanity.io/).

See the [Form Components docs on sanity.io](https://www.sanity.io/docs/form-components-reference) for more details.

## Objects

Custom components for schema items can be loaded at four different points, each of them displays a little differently.

```ts
components: {
  field: MyCustomField,
  input: MyCustomInput,
  item: MyCustomItem,
  preview: MyCustomPreview,
}
```

Getting the Types to play nicely can be complicated, so in this repo are code examples on how to load custom components and satisfy TypeScript.

See `./components/` for examples.