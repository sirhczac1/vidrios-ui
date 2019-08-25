export function configureFakeBackend() {
	let users = [{id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User'}];
	let realFetch = window.fetch;

	window.fetch = function (url, opts) {
		const isLoggedIn = opts.headers['Authorization'] === 'Bearer fake-jwt-token';

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
					const params = JSON.parse(opts.body);
					const user = users.find(x => x.username === params.username && x.password === params.password);

					if (!user) {
						return error ('El usuario es incorrecto');
					}

					return ok({
						id: user.id,
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						tocken: 'fake-jwt-token'
					});
				}

				if (url.endsWith('/users') && opts.method === 'GET') {
					return !isLoggedIn ? unauthorised() : ok(users); 
				}

				realFetch(url, opts).then(response => resolve(resolve));

				function ok(body) {
					resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
				}

				function unauthorised() {
					resolve({status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorised' })) });
				}

        function error(message) {
        	resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
        }
			}, 500);
		});
	}
}