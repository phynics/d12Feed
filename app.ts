import * as fs from "fs";
import * as path from "path";
import * as podcast from "podcast";

const STORAGE_PATH: string = __dirname + "/storage";

if (!fs.existsSync(STORAGE_PATH)) {
    console.log("The storage folder does not exist.");
    console.log(STORAGE_PATH);
    process.exit();
}

const tryRead = fs.readdirSync(STORAGE_PATH);

let podcastsJson: string[] = [];
const matchExtension = /\.[0-9a-z]+$/i;
const podcastList = tryRead
    .filter(fileName => {
        return path.parse(fileName).ext == ".json";
    })

podcastList.forEach(podcastFileName => {
    console.log("Trying to load:" + podcastFileName);
    const podcastDirectory = STORAGE_PATH + "/"
        + path.parse(STORAGE_PATH + "/" + podcastFileName).name;

    const podDef = JSON.parse(fs.readFileSync(STORAGE_PATH + "/" + podcastFileName).toString()) as IFeedOptions;
    console.log(podDef.itunesCategory);
    const episodeFiles = fs.readdirSync(podcastDirectory)
        .filter(fileName => {
            const result = fileName.match(matchExtension);
            return result && result.length > 0 && result[0] == ".json";
        });

    const episodesDef: [string, IItemOptions][] = episodeFiles.map(episode => {
        let episodeName = path.parse(podcastDirectory + "/" + episode).name;
        let options = JSON.parse(
            fs.readFileSync(podcastDirectory + "/" + episode).toString()
        ) as IItemOptions;
        return [episodeName, options] as [string, IItemOptions];
    });
    
    podDef.pubDate = new Date();

    let pder = new podcast(podDef);
    
    episodesDef.forEach(eF => {
        let episodeDetail = eF["1"];
        if(episodeDetail.enclosure.url.length === 0) {
            episodeDetail.enclosure.url = podDef.site_url + "podcast/" + eF["0"] + ".mp3";
        }
        episodeDetail.itunesAuthor = podDef.itunesAuthor;
        episodeDetail.itunesExplicit = podDef.itunesExplicit;
        pder.item(eF["1"]);
    });

    fs.writeFileSync(podcastDirectory + "/feed.xml", pder.xml());
    console.log("podcast written");
});