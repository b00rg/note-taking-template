
var toolbarBuiltInButtons = {
    "bold": {
        name: "bold",
        action: toggleBold,
        className: "fa fa-bold",
        title: "Bold",
        default: true
    },
    "italic": {
        name: "italic",
        action: toggleItalic,
        className: "fa fa-italic",
        title: "Italic",
        default: true
    },
    "strikethrough": {
        name: "strikethrough",
        action: toggleStrikethrough,
        className: "fa fa-strikethrough",
        title: "Strikethrough"
    },
    "heading": {
        name: "heading",
        action: toggleHeadingSmaller,
        className: "fa fa-header",
        title: "Heading",
        default: true
    },
    "heading-smaller": {
        name: "heading-smaller",
        action: toggleHeadingSmaller,
        className: "fa fa-header fa-header-x fa-header-smaller",
        title: "Smaller Heading"
    },
    "heading-bigger": {
        name: "heading-bigger",
        action: toggleHeadingBigger,
        className: "fa fa-header fa-header-x fa-header-bigger",
        title: "Bigger Heading"
    },
    "heading-1": {
        name: "heading-1",
        action: toggleHeading1,
        className: "fa fa-header fa-header-x fa-header-1",
        title: "Big Heading"
    },
    "heading-2": {
        name: "heading-2",
        action: toggleHeading2,
        className: "fa fa-header fa-header-x fa-header-2",
        title: "Medium Heading"
    },
    "heading-3": {
        name: "heading-3",
        action: toggleHeading3,
        className: "fa fa-header fa-header-x fa-header-3",
        title: "Small Heading"
    },
    "separator-1": {
        name: "separator-1"
    },
    "code": {
        name: "code",
        action: toggleCodeBlock,
        className: "fa fa-code",
        title: "Code"
    },
    "quote": {
        name: "quote",
        action: toggleBlockquote,
        className: "fa fa-quote-left",
        title: "Quote",
        default: true
    },
    "unordered-list": {
        name: "unordered-list",
        action: toggleUnorderedList,
        className: "fa fa-list-ul",
        title: "Generic List",
        default: true
    },
    "ordered-list": {
        name: "ordered-list",
        action: toggleOrderedList,
        className: "fa fa-list-ol",
        title: "Numbered List",
        default: true
    },
    "clean-block": {
        name: "clean-block",
        action: cleanBlock,
        className: "fa fa-eraser fa-clean-block",
        title: "Clean block"
    },
    "separator-2": {
        name: "separator-2"
    },
    "link": {
        name: "link",
        action: drawLink,
        className: "fa fa-link",
        title: "Create Link",
        default: true
    },
    "image": {
        name: "image",
        action: drawImage,
        className: "fa fa-picture-o",
        title: "Insert Image",
        default: true
    },
    "table": {
        name: "table",
        action: drawTable,
        className: "fa fa-table",
        title: "Insert Table"
    },
    "horizontal-rule": {
        name: "horizontal-rule",
        action: drawHorizontalRule,
        className: "fa fa-minus",
        title: "Insert Horizontal Line"
    },
    "separator-3": {
        name: "separator-3"
    },
    "preview": {
        name: "preview",
        action: togglePreview,
        className: "fa fa-eye no-disable",
        title: "Toggle Preview",
        default: true
    },
    "side-by-side": {
        name: "side-by-side",
        action: toggleSideBySide,
        className: "fa fa-columns no-disable no-mobile",
        title: "Toggle Side by Side",
        default: true
    },
    "fullscreen": {
        name: "fullscreen",
        action: toggleFullScreen,
        className: "fa fa-arrows-alt no-disable no-mobile",
        title: "Toggle Fullscreen",
        default: true
    },
    "separator-4": {
        name: "separator-4"
    },
    "guide": {
        name: "guide",
        action: "https://simplemde.com/markdown-guide",
        className: "fa fa-question-circle",
        title: "Markdown Guide",
        default: true
    },
    "separator-5": {
        name: "separator-5"
    },
    "undo": {
        name: "undo",
        action: undo,
        className: "fa fa-undo no-disable",
        title: "Undo"
    },
    "redo": {
        name: "redo",
        action: redo,
        className: "fa fa-repeat no-disable",
        title: "Redo"
    }
};

var insertTexts = {
    link: ["[", "](#url#)"],
    image: ["![](", "#url#)"],
    table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"],
    horizontalRule: ["", "\n\n-----\n\n"]
};

var promptTexts = {
    link: "URL for the link:",
    image: "URL of the image:"
};

var blockStyles = {
    "bold": "**",
    "code": "```",
    "italic": "*"
};



SimpleMDE.prototype.createToolbar = function(items) {
	items = items || this.options.toolbar;

	if(!items || items.length === 0) {
		return;
	}
	var i;
	for(i = 0; i < items.length; i++) {
		if(toolbarBuiltInButtons[items[i]] != undefined) {
			items[i] = toolbarBuiltInButtons[items[i]];
		}
	}

	var bar = document.createElement("div");
	bar.className = "editor-toolbar";

	var self = this;

	var toolbarData = {};
	self.toolbar = items;

	for(i = 0; i < items.length; i++) {
		if(items[i].name == "guide" && self.options.toolbarGuideIcon === false)
			continue;

		if(self.options.hideIcons && self.options.hideIcons.indexOf(items[i].name) != -1)
			continue;

		// Fullscreen does not work well on mobile devices (even tablets)
		// In the future, hopefully this can be resolved
		if((items[i].name == "fullscreen" || items[i].name == "side-by-side") && isMobile())
			continue;


		// Don't include trailing separators
		if(items[i] === "|") {
			var nonSeparatorIconsFollow = false;

			for(var x = (i + 1); x < items.length; x++) {
				if(items[x] !== "|" && (!self.options.hideIcons || self.options.hideIcons.indexOf(items[x].name) == -1)) {
					nonSeparatorIconsFollow = true;
				}
			}

			if(!nonSeparatorIconsFollow)
				continue;
		}


		// Create the icon and append to the toolbar
		(function(item) {
			var el;
			if(item === "|") {
				el = createSep();
			} else {
				el = createIcon(item, self.options.toolbarTips, self.options.shortcuts);
			}

			// bind events, special for info
			if(item.action) {
				if(typeof item.action === "function") {
					el.onclick = function(e) {
						e.preventDefault();
						item.action(self);
					};
				} else if(typeof item.action === "string") {
					el.href = item.action;
					el.target = "_blank";
				}
			}

			toolbarData[item.name || item] = el;
			bar.appendChild(el);
		})(items[i]);
	}

	self.toolbarElements = toolbarData;

	var cm = this.codemirror;
	cm.on("cursorActivity", function() {
		var stat = getState(cm);

		for(var key in toolbarData) {
			(function(key) {
				var el = toolbarData[key];
				if(stat[key]) {
					el.className += " active";
				} else if(key != "fullscreen" && key != "side-by-side") {
					el.className = el.className.replace(/\s*active\s*/g, "");
				}
			})(key);
		}
	});

	var cmWrapper = cm.getWrapperElement();
	cmWrapper.parentNode.insertBefore(bar, cmWrapper);
	return bar;
};