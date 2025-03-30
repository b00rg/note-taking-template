
/**
 * Toggle side by side preview
 */
function toggleSideBySide(editor) {
	var cm = editor.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.nextSibling;
	var toolbarButton = editor.toolbarElements["side-by-side"];
	var useSideBySideListener = false;
	if(/editor-preview-active-side/.test(preview.className)) {
		preview.className = preview.className.replace(
			/\s*editor-preview-active-side\s*/g, ""
		);
		toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
		wrapper.className = wrapper.className.replace(/\s*CodeMirror-sided\s*/g, " ");
	} else {
		// When the preview button is clicked for the first time,
		// give some time for the transition from editor.css to fire and the view to slide from right to left,
		// instead of just appearing.
		setTimeout(function() {
			if(!cm.getOption("fullScreen"))
				toggleFullScreen(editor);
			preview.className += " editor-preview-active-side";
		}, 1);
		toolbarButton.className += " active";
		wrapper.className += " CodeMirror-sided";
		useSideBySideListener = true;
	}

	// Hide normal preview if active
	var previewNormal = wrapper.lastChild;
	if(/editor-preview-active/.test(previewNormal.className)) {
		previewNormal.className = previewNormal.className.replace(
			/\s*editor-preview-active\s*/g, ""
		);
		var toolbar = editor.toolbarElements.preview;
		var toolbar_div = wrapper.previousSibling;
		toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
		toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
	}

	var sideBySideRenderingFunction = function() {
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);
	};

	if(!cm.sideBySideRenderingFunction) {
		cm.sideBySideRenderingFunction = sideBySideRenderingFunction;
	}

	if(useSideBySideListener) {
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);
		cm.on("update", cm.sideBySideRenderingFunction);
	} else {
		cm.off("update", cm.sideBySideRenderingFunction);
	}

	// Refresh to fix selection being off (#309)
	cm.refresh();
}


/**
 * Preview action.
 */
function togglePreview(editor) {
	var cm = editor.codemirror;
	var wrapper = cm.getWrapperElement();
	var toolbar_div = wrapper.previousSibling;
	var toolbar = editor.options.toolbar ? editor.toolbarElements.preview : false;
	var preview = wrapper.lastChild;
	if(!preview || !/editor-preview/.test(preview.className)) {
		preview = document.createElement("div");
		preview.className = "editor-preview";
		wrapper.appendChild(preview);
	}
	if(/editor-preview-active/.test(preview.className)) {
		preview.className = preview.className.replace(
			/\s*editor-preview-active\s*/g, ""
		);
		if(toolbar) {
			toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
			toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
		}
	} else {
		// When the preview button is clicked for the first time,
		// give some time for the transition from editor.css to fire and the view to slide from right to left,
		// instead of just appearing.
		setTimeout(function() {
			preview.className += " editor-preview-active";
		}, 1);
		if(toolbar) {
			toolbar.className += " active";
			toolbar_div.className += " disabled-for-preview";
		}
	}
	preview.innerHTML = editor.options.previewRender(editor.value(), preview);

	// Turn off side by side if needed
	var sidebyside = cm.getWrapperElement().nextSibling;
	if(/editor-preview-active-side/.test(sidebyside.className))
		toggleSideBySide(editor);
}


/**
 * Toggle full screen of the editor.
 */
function toggleFullScreen(editor) {
	// Set fullscreen
	var cm = editor.codemirror;
	cm.setOption("fullScreen", !cm.getOption("fullScreen"));


	// Prevent scrolling on body during fullscreen active
	if(cm.getOption("fullScreen")) {
		saved_overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = saved_overflow;
	}


	// Update toolbar class
	var wrap = cm.getWrapperElement();

	if(!/fullscreen/.test(wrap.previousSibling.className)) {
		wrap.previousSibling.className += " fullscreen";
	} else {
		wrap.previousSibling.className = wrap.previousSibling.className.replace(/\s*fullscreen\b/, "");
	}


	// Update toolbar button
	var toolbarButton = editor.toolbarElements.fullscreen;

	if(!/active/.test(toolbarButton.className)) {
		toolbarButton.className += " active";
	} else {
		toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
	}


	// Hide side by side if needed
	var sidebyside = cm.getWrapperElement().nextSibling;
	if(/editor-preview-active-side/.test(sidebyside.className))
		toggleSideBySide(editor);
}


SimpleMDE.prototype.createSideBySide = function() {
	var cm = this.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.nextSibling;

	if(!preview || !/editor-preview-side/.test(preview.className)) {
		preview = document.createElement("div");
		preview.className = "editor-preview-side";
		wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);
	}

	// Syncs scroll  editor -> preview
	var cScroll = false;
	var pScroll = false;
	cm.on("scroll", function(v) {
		if(cScroll) {
			cScroll = false;
			return;
		}
		pScroll = true;
		var height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
		var ratio = parseFloat(v.getScrollInfo().top) / height;
		var move = (preview.scrollHeight - preview.clientHeight) * ratio;
		preview.scrollTop = move;
	});

	// Syncs scroll  preview -> editor
	preview.onscroll = function() {
		if(pScroll) {
			pScroll = false;
			return;
		}
		cScroll = true;
		var height = preview.scrollHeight - preview.clientHeight;
		var ratio = parseFloat(preview.scrollTop) / height;
		var move = (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight) * ratio;
		cm.scrollTo(0, move);
	};
	return preview;
};