class UrlMappings {

	static mappings = {
//        "/$controller/$action?/$id?(.${format})?"{
//            constraints {
//                // apply constraints here
//            }
//        }

        "/"(controller: "api", action: "root")
        "500"(view:'/error')
	}
}
