// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class Mode {
	label: string = "";
	detail: string = "";
	settings: object = {}

	constructor(label: string, detail: string, settings: object = {}) {
		this.label = label;
		this.detail = detail;
		this.settings = Object.assign({
			"**/.git": true,
			"**/.svn": true,
			"**/.hg": true,
			"**/CVS": true,
			"**/.DS_Store": true,
			"**/Thumbs.db": true,
			"node_modules": true
		}, settings)
	}
}

// All my code modes:
const codeModes: Mode[] = [
	new Mode("Default", "Default Mode"),
	new Mode("Zen", "Code distraction-free", {
		"**/LICENSE": true,
		"**/*.md": true,
		"**/package.json": true,
		"**/package-lock.json": true,
		"**/.git*": true,
		"**/.browserslistrc": true,
		"**/.editorconfig": true,
		"**/tslint.json": true,
		"**/tsconfig*.json": true,
		"**/angular.json": true,
		"**/*.spec.*": true,
		"**/*.conf.*": true
	}),
	new Mode("Everything", "View everything so you can take in the whole scale of your project", {
		"**/.git": false,
		"**/.svn": false,
		"**/.hg": false,
		"**/CVS": false,
		"**/.DS_Store": false,
		"**/Thumbs.db": false,
		"node_modules": false
	}),
	new Mode("Documentation", "Update documentation", {
		"**/.*": true,
		"**/*.html": true,
		"**/*.css": true,
		"**/*.scss": true,
		"**/*.sass": true,
		"**/*.less": true,
		"**/*.js": true,
		"**/*.ts": true,
	}),
];

let statusBarItem: vscode.StatusBarItem;

let currentMode = "Default";

function changeCodeModeSettings(modeName: string | vscode.QuickPickItem): void {
	modeName = typeof modeName === "string" ? modeName : modeName.label;
	const modeToChangeTo = codeModes.find(mode => mode.label == modeName);

	if (!modeToChangeTo) {
		console.log("Mode not found")
		return;
	}

	// UI changes
	console.log("Switched to " + modeName + " mode")
	vscode.window.showInformationMessage("Switched to " + modeName + " mode");
	currentMode = modeName;
	statusBarItem.text = "Current mode: " + modeName;

	// Actual changes
	const config = vscode.workspace.getConfiguration("files");
	config.update("exclude", modeToChangeTo.settings, true)
}

// this method is called when your extension is activated
// this extension is activated on startup
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Code modes starting...');

	// Create status bar icon displaying current mode
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'code-modes.changeMode';
	statusBarItem.text = "Current mode: " + currentMode;
	console.log( "Current mode: " + currentMode)
	statusBarItem.show();

	context.subscriptions.push(statusBarItem);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('code-modes.changeMode', () => {
		// The code you place here will be executed every time your command is executed
		console.log("Change mode command ran")

		// Ask the user which mode to set to
		const response = vscode.window.showQuickPick(codeModes.filter(mode => mode.label !== currentMode), { placeHolder: "Choose which mode you want" })

		response.then(answer => {
			if (answer) changeCodeModeSettings(answer)
		})
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
