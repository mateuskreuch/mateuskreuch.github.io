(function() {
	// http module ------------------------------------------------------------//
	const http = {
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
		}
	}

	// routing ----------------------------------------------------------------//
	{
		let root = document.getElementById('root');
		
		function refresh() {
			let path = window.location.hash.replace(/(\/#\/|#\/|#)/, 'routes/');

			if (!path) {
				path = 'routes';
			}

			if (path) {
				http.get(path).then((response) => {
					root.innerHTML = response;
					root.style.opacity = 1;
				},
				(error) => {
					root.innerHTML = error;
					root.style.opacity = 1;
				});
			}
		}

		refresh();

		window.onhashchange = refresh;
	}
})();