# Sanity Studio v3: Typed examples showcase

I'd like to turn these into guides. If I haven't done this already, bug me on [Slack](https://slack.sanity.io/).

## Objects

See the [Form Components docs on sanity.io](https://www.sanity.io/docs/form-components-reference) for more details.

Custom components for schema items can be loaded at four different points, and they display a little differently.

```ts
components: {
  field: MyCustomField,
  input: MyCustomInput,
  item: MyCustomItem,
  preview: MyCustomPreview,
}
```

Getting the Types to play nicely can be complicated, so in this repo are code examples on how to load custom components for objects and satisfy TypeScript.

See `./components/` for examples.

## Tools

Tools are a way to use a custom component with full-screen real estate. For a different modality for working with Sanity content or doing completely different operations entirely.

In `sanity.config.ts` there is a custom tool loaded as a plugin. Using a plugin helps isolate away specific functionality and makes re-use between projects easier.

A Tool can take a key-value pair of `options` which are passed into the `component` as props.
