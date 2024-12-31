import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
	async onload() {

		this.addCommand({
			id: 'init-frontmatter',
			name: 'Init Frontmatter',
			editorCallback: (_: Editor, view: MarkdownView) => {
				const activeFile = view.file;
				if (!activeFile) {
					new Notice('No active file');
					return;
				}

				this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
					frontmatter.data = {
						foo: {
							value: 0,
						},
						bar: {
							value: 1,
						}
					}
				});
			}
		});

		this.addCommand({
			id: 'modify-frontmatter-1',
			name: 'Modify Frontmatter 1',
			editorCallback: (_: Editor, view: MarkdownView) => {
				const activeFile = view.file;
				if (!activeFile) {
					new Notice('No active file');
					return;
				}

				this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
					// Some checks to make sure that the previous commands have been run.
					if (!frontmatter?.data?.foo || !frontmatter?.data?.bar) {
						new Notice('Please run Init Frontmatter first');
						return;
					}

					// Modify foo.value.
					frontmatter.data.foo = frontmatter.data.bar;
				});
			}
		});

		this.addCommand({
			id: 'modify-frontmatter-2',
			name: 'Modify Frontmatter 2',
			editorCallback: (_: Editor, view: MarkdownView) => {
				const activeFile = view.file;
				if (!activeFile) {
					new Notice('No active file');
					return;
				}

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
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
	}

	async saveSettings() {
	}
}