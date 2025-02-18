const fs = require("fs");
const path = require("path");

const runelitePath = path.join("C:", "Users", "windows_username", ".runelite");
const username = "Zezima";
const deathsPath = path.join(runelitePath, "screenshots", username, "Deaths");
const chestLootPath = path.join(runelitePath, "screenshots", username, "Chest Loot");

function getFiles(directory) {
  return fs.readdirSync(directory);
}

function fileToTimestamp(filename) {
  const re = /.* (\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}).*\.png/;
  const match = filename.match(re);
  return { ts: match ? match[1] : "UNKNOWN", fp: filename };
}

function timeStringToDate(obj) {
  const formatted = obj.ts.replace("_", " ");
  const [dateStr, timeStr] = formatted.split(" ");
  const date = Date.parse(`${dateStr} ${timeStr.replace(/-/g, ":")} EST`);
  return { ...obj, date, readable: new Date(date).toLocaleString() };
}

function compareLootToDeath() {
  const cgLootStamps = getFiles(chestLootPath).map(fileToTimestamp).map(timeStringToDate);
  const deathStamps = getFiles(deathsPath).map(fileToTimestamp).map(timeStringToDate);

  const deaths = [];
  const wins = [];

  cgLootStamps.forEach((loot) => {
    const closeDeath = deathStamps.find((death) => {
      const diffMinutes = Math.abs(loot.date - death.date) / 1000 / 60;
      return diffMinutes < 6 && death.date < loot.date;
    });

    if (closeDeath) {
      deaths.push({ ...closeDeath, type: "death" });
    } else {
      wins.push({ ...loot, type: "win" });
    }
  });

  return { deaths, wins };
}

function saveResultsToFile(results) {
  const allResults = [...results.deaths, ...results.wins];
  const content = [
    "type, date",
    ...allResults.map((r) => `${r.type}, ${r.readable.replace(",", "")}`)
  ].join("\n");

  fs.writeFile("./results.csv", content, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Results saved to results.csv");
    }
  });
}

const results = compareLootToDeath();
saveResultsToFile(results);
console.log(`Wins: ${results.wins.length}, Losses: ${results.deaths.length}`);
