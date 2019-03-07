
# d12Feed

This is a tool I have written for my podcast in order to configure and publish podcast feed based on podcast and episode definition written in JSON files. The tools is written in Typescript and uses [maxnowack/node-podcast](https://github.com/maxnowack/node-podcast) for feed generation.

## Configuration

Script checks ./storage/ folder for JSON files, and upon finding them checks the folder with the same name as the JSON file. The second set of JSON's are used as the episode definitions for the mp3 files with the same name. Sample configurations are provided. Folder structure should look like this:

./app.ts
....
./storage/podcastName.json
./storage/podcastName/
....
./storage/podcastName/ep0.json
./storage/podcastName/ep0.mp3

If no url is provided in the url field of the episode.json, a url is generated using the podcast.json's site url. The pattern should be adjusted as necessary.

## Usage

A transpiled js file (./app.js) is present within the repository. You just need to have [nodeJS](https://nodejs.org/) installed as the runtime environment. After that running `npm install` will install dependencies, and `npm start` will execute the script.

## Altering the script

The script is written in Typescript, and need transpiling to be able to executed by nodeJS. Having typescript installed should suffice for transpiling after making changes to the script(./app.ts). Another option is to change the JS file in which case no transpilation is needed.

This shortcut transpiles the Typescript file: `npm run build`
