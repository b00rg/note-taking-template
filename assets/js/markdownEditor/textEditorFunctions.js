/**
 * Action for clean block (remove headline, list, blockquote code, markers)
 */
function cleanBlock(editor) {
	var cm = editor.codemirror;
	_cleanBlock(cm);
}

/**
 * Undo action.
 */
function undo(editor) {
	var cm = editor.codemirror;
	cm.undo();
	cm.focus();
}


/**
 * Redo action.
 */
function redo(editor) {
	var cm = editor.codemirror;
	cm.redo();
	cm.focus();
}



function _replaceSelection(cm, active, startEnd, url) {
	if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	var text;
	var start = startEnd[0];
	var end = startEnd[1];
	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");
	if(url) {
		end = end.replace("#url#", url);
	}
	if(active) {
		text = cm.getLine(startPoint.line);
		start = text.slice(0, startPoint.ch);
		end = text.slice(startPoint.ch);
		cm.replaceRange(start + end, {
			line: startPoint.line,
			ch: 0
		});
	} else {
		text = cm.getSelection();
		cm.replaceSelection(start + text + end);

		startPoint.ch += start.length;
		if(startPoint !== endPoint) {
			endPoint.ch += start.length;
		}
	}
	cm.setSelection(startPoint, endPoint);
	cm.focus();
}




function _cleanBlock(cm) {
	if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");
	var text;

	for(var line = startPoint.line; line <= endPoint.line; line++) {
		text = cm.getLine(line);
		text = text.replace(/^[ ]*([# ]+|\*|\-|[> ]+|[0-9]+(.|\)))[ ]*/, "");

		cm.replaceRange(text, {
			line: line,
			ch: 0
		}, {
			line: line,
			ch: 99999999999999
		});
	}
}

// Merge the properties of one object into another.
function _mergeProperties(target, source) {
	for(var property in source) {
		if(source.hasOwnProperty(property)) {
			if(source[property] instanceof Array) {
				target[property] = source[property].concat(target[property] instanceof Array ? target[property] : []);
			} else if(
				source[property] !== null &&
				typeof source[property] === "object" &&
				source[property].constructor === Object
			) {
				target[property] = _mergeProperties(target[property] || {}, source[property]);
			} else {
				target[property] = source[property];
			}
		}
	}

	return target;
}

// Merge an arbitrary number of objects into one.
function extend(target) {
	for(var i = 1; i < arguments.length; i++) {
		target = _mergeProperties(target, arguments[i]);
	}

	return target;
}

/**
 * Get or set the text content.
 */
SimpleMDE.prototype.value = function(val) {
	if(val === undefined) {
		return this.codemirror.getValue();
	} else {
		this.codemirror.getDoc().setValue(val);
		return this;
	}
};


/* The right word count in respect for CJK. */
function wordCount(data) {
	var pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
	var m = data.match(pattern);
	var count = 0;
	if(m === null) return count;
	for(var i = 0; i < m.length; i++) {
		if(m[i].charCodeAt(0) >= 0x4E00) {
			count += m[i].length;
		} else {
			count += 1;
		}
	}
	return count;
}
