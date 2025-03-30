
SimpleMDE.prototype.createStatusbar = function(status) {
	// Initialize
	status = status || this.options.status;
	var options = this.options;
	var cm = this.codemirror;


	// Make sure the status variable is valid
	if(!status || status.length === 0)
		return;


	// Set up the built-in items
	var items = [];
	var i, onUpdate, defaultValue;

	for(i = 0; i < status.length; i++) {
		// Reset some values
		onUpdate = undefined;
		defaultValue = undefined;


		// Handle if custom or not
		if(typeof status[i] === "object") {
			items.push({
				className: status[i].className,
				defaultValue: status[i].defaultValue,
				onUpdate: status[i].onUpdate
			});
		} else {
			var name = status[i];

			if(name === "words") {
				defaultValue = function(el) {
					el.innerHTML = wordCount(cm.getValue());
				};
				onUpdate = function(el) {
					el.innerHTML = wordCount(cm.getValue());
				};
			} else if(name === "lines") {
				defaultValue = function(el) {
					el.innerHTML = cm.lineCount();
				};
				onUpdate = function(el) {
					el.innerHTML = cm.lineCount();
				};
			} else if(name === "cursor") {
				defaultValue = function(el) {
					el.innerHTML = "0:0";
				};
				onUpdate = function(el) {
					var pos = cm.getCursor();
					el.innerHTML = pos.line + ":" + pos.ch;
				};
			} else if(name === "autosave") {
				defaultValue = function(el) {
					if(options.autosave != undefined && options.autosave.enabled === true) {
						el.setAttribute("id", "autosaved");
					}
				};
			}

			items.push({
				className: name,
				defaultValue: defaultValue,
				onUpdate: onUpdate
			});
		}
	}


	// Create element for the status bar
	var bar = document.createElement("div");
	bar.className = "editor-statusbar";


	// Create a new span for each item
	for(i = 0; i < items.length; i++) {
		// Store in temporary variable
		var item = items[i];


		// Create span element
		var el = document.createElement("span");
		el.className = item.className;


		// Ensure the defaultValue is a function
		if(typeof item.defaultValue === "function") {
			item.defaultValue(el);
		}


		// Ensure the onUpdate is a function
		if(typeof item.onUpdate === "function") {
			// Create a closure around the span of the current action, then execute the onUpdate handler
			this.codemirror.on("update", (function(el, item) {
				return function() {
					item.onUpdate(el);
				};
			}(el, item)));
		}


		// Append the item to the status bar
		bar.appendChild(el);
	}


	// Insert the status bar into the DOM
	var cmWrapper = this.codemirror.getWrapperElement();
	cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling);
	return bar;
};
