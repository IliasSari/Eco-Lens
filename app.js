// 1. Αρχικοποίηση του χάρτη (συντεταγμένες: [πλάτος, μήκος], επίπεδο zoom: 14)
// Βάζουμε προσωρινά Θεσσαλονίκη, και στο επόμενο βήμα θα βάλουμε αυτόματο GPS!
const map = L.map('map').setView([40.6401, 22.9444], 14);

// 2. Προσθήκη του οπτικού χάρτη (Dark Mode στυλ από CartoDB)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);