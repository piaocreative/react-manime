const { parse, stringify } = require('envfile')
const fs = require ('fs')
const { format } = require( 'date-fns');
const { string } = require('prop-types');

let raw = ""

fs.readFile('./.env', function (err, data) {
    if (err) {
       throw err
    }
    raw = data.toString()
    console.log("Reading .env" );

    let parsed = parse(raw);
    let label = parsed.RELEASE_LABEL
    let release = parsed.RELEASE
    let nowYear = format(new Date(), "yyyy")
    let build = 1
    if(!label)
        label = "DEV"
    if(!release){
        release = `${label}-RC${nowYear}.1`

    parsed.RELEASE_LABEL=label
    }else{
        let match = release.match(/(\d{4}).(\d*)/)
        let parsedYear = match[1]
        let parsedBuild = match[2]
        if(parsedYear === nowYear){
            build = parseInt(parsedBuild) + 1
        }
    }
    // format is $LABEL-RC$year.$buildNUmber

    parsed.RELEASE= `${label}-RC${nowYear}.${build}`
    fs.writeFile('./.env', stringify(parsed), (err, data)=>{
        
        if(err){
            throw err
        }else{
            console.log("Updating .env")
        }
    })
 });


