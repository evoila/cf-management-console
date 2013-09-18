class UrlMappings {

	static mappings = {
        "/"(controller: "api") {
            action = [GET: "root"]
        }
        "/api/access_token"(controller: "accessToken") {
            action = [POST: "authenticate"]
        }
        "/api/apps/$id"(controller: "application") {
            action = [GET: "getApplication"]
        }
        "500"(view:'/error')
	}
}
