var values = {};
var qs = require('querystring');
var nock = require('nock');
describe('OAuth requests', function() {
	beforeEach(function(done) {
		values = require('../init_tests')();
		values.OAuth.initialize('somekey', 'somesecret');

		values.OAuth.generateStateToken(values.express_app.req);

		var scope = nock('https://oauth.io')
			.post('/auth/access_token', {
				code: 'somecode',
				key: 'somekey',
				secret: 'somesecret'
			})
			.reply(200, {
				access_token: 'result_access_token',
				expires_in: 'someday',
				request: {},
				state: 'unique_id',
				provider: 'facebook'
			});

		values.OAuth.auth('somecode', values.express_app.req)
			.then(function(result) {
				expect(result.access_token).toBe('result_access_token');
				done();
			})
			.fail(function(error) {
				expect(error).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create() should exist', function(done) {
		expect(typeof values.OAuth.create).toBe('function');
		done();
	});

	it('OAuth.create() should return an object with the provider info + the methods get,post, patch, put and delete', function(done) {
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook')).toBe('object');
		expect(values.OAuth.create(values.express_app.req, 'facebook').access_token).toBe('result_access_token');
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook').get).toBe('function');
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook').post).toBe('function');
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook').patch).toBe('function');
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook').put).toBe('function');
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook').del).toBe('function');
		expect(typeof values.OAuth.create(values.express_app.req, 'facebook').me).toBe('function');
		done();
	});

	it('OAuth.create().get|patch|post|put|del|me() should fail with "Not authenticated for provider \'provider\'" if not authenticated', function(done) {
		values.express_app.req.session.oauth['facebook'] = undefined;
		values.OAuth.create(values.express_app.req, 'facebook')
			.get('/me')
			.fail(function(e) {
				expect(e.message).toBe('Not authenticated for provider \'facebook\'');
				done();
			});
	});

	it('OAuth.create().get() should call oauth.io to make a GET request to an API endpoint', function(done) {
		var url = '/me';
		url = encodeURIComponent(url);
		if (url[0] !== '/')
			url = '/' + url;
		url = '/request/facebook' + url;
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.get(url)
			.reply(200, {
				'name': 'User Name'
			});
		values.OAuth.create(values.express_app.req, 'facebook').get('/me')
			.then(function(r) {
				expect(r.name).toBe('User Name');
				done();
			})
			.fail(function(e) {
				expect(e).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create().post() should call oauth.io to make a POST request to an API endpoint', function(done) {
		var url = '/me/feed';
		url = encodeURIComponent(url);
		if (url[0] !== '/')
			url = '/' + url;
		url = '/request/facebook' + url;
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.post(url, {
				message: "Hello World"
			})
			.reply(200, {
				'id': 'SOMEID'
			});
		values.OAuth.create(values.express_app.req, 'facebook').post('/me/feed', {
			message: "Hello World"
		})
			.then(function(r) {
				expect(r.id).toBe('SOMEID');
				done();
			})
			.fail(function(e) {
				expect(e).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create().put() should call oauth.io to make a PUT request to an API endpoint', function(done) {
		var url = '/me/feed';
		url = encodeURIComponent(url);
		if (url[0] !== '/')
			url = '/' + url;
		url = '/request/facebook' + url;
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.put(url, {
				message: "Hello World"
			})
			.reply(200, {
				'id': 'SOMEID'
			});
		values.OAuth.create(values.express_app.req, 'facebook').put('/me/feed', {
			message: "Hello World"
		})
			.then(function(r) {
				expect(r.id).toBe('SOMEID');
				done();
			})
			.fail(function(e) {
				expect(e).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create().patch() should call oauth.io to make a PATCH request to an API endpoint', function(done) {
		var url = '/me/feed';
		url = encodeURIComponent(url);
		if (url[0] !== '/')
			url = '/' + url;
		url = '/request/facebook' + url;
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.patch(url, {
				message: "Hello World"
			})
			.reply(200, {
				'id': 'SOMEID'
			});

		values.OAuth.create(values.express_app.req, 'facebook').patch('/me/feed', {
			message: "Hello World"
		})
			.then(function(r) {
				expect(r.id).toBe('SOMEID');
				done();
			})
			.fail(function(e) {
				expect(e).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create().del() should call oauth.io to make a DELETE request to an API endpoint', function(done) {
		var url = '/me/feed';
		url = encodeURIComponent(url);
		if (url[0] !== '/')
			url = '/' + url;
		url = '/request/facebook' + url;
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.delete(url, {
				message: "Hello World"
			})
			.reply(200, {
				'id': 'SOMEID'
			});

		values.OAuth.create(values.express_app.req, 'facebook').del('/me/feed', {
			message: "Hello World"
		})
			.then(function(r) {
				expect(r.id).toBe('SOMEID');
				done();
			})
			.fail(function(e) {
				expect(e).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create().me() should call a GET on oauthd/auth/me to get user info', function (done) {
		var url = '/auth/facebook/me';
		url = encodeURIComponent(url);
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.get('/auth/facebook/me')
			.reply(200, {
				'firstname': 'Archibald'
			});

		values.OAuth.create(values.express_app.req, 'facebook').me()
		.then(function (r) {
			expect(r.firstname).toBe('Archibald');
			done();
		})
		.fail(function (e) {
			expect(e).not.toBeDefined();
			done();
		});
	});

	it('OAuth.create().me(filter) should call a GET on oauthd/auth/me?filter to get user info', function(done) {

		var url = '/auth/facebook/me?' + qs.stringify({
			filter: 'firstname,lastname'
		});
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.get(url)
			.reply(200, {
				'firstname': 'Archibald',
				'lastname': 'De la Testitude',
			});

		values.OAuth.create(values.express_app.req, 'facebook').me(['firstname', 'lastname'])
			.then(function(r) {
				expect(r.firstname).toBe('Archibald');
				expect(r.lastname).toBe('De la Testitude');
				done();
			})
			.fail(function(e) {
				expect(e).not.toBeDefined();
				done();
			});
	});

	it('OAuth.create().me() should be able to handle an 501 error when a provider\'s me is not implemented', function (done) {
		var url = '/auth/facebook/me';
		url = encodeURIComponent(url);
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.get('/auth/facebook/me')
			.reply(501, 'Returned provider name does not match asked provider');

		values.OAuth.create(values.express_app.req, 'facebook').me()
		.then(function (r) {
			expect(r).not.toBeDefined();
			done();
		})
		.fail(function (e) {
			expect(e.message).toBe('Returned provider name does not match asked provider');
			done();
		});
	});

	it('OAuth.create().me() should be able to handle any other error with a standard message', function (done) {
		var url = '/auth/facebook/me';
		url = encodeURIComponent(url);
		var scope = nock('https://oauth.io')
			.matchHeader('oauthio', qs.stringify({
				k: 'somekey',
				access_token: 'result_access_token'
			}))
			.get('/auth/facebook/me')
			.reply(500, 'Returned provider name does not match asked provider');

		values.OAuth.create(values.express_app.req, 'facebook').me()
		.then(function (r) {
			expect(r).not.toBeDefined();
			done();
		})
		.fail(function (e) {
			expect(e.message).toBe('An error occured while retrieving the user\'s information');
			done();
		});
	});

});