
SimpleMDE.prototype.autosave = function() {
	if(isLocalStorageAvailable()) {
		var simplemde = this;

		if(this.options.autosave.uniqueId == undefined || this.options.autosave.uniqueId == "") {
			console.log("SimpleMDE: You must set a uniqueId to use the autosave feature");
			return;
		}

		if(simplemde.element.form != null && simplemde.element.form != undefined) {
			simplemde.element.form.addEventListener("submit", function() {
				localStorage.removeItem("smde_" + simplemde.options.autosave.uniqueId);
			});
		}

		if(this.options.autosave.loaded !== true) {
			if(typeof localStorage.getItem("smde_" + this.options.autosave.uniqueId) == "string" && localStorage.getItem("smde_" + this.options.autosave.uniqueId) != "") {
				this.codemirror.setValue(localStorage.getItem("smde_" + this.options.autosave.uniqueId));
				this.options.autosave.foundSavedValue = true;
			}

			this.options.autosave.loaded = true;
		}

		localStorage.setItem("smde_" + this.options.autosave.uniqueId, simplemde.value());

		var el = document.getElementById("autosaved");
		if(el != null && el != undefined && el != "") {
			var d = new Date();
			var hh = d.getHours();
			var m = d.getMinutes();
			var dd = "am";
			var h = hh;
			if(h >= 12) {
				h = hh - 12;
				dd = "pm";
			}
			if(h == 0) {
				h = 12;
			}
			m = m < 10 ? "0" + m : m;

			el.innerHTML = "Autosaved: " + h + ":" + m + " " + dd;
		}

		this.autosaveTimeoutId = setTimeout(function() {
			simplemde.autosave();
		}, this.options.autosave.delay || 10000);
	} else {
		console.log("SimpleMDE: localStorage not available, cannot autosave");
	}
};

SimpleMDE.prototype.clearAutosavedValue = function() {
	if(isLocalStorageAvailable()) {
		if(this.options.autosave == undefined || this.options.autosave.uniqueId == undefined || this.options.autosave.uniqueId == "") {
			console.log("SimpleMDE: You must set a uniqueId to clear the autosave value");
			return;
		}

		localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
	} else {
		console.log("SimpleMDE: localStorage not available, cannot autosave");
	}
};

// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem throw QuotaExceededError. We're going to detect this and set a variable accordingly.
function isLocalStorageAvailable() {
	if(typeof localStorage === "object") {
		try {
			localStorage.setItem("smde_localStorage", 1);
			localStorage.removeItem("smde_localStorage");
		} catch(e) {
			return false;
		}
	} else {
		return false;
	}

	return true;
}
