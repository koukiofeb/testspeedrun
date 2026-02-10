function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

/* ===== GOOGLE SHEET CSV ===== */
const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1qiF8kdX4Dt2DUUyCCfUURPvmzFpuPRZsXDExRy-hZJ8/export?format=csv&gid=0";

/* ===== TIME ===== */
function timeToMs(t){
  const clean = t.replace(/\r/g,"").trim();
  const [m,s] = clean.split(":");
  const [sec,ms="0"] = s.split(".");
  return (+m*60000)+(+sec*1000)+(+ms);
}

async function loadRuns(){
  const body = document.getElementById("tableBody");

  try{
    const res = await fetch(SHEET_URL);
    const raw = await res.text();

    // 🔍 DEBUG VISUAL (clave)
    console.log("CSV RAW:", raw);

    const lines = raw.replace(/\r/g,"").trim().split("\n");
    if(lines.length < 2){
      body.innerHTML =
        "<tr><td colspan='4'>CSV vacío</td></tr>";
      return;
    }

    const separator = lines[0].includes(";") ? ";" : ",";

    const runs = lines.slice(1).map(line=>{
      const cols = line.split(separator).map(v =>
        v.replace(/^"+|"+$/g,"").trim()
      );

      return {
        player: cols[0] || "",
        video:  cols[1] || "",
        time:   cols[2] || ""
      };
    }).filter(r => r.player && r.time);

    if(runs.length === 0){
      body.innerHTML =
        "<tr><td colspan='4'>No se pudieron leer filas</td></tr>";
      return;
    }

    body.innerHTML = "";

    runs
      .map(r => ({ ...r, ms: timeToMs(r.time) }))
      .sort((a,b)=>a.ms-b.ms)
      .forEach((r,i)=>{
        body.innerHTML += `
          <tr>
            <td class="rank">${i+1}</td>
            <td>${r.player}</td>
            <td>${r.video ? `<a href="${r.video}" target="_blank">Ver</a>` : "-"}</td>
            <td>${r.time}</td>
          </tr>
        `;
      });

  }catch(err){
    console.error("FETCH ERROR:", err);
    body.innerHTML =
      "<tr><td colspan='4'>Error cargando datos</td></tr>";
  }
}

loadRuns();
