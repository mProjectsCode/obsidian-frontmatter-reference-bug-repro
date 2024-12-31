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

Run the `Modify Frontmatter 1` command added by this plugin, which does the following:

```ts
this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
	// Some checks to make sure that the previous commands have been run.
	if (!frontmatter?.data?.foo || !frontmatter?.data?.bar) {
		new Notice('Please run Init Frontmatter first');
		return;
	}

	// Modify foo.value.
	frontmatter.data.foo = frontmatter.data.bar;
});
```

#### Observed Behavior

The frontmatter uses YAML [anchors and references](https://yaml.org/spec/1.2.2/#71-alias-nodes), which is very confusing to the average user and makes manual editing of the frontmatter difficult.
Further, it breaks expectations around modifying frontmatter later on, as seen in step 4.

The frontmatter looks like this (in source mode):

```yml
data:
  foo:
    &a1
    value: 1
  bar: *a1
```

#### Expected Behavior

The frontmatter should look like this (in source mode):

```yml
data:
  foo:
    value: 1
  bar:
    value: 1
```

### 4.

Run the `Modify Frontmatter 2` command added by this plugin, which does the following:

```ts
this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
	// Some checks to make sure that the previous commands have been run.
	if (!frontmatter?.data?.foo || !frontmatter?.data?.bar) {
		new Notice('Please run Init Frontmatter first');
		return;
	}
	if (frontmatter.data.foo.value !== frontmatter.data.bar.value) {
		new Notice('Please run Modify Frontmatter first');
		return;
	}

	// Modify foo.value. We expect this to not affect foo.value.
	frontmatter.data.foo.value = 2;

	// Oh no! This also changed bar.value to 2. This is not expected.
	if (frontmatter.data.bar.value === 2) {
		new Notice('Something went wrong. I modified foo.value to 2, but that also changed bar.value to 2. This is not expected.');
	}
});
```

#### Observed Behavior

The value of `bar.value` also changes when we change `foo.value`. And the last notice displays.

The frontmatter looks like this (in source mode):

```yml
data:
  foo:
    &a1
    value: 2
  bar: *a1
```

#### Expected Behavior

Edits to one property should not affect another.

The frontmatter should look like this (in source mode):

```yml
data:
  foo:
    value: 2
  bar:
    value: 1
```

## Remarks

In essence frontmatter handles like we would expect a normal JavaScript object to handle, but this is contrary to how we would expect a serialized Object to behave.
With e.g. JSON as the serialization format, this would behave like outlined in the "Expected Behavior" sections in the reproduction steps.
In addition, few people know about YAML [anchors and references](https://yaml.org/spec/1.2.2/#71-alias-nodes) and they are [confusing to the average user](https://github.com/mProjectsCode/obsidian-meta-bind-plugin/issues/490).
In light of this, I believe this behavior to be a bug that the Obsidian team should address.