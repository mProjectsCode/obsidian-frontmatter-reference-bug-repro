# Frontmatter Reference Bug Repro

This plugin only serves the purpose to reproduce a specific bug with Obsidians `processFrontMatter` method.

## Reproduction steps

### 1.

Install and enable this plugin in a vault.

### 2.

Create a new note and run the `Init Frontmatter` command added by this plugin.

The frontmatter of the file should look like this (in source mode):

```yml
data:
  foo:
    value: 0
  bar:
    value: 1
```

### 3.

Run the `Modify Frontmatter` command added by this plugin, which does the following:

```ts
this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
	if (!frontmatter?.data?.foo || !frontmatter?.data?.bar) {
		new Notice('Please run Init Frontmatter first');
		return;
	}

	frontmatter.data.foo = frontmatter.data.bar;
});
```

The frontmatter of the file now looks like this (in source mode):

```yml
data:
  foo:
    &a1
    value: 1
  bar: *a1
```

## Expected Behavior

After the third reproduction step, the frontmatter should look like this:

```yml
data:
  foo:
    value: 1
  bar:
    value: 1
```

## Observed Behavior

The frontmatter uses YAML anchors and references, which is very confusing to the average user and makes manual editing of the frontmatter difficult.