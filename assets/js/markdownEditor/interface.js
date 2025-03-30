
/**
 * Interface of SimpleMDE.
 */
function SimpleMDE(options) {
	// Handle options parameter
	options = options || {};


	// Used later to refer to it"s parent
	options.parent = this;


	// Check if Font Awesome needs to be auto downloaded
	var autoDownloadFA = true;

	if(options.autoDownloadFontAwesome === false) {
		autoDownloadFA = false;
	}

	if(options.autoDownloadFontAwesome !== true) {
		var styleSheets = document.styleSheets;
		for(var i = 0; i < styleSheets.length; i++) {
			if(!styleSheets[i].href)
				continue;

			if(styleSheets[i].href.indexOf("//maxcdn.bootstrapcdn.com/font-awesome/") > -1) {
				autoDownloadFA = false;
			}
		}
	}

	if(autoDownloadFA) {
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css";
		document.getElementsByTagName("head")[0].appendChild(link);
	}


	// Find the textarea to use
	if(options.element) {
		this.element = options.element;
	} else if(options.element === null) {
		// This means that the element option was specified, but no element was found
		console.log("SimpleMDE: Error. No element was found.");
		return;
	}


	// Handle toolbar
	if(options.toolbar === undefined) {
		// Initialize
		options.toolbar = [];


		// Loop over the built in buttons, to get the preferred order
		for(var key in toolbarBuiltInButtons) {
			if(toolbarBuiltInButtons.hasOwnProperty(key)) {
				if(key.indexOf("separator-") != -1) {
					options.toolbar.push("|");
				}

				if(toolbarBuiltInButtons[key].default === true || (options.showIcons && options.showIcons.constructor === Array && options.showIcons.indexOf(key) != -1)) {
					options.toolbar.push(key);
				}
			}
		}
	}


	// Handle status bar
	if(!options.hasOwnProperty("status")) {
		options.status = ["autosave", "lines", "words", "cursor"];
	}


	// Add default preview rendering function
	if(!options.previewRender) {
		options.previewRender = function(plainText) {
			// Note: "this" refers to the options object
			return this.parent.markdown(plainText);
		};
	}


	// Set default options for parsing config
	options.parsingConfig = extend({
		highlightFormatting: true // needed for toggleCodeBlock to detect types of code
	}, options.parsingConfig || {});


	// Merging the insertTexts, with the given options
	options.insertTexts = extend({}, insertTexts, options.insertTexts || {});


	// Merging the promptTexts, with the given options
	options.promptTexts = promptTexts;


	// Merging the blockStyles, with the given options
	options.blockStyles = extend({}, blockStyles, options.blockStyles || {});


	// Merging the shortcuts, with the given options
	options.shortcuts = extend({}, shortcuts, options.shortcuts || {});


	// Change unique_id to uniqueId for backwards compatibility
	if(options.autosave != undefined && options.autosave.unique_id != undefined && options.autosave.unique_id != "")
		options.autosave.uniqueId = options.autosave.unique_id;


	// Update this options
	this.options = options;


	// Auto render
	this.render();


	// The codemirror component is only available after rendering
	// so, the setter for the initialValue can only run after
	// the element has been rendered
	if(options.initialValue && (!this.options.autosave || this.options.autosave.foundSavedValue !== true)) {
		this.value(options.initialValue);
	}
}

/**
 * Default markdown render.
 */
SimpleMDE.prototype.markdown = function(text) {
	if(marked) {
		// Initialize
		var markedOptions = {};


		// Update options
		if(this.options && this.options.renderingConfig && this.options.renderingConfig.singleLineBreaks === false) {
			markedOptions.breaks = false;
		} else {
			markedOptions.breaks = true;
		}

		if(this.options && this.options.renderingConfig && this.options.renderingConfig.codeSyntaxHighlighting === true && window.hljs) {
			markedOptions.highlight = function(code) {
				return window.hljs.highlightAuto(code).value;
			};
		}


		// Set options
		marked.setOptions(markedOptions);


		// Return
		return marked(text);
	}
};

/**
 * Render editor to the given element.
 */
SimpleMDE.prototype.render = function(el) {
	if(!el) {
		el = this.element || document.getElementsByTagName("textarea")[0];
	}

	if(this._rendered && this._rendered === el) {
		// Already rendered.
		return;
	}

	this.element = el;
	var options = this.options;

	var self = this;
	var keyMaps = {};

	for(var key in options.shortcuts) {
		// null stands for "do not bind this command"
		if(options.shortcuts[key] !== null && bindings[key] !== null) {
			(function(key) {
				keyMaps[fixShortcut(options.shortcuts[key])] = function() {
					bindings[key](self);
				};
			})(key);
		}
	}

	keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
	keyMaps["Tab"] = "tabAndIndentMarkdownList";
	keyMaps["Shift-Tab"] = "shiftTabAndUnindentMarkdownList";
	keyMaps["Esc"] = function(cm) {
		if(cm.getOption("fullScreen")) toggleFullScreen(self);
	};

	document.addEventListener("keydown", function(e) {
		e = e || window.event;

		if(e.keyCode == 27) {
			if(self.codemirror.getOption("fullScreen")) toggleFullScreen(self);
		}
	}, false);

	var mode, backdrop;
	if(options.spellChecker !== false) {
		mode = "spell-checker";
		backdrop = options.parsingConfig;
		backdrop.name = "gfm";
		backdrop.gitHubSpice = false;

		CodeMirrorSpellChecker({
			codeMirrorInstance: CodeMirror
		});
	} else {
		mode = options.parsingConfig;
		mode.name = "gfm";
		mode.gitHubSpice = false;
	}

	this.codemirror = CodeMirror.fromTextArea(el, {
		mode: mode,
		backdrop: backdrop,
		theme: "paper", // light mode
		tabSize: (options.tabSize != undefined) ? options.tabSize : 2,
		indentUnit: (options.tabSize != undefined) ? options.tabSize : 2,
		indentWithTabs: (options.indentWithTabs === false) ? false : true,
		lineNumbers: false,
		autofocus: (options.autofocus === true) ? true : false,
		extraKeys: keyMaps,
		lineWrapping: (options.lineWrapping === false) ? false : true,
		allowDropFileTypes: ["text/plain"],
		placeholder: options.placeholder || el.getAttribute("placeholder") || "",
		styleSelectedText: (options.styleSelectedText != undefined) ? options.styleSelectedText : true
	});

	if(options.forceSync === true) {
		var cm = this.codemirror;
		cm.on("change", function() {
			cm.save();
		});
	}

	this.gui = {};

	if(options.toolbar !== false) {
		this.gui.toolbar = this.createToolbar();
	}
	if(options.status !== false) {
		this.gui.statusbar = this.createStatusbar();
	}
	if(options.autosave != undefined && options.autosave.enabled === true) {
		this.autosave();
	}

	this.gui.sideBySide = this.createSideBySide();

	this._rendered = this.element;


	// Fixes CodeMirror bug (#344)
	var temp_cm = this.codemirror;
	setTimeout(function() {
		temp_cm.refresh();
	}.bind(temp_cm), 0);
};
