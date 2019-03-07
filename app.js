"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var podcast = require("podcast");
var STORAGE_PATH = __dirname + "/storage";
if (!fs.existsSync(STORAGE_PATH)) {
    console.log("The storage folder does not exist.");
    console.log(STORAGE_PATH);
    process.exit();
}
var tryRead = fs.readdirSync(STORAGE_PATH);
var podcastsJson = [];
var matchExtension = /\.[0-9a-z]+$/i;
var podcastList = tryRead
    .filter(function (fileName) {
    return path.parse(fileName).ext == ".json";
});
podcastList.forEach(function (podcastFileName) {
    console.log("Trying to load:" + podcastFileName);
    var podcastDirectory = STORAGE_PATH + "/"
        + path.parse(STORAGE_PATH + "/" + podcastFileName).name;
    var podDef = JSON.parse(fs.readFileSync(STORAGE_PATH + "/" + podcastFileName).toString());
    console.log(podDef.itunesCategory);
    var episodeFiles = fs.readdirSync(podcastDirectory)
        .filter(function (fileName) {
        var result = fileName.match(matchExtension);
        return result && result.length > 0 && result[0] == ".json";
    });
    var episodesDef = episodeFiles.map(function (episode) {
        var episodeName = path.parse(podcastDirectory + "/" + episode).name;
        var options = JSON.parse(fs.readFileSync(podcastDirectory + "/" + episode).toString());
        return [episodeName, options];
    });
    podDef.pubDate = new Date();
    var pder = new podcast(podDef);
    episodesDef.forEach(function (eF) {
        var episodeDetail = eF["1"];
        if (episodeDetail.enclosure.url.length === 0) {
            episodeDetail.enclosure.url = podDef.site_url + "podcast/" + eF["0"] + ".mp3";
        }
        episodeDetail.itunesAuthor = podDef.itunesAuthor;
        episodeDetail.itunesExplicit = podDef.itunesExplicit;
        pder.item(eF["1"]);
    });
    fs.writeFileSync(podcastDirectory + "/feed.xml", pder.xml());
    console.log("podcast written");
});
