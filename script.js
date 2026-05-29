function repairKingdomData(data) {
  if (!data || typeof data !== "object") data = {};

  if (typeof data.name !== "string") data.name = "月光";
  if (typeof data.identity !== "string") data.identity = "女王";
  if (typeof data.day !== "number") data.day = 1;
  if (typeof data.population !== "number") data.population = 1000;
  if (typeof data.food !== "number") data.food = 500;
  if (typeof data.gold !== "number") data.gold = 200;
  if (typeof data.soldiers !== "number") data.soldiers = 80;
  if (typeof data.morale !== "number") data.morale = 70;
  if (typeof data.lastLogin !== "number") data.lastLogin = Date.now();
  if (!data.report) data.report = "王国初建，宫廷书记官已开始记录第一日的政务。";
  if (!Array.isArray(data.logs)) data.logs = [];

  return data;
}

function createKingdom() {
  const nameInput = document.getElementById("kingdomName");
  const identityInput = document.getElementById("identity");

  const name = nameInput.value.trim();
  const identity = identityInput.value;

  if (!name) {
    alert("请先为你的王国命名。");
    return;
  }

  const kingdomData = {
    name: name,
    identity: identity,
    day: 1,
    population: 1000,
    food: 500,
    gold: 200,
    soldiers: 80,
    morale: 70,
    lastLogin: Date.now(),
    report: "王国初建，宫廷书记官已开始记录第一日的政务。",
    logs: []
  };

  localStorage.setItem("moonlitKingdom", JSON.stringify(kingdomData));
  showKingdom(kingdomData);
}

function showKingdom(data) {
  data = repairKingdomData(data);

  const setupSection = document.getElementById("setup");
  const kingdomSection = document.getElementById("kingdom");

  setupSection.classList.add("hidden");
  kingdomSection.classList.remove("hidden");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>${data.name}王国</h2>
    <p>第 ${data.day} 日</p>
    <p>━━━━━━━━━━━━</p>

    <p>统治者：${data.identity}</p>
    <p>人口：${data.population}</p>
    <p>粮食：${data.food}</p>
    <p>黄金：${data.gold}</p>
    <p>士兵：${data.soldiers}</p>
    <p>民心：${data.morale}</p>

    <p>天气：月色清冷</p>

    <p>王国报告：</p>
    <p>${data.report}</p>

    <p><a href="javascript:void(0)" onclick="showUnavailable('王宫事务')">王宫事务</a></p>
    <p><a href="javascript:void(0)" onclick="showUnavailable('粮仓')">粮仓</a></p>
    <p><a href="javascript:void(0)" onclick="showUnavailable('边境')">边境</a></p>
    <p><a href="javascript:void(0)" onclick="showLog()">王国日志</a></p>
  `;
}

function showUnavailable(placeName) {
  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>${placeName}</h2>
    <p>━━━━━━━━━━━━</p>

    <p>此处暂时维护中。</p>
    <p>宫廷书记官正在重新整理相关文书。</p>

    <p><a href="javascript:void(0)" onclick="returnToKingdom()">返回王国</a></p>
  `;
}

function showLog() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));
  const logs = data.logs || [];

  let logText = "";

  if (logs.length === 0) {
    logText = "<p>王国日志尚未留下记录。</p>";
  } else {
    logText = logs.map(function(item) {
      return `
        <p>第 ${item.day} 日</p>
        <p>${item.summary}</p>
        <p>王国报告：</p>
        <p>${item.report}</p>
        <p>────────────</p>
      `;
    }).join("");
  }

  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>王国日志</h2>
    <p>━━━━━━━━━━━━</p>

    ${logText}

    <p><a href="javascript:void(0)" onclick="returnToKingdom()">返回王国</a></p>
  `;
}

function returnToKingdom() {
  const saved = localStorage.getItem("moonlitKingdom");

  if (!saved) {
    location.reload();
    return;
  }

  const data = repairKingdomData(JSON.parse(saved));
  showKingdom(data);
}

window.onload = function () {
  const saved = localStorage.getItem("moonlitKingdom");

  if (saved) {
    const data = repairKingdomData(JSON.parse(saved));
    localStorage.setItem("moonlitKingdom", JSON.stringify(data));
    showKingdom(data);
  }
};
