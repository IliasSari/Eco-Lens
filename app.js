// 1. Αρχικοποίηση του χάρτη (συντεταγμένες: [πλάτος, μήκος], επίπεδο zoom: 14)
// Βάζουμε προσωρινά Θεσσαλονίκη, και στο επόμενο βήμα θα βάλουμε αυτόματο GPS!
const map = L.map('map').setView([40.6401, 22.9444], 14);

// 2. Προσθήκη του οπτικού χάρτη (Dark Mode στυλ από CartoDB)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// 3. Διαχείριση κλικ στο κουμπί δημιουργίας διαδρομής
document.getElementById('generate-btn').addEventListener('click', () => {
    // Διαβάζουμε τις τιμές από τα dropdowns
    const selectedMood = document.getElementById('mood-select').value;
    const selectedTime = document.getElementById('time-select').value;

    console.log(`Επιλεγμένη διάθεση: ${selectedMood}, Χρόνος: ${selectedTime} λεπτά`);

    // Προσωρινό μήνυμα επιβεβαίωσης για να δούμε ότι δουλεύει
    alert(`Ο AI Agent ξεκινάει την αναζήτηση!\nΔιάθεση: ${selectedMood}\nΧρόνος: ${selectedTime} min`);
    
    // Εδώ αργότερα θα συνδέσουμε την κλήση στο Overpass API για τα σημεία ενδιαφέροντος!
});