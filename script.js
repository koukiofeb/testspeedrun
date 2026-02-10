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

function timeToMs(t){
  let [m,r]=t.split(":");
  let [s,ms]=r.split(".");
  return (+m*60000)+(+s*1000)+(+ms||0);
}

async function loadRuns(){
  const body = document.getElementById("tableBody");

  try{
    const res = await fetch(SHEET_URL);
    const csv = await res.text();

    const lines = csv.trim().split("\n");
    lines.shift();

    const runs = lines.map(line => {
      const values = [];
      let current = "";
      let insideQuotes = false;

      for(const char of line){
        if(char === '"'){
          insideQuotes = !insideQuotes;
        }else if(char === "," && !insideQuotes){
          values.push(current);
          current = "";
        }else{
          current += char;
        }
      }
      values.push(current);

      return {
        player:(values[0]||"").replace(/"/g,"").trim(),
        video:(values[1]||"").replace(/"/g,"").trim(),
        time:(values[2]||"").replace(/"/g,"").trim()
      };
    }).filter(r=>r.player && r.time);

    body.innerHTML="";

    runs
      .map(r=>({...r,ms:timeToMs(r.time)}))
      .sort((a,b)=>a.ms-b.ms)
      .forEach((r,i)=>{
        body.innerHTML+=`
          <tr>
            <td class="rank">${i+1}</td>
            <td>${r.player}</td>
            <td>${r.video?`<a href="${r.video}" target="_blank">Ver</a>`:"-"}</td>
            <td>${r.time}</td>
          </tr>`;
      });

  }catch(e){
    console.error(e);
    body.innerHTML="<tr><td colspan='4'>Error cargando datos</td></tr>";
  }
}

loadRuns();
