(function() {
	// custom elements --------------------------------------------------------//
	{
		const codeRegex = new RegExp(
			'('						+
				'\'.*?\'|'			+ // '' strings
				'".*?"|'				+ // "" strings
				'\\btrue\\b|'		+
				'\\bfalse\\b|'		+
				'\\b\\d+\\b|'		+ // numbers
				'\\B[@]\\B'			+ // the @ character
			')|'						+
			'(?<=\\w[.])(\\w+)|'	+ // fields
			'('						+
				'\\bfunction\\b|'	+
				'\\bgoto\\b|'		+
				'\\blabel\\b|'		+
				'\\bvar\\b|'		+
				'\\bif\\b|'			+
				'\\belse\\b|'		+
				'\\bthen\\b|'		+
				'\\bfor\\b|'		+
				'\\band\\b|'		+
				'\\bor\\b|'			+
				'\\breturn\\b|'	+
				'\\bend\\b|'		+
				'\\B[+]\\B|'		+
				'\\B[-]\\B|'		+
				'\\B[/]\\B|'		+
				'\\B[*]\\B|'		+
				'\\bclass\\b'		+
			')|'						+
			'(#.+)',				  // comment lines
			'g'
		);

		const codeFunction = function(_, p1, p2, p3, p4) {
			if      (p1) { return '<span class="code-data-type">' + p1 + '</span>'; }
			else if (p2) { return '<span class="code-field">' + p2 + '</span>'; }
			else if (p3) { return '<span class="code-keyword">' + p3 + '</span>'; }
			else if (p4) { return '<span class="code-comment">' + p4 + '</span>'; }
		}
			
		class CodeViewer extends HTMLElement {
			connectedCallback() {
				let code = this.textContent.replace(/^\s*?\n|\n.+$/g, '')
													.replace(/\t/g, '   ');
				
				try {
					// remove extra indentation
					code = code.replace(
						new RegExp(
							'^ {' + 
								Math.min(...code.match(/^ +/gm).map(({length}) => length)) + 
							'}',
							'gm'
						),
						''
					);

					this.classList.add('box');
				}
				catch {}
				
				this.innerHTML = code.replace(codeRegex, codeFunction);
			}
		}

		customElements.define('code-viewer', CodeViewer);
	}

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
						reject(xhr.status);
					}
				}

				xhr.onerror = function() {
					reject(xhr.status);
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
					http.get('routes/' + error + '.html').then((response) => {
						root.innerHTML = response;
						root.style.opacity = 1;
					});
				});
			}
		}

		refresh();

		window.onhashchange = refresh;
	}
})();