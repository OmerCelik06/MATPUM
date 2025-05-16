// Leaflet için basit tip tanımı
interface LeafletMap {
    setView(center: [number, number], zoom: number): any;
}

interface LeafletMarker {
    addTo(map: any): any;
    bindPopup(content: string): any;
    on(event: string, callback: () => void): void;
}

interface LeafletTileLayer {
    addTo(map: any): any;
}

interface LeafletPolygon {
    addTo(map: any): any;
    bindPopup(content: string): any;
    on(event: string, callback: () => void): void;
    setStyle(style: any): void;
}

interface Leaflet {
    map(element: string, options?: any): LeafletMap;
    marker(position: [number, number]): LeafletMarker;
    tileLayer(url: string, options: any): LeafletTileLayer;
    polygon(latlngs: [number, number][], options?: any): LeafletPolygon;
}

declare var L: Leaflet;

// Bina tipi tanımı
interface Building {
    name: string;
    position: {
        lat: number;
        lng: number;
    };
    description: string;
    imageUrl: string;
}

// Bina verileri
const buildings: Building[] = [
    {
        name: "Fizik Bölümü",
        position: { lat: 39.89453348513425, lng: 32.78230002932196 },
        description: "Fizik bölümü ve laboratuvarları bu alanda bulunmaktadır. Modern laboratuvarlar ve araştırma merkezleri ile öğrencilere en iyi eğitim imkanlarını sunmaktadır.",
        imageUrl: "fizik-bina.jpg"
    },
    {
        name: "Matematik Bölümü",
        position: { lat: 39.895321189073, lng: 32.78204972297499 },
        description: "Matematik bölümü ve derslikleri bu alanda bulunmaktadır. Modern eğitim imkanları ve geniş derslikler ile öğrencilere kapsamlı bir eğitim sunmaktadır.",
        imageUrl: "matematik-bina.jpg"
    },
    {
        name: "Endüstri Mühendisliği",
        position: { lat: 39.89206823750135, lng: 32.78163680254903 },
        description: "Endüstri Mühendisliği bölümü ve laboratuvarları bu alanda bulunmaktadır. Modern eğitim ve araştırma imkanları ile öğrencilere kapsamlı bir eğitim sunmaktadır.",
        imageUrl: "endustri-bina.jpg"
    },
    {
        name: "Bilgisayar Mühendisliği",
        position: { lat: 39.89167028453943, lng: 32.78352452069339 },
        description: "Bilgisayar Mühendisliği bölümü ve laboratuvarları bu alanda bulunmaktadır. Modern bilgisayar laboratuvarları ve araştırma merkezleri ile öğrencilere en iyi eğitim imkanlarını sunmaktadır.",
        imageUrl: "bilgisayar-bina.jpg"
    },
    {
        name: "Yüksel Proje Amfisi",
        position: { lat: 39.88773097478301, lng: 32.781573964792585 },
        description: "Yüksel Proje Amfisi, öğrenci projeleri ve etkinlikler için kullanılan modern bir amfidir. Geniş oturma alanı ve modern teknik altyapısı ile çeşitli etkinliklere ev sahipliği yapmaktadır.",
        imageUrl: "yuksel-proje.jpg"
    }
];

let map: any;
let modal: HTMLElement;
let overlay: HTMLElement;
let modalTitle: HTMLElement;
let modalImage: HTMLImageElement;
let modalDescription: HTMLElement;
let closeButton: HTMLElement;
let menuButton: HTMLElement;
let sidePanel: HTMLElement;
let closePanelButton: HTMLElement;
let polygons: { [key: string]: any } = {};

// Alt seksiyon verileri
const subSections: { [key: string]: { title: string; description: string; imageUrl: string } } = {
    // Fizik Bölümü
    'fizik-1': {
        title: 'Erişilebilirlik',
        description: 'Fizik Bölümü binası engelli erişimine uygun olarak tasarlanmıştır. Asansör ve rampalar mevcuttur.',
        imageUrl: 'fizik-erisim.jpg'
    },
    'fizik-2': {
        title: 'Çalışma Salonları ve Bilgisayar Laboratuvarları',
        description: 'Modern bilgisayar laboratuvarları ve geniş çalışma salonları öğrencilerin kullanımına açıktır.',
        imageUrl: 'fizik-lab.jpg'
    },
    'fizik-3': {
        title: 'Kantin ve Otomatlar',
        description: 'Bina içerisinde kantin ve çeşitli otomatlar bulunmaktadır.',
        imageUrl: 'fizik-kantin.jpg'
    },
    'fizik-4': {
        title: 'Geri Dönüşüm',
        description: 'Bina içerisinde geri dönüşüm noktaları bulunmaktadır.',
        imageUrl: 'fizik-geri-donusum.jpg'
    },

    // Matematik Bölümü
    'matematik-1': {
        title: 'Erişilebilirlik',
        description: 'Matematik Bölümü binası engelli erişimine uygun olarak tasarlanmıştır. Asansör ve rampalar mevcuttur.',
        imageUrl: 'matematik-erisim.jpg'
    },
    'matematik-2': {
        title: 'Çalışma Salonları ve Bilgisayar Laboratuvarları',
        description: 'Modern bilgisayar laboratuvarları ve geniş çalışma salonları öğrencilerin kullanımına açıktır.',
        imageUrl: 'matematik-lab.jpg'
    },
    'matematik-3': {
        title: 'Kantin ve Otomatlar',
        description: 'Bina içerisinde kantin ve çeşitli otomatlar bulunmaktadır.',
        imageUrl: 'matematik-kantin.jpg'
    },
    'matematik-4': {
        title: 'Geri Dönüşüm',
        description: 'Bina içerisinde geri dönüşüm noktaları bulunmaktadır.',
        imageUrl: 'matematik-geri-donusum.jpg'
    },

    // Endüstri Mühendisliği
    'endustri-1': {
        title: 'Erişilebilirlik',
        description: 'Endüstri Mühendisliği binası engelli erişimine uygun olarak tasarlanmıştır. Asansör ve rampalar mevcuttur.',
        imageUrl: 'endustri-erisim.jpg'
    },
    'endustri-2': {
        title: 'Çalışma Salonları ve Bilgisayar Laboratuvarları',
        description: 'Modern bilgisayar laboratuvarları ve geniş çalışma salonları öğrencilerin kullanımına açıktır.',
        imageUrl: 'endustri-lab.jpg'
    },
    'endustri-3': {
        title: 'Kantin ve Otomatlar',
        description: 'Bina içerisinde kantin ve çeşitli otomatlar bulunmaktadır.',
        imageUrl: 'endustri-kantin.jpg'
    },
    'endustri-4': {
        title: 'Geri Dönüşüm',
        description: 'Bina içerisinde geri dönüşüm noktaları bulunmaktadır.',
        imageUrl: 'endustri-geri-donusum.jpg'
    },

    // Bilgisayar Mühendisliği
    'bilgisayar-1': {
        title: 'Erişilebilirlik',
        description: 'Bilgisayar Mühendisliği binası engelli erişimine uygun olarak tasarlanmıştır. Asansör ve rampalar mevcuttur.',
        imageUrl: 'bilgisayar-erisim.jpg'
    },
    'bilgisayar-2': {
        title: 'Çalışma Salonları ve Bilgisayar Laboratuvarları',
        description: 'Modern bilgisayar laboratuvarları ve geniş çalışma salonları öğrencilerin kullanımına açıktır.',
        imageUrl: 'bilgisayar-lab.jpg'
    },
    'bilgisayar-3': {
        title: 'Kantin ve Otomatlar',
        description: 'Bina içerisinde kantin ve çeşitli otomatlar bulunmaktadır.',
        imageUrl: 'bilgisayar-kantin.jpg'
    },
    'bilgisayar-4': {
        title: 'Geri Dönüşüm',
        description: 'Bina içerisinde geri dönüşüm noktaları bulunmaktadır.',
        imageUrl: 'bilgisayar-geri-donusum.jpg'
    },

    // Yüksel Proje Amfisi
    'yuksel-1': {
        title: 'Erişilebilirlik',
        description: 'Yüksel Proje Amfisi engelli erişimine uygun olarak tasarlanmıştır. Asansör ve rampalar mevcuttur.',
        imageUrl: 'yuksel-erisim.jpg'
    },
    'yuksel-2': {
        title: 'Çalışma Salonları ve Bilgisayar Laboratuvarları',
        description: 'Modern bilgisayar laboratuvarları ve geniş çalışma salonları öğrencilerin kullanımına açıktır.',
        imageUrl: 'yuksel-lab.jpg'
    },
    'yuksel-3': {
        title: 'Kantin ve Otomatlar',
        description: 'Bina içerisinde kantin ve çeşitli otomatlar bulunmaktadır.',
        imageUrl: 'yuksel-kantin.jpg'
    },
    'yuksel-4': {
        title: 'Geri Dönüşüm',
        description: 'Bina içerisinde geri dönüşüm noktaları bulunmaktadır.',
        imageUrl: 'yuksel-geri-donusum.jpg'
    }
};

// Polygon'ları gizleme fonksiyonu
function hideAllPolygons(): void {
    Object.values(polygons).forEach((polygon: LeafletPolygon) => {
        polygon.setStyle({ opacity: 0, fillOpacity: 0 });
    });
}

// Seçili polygon'u gösterme fonksiyonu
function showPolygon(buildingId: string): void {
    hideAllPolygons();
    if (polygons[buildingId]) {
        polygons[buildingId].setStyle({ opacity: 1, fillOpacity: 0.4 });
    }
}

// Tüm polygon'ları gösterme fonksiyonu
function showAllPolygons(): void {
    Object.values(polygons).forEach((polygon: LeafletPolygon) => {
        polygon.setStyle({ opacity: 1, fillOpacity: 0.4 });
    });
}

// Modal'ı açma fonksiyonu
function openModal(building: Building): void {
    modalTitle.textContent = building.name;
    modalImage.src = building.imageUrl;
    modalImage.alt = building.name;
    modalDescription.textContent = building.description;
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

// Modal'ı kapatma fonksiyonu
function closeModal(): void {
    modal.style.display = 'none';
    overlay.style.display = 'none';
}

// Yan paneli açma/kapama
function toggleSidePanel(): void {
    sidePanel.classList.toggle('active');
}

// Bina seçme
function selectBuilding(buildingId: string): void {
    // Tüm bina bölümlerini güncelle
    document.querySelectorAll('.building-section').forEach(section => {
        section.classList.remove('active');
        if (section.querySelector(`[data-building="${buildingId}"]`)) {
            section.classList.add('active');
        }
    });

    // Aktif butonu güncelle
    document.querySelectorAll('.building-option').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-building') === buildingId) {
            button.classList.add('active');
        }
    });

    // Seçili binayı göster
    showPolygon(buildingId);
}

// Alt seksiyon seçme fonksiyonu
function selectSubSection(sectionId: string): void {
    const subSection = subSections[sectionId];
    if (subSection) {
        // Aktif alt seksiyon butonunu güncelle
        document.querySelectorAll('.sub-section').forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-section') === sectionId) {
                button.classList.add('active');
            }
        });

        // Modal'ı aç
        openModal({
            name: subSection.title,
            position: { lat: 0, lng: 0 }, // Bu değerler kullanılmayacak
            description: subSection.description,
            imageUrl: subSection.imageUrl
        });
    }
}

// Haritayı başlatma fonksiyonu
function initMap(): void {
    // Harita merkezi
    const center: [number, number] = [39.89764966170611, 32.77806978990851];

    // Harita oluşturma
    map = L.map('map').setView(center, 17);

    // OpenStreetMap katmanını ekleme
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Modal elementlerini seç
    modal = document.getElementById('buildingModal') as HTMLElement;
    overlay = document.getElementById('overlay') as HTMLElement;
    modalTitle = document.getElementById('modalTitle') as HTMLElement;
    modalImage = document.getElementById('modalImage') as HTMLImageElement;
    modalDescription = document.getElementById('modalDescription') as HTMLElement;
    closeButton = document.getElementById('closeModal') as HTMLElement;
    menuButton = document.getElementById('menuButton') as HTMLElement;
    sidePanel = document.getElementById('sidePanel') as HTMLElement;
    closePanelButton = document.getElementById('closePanel') as HTMLElement;

    // Event listener'ları ekle
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    menuButton.addEventListener('click', toggleSidePanel);
    closePanelButton.addEventListener('click', toggleSidePanel);

    // Bina seçenekleri için event listener'lar
    document.querySelectorAll('.building-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const buildingId = (e.target as HTMLElement).getAttribute('data-building');
            if (buildingId) {
                selectBuilding(buildingId);
            }
        });
    });

    // Fizik Bölümü koordinatları
    const fizikBinasi: [number, number][] = [
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

    // Endüstri Mühendisliği koordinatları
    const endustriBinasi: [number, number][] = [
        [39.89206823750135, 32.78163680254903],
        [39.89229473956854, 32.78190769295077],
        [39.89232305227435, 32.78189259689205],
        [39.89235844314007, 32.78192782103005],
        [39.89235329537931, 32.7819697545288],
        [39.892372599481575, 32.78199910797764],
        [39.892406703382164, 32.78200078531782],
        [39.8924704068497, 32.782094716354976],
        [39.89253732760071, 32.782020913397105],
        [39.892555344714424, 32.78204020280626],
        [39.892695620654365, 32.781932014380516],
        [39.89267567317583, 32.781895112900855],
        [39.892727793994624, 32.78184311536245],
        [39.89268918598475, 32.781765957725696],
        [39.89271170732641, 32.78174582964638],
        [39.89256885754705, 32.78143384441452],
        [39.89227221808986, 32.7816661559979],
        [39.89214288031059, 32.78151267939299]
    ];

    // Matematik Bölümü koordinatları
    const matematikBinasi: [number, number][] = [
        [39.895321189073, 32.78204972297499],
        [39.895328421925825, 32.782137711880154],
        [39.89534168215391, 32.7821361406495],
        [39.895375435450774, 32.782437816895595],
        [39.89559483147548, 32.78240010736502],
        [39.89560568071116, 32.78251009349685],
        [39.89570573469288, 32.78249123873155],
        [39.89570935109913, 32.78252266334081],
        [39.89600951215266, 32.78247081273557],
        [39.896004690299094, 32.78244095935696],
        [39.89606616891089, 32.78242681828365],
        [39.89605049789725, 32.78226812400794],
        [39.895950444418844, 32.7822932636945],
        [39.89595285534756, 32.78234040060781],
        [39.89572261125406, 32.782389108751744],
        [39.895716583910996, 32.7822995486172],
        [39.89582628146513, 32.78227598015991],
        [39.8958045830619, 32.782101573580235],
        [39.895639433878046, 32.78212671326682],
        [39.89565510498565, 32.782305833538544],
        [39.895444147468226, 32.78235139922114],
        [39.89544535294178, 32.78233097322513],
        [39.895458613147184, 32.78232625953447],
        [39.895436914627595, 32.78215970910679],
        [39.89550442111087, 32.782142425572204],
        [39.89548995544155, 32.78199158744843],
        [39.895389901144284, 32.78201201344433],
        [39.895389901144284, 32.78203715313094]
    ];

    // Bilgisayar Mühendisliği koordinatları
    const bilgisayarBinasi: [number, number][] = [
        [39.89167028453943, 32.78352452069339],
        [39.891691629072795, 32.78379797779283],
        [39.89175475435667, 32.78379087501105],
        [39.891755208495226, 32.7838092238635],
        [39.8917688326498, 32.78381869423953],
        [39.89179426439671, 32.78381159145778],
        [39.89179925991729, 32.78378673172111],
        [39.891812429924926, 32.783780812736495],
        [39.891826054068105, 32.78379561019855],
        [39.8918433113119, 32.783792058807194],
        [39.891850577517886, 32.78377726134508],
        [39.89186374751566, 32.78377430185324],
        [39.89186692647982, 32.78379265070578],
        [39.89187782578642, 32.783804488676026],
        [39.89190053266725, 32.78380271298033],
        [39.891909161280694, 32.78378850741677],
        [39.89190689059282, 32.78376956666477],
        [39.89192460195372, 32.78376483147724],
        [39.89193368470157, 32.78374944211657],
        [39.891932776426785, 32.783710376816344],
        [39.89191824402977, 32.78369261986245],
        [39.891904165768096, 32.78369261986245],
        [39.89189508301638, 32.78357068877435],
        [39.89190825300557, 32.78356891307968],
        [39.891920060579764, 32.78354642093723],
        [39.891916881618044, 32.78351327462158],
        [39.891904165768096, 32.78350202855091],
        [39.89190325749291, 32.78348663919027],
        [39.89194340037088, 32.78345987512711],
        [39.89192908415467, 32.78329304175344],
        [39.89206045637465, 32.783266699640905],
        [39.89205371934435, 32.78319535642217],
        [39.89208908874849, 32.78318218536646],
        [39.89207729894889, 32.78308340244709],
        [39.891892872537, 32.78311742767468],
        [39.89189371466799, 32.78313279390676],
        [39.891712656295, 32.783164623958044],
        [39.89172528828962, 32.783280968284856],
        [39.891857503031645, 32.78325243099792],
        [39.891862555819216, 32.78330182245665],
        [39.89188445122812, 32.783298529693184],
        [39.89189371466799, 32.78338633673209],
        [39.891726130422654, 32.78341597160815],
        [39.89173286748587, 32.78349390035473],
        [39.89171686696014, 32.783515852114675]
    ];

    // Yüksel Proje Amfisi koordinatları
    const yukselProje: [number, number][] = [
        [39.88773097478301, 32.781573964792585],
        [39.88726932284388, 32.78164598319054],
        [39.88732803685426, 32.78225663919358],
        [39.88778623465737, 32.78218011964506]
    ];

    // Polygon'ları oluştur ve sakla
    const fizikPolygon = L.polygon(fizikBinasi, {
        color: "#ff7800",
        weight: 3,
        fillColor: "#ffcc99",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['fizik'] = fizikPolygon;

    const endustriPolygon = L.polygon(endustriBinasi, {
        color: "#2ecc71",
        weight: 3,
        fillColor: "#a9dfbf",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['endustri'] = endustriPolygon;

    const matematikPolygon = L.polygon(matematikBinasi, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['matematik'] = matematikPolygon;

    const bilgisayarPolygon = L.polygon(bilgisayarBinasi, {
        color: "#9b59b6",
        weight: 3,
        fillColor: "#d2b4de",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['bilgisayar'] = bilgisayarPolygon;

    const yukselProjePolygon = L.polygon(yukselProje, {
        color: "#e74c3c",
        weight: 3,
        fillColor: "#f5b7b1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['yuksel'] = yukselProjePolygon;

    // Polygon click event'lerini ekle
    Object.entries(polygons).forEach(([id, polygon]: [string, LeafletPolygon]) => {
        polygon.on('click', () => {
            const building = buildings.find(b => b.name.toLowerCase().includes(id));
            if (building) {
                openModal(building);
            }
        });
    });

    // Alt seksiyonlar için event listener'lar
    document.querySelectorAll('.sub-section').forEach(button => {
        button.addEventListener('click', (e) => {
            const sectionId = (e.target as HTMLElement).getAttribute('data-section');
            if (sectionId) {
                selectSubSection(sectionId);
            }
        });
    });
}

// Sayfa yüklendiğinde haritayı başlat
window.addEventListener('DOMContentLoaded', initMap); 