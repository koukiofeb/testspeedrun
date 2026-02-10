function toggleTheme(){
  document.body.classList.toggle("dark");
}

/* ===== GOOGLE SHEET (CSV TEXTO PLANO) ===== */
const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1qiF8kdX4Dt2DUUyCCfUURPvmzFpuPRZsXDExRy-hZJ8/export?format=csv&gid=0";

/* ===== TIME (TEXTO PLANO) ===== */
function timeToMs(t){
  const [m, rest] = t.split(":");
  const [s, ms] = rest.split(".");
  return (+m * 60000) + (+s * 1000) + (+ms);
}

/* ===== LOAD ===== */
async function loadRuns(){
  const body = document.getElementById("tableBody");

  const res = await fetch(SHEET_URL);
  const csv = await res.text();

  const lines = csv.trim().split(/\r?\n/);
  lines.shift(); // quitar header

  body.innerHTML = "";

  for(let i = 0; i < lines.length; i++){
    const cols = lines[i].split(",");

    const player = cols[0];
    const video  = cols[1];
    const time   = cols[2];

    body.innerHTML += `
      <tr>
        <td class="rank">${i+1}</td>
        <td>${player}</td>
        <td><a href="${video}" target="_blank">Ver</a></td>
        <td>${time}</td>
      </tr>
    `;
  }
}

loadRuns();
