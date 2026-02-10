function toggleTheme(){
  document.body.classList.toggle("dark");
}

/* ===== GOOGLE SHEET CSV ===== */
const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1qiF8kdX4Dt2DUUyCCfUURPvmzFpuPRZsXDExRy-hZJ8/export?format=csv&gid=0";

/* ===== TIME ===== */
function timeToMs(t){
  const [m, rest] = t.split(":");
  const [s, ms="0"] = rest.split(".");
  return (+m * 60000) + (+s * 1000) + (+ms);
}

/* ===== LOAD ===== */
async function loadRuns(){
  const body = document.getElementById("tableBody");

  const res = await fetch(SHEET_URL);
  const csv = await res.text();

  const lines = csv.trim().split(/\r?\n/);
  lines.shift(); // header

  body.innerHTML = "";

  const runs = lines.map(line => {
    const [player, video, time] =
      line.split(",").map(v => v.replace(/"/g,"").trim());

    return { player, video, time };
  });

  runs
    .map(r => ({ ...r, ms: timeToMs(r.time) }))
    .sort((a,b)=>a.ms-b.ms)
    .forEach((r,i)=>{
      body.innerHTML += `
        <tr>
          <td class="rank">${i+1}</td>
          <td>${r.player}</td>
          <td><a href="${r.video}" target="_blank">Ver</a></td>
          <td>${r.time}</td>
        </tr>
      `;
    });
}

loadRuns();
