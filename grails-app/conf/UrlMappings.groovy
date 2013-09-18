class UrlMappings {

	static mappings = {
        "/api"(controller: "root") {
            action = [GET: "root"]
        }
        "/api/$id"(controller: "root") {
            action = [GET: "root"]
        }
        "/api/access_token"(controller: "accessToken") {
            action = [POST: "authenticate"]
        }
        "/api/apps/$id"(controller: "application") {
            action = [GET: "getApplication"]
        }
        "500"(view:'/error')
        "404"(view:'/missing')
	}
}
