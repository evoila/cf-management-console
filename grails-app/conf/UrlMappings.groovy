class UrlMappings {

	static mappings = {
        "/"(controller: "api") {
            action = [GET: "root"]
        }
        "/api/access_token"(controller: "accessToken") {
            action = [POST: "authenticate"]
        }
        "500"(view:'/error')
	}
}
