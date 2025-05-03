
const fs = require('fs/promises')

console.time('Start')

async function writeFile(){

    const filehandler =await fs.open('test.txt','w')
    await filehandler.writeFile("Ankit")
    await filehandler.close(); 

}
writeFile()
  .then(() => console.timeEnd("Start"))
  .catch(console.error);
console.timeEnd("Start")
