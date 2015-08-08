# CloudFoundry Management Console (CFMC)

CloudFoundry Management Console (CFMC) is a web console for CloudFoundry V2.

# Requirements

* CloudFoundry Management Console requires the Java7 JDK installed locally. This project is was a branch of https://github.com/ravanrijn/styx. The project has been migrated multiple times and is now a nearly a full rewrite.

# Installation

1. Register CloudFoundry Management Console (CFMC) as client in the UAA (optional, you can also run CloudFoundry Management Console as client cf).
2. Update `application.properties` in `src/main/resources` with the base URLs to your Cloud Foundry API and UAA and the client id and client secret you used to register Styx (use client id cf and leave client secret empty to run as cf). NOTE: This will be changed in a future release, enabling the configuration via `env:` properties.
3. Create a new war using mvn clean package
4. Push CloudFoundry Management Console (CFMC) to your Cloud Foundry

## Enable UAA username feature

For some reason the Cloud Foundry API does not return user names for any operation. As a workaround you can enable an endpoint on the UAA that will return the user names.

In your BOSH deployment descriptor enable the following setting:

`````
scim:
    userids_enabled: true
````

## Toolset and used projects

- Migration to Spring Framework 4.1.1
- Migration to Angular 1.4.3
- Angular UI Router
- Migration to Angular Material Design

# Development
## Java Project
Checkout the repository and open the Java part REST interface by importing a Maven project. Dependencies should be automatically be pulled and the project should be ready to run.

### Configuration
In src/main/resources you can find the application.properties which contains endpoints for the communication with the Cloud Foundry instance:

base.api.url=https://api.X.X.X.X.xip.io/
base.uaa.url=https://uaa.X.X.X.X.xip.io/

In a future release this will be configurable via env: properties of the deployment manifest.

## Javascript Project

### Install Dependencies

We have two kinds of dependencies in this project: tools and AngularJS framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the AngularJS code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/lib` - contains the AngularJS framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
the CFMC configured the path to be `lib`. This is configured through the `.bowerrc` file.  Putting it in the app folder makes it easier to serve the files by a web server.*

### Run End-to-End Tests

To run your e2e tests your should install and configure Protractor and the Selenium WebServer.
These are already specified as npm dependencies within `package.json`. Simply run these
terminal commands:

```console
npm update
webdriver-manager update
```

Your can read more details about Protractor and e2e here: http://angular.github.io/protractor/#/
for more details on Protractor.

 1. Start your local HTTP Webserver: `live-server` or `http-server`.

```console
cd ./app; live-server;
```

> Note: since `live-server` is working on port 8080, we configure the `protractor.conf.js` to use
`baseUrl: 'http://localhost:8080'`

 2. In another tab, start a Webdriver instance:

```console
webdriver-manager start
```

>This will start up a Selenium Server and will output a bunch of info logs. Your Protractor test
will send requests to this server to control a local browser. You can see information about the
status of the server at `http://localhost:4444/wd/hub`. If you see errors, verify path in
`e2e-tests/protractor.conf.js` for `chromeDriver` and `seleniumServerJar` to your local file system.

 3. Run your e2e tests using the `test` script defined in `package.json`:

```console
npm test
```

> This uses the local **Protractor** installed at `./node_modules/protractor`

## Directory Layout

```
app/                    --> all of the source files for the application
  assets/app.css        --> default stylesheet
  src/           --> all app specific modules
     users/              --> package for user features
  index.html            --> app layout file (the main html template file of the app)
karma.conf.js         --> config file for running unit tests with Karma
e2e-tests/            --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
```

## Updating Angular

Previously we recommended that you merge in changes to angular-seed into your own fork of the
project. Now that the AngularJS framework library code and tools are acquired through package managers
(npm and bower) you can use these tools instead to update the dependencies.

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.

### Running the App during Development

For development we recommend the usage of a pre-configured local development web server.  It is a node.js tool called [http-server][http-server].  You can install http-server globally:

```
npm install -g live-server
```

Then you can start your own development web server to serve static files from a folder by running:

```
cd app
live-server --port=8001
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.

# Screenshots

![App Spaces](https://raw.github.com/jhiemer/cfc/master/app-spaces.png)
![App](https://raw.github.com/jhiemer/cfc/master/application-details.png)

# Copyright and license

CloudFoundry Management Console has been built using [Bootstrap](http://getbootstrap.com/) which has the
[Apache 2.0 license](https://github.com/twbs/bootstrap/blob/master/LICENSE)
and [AngularJS](http://angularjs.org/) which has the
[MIT license](https://github.com/angular/angular.js/blob/master/LICENSE).
