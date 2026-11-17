// 1. Αρχικοποίηση του χάρτη (συντεταγμένες: [πλάτος, μήκος], επίπεδο zoom: 14)
const map = L.map('map').setView([40.6401, 22.9444], 14);

// 2. Προσθήκη του οπτικού χάρτη (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);


// --- ΣΥΝΑΡΤΗΣΗ: Φέρνει Points of Interest (POIs) από το Overpass API ---
async function fetchPOIs(lat, lon, mood) {
    let amenityTag = 'cafe'; // Default για cozy
    if (mood === 'nature') {
        amenityTag = 'park'; 
    } else if (mood === 'history') {
        amenityTag = 'historic'; 
    }

    const query = `
        [out:json];
        (
          node["amenity"="${amenityTag}"](around:1500, ${lat}, ${lon});
          way["amenity"="${amenityTag}"](around:1500, ${lat}, ${lon});
          node["leisure"="${amenityTag}"](around:1500, ${lat}, ${lon});
          node["historic"](around:1500, ${lat}, ${lon});
        );
        out body;
        >;
        out skel qt;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        console.log('Αποστολή αιτήματος στο Overpass API...');
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`Βρέθηκαν ${data.elements.length} σημεία!`, data.elements);
        return data.elements;
    } catch (error) {
        console.error('Σφάλμα κατά την ανάκτηση των POIs:', error);
        alert('Υπήρξε κάποιο πρόβλημα στην επικοινωνία με τον χάρτη. Δοκίμασε ξανά!');
        return [];
    }
}


// --- 3. Διαχείριση κλικ στο κουμπί δημιουργίας διαδρομής ---
document.getElementById('generate-btn').addEventListener('click', async () => {
    const selectedMood = document.getElementById('mood-select').value;
    const selectedTime = document.getElementById('time-select').value;

    // Προσωρινές συντεταγμένες (Κέντρο Θεσσαλονίκης)
    const currentLat = 40.6401;
    const currentLon = 22.9444;

    console.log(`Ο AI Agent ξεκινάει! Διάθεση: ${selectedMood}, Χρόνος: ${selectedTime} min`);

    // Καλούμε την API συνάρτηση και περιμένουμε τα αποτελέσματα
    const pois = await fetchPOIs(currentLat, currentLon, selectedMood);
    
    // Εμφανίζουμε μήνυμα με τα αποτελέσματα που φέραμε
    alert(`Επιτυχία! Βρέθηκαν ${pois.length} σημεία ενδιαφέροντος γύρω σου.`);
});