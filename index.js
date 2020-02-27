'use strict';
const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');

Fs.readFile(__dirname + '/' + process.argv[2], async (err, res) => {
  if (err) console.log(err);
  let content = res.toString();
  let regEx = new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?', "g");
  let array = content.match(regEx);
  Fs.mkdirSync(__dirname + '/downloadedFiles', {recursive: true})
  array.map(item => {
    downloadImage(item)
  });
});


async function downloadImage (url, fileName) {
  if (fileName === undefined) {
    let lastDotIndex;
    for (let i = url.length; i > 0; i--) {
      if (url[i] === "/") {
        lastDotIndex = i;
        break;
      }
    }
    fileName = url.substr(lastDotIndex + 1);
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

