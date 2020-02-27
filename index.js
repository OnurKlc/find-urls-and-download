'use strict';
const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');

Fs.readFile(__dirname + '/emoji.scss', async (err, res) => {
  if (err) console.log(err);
  let content = res.toString();
  let regEx = new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?', "g");
  let array = content.match(regEx);
  Fs.mkdirSync(__dirname + '/downloadedFiles', {recursive: true})
  array.map(item => {
    downloadImage(item)
  });
});


let count = 0;
async function downloadImage (url, fileName) {
  let extension;
  if (fileName === undefined) {
    fileName = count++;
    fileName = fileName.toString();
    let lastDotIndex;
    for (let i = url.length; i > 0; i--) {
      if (url[i] === ".") {
        lastDotIndex = i;
        break;
      }
    }
    extension = url.substr(lastDotIndex);
    fileName = fileName + extension;
  }

  const path = Path.resolve(__dirname, 'downloadedFiles', fileName);

  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject)
  })
}

