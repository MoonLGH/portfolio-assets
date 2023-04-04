const puppeteer = require('puppeteer');
const fs = require('fs');

const dataPath = './data.json';
const outputPath = './output/';

// Read data from the JSON file
const rawData = fs.readFileSync(dataPath);
const data = JSON.parse(rawData);

async function takeScreenshot(path, screenshotPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(path);
  await page.screenshot({ path: screenshotPath+".png" });
  await browser.close();
}

async function processProjects(projects) {
  for (let project of projects) {
    const {screenshoot, path} = project;
    let filename = path.split('/').pop();
    let outputPathname = outputPath + filename;
    if (screenshoot === true) {
      await takeScreenshot(path, outputPathname);
    } else {
      fs.copyFileSync(path, outputPathname);
    }
    project.path = `./${filename}`;
  }
}

async function main() {
  await processProjects(data.projects);

  // Write the modified data to the output file
  const outputData = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath + 'data.json', outputData);
}

main();
