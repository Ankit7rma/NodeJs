const fs = require('fs').promises;

const path = require('path')


async function exploreDirectory( dirPath , extension= ''){


}

(async ()=>{
    const dirPath = "./"
    const extensionFilter = ".js"
    console.log(`Exploring Directories ${dirPath}`)
    await exploreDirectory(dirPath , extensionFilter)
})()