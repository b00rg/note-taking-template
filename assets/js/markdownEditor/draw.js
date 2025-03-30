
/**
 * Action for drawing a link.
 */
function drawLink(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	var url = "http://";
	if(options.promptURLs) {
		url = prompt(options.promptTexts.link);
		if(!url) {
			return false;
		}
	}
	_replaceSelection(cm, stat.link, options.insertTexts.link, url);
}

/**
 * Action for drawing an img.
 */
function drawImage(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	var url = "http://";
	if(options.promptURLs) {
		url = prompt(options.promptTexts.image);
		if(!url) {
			return false;
		}
	}
	_replaceSelection(cm, stat.image, options.insertTexts.image, url);
}

/**
 * Action for drawing a table.
 */
function drawTable(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	_replaceSelection(cm, stat.table, options.insertTexts.table);
}

/**
 * Action for drawing a horizontal rule.
 */
function drawHorizontalRule(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	_replaceSelection(cm, stat.image, options.insertTexts.horizontalRule);
}

