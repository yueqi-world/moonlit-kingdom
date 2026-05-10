function createKingdom() {
  const name = document.getElementById("kingdomName").value.trim();
  const identity = document.getElementById("identity").value;

  if (!name) {
    alert("请先为你的王国命名。");
    return;
  }

  const kingdomData = {
    name: name,
    identity: identity,
    day: 1
  };

  localStorage.setItem("moonlitKingdom", JSON.stringify(kingdomData));

  showKingdom(kingdomData);
}

function showKingdom(data) {
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("kingdom").classList.remove("hidden");

  document.getElementById("displayName").textContent = data.name + "王国";
  document.getElementById("displayIdentity").textContent = data.identity;
  document.getElementById("day").textContent = data.day;
}

window.onload = function () {
  const saved = localStorage.getItem("moonlitKingdom");

  if (saved) {
    const data = JSON.parse(saved);
    showKingdom(data);
  }
};
