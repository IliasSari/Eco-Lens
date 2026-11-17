// 1. Αρχικοποίηση του χάρτη (συντεταγμένες: [πλάτος, μήκος], επίπεδο zoom: 14)
const map = L.map('map').setView([40.6401, 22.9444], 14);

// 2. Προσθήκη του οπτικού χάρτη (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);


// --- ΣΥΝΑΡΤΗΣΗ: Φέρνει Points of Interest (POIs) από το Overpass API ---
async function fetchPOIs(lat, lon, mood) {
    // Ορίζουμε σωστά τα Overpass tags ανάλογα με τη διάθεση
    let queryFilter = '';
    if (mood === 'nature') {
        queryFilter = 'node["leisure"="park"](around:2000, ' + lat + ', ' + lon + ');';
    } else if (mood === 'history') {
        queryFilter = 'node["historic"](around:2000, ' + lat + ', ' + lon + ');';
    } else {
        // cozy / default
        queryFilter = 'node["amenity"="cafe"](around:2000, ' + lat + ', ' + lon + ');';
    }

    const query = `
        [out:json][timeout:25];
        (${queryFilter});
        out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        console.log('Αποστολή αιτήματος στο Overpass API...');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Βρέθηκαν ${data.elements.length} σημεία!`, data.elements);
        return data.elements;
    } catch (error) {
        console.error('Σφάλμα κατά την ανάκτηση των POIs:', error);
        alert('Ο server του Overpass είναι προσωρινά φορτωμένος. Δοκίμασε ξανά σε λίγο!');
        return [];
    }
}

// --- ΣΥΝΑΡΤΗΣΗ: Καθαρίζει και εμφανίζει τα markers στον χάρτη ---
let markersLayer = L.layerGroup().addTo(map); // Layer για να διαχειριζόμαστε τα pins

function displayPOIsOnMap(pois) {
    // Καθαρίζουμε τα παλιά markers αν υπήρχαν
    markersLayer.clearLayers();

    pois.forEach(poi => {
        // Το Overpass μπορεί να επιστρέψει nodes (με lat/lon) ή ways (με center lat/lon)
        const lat = poi.lat || (poi.center ? poi.center.lat : null);
        const lon = poi.lon || (poi.center ? poi.center.lon : null);

        if (lat && lon) {
            // Παίρνουμε το όνομα του σημείου ή βάζουμε ένα default
            const name = poi.tags && poi.tags.name ? poi.tags.name : 'Σημείο Ενδιαφέροντος';
            
            // Δημιουργία marker στο Leaflet
            const marker = L.marker([lat, lon]).addTo(markersLayer);
            
            // Προσθήκη popup με το όνομα όταν ο χρήστης κάνει κλικ στο pin
            marker.bindPopup(`<b>${name}</b><br>EcoLens Micro-Adventure`);
        }
    });
}
// --- 3. Διαχείριση κλικ στο κουμπί δημιουργίας διαδρομής ---
document.getElementById('generate-btn').addEventListener('click', async () => {
    const selectedMood = document.getElementById('mood-select').value;
    const selectedTime = document.getElementById('time-select').value;

    const currentLat = 40.6401;
    const currentLon = 22.9444;

    console.log(`Ο AI Agent ξεκινάει! Διάθεση: ${selectedMood}, Χρόνος: ${selectedTime} min`);

    // Φέρνουμε τα σημεία από το Overpass API
    const pois = await fetchPOIs(currentLat, currentLon, selectedMood);
    
    // Εμφανίζουμε τα σημεία στον χάρτη!
    displayPOIsOnMap(pois);

    alert(`Επιτυχία! Βρέθηκαν και σχεδιάστηκαν ${pois.length} σημεία στον χάρτη.`);
});