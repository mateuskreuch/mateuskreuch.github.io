!function() {
	const _ = {
		_defaultHTML: document.getElementById('main').innerHTML,

		get(path) {
			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();
				
				xhr.onload = function() {
					if (this.status >= 200 && this.status < 300) {
						resolve(xhr.response);
					}
					else {
						reject(xhr.statusText);
					}
				}

				xhr.onerror = function() {
					reject(xhr.statusText);
				}

				xhr.open('GET', path, true);
				xhr.send();
			});
		},
		refresh() {
			let path = window.location.hash.slice(2);

			if (path) {
				_.get(path).then((response) => {
					document.getElementById('main').innerHTML = response;
				});
			}
			else {
				document.getElementById('main').innerHTML = _._defaultHTML;
			}
		}
	}

	_.refresh();

	window.onhashchange = _.refresh;
}();