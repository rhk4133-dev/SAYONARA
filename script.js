// ========== FIREBASE CONFIG ==========
const firebaseConfig = {
  apiKey: "AIzaSyB0WeuCDrJjf-8xVAp8s1V5f7VQpqokLe0",
  authDomain: "sayanora-80510.firebaseapp.com",
  projectId: "sayanora-80510",
  storageBucket: "sayanora-80510.firebasestorage.app",
  messagingSenderId: "508654680237",
  appId: "1:508654680237:web:6f55a7656f60ae1e6eee24",
  measurementId: "G-MH782WECPK"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ========== LOGIN / REGISTER ==========
function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email,password)
    .then(user=>{
      document.getElementById("loginMsg").innerText = "Registered Successfully!";
      db.collection("players").doc(user.user.uid).set({
        email: email,
        kills: 0,
        rank: "Rookie"
      }).then(()=> renderLeaderboard());
    })
    .catch(err=>document.getElementById("loginMsg").innerText=err.message);
}

function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email,password)
    .then(user=>{
      document.getElementById("loginMsg").innerText = "Login Successful!";
      loadProfile(user.user.uid);
    })
    .catch(err=>document.getElementById("loginMsg").innerText=err.message);
}

function loadProfile(uid){
  db.collection("players").doc(uid).get()
    .then(doc=>{
      const data = doc.data();
      document.body.innerHTML += `
        <section class="profile">
          <h2>${data.email}'s Profile</h2>
          <p>Kills: ${data.kills}</p>
          <p>Rank: ${data.rank}</p>
        </section>
      `;
    });
}

// ========== LEADERBOARD ==========
function renderLeaderboard(){
  db.collection("players").get().then(snapshot=>{
    const labels=[];
    const data=[];
    snapshot.forEach(doc=>{
      labels.push(doc.data().email);
      data.push(doc.data().kills);
    });

    new Chart(document.getElementById('killsChart'),{
      type:'bar',
      data:{
        labels:labels,
        datasets:[{
          label:'Kills',
          data:data,
          backgroundColor:'rgba(255, 100, 0, 0.7)'
        }]
      },
      options:{
        responsive:true,
        plugins:{legend:{display:false}}
      }
    });
  });
}

renderLeaderboard();

// ========== TOURNAMENT REGISTRATION ==========
document.getElementById("tournamentForm").addEventListener("submit", e=>{
  e.preventDefault();
  const team = document.getElementById("teamName").value;
  db.collection("tournaments").add({team, timestamp:Date.now()});
  alert("Team Registered!");
});

// ========== ADMIN PANEL ==========
function clearLeaderboard(){
  const pass = document.getElementById("adminPass").value;
  if(pass !== "SAYANORA123") return alert("Wrong Admin Password");
  db.collection("players").get().then(snapshot=>{
    snapshot.forEach(doc=>{
      db.collection("players").doc(doc.id).delete();
    });
  }).then(()=>{
    alert("Leaderboard Cleared!");
    renderLeaderboard();
  });
}

// ========== tsParticles FIRE BACKGROUND ==========
tsParticles.load("tsparticles", {
  fpsLimit: 60,
  background: { color: "#0d0d0d" },
  particles: {
    number:{ value:120 },
    color:{ value: ["#ff3300","#ff6600"] },
    shape:{ type:"circle" },
    opacity:{ value:0.7 },
    size:{ value:3 },
    move:{ enable:true, speed:3, direction:"none", outModes:"bounce" }
  }
});
