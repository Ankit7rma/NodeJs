#!/usr/bin/env node;

// Node.js script that recursively explores a directory and its subdirectories, 
// listing files (optionally filtered by extension) and directories, along with their details like size and type.


const fs = require('fs').promises;

const path = require('path')

const program = require("commander")


async function exploreDirectory( dirPath , extension= ''){
   try {
    const absolutePath = path.resolve(dirPath)
    
    const items =await fs.readdir(dirPath,{withFileTypes: true})

    for (const item of items){
        const fullPath = path.join(dirPath,item.name)
        const stats = await fs.stat(fullPath)
        const type = stats.isDirectory() ? "directory" : "file";


        if(type === "file" && (extension==="" || path.extname(item.name) === extension )){
            console.log(`File:${fullPath}, size:${stats.size} bytes, Type:${type}`)
        }else if(type === "directory"){
            console.log(`Directory :${fullPath}, Type:${type}`)
            await exploreDirectory(fullPath,extension)
        }
 
    }

   } catch (error) {
     console.log(`Error Reading ${dirPath} : ${error.message}`)
   }

}

// (async ()=>{
//     const dirPath = "./"
//     const extensionFilter = ".js"
//     console.log(`Exploring Directories ${dirPath}`)
//     await exploreDirectory(dirPath , extensionFilter)

// })()

// CLI Commander
program
  .version('1.0.0','-v, --version')
  .description('File System Explorer to list files and directories')
  .option('-p, --path <path>', 'Directory path to explore', './')
  .option('-e, --ext <extension>', 'Filter files by extension (e.g., .js)', '')
  .action(async (options) => {
    const { path: dirPath, ext } = options;
    console.log(`Exploring directory: ${dirPath} ${ext ? `with extension ${ext}` : ''}`);
    await exploreDirectory(dirPath, ext);
  });

  // Parse command-line arguments
program.parse(process.argv);