var map = L.map('map').setView([32.0853, 34.7818], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 📍 Spots array — add as many as you like
const spots = [
  {
    name: "כפר סבא",
    description: "מקום עם מתח ליד הסקייטפארק",
    lat: 32.171184,
    lon: 34.910736
  },
  {
    name: "פארק הירקון",
    description: "מתקני כושר על הדשא ליד הנהר",
    lat: 32.096831,
    lon: 34.803987
  },
  {
    name: "חוף תל אביב",
    description: "מתח מתחת לדק עץ",
    lat: 32.0704,
    lon: 34.7675
  }
];

// 📌 Create all markers + attach click event
spots.forEach(spot => {
  L.marker([spot.lat, spot.lon])
    .addTo(map)
    .on("click", function () {
      document.getElementById("spotTitle").textContent = spot.name;
      document.getElementById("spotDescription").textContent = spot.description;
      document.getElementById("infoPanel").classList.add("open");
    });
});

// 🗺 Close info panel when clicking outside
map.on("click", function () {
  document.getElementById("infoPanel").classList.remove("open");
});

// 📍 Locate user
function locateUser() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      L.marker([lat, lon]).addTo(map)
        .bindPopup("אתה נמצא כאן")
        .openPopup();

      map.setView([lat, lon], 14);
    },
    function() {
      alert("Unable to retrieve your location.");
    }
  );
}

// 🔐 Admin unlock
function unlockAdmin() {
  const pass = prompt("הכנס סיסמה");

  if (pass === "letmein123") {
    alert("מצב ניהול הופעל");
    document.getElementById('adminAddBtn').style.display = 'block';
    document.getElementById('adminUnlockBtn').style.display = 'none';
  } else {
    alert("סיסמה שגויה");
  }
}

// ➕ Add new spot (admin only)
let newLat = null;
let newLon = null;

function enableAddMode() {
  alert("לחץ על המפה כדי לבחור מיקום לנקודה");
  map.once('click', function (e) {
    newLat = e.latlng.lat;
    newLon = e.latlng.lng;
    document.getElementById('addSpotForm').style.display = 'block';
  });
}

function submitSpot() {
  const name = document.getElementById('spotName').value.trim();
  const desc = document.getElementById('spotDescription').value.trim();

  if (!name || !desc || newLat === null || newLon === null) {
    alert("נא למלא את כל השדות ולבחור מיקום במפה");
    return;
  }

  L.marker([newLat, newLon])
    .addTo(map)
    .on("click", function () {
      document.getElementById("spotTitle").textContent = name;
      document.getElementById("spotDescription").textContent = desc;
      document.getElementById("infoPanel").classList.add("open");
    });

  document.getElementById('spotName').value = '';
  document.getElementById('spotDescription').value = '';
  document.getElementById('addSpotForm').style.display = 'none';
  newLat = null;
  newLon = null;

  alert("הנקודה נוספה!");
}
