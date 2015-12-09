# Cloud Foundry Management Console
Cloud Foundry Management Console (CFMC) is an Opensource (OSS) web based framework to manage applications, users, domains and routes.

## Description

--TODO-- Screenshot Space Landing Page

## Features

# Installation

You have the possibility to install CFMC on your local machine or directly in your CF Environment. We guide you through both ways in the two sub sections.

For both installation you should download the CFMC repository.

## Running local

We ran our development environment in a Spring Tool Suite (STS -  [link](https://spring.io/tools/sts "Spring Tool Suite Website"))



### Backend

For an easy setup we recommend to download this Suite and ran the backend in it. Follow these steps to set it up:

1. Download STS ([link](https://spring.io/tools/sts "Spring Tool Suite Website"))
2. Install STS
3. Open STS and select "Import" from the menu.
4. Select "Import Existing Maven Project"
5. Navigate to the downloaded repository and import it by selection the project pom.xml file
6. Right click on the imported project an "Run as --> Spring Boot App"
7. Now you should reach our backend API local at http://localhost:8080/api

### Frontend

We used the live-server ([link](https://github.com/tapio/live-server )) with npm to run the local webserver. We assume you have installed nodejs and its package manager npm

1. Navigate to the frontend folder with a terminal
2. Install live-server with npm with the command "*npm install live-server*"
3. Start the live-server with "*live-server --port=8000*"" (We use port 8000 because the default port 8080 is used by our backend)
4. Now a new browser window should appear with the running webserver

## Running on Cloud Foundry

### Backend

### Frontend

# Usage

## Application Management

### List applications

### Details of applications

### Manage Applications

# Planned Features

* Animate transitions

# Development



# Issues

# Contact information
This software is currently developed and maintained by evoila GmbH, from Tobias Siegel, Johannes Hiemer and Christian Müller.
