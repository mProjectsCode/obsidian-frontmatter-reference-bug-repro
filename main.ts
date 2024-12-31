import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

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
			id: 'modify-frontmatter',
			name: 'Modify Frontmatter',
			editorCallback: (_: Editor, view: MarkdownView) => {
				const activeFile = view.file;
				if (!activeFile) {
					new Notice('No active file');
					return;
				}

this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
	if (!frontmatter?.data?.foo || !frontmatter?.data?.bar) {
		new Notice('Please run Init Frontmatter first');
		return;
	}

	frontmatter.data.foo = frontmatter.data.bar;
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