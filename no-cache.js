
var fs = require('fs');
var path = require('path');
var replaceFile = require('replace-in-file');
var package = require("./package.json");
var angular = require("./angular.json");
var buildVersion = package.version;
var buildPath = '/dist';
var defaultProject = angular.defaultProject;
var appendUrl = '?v=' + buildVersion;

const getNestedObject = (nestedObj, pathArr) => {
	return pathArr.reduce((obj, key) =>
		(obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

const relativePath = getNestedObject(angular, ['projects',defaultProject,'architect','build','options','outputPath']); // relative build path
// buildPath += relativePath.replace(/[/]/g, '\\');
var indexPath = __dirname + buildPath + '/' + 'index.html';


var data = fs.readFileSync(indexPath); //read existing contents into data
var fd = fs.openSync(indexPath, 'w+');
var buffer = new Buffer.from(`<?php
header("Cache-Control: no-cache, must-revalidate"); //HTTP 1.1
header("Pragma: no-cache"); //HTTP 1.0
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>
`, "utf-8");

fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
// or fs.appendFile(fd, data);
fs.renameSync(indexPath, __dirname + buildPath + '/' + 'index.php');