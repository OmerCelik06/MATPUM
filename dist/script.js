"use strict";
// Bina verileri
const buildings = [
    {
        name: "Ana Bina",
        position: { lat: 39.89764966170611, lng: 32.77806978990851 }, // Okulunuzun koordinatları
        description: "Ana bina açıklaması buraya gelecek",
        imageUrl: "ana-bina.jpg" // Bina fotoğrafının URL'si
    },
    {
        name: "Matematik Bölümü",
        position: { lat: 39.89579455062533, lng: 32.78239681570757 },
        description: "Açıklama",
        imageUrl: "matematik-bina.jpg"
    }
];
let map;
let infoPanel;
// Haritayı başlatma fonksiyonu
function initMap() {
    // Harita merkezi (okulunuzun koordinatları)
    const center = [39.89764966170611, 32.77806978990851];
    // Harita oluşturma
    map = L.map('map').setView(center, 17);
    // OpenStreetMap katmanını ekleme
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // Çok köşeli polygon
    const polygonBounds = [
        [39.89453348513425, 32.78230002932196],
        [39.894541182644275, 32.78239478455038],
        [39.89460447324831, 32.78240258792246],
        [39.8946557899111, 32.78239032548095],
        [39.894606183804314, 32.781885335847846],
        [39.894642960749024, 32.781878647243616],
        [39.8946292763072, 32.7817303831788],
        [39.894505260924575, 32.781751563760196],
        [39.8945035503653, 32.78173261271354],
        [39.89446164166725, 32.78173818655088],
        [39.89444111494848, 32.78153864318631],
        [39.894329928448485, 32.781556479464115],
        [39.894350455200566, 32.78177720341003],
        [39.89420078082614, 32.78180172829309],
        [39.89418025402921, 32.781570971440345],
        [39.89407590938319, 32.78158657818443],
        [39.89409558092663, 32.781808416897235],
        [39.89399123615246, 32.78182848271081],
        [39.89399380200902, 32.781841859919155],
        [39.893976696294345, 32.78184297468701],
        [39.89397327515013, 32.781819564570895],
        [39.89394334013724, 32.781827367942924],
        [39.89394932714043, 32.78189871305719],
        [39.89393393198739, 32.78190428689345],
        [39.893936497846084, 32.781926582241795],
        [39.89395103771275, 32.78192212317231],
        [39.893955314143824, 32.78194999235785],
        [39.89399636786624, 32.78194776282214],
        [39.894002354865506, 32.78197451723986],
        [39.89410926547575, 32.781958910496826],
        [39.89413235814604, 32.78218520827909],
        [39.89423670270537, 32.782168486768114],
        [39.89421800192008, 32.78194235126895],
        [39.894358215729966, 32.78192010824361],
        [39.8943808159556, 32.782143139664385],
        [39.894494739427245, 32.7821227001273],
        [39.894475829066124, 32.78190808498573],
        [39.89455147047761, 32.781893657077575],
        [39.89459021360767, 32.782282008285506],
        [39.894530715221066, 32.782294031542335]
    ];
    const polygon = L.polygon(polygonBounds, {
        color: "#ff7800",
        weight: 3,
        fillColor: "#ffcc99",
        fillOpacity: 0.4
    }).addTo(map);
    // Bilgi panelini seç
    infoPanel = document.getElementById('building-info');
    // Binaları haritaya ekleme
    buildings.forEach(building => {
        const marker = L.marker([building.position.lat, building.position.lng])
            .addTo(map)
            .bindPopup(`
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 5px 0;">${building.name}</h3>
                    <p style="margin: 0;">${building.description}</p>
                </div>
            `);
        // Marker'a tıklama olayı ekleme
        marker.on('click', () => {
            showBuildingInfo(building);
        });
    });
}
// Bina bilgilerini gösterme fonksiyonu
function showBuildingInfo(building) {
    if (infoPanel) {
        infoPanel.innerHTML = `
            <h3>${building.name}</h3>
            <p>${building.description}</p>
            <img src="${building.imageUrl}" alt="${building.name}" class="building-image">
        `;
    }
}
// Sayfa yüklendiğinde haritayı başlat
window.addEventListener('DOMContentLoaded', initMap);
