// 🌍 Initialize map
var map = L.map('map').setView([32.0853, 34.7818], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 🔄 Load spots from server
fetch('/spots')
  .then(response => response.json())
  .then(spots => {
    spots.forEach(spot => {
      L.marker([spot.lat, spot.lon])
        .addTo(map)
        .on("click", function () {
          document.getElementById("spotTitle").textContent = spot.name;
          document.getElementById("spotDescription").textContent = spot.description;
          document.getElementById("infoPanel").classList.add("open");
        });
    });
  });

// 🗺 Close info panel when clicking map
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

// 🔐 Admin mode
function unlockAdmin() {
  const pass = prompt("הכנס סיסמה");
  if (pass === "Cal!srael2001") {
    alert("מצב ניהול הופעל");
    document.getElementById('adminAddBtn').style.display = 'block';
    document.getElementById('adminUnlockBtn').style.display = 'none';
  } else {
    alert("סיסמה שגויה");
  }
}

let addMode = false;
function enableAddMode() {
  alert("הקלק על המפה להוספת נקודה");
  addMode = true;
}

map.on('click', function (e) {
  if (!addMode) return;

  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  document.getElementById('addSpotForm').style.display = 'block';
  window.newSpotCoords = { lat, lon };

  addMode = false;
});

function submitSpot() {
  const name = document.getElementById("spotName").value;
  const description = document.getElementById("spotDescription").value;
  const { lat, lon } = window.newSpotCoords;

  if (!name || !lat || !lon) {
    alert("יש למלא שם וקליק במפה");
    return;
  }

  fetch('/add_spot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description,
      lat,
      lon
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert("נקודה נוספה בהצלחה 🎉");
        location.reload();
      } else {
        alert("שגיאה בהוספה");
      }
    });
}
document.getElementById("spotDescription").textContent =
  spot.description || "אין תיאור זמין למקום זה";
