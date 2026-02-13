let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

const table = document.getElementById("leaderboardData");
const form = document.getElementById("registerForm");

function renderLeaderboard(){
  table.innerHTML = "";
  leaderboard.sort((a,b)=>b.kills-a.kills);
  leaderboard.forEach(player=>{
    table.innerHTML += `
      <tr>
        <td>${player.name}</td>
        <td>${player.kills}</td>
      </tr>
    `;
  });
}

form.addEventListener("submit",function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const kills = document.getElementById("kills").value;

  leaderboard.push({name,kills});
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  renderLeaderboard();
  form.reset();
});

function clearLeaderboard(){
  const pass = document.getElementById("adminPass").value;

  if(pass === "sayanora123"){
    localStorage.removeItem("leaderboard");
    leaderboard=[];
    renderLeaderboard();
    alert("Leaderboard Cleared");
  } else {
    alert("Wrong Password");
  }
}

renderLeaderboard();
