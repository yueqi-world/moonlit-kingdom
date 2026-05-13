function repairKingdomData(data) {
  if (typeof data.population !== "number") data.population = 1000;
  if (typeof data.food !== "number") data.food = 500;
  if (typeof data.gold !== "number") data.gold = 200;
  if (typeof data.soldiers !== "number") data.soldiers = 80;
  if (typeof data.morale !== "number") data.morale = 70;
  if (typeof data.lastLogin !== "number") data.lastLogin = Date.now();
  if (!data.report) data.report = "王国初建，宫廷书记官已开始记录第一日的政务。";

  return data;
}function createKingdom() {
  const name = document.getElementById("kingdomName").value.trim();
  const identity = document.getElementById("identity").value;

  if (!name) {
    alert("请先为你的王国命名。");
    return;
  }

  const now = Date.now();

  const kingdomData = {
    name: name,
    identity: identity,
    day: 1,
    population: 1000,
    food: 500,
    gold: 200,
    soldiers: 80,
    morale: 70,
    lastLogin: now,
    report: "王国初建，宫廷书记官已开始记录第一日的政务。"
  };

  localStorage.setItem("moonlitKingdom", JSON.stringify(kingdomData));
  showKingdom(kingdomData, null);
}

function updateKingdomByOfflineTime(data) {
  const now = Date.now();
  const lastLogin = data.lastLogin || now;
  const hoursAway = Math.floor((now - lastLogin) / (1000 * 60 * 60));

  if (hoursAway <= 0) {
    data.report = "王国仍保持安静。宫廷书记官暂未送来新的报告。";
    const summaryParts = [];

summaryParts.push(`你离开了 ${hoursAway} 小时。`);
summaryParts.push(`粮仓减少了 ${foodLoss} 单位。`);

if (moraleChange < 0) {
  summaryParts.push("民心轻微下降。");
}

if (populationChange > 0) {
  summaryParts.push("人口略有增加。");
}

if (populationChange < 0) {
  summaryParts.push("人口略有流失。");
}

if (!data.logs) {
  data.logs = [];
}

data.logs.unshift({
  day: data.day,
  summary: summaryParts.join(" "),
  report: data.report
});

data.logs = data.logs.slice(0, 10);

data.lastLogin = now;

return {
  data: data,
  hoursAway: hoursAway,
  changes: {
    foodLoss: foodLoss,
    moraleChange: moraleChange,
    populationChange: populationChange
  }
};

  const foodLoss = Math.max(1, Math.floor(hoursAway * (data.population / 1000) * 4));
  data.food = Math.max(0, data.food - foodLoss);

  let moraleChange = 0;
  let populationChange = 0;

  if (data.food < 200) {
    moraleChange = -2;
    populationChange = -1;
  } else if (data.food > 400 && data.morale >= 70) {
    populationChange = 1;
  }

  data.morale = Math.max(0, Math.min(100, data.morale + moraleChange));
  data.population = Math.max(100, data.population + populationChange);

  data.day = data.day + Math.max(1, Math.floor(hoursAway / 12));

  data.report = generateKingdomReport(data);

  data.lastLogin = now;

  return {
    data: data,
    hoursAway: hoursAway,
    changes: {
      foodLoss: foodLoss,
      moraleChange: moraleChange,
      populationChange: populationChange
    }
  };
}

function generateKingdomReport(data) {
  const reports = [
    "北境商队回报，邻国边境有骑兵调动的传闻。宫廷书记官建议继续观察，不宜贸然扩军。",
    "王都粮价轻微上涨，市场官员请求重新核对粮仓储量。",
    "港口商队带回南方王国的问候。信件措辞温和，但未提及具体盟约。",
    "夜里有雾从城墙外漫入，守卫回报边境道路暂时平静。",
    "宫廷书记官提醒：粮仓储量仍是近日最需要留意的事项。",
    "王都街市秩序稳定，但民众开始讨论今年的收成。",
    "边境驿站送来短报：邻国使者队伍曾在远处停留，随后转向东路离开。"
  ];

  if (data.food < 150) {
    return "粮仓储量偏低。王都粮价上涨，民心开始出现轻微不安。";
  }

  if (data.morale < 50) {
    return "宫廷书记官报告：民心不稳，王都需要一个明确的安抚措施。";
  }

  const index = Math.floor(Math.random() * reports.length);
  return reports[index];
}

function showKingdom(data, updateResult) {
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("kingdom").classList.remove("hidden");

  document.getElementById("displayName").textContent = data.name + "王国";
  document.getElementById("displayIdentity").textContent = data.identity;
  document.getElementById("day").textContent = data.day;

  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2 id="displayName">${data.name}王国</h2>
    <p>第 <span id="day">${data.day}</span> 日</p>
    <p>━━━━━━━━━━━━</p>

    <p>统治者：<span id="displayIdentity">${data.identity}</span></p>
    <p>人口：${data.population}</p>
    <p>粮食：${data.food}</p>
    <p>黄金：${data.gold}</p>
    <p>士兵：${data.soldiers}</p>
    <p>民心：${data.morale}</p>

    <p>天气：月色清冷</p>

    ${renderOfflineSummary(updateResult)}

    <p>王国报告：</p>
    <p>${data.report}</p>

<p><a href="#" onclick="showUnavailable('王宫事务')">王宫事务</a></p>
<p><a href="#" onclick="showUnavailable('粮仓')">粮仓</a></p>
<p><a href="#" onclick="showUnavailable('边境')">边境</a></p>
<p><a href="#" onclick="showLog()">王国日志</a></p>
  `;
}

function renderOfflineSummary(updateResult) {
  if (!updateResult || updateResult.hoursAway === 0) {
    return `
      <p>你刚刚登入王国。</p>
    `;
  }

  const changes = updateResult.changes;

  let text = `
    <p>你离开了 ${updateResult.hoursAway} 小时。</p>
    <p>粮仓减少了 ${changes.foodLoss} 单位。</p>
  `;

  if (changes.moraleChange < 0) {
    text += `<p>民心轻微下降。</p>`;
  }

  if (changes.populationChange > 0) {
    text += `<p>人口略有增加。</p>`;
  }

  if (changes.populationChange < 0) {
    text += `<p>人口略有流失。</p>`;
  }

  return text;
}

window.onload = function () {
  const saved = localStorage.getItem("moonlitKingdom");

  if (saved) {
   const data = repairKingdomData(JSON.parse(saved));
    const updateResult = updateKingdomByOfflineTime(data);
    localStorage.setItem("moonlitKingdom", JSON.stringify(updateResult.data));
    showKingdom(updateResult.data, updateResult);
  }
};function showUnavailable(placeName) {
  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>${placeName}</h2>
    <p>━━━━━━━━━━━━</p>

    <p>此处尚未开放。</p>
    <p>宫廷书记官仍在整理相关文书。</p>

    <p><a href="#" onclick="returnToKingdom()">返回王国</a></p>
  `;
}

function showLog() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));
  const logs = data.logs || [];

  const logText = logs.length
    ? logs.map(item => `
        <p>第 ${item.day} 日</p>
        <p>${item.summary}</p>
        <p>王国报告：</p>
        <p>${item.report}</p>
        <p>────────────</p>
      `).join("")
    : "<p>王国日志尚未留下记录。</p>";

  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>王国日志</h2>
    <p>━━━━━━━━━━━━</p>

    ${logText}

    <p><a href="#" onclick="returnToKingdom()">返回王国</a></p>
  `;
}

function returnToKingdom() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));
  showKingdom(data, null);
}
