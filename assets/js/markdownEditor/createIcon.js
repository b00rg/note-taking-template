
/**
 * Create icon element for toolbar.
 */
function createIcon(options, enableTooltips, shortcuts) {
	options = options || {};
	var el = document.createElement("a");
	enableTooltips = (enableTooltips == undefined) ? true : enableTooltips;

	if(options.title && enableTooltips) {
		el.title = createTootlip(options.title, options.action, shortcuts);

		if(isMac) {
			el.title = el.title.replace("Ctrl", "⌘");
			el.title = el.title.replace("Alt", "⌥");
		}
	}

	el.tabIndex = -1;
	el.className = options.className;
	return el;
}

function createSep() {
	var el = document.createElement("i");
	el.className = "separator";
	el.innerHTML = "|";
	return el;
}

function createTootlip(title, action, shortcuts) {
	var actionName;
	var tooltip = title;

	if(action) {
		actionName = getBindingName(action);
		if(shortcuts[actionName]) {
			tooltip += " (" + fixShortcut(shortcuts[actionName]) + ")";
		}
	}

	return tooltip;
}