<!doctype html>
<html lang="en" ng-app="styx">

<head>
    <meta charset="UTF-8"/>
    <title>Cloudfoundry dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${resource(dir: 'css', file: 'bootstrap.min.css')}" rel="stylesheet" media="screen">
    <link href="${resource(dir: 'css', file: 'styx.css')}" rel="stylesheet" media="screen">
    <link rel="icon"
          type="image/png"
          href="${resource(dir: 'img', file: 'favicon.ico')}">
</head>

<body ng-controller="StyxController">

<div>
    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand">CLOUD FOUNDRY</a>
            </div>

            <div ng-show="root">
                <ul class="nav navbar-nav navbar-left">
                    <li ng-show="root"><a href="#/org/{{root.selectedOrganization.id}}">Dashboard</a></li>
                    <li ng-show="root"><a href="#/admin" ng-show="isInRole(root.user, 'EINDBAAS')">Administration</a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><a>Welcome, <strong>{{root.user.username}}</strong></a></li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown"><span
                                class="glyphicon glyphicon-cog"></span><b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a ng-click="logout()">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</div>

<div class="container" ng-hide="!status">
    <div class="row">
        <div ng-class="['alert', (status.code === 200) ? 'alert-success' : 'alert-danger']">
            {{status.message}}
            <div class="pull-right">
                <a ng-click="clearStatus()">Clear <span class="glyphicon glyphicon-remove"></span></a>
            </div>
        </div>
    </div>
</div>

<div ng-hide="loading">
    <div ng-view></div>
</div>

<div>
    <nav class="navbar navbar-default navbar-fixed-bottom" role="navigation">
        <div class="container">
            <ul class="nav navbar-nav" ng-show="root">
                <li class="navbar-text">"<span>{{root.chuckQuote}}</span>"</li>
            </ul>
        </div>
    </nav>
</div>

<script src="${resource(dir: 'js', file: 'angular.js')}"></script>
<script src="${resource(dir: 'js', file: 'angular-local-storage-service.js')}"></script>
<script src="${resource(dir: 'js', file: 'spin.js')}"></script>
<script src="${resource(dir: 'js', file: 'angular-spin.js')}"></script>
<script src="${resource(dir: 'js', file: 'ui-bootstrap-0.6.0-SNAPSHOT.min.js')}"></script>
<script src="${resource(dir: 'js', file: 'ui-bootstrap-tpls-0.6.0-SNAPSHOT.min.js')}"></script>
<script src="${resource(dir: 'js', file: 'jquery-2.0.3.js')}"></script>
<script src="${resource(dir: 'js', file: 'styx-controllers.js')}"></script>
<script src="${resource(dir: 'js', file: 'styx-services.js')}"></script>
<script src="${resource(dir: 'js', file: 'styx.js')}"></script>
<script src="${resource(dir: 'js', file: 'bootstrap.min.js')}"></script>
</body>

</html>