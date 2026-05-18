function repairKingdomData(data) {
  if (typeof data.population !== "number") data.population = 1000;
  if (typeof data.food !== "number") data.food = 500;
  if (typeof data.gold !== "number") data.gold = 200;
  if (typeof data.soldiers !== "number") data.soldiers = 80;
  if (typeof data.morale !== "number") data.morale = 70;
  if (typeof data.lastLogin !== "number") data.lastLogin = Date.now();
  if (!data.report) data.report = "王国初建，宫廷书记官已开始记录第一日的政务。";
  if (!Array.isArray(data.logs)) data.logs = [];
  if (typeof data.granaryActionDay !== "number") data.granaryActionDay = data.day || 1;
if (typeof data.granaryActionsToday !== "number") data.granaryActionsToday = 0;
  if (typeof data.tradeFoodDay !== "number") data.tradeFoodDay = data.day || 1;
if (typeof data.tradeFoodUsedToday !== "boolean") data.tradeFoodUsedToday = false;

  return data;
}

function createKingdom() {
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
    report: "王国初建，宫廷书记官已开始记录第一日的政务。",
    logs: [],
granaryActionDay: 1,
granaryActionsToday: 0,
tradeFoodDay: 1,
tradeFoodUsedToday: false
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
    data.lastLogin = now;

    return {
      data: data,
      hoursAway: 0,
      changes: null
    };
  }

  let effectiveHours = hoursAway;

if (hoursAway > 24 * 30) {
  effectiveHours = 72;
  data.report = "你已离开王国许久。王国进入低速封存状态，宫廷只维持粮仓、城防与基本民生。王国仍在，只是变得很安静。";
} else if (hoursAway > 24 * 14) {
  effectiveHours = 96;
  data.report = "你已久未临朝。宫廷书记官代为处理了部分日常政务，王都并未陷入混乱，但市井之间开始流传王座久未开启的传闻。";
} else if (hoursAway > 24 * 7) {
  effectiveHours = 120;
  data.report = "在你未临朝期间，宫廷书记官与粮仓官维持了最基本的政务。王国仍在等待你的命令。";
}

const foodLoss = Math.max(1, Math.floor(effectiveHours * (data.population / 1000) * 4));
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
if (data.granaryActionDay !== data.day) {
  data.granaryActionDay = data.day;
  data.granaryActionsToday = 0;
}

if (data.tradeFoodDay !== data.day) {
  data.tradeFoodDay = data.day;
  data.tradeFoodUsedToday = false;
}

  if (hoursAway <= 24 * 7) {
  data.report = generateKingdomReport(data);
}

  const summaryParts = [];
  summaryParts.push("你离开了 " + hoursAway + " 小时。");
  summaryParts.push("粮仓减少了 " + foodLoss + " 单位。");

  if (moraleChange < 0) {
    summaryParts.push("民心轻微下降。");
  }

  if (populationChange > 0) {
    summaryParts.push("人口略有增加。");
  }

  if (populationChange < 0) {
    summaryParts.push("人口略有流失。");
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

    ${renderOfflineSummary(updateResult)}

    <p>王国报告：</p>
    <p>${data.report}</p>

    <p><a href="javascript:void(0)" onclick="showUnavailable('王宫事务')">王宫事务</a></p>
    <p><a href="javascript:void(0)" onclick="showGranary()">粮仓</a></p>
    <p><a href="javascript:void(0)" onclick="showUnavailable('边境')">边境</a></p>
    <p><a href="javascript:void(0)" onclick="showLog()">王国日志</a></p>
  `;
}

function renderOfflineSummary(updateResult) {
  if (!updateResult || updateResult.hoursAway === 0) {
    return "<p>你刚刚登入王国。</p>";
  }

  const changes = updateResult.changes;

  let text = "";
  text += "<p>你离开了 " + updateResult.hoursAway + " 小时。</p>";
  text += "<p>粮仓减少了 " + changes.foodLoss + " 单位。</p>";

  if (changes.moraleChange < 0) {
    text += "<p>民心轻微下降。</p>";
  }

  if (changes.populationChange > 0) {
    text += "<p>人口略有增加。</p>";
  }

  if (changes.populationChange < 0) {
    text += "<p>人口略有流失。</p>";
  }

  return text;
}

function showUnavailable(placeName) {
  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>${placeName}</h2>
    <p>━━━━━━━━━━━━</p>

    <p>此处尚未开放。</p>
    <p>宫廷书记官仍在整理相关文书。</p>

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
  const data = repairKingdomData(JSON.parse(saved));
  showKingdom(data, null);
}

window.onload = function () {
  const saved = localStorage.getItem("moonlitKingdom");

  if (saved) {
    const data = repairKingdomData(JSON.parse(saved));
    const updateResult = updateKingdomByOfflineTime(data);

    localStorage.setItem("moonlitKingdom", JSON.stringify(updateResult.data));
    showKingdom(updateResult.data, updateResult);
  }
};
function canHandleGranaryAction(data) {
  if (data.granaryActionDay !== data.day) {
    data.granaryActionDay = data.day;
    data.granaryActionsToday = 0;
  }

  if (data.granaryActionsToday >= 3) {
    data.report = "粮仓官合上账册。今日粮仓事务已处理完毕。频繁更改粮仓王令会扰乱市集秩序。";
    addManualLog(data, "你试图继续处理粮仓事务，但今日粮仓账册已封。");

    localStorage.setItem("moonlitKingdom", JSON.stringify(data));
    showGranary();
    return false;
  }

  data.granaryActionsToday += 1;
  return true;
}

function showGranary() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));
  const kingdomSection = document.getElementById("kingdom");

  kingdomSection.innerHTML = `
    <p>━━━━━━━━━━━━</p>
    <h2>粮仓</h2>
    <p>━━━━━━━━━━━━</p>

    <p>当前粮食：${data.food}</p>
<p>民心：${data.morale}</p>
<p>黄金：${data.gold}</p>
<p>今日粮仓事务：${data.granaryActionsToday} / 3</p>

<p>粮仓回报：</p>
<p>${data.report}</p>

<p>可执行事务：</p>

    <p><a href="javascript:void(0)" onclick="openReserveFood()">开放储备粮</a></p>
    <p>效果：粮食减少 50，民心上升 3。</p>

<p><a href="javascript:void(0)" onclick="increaseFarmLabor()">增加农田劳力</a></p>
<p>效果：粮食增加 80，民心下降 2。</p>

<p><a href="javascript:void(0)" onclick="buyFoodFromCaravan()">向商队购粮</a></p>
<p>效果：黄金减少 40，粮食增加 120。每日限一次。</p>

<p><a href="javascript:void(0)" onclick="returnToKingdom()">返回王国</a></p>
  `;
}
function openReserveFood() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));
  if (!canHandleGranaryAction(data)) {
  return;
}

  if (data.food < 50) {
    data.report = "粮仓储量不足，粮仓官无法开放更多储备粮。";
  } else {
    data.food = Math.max(0, data.food - 50);
    data.morale = Math.min(100, data.morale + 3);
    data.report = "你下令开放部分储备粮。王都民心稍有回稳，但粮仓储量减少。";

    addManualLog(data, "你下令开放部分储备粮。粮食减少 50，民心上升 3。");
  }

  localStorage.setItem("moonlitKingdom", JSON.stringify(data));
  showGranary();
}

function increaseFarmLabor() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));

  if (!canHandleGranaryAction(data)) {
    return;
  }

  if (data.morale < 10) {
    data.report = "民心已至谷底。村庄拒绝再派出劳力，农田劳力无法继续增加。宫廷书记官建议先安抚民心。";

    addManualLog(data, "你试图继续增加农田劳力，但民心过低，村庄拒绝执行。");

    localStorage.setItem("moonlitKingdom", JSON.stringify(data));
    showGranary();
    return;
  }

  data.food = data.food + 80;
  data.morale = Math.max(0, data.morale - 2);

  if (data.morale === 0) {
    data.report = "民心已近崩溃。粮仓充实，王都却不再欢呼。街市安静得异常。";
  } else if (data.morale < 10) {
    data.report = "民心已极低。部分村庄开始抗拒新的劳力征调，王令传达到各村时变得迟缓。";
  } else if (data.morale < 30) {
    data.report = "王都街市出现低声议论。连续征调劳力已引起民间不安。";
  } else if (data.morale < 50) {
    data.report = "民间略有疲惫。粮仓储量有所回升，但王都的议论声变多了。";
  } else {
    data.report = "你下令增加农田劳力。粮仓储量有所回升，但民间略有疲惫。";
  }

  addManualLog(data, "你下令增加农田劳力。粮食增加 80，民心下降 2。");

  localStorage.setItem("moonlitKingdom", JSON.stringify(data));
  showGranary();
}

function buyFoodFromCaravan() {
  const saved = localStorage.getItem("moonlitKingdom");
  const data = repairKingdomData(JSON.parse(saved));

  if (data.tradeFoodDay !== data.day) {
    data.tradeFoodDay = data.day;
    data.tradeFoodUsedToday = false;
  }

  if (data.tradeFoodUsedToday) {
    data.report = "今日商队粮契已用。粮仓官提醒：商队不会在同一日反复进城。";
    addManualLog(data, "你试图再次向商队购粮，但今日商队粮契已用。");

    localStorage.setItem("moonlitKingdom", JSON.stringify(data));
    showGranary();
    return;
  }

  if (data.gold < 40) {
    data.report = "国库不足。商队拒绝赊账，粮仓官无法完成采购。";
    addManualLog(data, "你试图向商队购粮，但国库不足。");

    localStorage.setItem("moonlitKingdom", JSON.stringify(data));
    showGranary();
    return;
  }

  data.gold = Math.max(0, data.gold - 40);
  data.food = data.food + 120;
  data.tradeFoodUsedToday = true;

  data.report = "粮仓官启用王都商队契约，从南方商队购入一批粮食。国库减少，但粮仓暂时稳住。";

  addManualLog(data, "你向商队购入粮食。黄金减少 40，粮食增加 120。");

  localStorage.setItem("moonlitKingdom", JSON.stringify(data));
  showGranary();
}

function addManualLog(data, summary) {
  if (!Array.isArray(data.logs)) {
    data.logs = [];
  }

  data.logs.unshift({
    day: data.day,
    summary: summary,
    report: data.report
  });

  data.logs = data.logs.slice(0, 10);
}
