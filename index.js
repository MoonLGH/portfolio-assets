const puppeteer = require('puppeteer');
const fs = require('fs');
const { load } = require('cheerio');

const dataPath = './data.json';
const outputPath = './output/';

// Read data from the JSON file
const rawData = fs.readFileSync(dataPath);
const data = JSON.parse(rawData);

async function takeScreenshot(path, screenshotPath) {
  const browser = await puppeteer.launch({headless:"false"});
  const page = await browser.newPage();
  console.log(path)
  await page.goto(path,{waitUntil:"networkidle0"});

  await page.setViewport({
    width: 1366,
    height: 768
  });
  await page.waitForTimeout(5000); // Wait for 5 seconds after page load
  await page.screenshot({ path: screenshotPath+".png" });
  await browser.close();
}

async function processProjects(projects) {
  for (let project of projects) {
    if(project.node) return
    const {screenshoot, path} = project;
    let filename = path.split('/').pop();
    let outputPathname = outputPath + filename;
    if (screenshoot === true) {
      await takeScreenshot(path, outputPathname);
      project.url = project.path;
      project.path = `./${filename}.png`;
    } else {
      fs.copyFileSync(path, outputPathname);
      project.path = `./${filename}`;
    }
  }
}

async function main() {
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true });
  }
  fs.mkdirSync(outputPath);

  await processProjects(data.projects);
  await processProjects(data['fcc-front-end']);

  await getLinkedInPfp(data.pfp);
  // Write the modified data to the output file
  const outputData = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath + 'data.json', outputData);
}


async function getLinkedInPfp(input){
  let inputName = input.split("/").pop()
  fs.copyFileSync(input, outputPath+inputName);
  data["pfp"] = outputPath+inputName
}

main();
