"use strict";
// Bina verileri
const buildings = [
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
let map;
let modal;
let overlay;
let modalTitle;
let modalImage;
let modalDescription;
let closeButton;
let menuButton;
let sidePanel;
let closePanelButton;
let polygons = {};
// Alt seksiyon verileri
const subSections = {
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
        description: 'Matematik Bölümü binasında asansör bulunmamaktadır. Bina girişi rampa ile erişilebilir durumdadır.',
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
function hideAllPolygons() {
    Object.values(polygons).forEach((polygon) => {
        polygon.setStyle({ opacity: 0, fillOpacity: 0 });
    });
}
// Seçili polygon'u gösterme fonksiyonu
function showPolygon(buildingId) {
    hideAllPolygons();
    if (polygons[buildingId]) {
        polygons[buildingId].setStyle({ opacity: 1, fillOpacity: 0.4 });
    }
}
// Tüm polygon'ları gösterme fonksiyonu
function showAllPolygons() {
    Object.values(polygons).forEach((polygon) => {
        polygon.setStyle({ opacity: 1, fillOpacity: 0.4 });
    });
}
// Modal'ı açma fonksiyonu
function openModal(building) {
    modalTitle.textContent = building.name;
    modalImage.src = building.imageUrl;
    modalImage.alt = building.name;
    modalDescription.textContent = building.description;
    modal.style.display = 'block';
    overlay.style.display = 'block';
}
// Modal'ı kapatma fonksiyonu
function closeModal() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
}
// Yan paneli açma/kapama
function toggleSidePanel() {
    sidePanel.classList.toggle('active');
}
// Bina seçme
function selectBuilding(buildingId) {
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
function selectSubSection(sectionId) {
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
function initMap() {
    // Harita merkezi
    const center = [39.89764966170611, 32.77806978990851];
    // Harita oluşturma
    map = L.map('map').setView(center, 17);
    // OpenStreetMap katmanını ekleme
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // Modal elementlerini seç
    modal = document.getElementById('buildingModal');
    overlay = document.getElementById('overlay');
    modalTitle = document.getElementById('modalTitle');
    modalImage = document.getElementById('modalImage');
    modalDescription = document.getElementById('modalDescription');
    closeButton = document.getElementById('closeModal');
    menuButton = document.getElementById('menuButton');
    sidePanel = document.getElementById('sidePanel');
    closePanelButton = document.getElementById('closePanel');
    // Event listener'ları ekle
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    menuButton.addEventListener('click', toggleSidePanel);
    closePanelButton.addEventListener('click', toggleSidePanel);
    // Bina seçenekleri için event listener'lar
    document.querySelectorAll('.building-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const buildingId = e.target.getAttribute('data-building');
            if (buildingId) {
                selectBuilding(buildingId);
            }
        });
    });
    // Fizik Bölümü koordinatları
    const fizikBinasi = [
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
    const endustriBinasi = [
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
    const matematikBinasi = [
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
    const bilgisayarBinasi = [
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
    const yukselProje = [
        [39.88773097478301, 32.781573964792585],
        [39.88726932284388, 32.78164598319054],
        [39.88732803685426, 32.78225663919358],
        [39.88778623465737, 32.78218011964506]
    ];
    // Yeni bina koordinatları
    const elektrikDblok = [
        [39.89161553843971, 32.782395437255644],
        [39.891803130528245, 32.7823605091468],
        [39.8918267765533, 32.78256596861172],
        [39.89156610718612, 32.78261571707907],
        [39.89157888654918, 32.78275062950428],
        [39.89146003838215, 32.7827722821159],
        [39.89144342518111, 32.78259573005218],
        [39.891397419372396, 32.782604057980166],
        [39.89140380906963, 32.78266068788702],
        [39.89132841060169, 32.78267234698586],
        [39.891305407662315, 32.78246414879786],
        [39.89137825027643, 32.782447492941884],
        [39.89138847379522, 32.78251411636285],
        [39.89143447960933, 32.78250245726397],
        [39.89143064579275, 32.78248080465235],
        [39.89146515013536, 32.782472476724394],
        [39.8914153105238, 32.78199112251352],
        [39.89147665157918, 32.781979463414615],
        [39.89148943095893, 32.7819428205332],
        [39.891521379397545, 32.78193782377761],
        [39.891534158768366, 32.781969469901924],
        [39.891571218932, 32.781969469901924]
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
    // Elektrik D Blok polygon'u oluştur
    const elektrikDblokPolygon = L.polygon(elektrikDblok, {
        color: "#1abc9c",
        weight: 3,
        fillColor: "#a3e4d7",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['elektrikDblok'] = elektrikDblokPolygon;
    // Elektrik B-C Blok koordinatları
    const elektrikBCblok = [
        [39.89074930102316, 32.78213906517047],
        [39.890787028326, 32.78249401779462],
        [39.89132228219424, 32.78239260275876],
        [39.89129280797101, 32.78212984562208],
        [39.89102400247023, 32.78217747995723],
        [39.89101574965338, 32.78209143083663]
    ];
    // Elektrik B-C Blok polygon'u oluştur
    const elektrikBCblokPolygon = L.polygon(elektrikBCblok, {
        color: "#e67e22",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['elektrikBCblok'] = elektrikBCblokPolygon;
    // Elektrik A Blok koordinatları
    const elektrikAblok = [
        [39.8903000063238, 32.782427875736005],
        [39.89034480778699, 32.78284736519993],
        [39.89041672586413, 32.78283199928603],
        [39.89040139906717, 32.782696779238165],
        [39.89043441062552, 32.78269063287263],
        [39.890436768593304, 32.78271521833625],
        [39.89047449606761, 32.78270599878789],
        [39.89047449606761, 32.78268294991639],
        [39.890505149625454, 32.782676803549464],
        [39.890519297416745, 32.78281356018795],
        [39.890587678367126, 32.78279819427408],
        [39.89057588855292, 32.78266758400113],
        [39.890687891704914, 32.78264607172164],
        [39.89070321843781, 32.78277821858529],
        [39.89077277818279, 32.78276592585419],
        [39.89072561904155, 32.782347972981],
        [39.890659596189465, 32.78236333889487],
        [39.890673743948895, 32.782493949167815],
        [39.890559382809755, 32.782510851673806],
        [39.89054287706264, 32.78238638776779],
        [39.89047656022066, 32.78239590373252],
        [39.89048376038903, 32.782483935699474],
        [39.890382615095575, 32.78250270393562],
        [39.89037061479661, 32.78241601255749]
    ];
    // Elektrik A Blok polygon'u oluştur
    const elektrikAblokPolygon = L.polygon(elektrikAblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['elektrikAblok'] = elektrikAblokPolygon;
    // Elektrik E Blok koordinatları
    const elektrikEblok = [
        [39.89187067845822, 32.78233074236084],
        [39.8918790785215, 32.782488882836134],
        [39.891957479061176, 32.78256308721319],
        [39.89197334582684, 32.78253510851411],
        [39.89210681317536, 32.78266770321957],
        [39.892162813383806, 32.7825716024698],
        [39.892210413525675, 32.782574035400074],
        [39.89234201374384, 32.782324660034504],
        [39.89204334621655, 32.78202905899204]
    ];
    // Elektrik E Blok polygon'u oluştur
    const elektrikEblokPolygon = L.polygon(elektrikEblok, {
        color: "#16a085",
        weight: 3,
        fillColor: "#7dcea0",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['elektrikEblok'] = elektrikEblokPolygon;
    // Elektrik F Blok koordinatları
    const elektrikFblok = [
        [39.89146225621366, 32.781574452313436],
        [39.89146470970303, 32.78159843525776],
        [39.89136288981638, 32.78177351075135],
        [39.89134510198912, 32.78177670847714],
        [39.89121199982608, 32.78164560171459],
        [39.891208319578425, 32.781620019906626],
        [39.89131259319004, 32.781447342707054],
        [39.89133038102523, 32.781440147823645]
    ];
    // Elektrik F Blok polygon'u oluştur
    const elektrikFblokPolygon = L.polygon(elektrikFblok, {
        color: "#c0392b",
        weight: 3,
        fillColor: "#f1948a",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['elektrikFblok'] = elektrikFblokPolygon;
    // BOTE koordinatları
    const bote = [
        [39.901523518144245, 32.77384637740491],
        [39.90156104145822, 32.77393621715149],
        [39.901597798970045, 32.77390726878909],
        [39.90161847506138, 32.77395318688133],
        [39.901946994347696, 32.77370962134552],
        [39.90192784991066, 32.77366170681367],
        [39.90196537300261, 32.773635753109005],
        [39.90192631835552, 32.77354691158146],
        [39.90180379382727, 32.77363774954776],
        [39.90181528051107, 32.77367069078849],
        [39.901768567984675, 32.77370662668696],
        [39.90175248661532, 32.773674683666]
    ];
    // BOTE polygon'u oluştur
    const botePolygon = L.polygon(bote, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['bote'] = botePolygon;
    // Biyoloji koordinatları
    const biyoloji = [
        [39.89537261328044, 32.780050295763516],
        [39.895470133378296, 32.78015642559444],
        [39.895394389624784, 32.78024898067946],
        [39.89552031356931, 32.7804143457663],
        [39.89567748147556, 32.78029834339219],
        [39.89608365469729, 32.780295875256655],
        [39.89616981234391, 32.780119403560434],
        [39.89612815371569, 32.77999106050865],
        [39.89606566572459, 32.779929357118306],
        [39.89564718407604, 32.77998118796543],
        [39.895502324448785, 32.77987999440555]
    ];
    // Biyoloji polygon'u oluştur
    const biyolojiPolygon = L.polygon(biyoloji, {
        color: "#27ae60",
        weight: 3,
        fillColor: "#82e0aa",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['biyoloji'] = biyolojiPolygon;
    // Çevre Mühendisliği Parça 1 koordinatları
    const cevreMuhendisligiParca1 = [
        [39.887164262668506, 32.78318662136385],
        [39.88716679492117, 32.783333479081136],
        [39.88671352029226, 32.78335163003507],
        [39.886712254157885, 32.78323612396491]
    ];
    // Çevre Mühendisliği Parça 2 koordinatları
    const cevreMuhendisligiParca2 = [
        [39.886947717416945, 32.782986540814534],
        [39.886953417336116, 32.78309499592339],
        [39.88710161507336, 32.783093510237705],
        [39.88710389503598, 32.783063796508856],
        [39.88715291421576, 32.78305785376335],
        [39.887156334157055, 32.78308756749084],
        [39.88729427165288, 32.78308311043236],
        [39.88728515182734, 32.782793401579],
        [39.88715063425428, 32.78279637295171],
        [39.88715063425428, 32.782849857662626],
        [39.8871244146971, 32.78285134334968],
        [39.88712669465892, 32.78297465532222],
        [39.88709933511069, 32.78297762669632],
        [39.887091355240244, 32.78275477373185],
        [39.88696937710779, 32.782760716477355],
        [39.886973937041745, 32.782983569441825]
    ];
    // Çevre Mühendisliği polygon'larını oluştur
    const cevreMuhendisligiParca1Polygon = L.polygon(cevreMuhendisligiParca1, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['cevreMuhendisligiParca1'] = cevreMuhendisligiParca1Polygon;
    const cevreMuhendisligiParca2Polygon = L.polygon(cevreMuhendisligiParca2, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['cevreMuhendisligiParca2'] = cevreMuhendisligiParca2Polygon;
    // Eğitim Fakültesi koordinatları
    const egitimFakultesi = [
        [39.900463880118764, 32.77590380544325],
        [39.900437166914514, 32.776092571369475],
        [39.90069445681985, 32.77614571905619],
        [39.90062837699074, 32.776660701824454],
        [39.90068461514758, 32.77667353057544],
        [39.90068320919363, 32.77671751486881],
        [39.90081677463294, 32.77674683773168],
        [39.90083083413782, 32.776602056098824],
        [39.90074928896988, 32.77658556198864],
        [39.90077600205305, 32.776338150340024],
        [39.90092643869343, 32.77636747320119],
        [39.90094190412381, 32.776228189605746],
        [39.90082099248454, 32.7762061974598],
        [39.90082380438545, 32.776176874596985],
        [39.90099533012895, 32.776209862817495],
        [39.90101782527637, 32.77601559885562]
    ];
    // Eğitim Fakültesi polygon'u oluştur
    const egitimFakultesiPolygon = L.polygon(egitimFakultesi, {
        color: "#d35400",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['egitimFakultesi'] = egitimFakultesiPolygon;
    // Eğitim Fakültesi D Blok koordinatları
    const egitimFakultesiDblok = [
        [39.90013088511421, 32.776655833479566],
        [39.900031887748725, 32.77738997027873],
        [39.900184127336075, 32.77742683977792],
        [39.90025899913968, 32.77687813487415],
        [39.90071654727518, 32.776971393019636],
        [39.90072985772093, 32.77684451856544],
        [39.90027314158226, 32.77674692283196],
        [39.90028062875672, 32.77669378737619]
    ];
    // Eğitim Fakültesi D Blok polygon'u oluştur
    const egitimFakultesiDblokPolygon = L.polygon(egitimFakultesiDblok, {
        color: "#d35400",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['egitimFakultesiDblok'] = egitimFakultesiDblokPolygon;
    // Gıda Mühendisliği koordinatları
    const gidaMuhendisligi = [
        [39.88734172266652, 32.77881872545831],
        [39.88738126802869, 32.77899844732042],
        [39.88743602310788, 32.77897466060412],
        [39.887501931941586, 32.779246886366394],
        [39.8878507407143, 32.77910945199986],
        [39.88778483221594, 32.77880551061588],
        [39.887809167668934, 32.77879493874079],
        [39.887783818238574, 32.7786786481245],
        [39.88769661612653, 32.778613895393875],
        [39.887610427884, 32.77864957547001],
        [39.88762259564254, 32.77870639929401]
    ];
    // Gıda Mühendisliği polygon'u oluştur
    const gidaMuhendisligiPolygon = L.polygon(gidaMuhendisligi, {
        color: "#e74c3c",
        weight: 3,
        fillColor: "#f5b7b1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['gidaMuhendisligi'] = gidaMuhendisligiPolygon;
    // Petrol Mühendisliği koordinatları
    const petrolMuhendisligi = [
        [39.886272640013175, 32.77923893210564],
        [39.88634697545251, 32.77959303393516],
        [39.886487956237715, 32.77952956285313],
        [39.886498209374054, 32.779569649852846],
        [39.886555883239595, 32.77954793606139],
        [39.88654563011133, 32.779514530228056],
        [39.88674556583186, 32.779441037395],
        [39.886755818930226, 32.77947611352067],
        [39.88680964767025, 32.77945439972925],
        [39.886803239489325, 32.779419323603605],
        [39.88692114992628, 32.77937255543753],
        [39.88693268463226, 32.77940930185403],
        [39.88699163976449, 32.779387588062605],
        [39.88698394996774, 32.779352511938384],
        [39.88704162342407, 32.77932912785465],
        [39.88701727241525, 32.77924227268883],
        [39.88704546831934, 32.77923058064846],
        [39.88703265200098, 32.77915207693988],
        [39.887003174458556, 32.779162098689426],
        [39.886971133637275, 32.77900342098292],
        [39.88699676629517, 32.77899339923337],
        [39.88697882343547, 32.77891823610955],
        [39.88695319077095, 32.77892658756673],
        [39.88692499482832, 32.77878795336082],
        [39.88683015384572, 32.77872114169418],
        [39.886780170031955, 32.778836391817805],
        [39.88682374566673, 32.779045178275],
        [39.88676479038955, 32.77905018914902],
        [39.88672249635562, 32.77914372548119],
        [39.886398241226004, 32.77926732706348],
        [39.88638029820967, 32.77919550452282]
    ];
    // Petrol Mühendisliği polygon'u oluştur
    const petrolMuhendisligiPolygon = L.polygon(petrolMuhendisligi, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['petrolMuhendisligi'] = petrolMuhendisligiPolygon;
    // Havacılık Mühendisliği koordinatları
    const havacilikMuhendisligi = [
        [39.88451404276188, 32.77845048982087],
        [39.88447451714552, 32.77884196581158],
        [39.88454724426228, 32.77885226781103],
        [39.88455198733223, 32.778804878611936],
        [39.88465949683368, 32.77882136181191],
        [39.88465633479203, 32.7788708114108],
        [39.88477333024019, 32.77888729460986],
        [39.88476068209303, 32.778965589808024],
        [39.88479072143849, 32.77897177100857],
        [39.88478755940292, 32.779006797807426],
        [39.884863448219136, 32.77902534140725],
        [39.884871353299815, 32.778988254207604],
        [39.884951985066294, 32.77900061660779],
        [39.885007320536914, 32.77851642261885],
        [39.88498360534058, 32.778510241419184],
        [39.88501364458841, 32.778252691425166],
        [39.88505475090565, 32.77825681222586],
        [39.885062655963566, 32.77815585262812],
        [39.88481601771878, 32.77810228222944],
        [39.88480336957943, 32.77821560422643],
        [39.884841313989654, 32.7782217854261],
        [39.88481285568429, 32.77850406021955]
    ];
    // Havacılık Mühendisliği polygon'u oluştur
    const havacilikMuhendisligiPolygon = L.polygon(havacilikMuhendisligi, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['havacilikMuhendisligi'] = havacilikMuhendisligiPolygon;
    // Havacılık Mühendisliği Laboratuvarı koordinatları
    const havacilikMuhendisligiLab = [
        [39.88378626287394, 32.777728289009076],
        [39.883751479963365, 32.77804765100129],
        [39.88457203573779, 32.77820424139762],
        [39.884603656188034, 32.77788281900456]
    ];
    // Havacılık Mühendisliği Laboratuvarı polygon'u oluştur
    const havacilikMuhendisligiLabPolygon = L.polygon(havacilikMuhendisligiLab, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['havacilikMuhendisligiLab'] = havacilikMuhendisligiLabPolygon;
    // İktisadi A Blok koordinatları
    const iktisadiAblok = [
        [39.898033048583756, 32.782611448240374],
        [39.89805250533743, 32.78281940975134],
        [39.8981355207583, 32.78280081156879],
        [39.89814330344916, 32.782900565463336],
        [39.898645285122456, 32.78280419305668],
        [39.8986932780098, 32.782890420999706],
        [39.8989202709399, 32.78284815240053],
        [39.898957886839014, 32.78278559487265],
        [39.89894491584167, 32.78268753171977],
        [39.89890470573434, 32.782652026096315],
        [39.898902111533204, 32.78258439633737],
        [39.89866344459722, 32.78261821121612],
        [39.89854021949526, 32.78265709832891],
        [39.898490929392324, 32.78260806675249],
        [39.89846369010948, 32.78235614589764],
        [39.898712734576065, 32.782308805065924],
        [39.89869068380062, 32.782195525218384],
        [39.898464987218404, 32.782246247537984],
        [39.89841829128093, 32.782163401081306],
        [39.89820945628318, 32.78219045298579],
        [39.89821594185145, 32.782320640274236],
        [39.898352138648534, 32.78230373283333],
        [39.898374189533484, 32.7825691796412],
        [39.89810568710348, 32.78262497419186],
        [39.898101795755736, 32.782594540801]
    ];
    // İktisadi A Blok polygon'u oluştur
    const iktisadiAblokPolygon = L.polygon(iktisadiAblok, {
        color: "#2980b9",
        weight: 3,
        fillColor: "#85c1e9",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['iktisadiAblok'] = iktisadiAblokPolygon;
    // İktisadi B Blok koordinatları
    const iktisadiBblok = [
        [39.89826742659778, 32.77872406568076],
        [39.898391818586276, 32.77934090659747],
        [39.89848646451364, 32.779298608934425],
        [39.898545956172, 32.77959469257567],
        [39.89932745543791, 32.779316232961605],
        [39.899086787063425, 32.77818124567318],
        [39.89838641024383, 32.778435031649764],
        [39.898429676972654, 32.7786676687972]
    ];
    // İktisadi B Blok polygon'u oluştur
    const iktisadiBblokPolygon = L.polygon(iktisadiBblok, {
        color: "#2980b9",
        weight: 3,
        fillColor: "#85c1e9",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['iktisadiBblok'] = iktisadiBblokPolygon;
    // İnşaat Mühendisliği K1 koordinatları
    const insaatMuhendisligiK1 = [
        [39.8900170028418, 32.78353115290392],
        [39.89005010786056, 32.783897894983824],
        [39.89023454981549, 32.783863994455146],
        [39.89024046140872, 32.78393795924467],
        [39.89054076965809, 32.78389481311771],
        [39.89055732204298, 32.78405969296091],
        [39.89080915426328, 32.784025792432345],
        [39.890805607337114, 32.78398572817147],
        [39.89086354044315, 32.78397340070697],
        [39.89085526428792, 32.7838886493854],
        [39.89079851348376, 32.78389635405145],
        [39.89080087810197, 32.783925631780164],
        [39.890609343797934, 32.783954909508964],
        [39.89060461454929, 32.78388556751935],
        [39.89103733946695, 32.78382084832816],
        [39.89103024563809, 32.783723769542206],
        [39.89115556984379, 32.783702196479396],
        [39.89113192378454, 32.783464892780415],
        [39.89063535466087, 32.783540398502254],
        [39.890629443101716, 32.78348492491085],
        [39.890436726004054, 32.78350957984111],
        [39.8904130796968, 32.78325378494412],
        [39.89022390894729, 32.78328152174049],
        [39.89024755531929, 32.783537316636114],
        [39.89020380952411, 32.783543480368365],
        [39.89019908024747, 32.78350187517515]
    ];
    // İnşaat Mühendisliği K1 polygon'u oluştur
    const insaatMuhendisligiK1Polygon = L.polygon(insaatMuhendisligiK1, {
        color: "#1abc9c",
        weight: 3,
        fillColor: "#a3e4d7",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['insaatMuhendisligiK1'] = insaatMuhendisligiK1Polygon;
    // İnşaat Mühendisliği K2 koordinatları
    const insaatMuhendisligiK2 = [
        [39.889116390262444, 32.783868090893975],
        [39.88914322765649, 32.784115428274646],
        [39.889327255218404, 32.784079202092244],
        [39.889340673875864, 32.784197874067445],
        [39.88964450990858, 32.78413791349024],
        [39.8895994617485, 32.783751917276135],
        [39.8892994594209, 32.783809379496006],
        [39.88930041789641, 32.78382936635438]
    ];
    // İnşaat Mühendisliği K2 polygon'u oluştur
    const insaatMuhendisligiK2Polygon = L.polygon(insaatMuhendisligiK2, {
        color: "#1abc9c",
        weight: 3,
        fillColor: "#a3e4d7",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['insaatMuhendisligiK2'] = insaatMuhendisligiK2Polygon;
    // İnşaat Mühendisliği K3 koordinatları
    const insaatMuhendisligiK3 = [
        [39.8879990133895, 32.78373414973527],
        [39.88803224518105, 32.78409102476462],
        [39.88892285119218, 32.78394030569865],
        [39.888884302812926, 32.78358343066935],
        [39.8883366476411, 32.78367178322438],
        [39.88832335498594, 32.78352279656215],
        [39.888347281764, 32.78351586695018],
        [39.888319367188274, 32.783269865715624],
        [39.88813592826696, 32.783299316567366],
        [39.888159855110416, 32.78355051501012],
        [39.8881811234088, 32.78354878260791],
        [39.888193086824, 32.78369603686784]
    ];
    // İnşaat Mühendisliği K3 polygon'u oluştur
    const insaatMuhendisligiK3Polygon = L.polygon(insaatMuhendisligiK3, {
        color: "#1abc9c",
        weight: 3,
        fillColor: "#a3e4d7",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['insaatMuhendisligiK3'] = insaatMuhendisligiK3Polygon;
    // İnşaat Mühendisliği K4 koordinatları
    const insaatMuhendisligiK4 = [
        [39.88714807732978, 32.7836330945608],
        [39.88715670388311, 32.78399785473741],
        [39.88718066652811, 32.78399410720206],
        [39.88718545905621, 32.784074054637614],
        [39.887292811593085, 32.78407155628028],
        [39.887314857182275, 32.7840303333833],
        [39.8873618238498, 32.784026585847954],
        [39.88734936330863, 32.7835781306982],
        [39.88730527214457, 32.78358062905551],
        [39.88727555851784, 32.78354190451691],
        [39.88717299848301, 32.78354939958885],
        [39.88717108147162, 32.78363059620355]
    ];
    // İnşaat Mühendisliği K4 polygon'u oluştur
    const insaatMuhendisligiK4Polygon = L.polygon(insaatMuhendisligiK4, {
        color: "#1abc9c",
        weight: 3,
        fillColor: "#a3e4d7",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['insaatMuhendisligiK4'] = insaatMuhendisligiK4Polygon;
    // İnşaat Mühendisliği K5 koordinatları
    const insaatMuhendisligiK5 = [
        [39.886375517254606, 32.78357438354607],
        [39.88638318538975, 32.78391915686325],
        [39.88640618978738, 32.783916658506],
        [39.88641098236968, 32.784074055020824],
        [39.88679822189161, 32.784059064877084],
        [39.88679822189161, 32.7840153436228],
        [39.88683943785034, 32.78401409444365],
        [39.88683847933959, 32.78390416671951],
        [39.88691516012926, 32.78389792082575],
        [39.88690557503483, 32.78355689504389]
    ];
    // İnşaat Mühendisliği K5 polygon'u oluştur
    const insaatMuhendisligiK5Polygon = L.polygon(insaatMuhendisligiK5, {
        color: "#1abc9c",
        weight: 3,
        fillColor: "#a3e4d7",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['insaatMuhendisligiK5'] = insaatMuhendisligiK5Polygon;
    // İstatistik koordinatları
    const istatistik = [
        [39.893315463385676, 32.78173015461326],
        [39.89333104654543, 32.781902118325604],
        [39.89343389531183, 32.78188586978524],
        [39.89344116744073, 32.78193326135951],
        [39.893506616568345, 32.78192513708996],
        [39.893486877949385, 32.78170578180453],
        [39.89343597306299, 32.78171255202858],
        [39.89343077868446, 32.781667868545384],
        [39.893348707455516, 32.78167870090479],
        [39.89335494071713, 32.781722030343644]
    ];
    // İstatistik polygon'u oluştur
    const istatistikPolygon = L.polygon(istatistik, {
        color: "#34495e",
        weight: 3,
        fillColor: "#7f8c8d",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['istatistik'] = istatistikPolygon;
    // Polygon click event'lerini ekle
    Object.entries(polygons).forEach(([id, polygon]) => {
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
            const sectionId = e.target.getAttribute('data-section');
            if (sectionId) {
                selectSubSection(sectionId);
            }
        });
    });
}
// Sayfa yüklendiğinde haritayı başlat
window.addEventListener('DOMContentLoaded', initMap);
