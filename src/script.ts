import { getAllBuildings, getBuildingById } from './services/buildingService';
import type { Building } from './services/buildingService';

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



// Bina verileri
const buildings: Building[] = [
    {
        id: 1,
        bina_adi: "Fizik Bölümü",
        calısma_salonlari: "A101, A102, A103",
        calısma_salonlari_kapasiteler: "30, 25, 20",
        calısma_salonlari_bölüm_özel: "Fizik Laboratuvarı, Fizik Seminer Odası",
        calısma_salonlari_pc: "Var, Var, Yok",
        asansor_sayisi: 2,
        rampa_sayisi: 1,
        erisilebilirlik_derecesi: 3,
        geri_dönüsüm_kutuları: 2,
        kantin_menu: "Günlük menü, Sandviç, İçecekler",
        otomat_sayisi: 2,
        polygon_koordinatları: "[[39.8901,32.7847],[39.8902,32.7847],[39.8902,32.7848],[39.8901,32.7848]]",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
    },

    // Kimya Bölümü
    'kimya-1': {
        title: 'Erişilebilirlik',
        description: 'Kimya Bölümü binası engelli erişimine uygun olarak tasarlanmıştır. Asansör ve rampalar mevcuttur.',
        imageUrl: 'kimya-erisim.jpg'
    },
    'kimya-2': {
        title: 'Çalışma Salonları ve Bilgisayar Laboratuvarları',
        description: 'Modern bilgisayar laboratuvarları ve geniş çalışma salonları öğrencilerin kullanımına açıktır.',
        imageUrl: 'kimya-lab.jpg'
    },
    'kimya-3': {
        title: 'Kantin ve Otomatlar',
        description: 'Bina içerisinde kantin ve çeşitli otomatlar bulunmaktadır.',
        imageUrl: 'kimya-kantin.jpg'
    },
    'kimya-4': {
        title: 'Geri Dönüşüm',
        description: 'Bina içerisinde geri dönüşüm noktaları bulunmaktadır.',
        imageUrl: 'kimya-geri-donusum.jpg'
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
function openModal(building: any): void {
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

    // Yeni bina koordinatları
    const elektrikDblok: [number, number][] = [
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
    const elektrikBCblok: [number, number][] = [
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
    const elektrikAblok: [number, number][] = [
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
    const elektrikEblok: [number, number][] = [
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
    const elektrikFblok: [number, number][] = [
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
    const bote: [number, number][] = [
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
    const biyoloji: [number, number][] = [
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
    const cevreMuhendisligiParca1: [number, number][] = [
        [39.887164262668506, 32.78318662136385],
        [39.88716679492117, 32.783333479081136],
        [39.88671352029226, 32.78335163003507],
        [39.886712254157885, 32.78323612396491]
    ];

    // Çevre Mühendisliği Parça 2 koordinatları
    const cevreMuhendisligiParca2: [number, number][] = [
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
    const egitimFakultesi: [number, number][] = [
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
    const egitimFakultesiDblok: [number, number][] = [
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
    const gidaMuhendisligi: [number, number][] = [
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
    const petrolMuhendisligi: [number, number][] = [
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
    const havacilikMuhendisligi: [number, number][] = [
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
    const havacilikMuhendisligiLab: [number, number][] = [
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
    const iktisadiAblok: [number, number][] = [
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
    const iktisadiBblok: [number, number][] = [
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
    const insaatMuhendisligiK1: [number, number][] = [
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
    const insaatMuhendisligiK2: [number, number][] = [
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
    const insaatMuhendisligiK3: [number, number][] = [
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
    const insaatMuhendisligiK4: [number, number][] = [
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
    const insaatMuhendisligiK5: [number, number][] = [
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
    const istatistik: [number, number][] = [
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

    // Kimya Bölümü koordinatları
    const kimyaBinasi: [number, number][] = [
        [39.89333107540014, 32.78191005498721],
        [39.8933342286077, 32.781955262857394],
        [39.893261704810556, 32.781969647179125],
        [39.89325539839001, 32.78188950595529],
        [39.89321755985324, 32.781893615761476],
        [39.893219136459294, 32.78191416479342],
        [39.89316710843818, 32.781926494212996],
        [39.8931665954822, 32.78190001078539],
        [39.89295059650149, 32.78193332749649],
        [39.89295570891167, 32.78195831503061],
        [39.89294164978378, 32.7819783050588],
        [39.89295570891167, 32.782094913552186],
        [39.892973602342835, 32.782104908565515],
        [39.892974880444854, 32.78212323275744],
        [39.89318193266212, 32.78208991604481],
        [39.89318193266212, 32.782066594347015],
        [39.89333913855796, 32.78204160681145],
        [39.89336725664779, 32.782299811332365],
        [39.89332252331772, 32.78230980634572],
        [39.89331102045662, 32.782256499606405],
        [39.89312314012099, 32.78228648464798],
        [39.893129530616875, 32.782339791387244],
        [39.893057957027, 32.78235478390795],
        [39.89304901032273, 32.78230147716721],
        [39.89289052565843, 32.782333128044996],
        [39.89292120013832, 32.78261465426374],
        [39.893253506123074, 32.78254968667483],
        [39.89326756518699, 32.78268795102974],
        [39.89292886875589, 32.78275125278387],
        [39.892960821320884, 32.783042774015996],
        [39.89329951759353, 32.782974474755946],
        [39.89335319760431, 32.78305776653673],
        [39.89368294531704, 32.782987801440385],
        [39.89376474295375, 32.78281955204392],
        [39.893727678411324, 32.78242808067395],
        [39.8935922009494, 32.78244973653699],
        [39.89360753803402, 32.78266629516676],
        [39.89356408295242, 32.782667961003085],
        [39.893565361043386, 32.78270960689275],
        [39.89336086617351, 32.78273792609943],
        [39.893331469985725, 32.78245639988066],
        [39.893381315687776, 32.78244307319471],
        [39.893391540442906, 32.782523033304415],
        [39.893484841261255, 32.78250804078368],
        [39.89343755182128, 32.78198830007216],
        [39.893391540442906, 32.78198996590842],
        [39.89338642806669, 32.781906782363535]
    ];

    // Kimya Bölümü polygon'u oluştur
    const kimyaPolygon = L.polygon(kimyaBinasi, {
        color: "#e67e22",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['kimya'] = kimyaPolygon;

    // Jeoloji Mühendisliği koordinatları
    const jeolojiMuhendisligi: [number, number][] = [
        [39.88581002165685, 32.781513533505176],
        [39.88578170114516, 32.781651597310116],
        [39.88606071012117, 32.781744551159704],
        [39.8860502210824, 32.78181153260937],
        [39.88623063232481, 32.78187304618575],
        [39.88627993066271, 32.78162015703802],
        [39.88615825810419, 32.78157504708153],
        [39.88622958342367, 32.78121416743207],
        [39.886168747126476, 32.78118682806439],
        [39.88618028504908, 32.78113488326687],
        [39.88603553642557, 32.78108020453149],
        [39.88599567805531, 32.781272947071756],
        [39.886101617356786, 32.781309855218325],
        [39.886059661217445, 32.781524469251764],
        [39.886070150254795, 32.78152857015732],
        [39.88606280792868, 32.78157368011381],
        [39.8860145583391, 32.781553175587135],
        [39.88601665614797, 32.78153130409396],
        [39.88587610280544, 32.78148072626419],
        [39.88586351592488, 32.7815272031884]
    ];

    // Jeoloji Mühendisliği polygon'u oluştur
    const jeolojiMuhendisligiPolygon = L.polygon(jeolojiMuhendisligi, {
        color: "#16a085",
        weight: 3,
        fillColor: "#7dcea0",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['jeolojiMuhendisligi'] = jeolojiMuhendisligiPolygon;

    // Kimya Mühendisliği D Blok koordinatları
    const kimyaMuhendisligiDblok: [number, number][] = [
        [39.88836089980592, 32.78196846144513],
        [39.88841956908698, 32.78252475363405],
        [39.88838045623828, 32.78253140254543],
        [39.88841276685429, 32.78281952200595],
        [39.88863638990844, 32.782778520390366],
        [39.888604929674926, 32.78249040092979],
        [39.88853860805443, 32.782503698750645],
        [39.88847738803992, 32.78194629840948]
    ];

    // Kimya Mühendisliği D Blok polygon'u oluştur
    const kimyaMuhendisligiDblokPolygon = L.polygon(kimyaMuhendisligiDblok, {
        color: "#e74c3c",
        weight: 3,
        fillColor: "#f5b7b1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['kimyaMuhendisligiDblok'] = kimyaMuhendisligiDblokPolygon;

    // Kimya Mühendisliği C Blok koordinatları
    const kimyaMuhendisligiCblok: [number, number][] = [
        [39.88799542824256, 32.78273940174532],
        [39.88800643307121, 32.782864299149935],
        [39.888226987796855, 32.78282485786414],
        [39.88821323180565, 32.78270354603137]
    ];

    // Kimya Mühendisliği C Blok polygon'u oluştur
    const kimyaMuhendisligiCblokPolygon = L.polygon(kimyaMuhendisligiCblok, {
        color: "#e74c3c",
        weight: 3,
        fillColor: "#f5b7b1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['kimyaMuhendisligiCblok'] = kimyaMuhendisligiCblokPolygon;

    // Kimya Mühendisliği A Blok koordinatları
    const kimyaMuhendisligiAblok: [number, number][] = [
        [39.88793878008735, 32.78188647617796],
        [39.88798388170025, 32.782319805151616],
        [39.88815065252146, 32.78228699791066],
        [39.88810974650849, 32.78185776984259]
    ];

    // Kimya Mühendisliği A Blok polygon'u oluştur
    const kimyaMuhendisligiAblokPolygon = L.polygon(kimyaMuhendisligiAblok, {
        color: "#e74c3c",
        weight: 3,
        fillColor: "#f5b7b1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['kimyaMuhendisligiAblok'] = kimyaMuhendisligiAblokPolygon;

    // Kimya Mühendisliği B Blok koordinatları
    const kimyaMuhendisligiBblok: [number, number][] = [
        [39.88746047562924, 32.7825439652614],
        [39.88748774656554, 32.782832395588],
        [39.88753494623762, 32.78282282680911],
        [39.887580048115694, 32.78325205487843],
        [39.887771992986615, 32.783215146731806],
        [39.88775730869855, 32.78304017478041],
        [39.887926177821896, 32.7830060005717],
        [39.887895760433, 32.782735340833966],
        [39.887910444691414, 32.78273123992841],
        [39.88787163628729, 32.78237992905778],
        [39.88775101543149, 32.78240180055096],
        [39.88775940645411, 32.782492020463934]
    ];

    // Kimya Mühendisliği B Blok polygon'u oluştur
    const kimyaMuhendisligiBblokPolygon = L.polygon(kimyaMuhendisligiBblok, {
        color: "#e74c3c",
        weight: 3,
        fillColor: "#f5b7b1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['kimyaMuhendisligiBblok'] = kimyaMuhendisligiBblokPolygon;

    // Maden Mühendisliği Parça 1 koordinatları
    const madenMuhendisligiParca1: [number, number][] = [
        [39.88581515167343, 32.7798943960654],
        [39.885743376967895, 32.780221782358865],
        [39.88583876175798, 32.780256244073826],
        [39.885813262866435, 32.78037316774959],
        [39.885892592718704, 32.78039778326058],
        [39.88591809158072, 32.78028578268675],
        [39.88596247846513, 32.78029932121666],
        [39.88589070391379, 32.78064763069406],
        [39.886001198915494, 32.78068824628704],
        [39.886105082943345, 32.78021193615382],
        [39.886129637326775, 32.780220551582886],
        [39.88614852530742, 32.78012578186704],
        [39.88599647691109, 32.78006670464117],
        [39.886015364928426, 32.77996701182229]
    ];

    // Maden Mühendisliği Parça 1 polygon'u oluştur
    const madenMuhendisligiParca1Polygon = L.polygon(madenMuhendisligiParca1, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['madenMuhendisligiParca1'] = madenMuhendisligiParca1Polygon;

    // Maden Mühendisliği Parça 2 koordinatları
    const madenMuhendisligiParca2: [number, number][] = [
        [39.88567040591661, 32.78001396044883],
        [39.885638205541284, 32.78016214728751],
        [39.88570763758153, 32.780188375046805],
        [39.88573883166336, 32.78003887682081]
    ];

    // Maden Mühendisliği Parça 2 polygon'u oluştur
    const madenMuhendisligiParca2Polygon = L.polygon(madenMuhendisligiParca2, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['madenMuhendisligiParca2'] = madenMuhendisligiParca2Polygon;

    // Maden Mühendisliği Parça 3 koordinatları
    const madenMuhendisligiParca3: [number, number][] = [
        [39.885518963395384, 32.77995757076715],
        [39.88546412200168, 32.780209357254506],
        [39.88557229535158, 32.78024804319858],
        [39.88562663352795, 32.77999756809973]
    ];

    // Maden Mühendisliği Parça 3 polygon'u oluştur
    const madenMuhendisligiParca3Polygon = L.polygon(madenMuhendisligiParca3, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['madenMuhendisligiParca3'] = madenMuhendisligiParca3Polygon;

    // Maden Mühendisliği Parça 4 koordinatları
    const madenMuhendisligiParca4: [number, number][] = [
        [39.88567411291197, 32.78040385679688],
        [39.88561927164238, 32.78065564328418],
        [39.885650968895504, 32.78067006855176],
        [39.8856444281937, 32.78070875449589],
        [39.88571687900955, 32.78073432656089],
        [39.88572191031369, 32.78072121268187],
        [39.88579285165844, 32.78074809613423],
        [39.88583058638619, 32.780569747373164],
        [39.88580241112467, 32.78055728918716],
        [39.885811467460144, 32.78050024381233],
        [39.88574253865548, 32.780473360358826],
        [39.885748073087626, 32.780431395944646]
    ];

    // Maden Mühendisliği Parça 4 polygon'u oluştur
    const madenMuhendisligiParca4Polygon = L.polygon(madenMuhendisligiParca4, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['madenMuhendisligiParca4'] = madenMuhendisligiParca4Polygon;

    // Makina Mühendisliği A Blok koordinatları
    const makinaMuhendisligiAblok: [number, number][] = [
        [39.88934696360661, 32.78232156444176],
        [39.88938760377218, 32.78272637793049],
        [39.88959273948106, 32.782687283792654],
        [39.88958403090285, 32.782580090190606],
        [39.88964595855086, 32.78256747917783],
        [39.88966724616725, 32.782769255371335],
        [39.88987238103928, 32.782732683436905],
        [39.88984432017284, 32.78246911328338],
        [39.88971852994237, 32.78248802980147],
        [39.88971078899783, 32.78242371364027],
        [39.88956758136109, 32.78244641346129],
        [39.889548228955505, 32.78228373140561]
    ];

    // Makina Mühendisliği A Blok polygon'u oluştur
    const makinaMuhendisligiAblokPolygon = L.polygon(makinaMuhendisligiAblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiAblok'] = makinaMuhendisligiAblokPolygon;

    // Makina Mühendisliği B Blok koordinatları
    const makinaMuhendisligiBblok: [number, number][] = [
        [39.88883895996963, 32.78211852833289],
        [39.88885347442496, 32.78226986047855],
        [39.88901023034697, 32.78224211625178],
        [39.888997651181256, 32.78209078410606],
        [39.88908280241233, 32.78207312868972],
        [39.889126435809374, 32.78247248811405],
        [39.889018376882234, 32.78249457946987],
        [39.889000013910305, 32.78234270140459],
        [39.88883050932205, 32.78237123607161],
        [39.88887571058635, 32.78278913086871],
        [39.889045215062794, 32.78275691430929],
        [39.88902967716979, 32.782610559083395],
        [39.8892909958098, 32.78256177400752],
        [39.88923237576904, 32.78202145628407],
        [39.88919282487009, 32.78202697912346],
        [39.88918929353849, 32.7819910806717],
        [39.88916386794742, 32.78199384209054],
        [39.88915609901477, 32.781934931811094],
        [39.88888559835925, 32.78198187593995],
        [39.88889619239973, 32.782107980758695]
    ];

    // Makina Mühendisliği B Blok polygon'u oluştur
    const makinaMuhendisligiBblokPolygon = L.polygon(makinaMuhendisligiBblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiBblok'] = makinaMuhendisligiBblokPolygon;

    // Makina Mühendisliği C Blok koordinatları
    const makinaMuhendisligiCblok: [number, number][] = [
        [39.88929972416733, 32.78190734837625],
        [39.88932984794252, 32.78217768309898],
        [39.88953382859097, 32.782137301149106],
        [39.88950370490463, 32.781873696751205]
    ];

    // Makina Mühendisliği C Blok polygon'u oluştur
    const makinaMuhendisligiCblokPolygon = L.polygon(makinaMuhendisligiCblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiCblok'] = makinaMuhendisligiCblokPolygon;

    // Makina Mühendisliği D Blok koordinatları
    const makinaMuhendisligiDblok: [number, number][] = [
        [39.88998397599758, 32.779900998546935],
        [39.89001237813184, 32.780262192658114],
        [39.89007434638367, 32.780252097170376],
        [39.89007864973189, 32.78031715697887],
        [39.890017542154766, 32.780329495908205],
        [39.89003303422197, 32.7805269187763],
        [39.89026713614135, 32.78049102370966],
        [39.89024906212475, 32.78029472256185],
        [39.89018881536751, 32.78030257460793],
        [39.890182790689465, 32.78023751479944],
        [39.890246480121704, 32.78022517587016],
        [39.890216356749306, 32.7798707120848]
    ];

    // Makina Mühendisliği D Blok polygon'u oluştur
    const makinaMuhendisligiDblokPolygon = L.polygon(makinaMuhendisligiDblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiDblok'] = makinaMuhendisligiDblokPolygon;

    // Makina Mühendisliği E Blok Parça 1 koordinatları
    const makinaMuhendisligiEblokParca1: [number, number][] = [
        [39.88973285013532, 32.78019857468678],
        [39.889755254419896, 32.78045983445787],
        [39.889856663194394, 32.78053206509986],
        [39.88996514683325, 32.780513623234356],
        [39.88995689264914, 32.780373772416056],
        [39.88991444254481, 32.7803276677495],
        [39.889855484023485, 32.78033381503937],
        [39.8898531256811, 32.78030000495124],
        [39.88991208420501, 32.7802907840171],
        [39.88994274261728, 32.78023545841921],
        [39.889915621714636, 32.77991887305015]
    ];

    // Makina Mühendisliği E Blok Parça 1 polygon'u oluştur
    const makinaMuhendisligiEblokParca1Polygon = L.polygon(makinaMuhendisligiEblokParca1, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiEblokParca1'] = makinaMuhendisligiEblokParca1Polygon;

    // Makina Mühendisliği E Blok Parça 2 koordinatları
    const makinaMuhendisligiEblokParca2: [number, number][] = [
        [39.88940621842204, 32.78000954555907],
        [39.88943687706063, 32.78038453017027],
        [39.88971280419068, 32.78034457279358],
        [39.88968214567552, 32.77997112500384]
    ];

    // Makina Mühendisliği E Blok Parça 2 polygon'u oluştur
    const makinaMuhendisligiEblokParca2Polygon = L.polygon(makinaMuhendisligiEblokParca2, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiEblokParca2'] = makinaMuhendisligiEblokParca2Polygon;

    // Makina Mühendisliği F Blok koordinatları
    const makinaMuhendisligiFblok: [number, number][] = [
        [39.88880010338397, 32.780235477216536],
        [39.888828403916534, 32.7805858726737],
        [39.88910551267958, 32.780550525764056],
        [39.889100795944216, 32.78043065363403],
        [39.889395591291134, 32.780387622611755],
        [39.88937200771028, 32.78014634153041],
        [39.88927413576167, 32.780158636107444],
        [39.88928356920877, 32.78027236094891],
        [39.889165651029174, 32.78029233963727],
        [39.88916093429796, 32.78023240357223],
        [39.889112587782535, 32.780235477216536],
        [39.88909136247196, 32.78000956435639],
        [39.88888146738367, 32.78003722715599],
        [39.88889208007177, 32.78016478339592],
        [39.88905834530971, 32.78014019424194],
        [39.88906542041752, 32.78019551983985]
    ];

    // Makina Mühendisliği F Blok polygon'u oluştur
    const makinaMuhendisligiFblokPolygon = L.polygon(makinaMuhendisligiFblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiFblok'] = makinaMuhendisligiFblokPolygon;

    // Makina Mühendisliği G Blok koordinatları
    const makinaMuhendisligiGblok: [number, number][] = [
        [39.88901117790732, 32.7806104618291],
        [39.88903122405716, 32.78082100646657],
        [39.88913027553599, 32.780802564601004],
        [39.8891467841018, 32.78097622550743],
        [39.889528838372144, 32.78092089990818],
        [39.88950407566023, 32.780639661450124],
        [39.88941799568596, 32.780648882382906],
        [39.88942389157785, 32.78073494442472],
        [39.8893814411434, 32.780739554891795],
        [39.889374366068694, 32.78065810331569],
        [39.889284748389485, 32.78066886107126],
        [39.88929418183511, 32.7807518494688],
        [39.88925173132034, 32.78075799675733],
        [39.88924229786889, 32.78067961882678],
        [39.889120842067825, 32.780693450226636],
        [39.88911022941514, 32.78059816725073]
    ];

    // Makina Mühendisliği G Blok polygon'u oluştur
    const makinaMuhendisligiGblokPolygon = L.polygon(makinaMuhendisligiGblok, {
        color: "#8e44ad",
        weight: 3,
        fillColor: "#bb8fce",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['makinaMuhendisligiGblok'] = makinaMuhendisligiGblokPolygon;

    // Merkez Mühendislik Parça 1 koordinatları
    const merkezMuhendislikParca1: [number, number][] = [
        [39.892258021649155, 32.78331766519972],
        [39.89231458774279, 32.78337154161457],
        [39.89216773336477, 32.783625327888046],
        [39.89219492864328, 32.78365084829457],
        [39.89217426023248, 32.783687711105074],
        [39.892217772669454, 32.78373449851878],
        [39.89219492864328, 32.783784121533216],
        [39.8922612850788, 32.78384934035216],
        [39.892409227064405, 32.78360122528014],
        [39.89252888578929, 32.78371890271421],
        [39.8926017687285, 32.78358704727654],
        [39.89250495406131, 32.7834920546494],
        [39.8924777589053, 32.78328647359058],
        [39.89234830981462, 32.7831588715533]
    ];

    // Merkez Mühendislik Parça 1 polygon'u oluştur
    const merkezMuhendislikParca1Polygon = L.polygon(merkezMuhendislikParca1, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['merkezMuhendislikParca1'] = merkezMuhendislikParca1Polygon;

    // Merkez Mühendislik Parça 2 koordinatları
    const merkezMuhendislikParca2: [number, number][] = [
        [39.89227575690899, 32.78302768427406],
        [39.892491048057906, 32.78322800425394],
        [39.89255909634548, 32.783101848540866],
        [39.89234615190958, 32.782901528560984]
    ];

    // Merkez Mühendislik Parça 2 polygon'u oluştur
    const merkezMuhendislikParca2Polygon = L.polygon(merkezMuhendislikParca2, {
        color: "#2c3e50",
        weight: 3,
        fillColor: "#95a5a6",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['merkezMuhendislikParca2'] = merkezMuhendislikParca2Polygon;

    // Metalurji ve Malzeme Mühendisliği koordinatları
    const metalurjiMalzemeMuhendisligi: [number, number][] = [
        [39.8855256409573, 32.78263046157036],
        [39.88548588402634, 32.78284922425138],
        [39.885693503300274, 32.782918307202294],
        [39.88569939320004, 32.782897198522534],
        [39.88576712700552, 32.782918307202294],
        [39.88583338827294, 32.78258248729921],
        [39.88604100649519, 32.78265540819177],
        [39.88602186441594, 32.78275903261897],
        [39.88594529604538, 32.78273600496925],
        [39.885846640518935, 32.78325412710541],
        [39.886079290637724, 32.783334723882945],
        [39.88619561540105, 32.78274943776577],
        [39.886107267497295, 32.782720653202716],
        [39.88611904722458, 32.78265924613336],
        [39.88628543565318, 32.78271489628949],
        [39.8863237196592, 32.78250189052173],
        [39.88611315736148, 32.7824270506575],
        [39.886094015302376, 32.78237907638635],
        [39.88576123711226, 32.78226585710419],
        [39.885711172996764, 32.78254026993963],
        [39.88569203082537, 32.782686111726434]
    ];

    // Metalurji ve Malzeme Mühendisliği polygon'u oluştur
    const metalurjiMalzemeMuhendisligiPolygon = L.polygon(metalurjiMalzemeMuhendisligi, {
        color: "#16a085",
        weight: 3,
        fillColor: "#7dcea0",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['metalurjiMalzemeMuhendisligi'] = metalurjiMalzemeMuhendisligiPolygon;

    // Metalurji ve Malzeme Mühendisliği E Blok koordinatları
    const metalurjiMalzemeMuhendisligiEblok: [number, number][] = [
        [39.88523735299006, 32.78183133965743],
        [39.8852079032896, 32.78196950556105],
        [39.88525796777259, 32.781988695270826],
        [39.88523293553533, 32.78211150940615],
        [39.88510335675221, 32.7820692920466],
        [39.885075379482345, 32.782195944125306],
        [39.88548325749264, 32.78233411002881],
        [39.885592220881904, 32.782364813561855],
        [39.885664372220475, 32.78200212806561],
        [39.88556129885686, 32.78195607276615]
    ];

    // Metalurji ve Malzeme Mühendisliği E Blok polygon'u oluştur
    const metalurjiMalzemeMuhendisligiEblokPolygon = L.polygon(metalurjiMalzemeMuhendisligiEblok, {
        color: "#16a085",
        weight: 3,
        fillColor: "#7dcea0",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['metalurjiMalzemeMuhendisligiEblok'] = metalurjiMalzemeMuhendisligiEblokPolygon;

    // Mimarlık Amfisi koordinatları
    const mimarlikAmfisi: [number, number][] = [
        [39.89666670836601, 32.782214535367814],
        [39.89668973254683, 32.78242564421453],
        [39.89671672640361, 32.782417365436515],
        [39.896719902150664, 32.7824628987174],
        [39.89693267687696, 32.78242150482549],
        [39.896900125562524, 32.782126573348165],
        [39.896687350735135, 32.782169002087784],
        [39.89669132042101, 32.782208326284234]
    ];

    // Mimarlık Amfisi polygon'u oluştur
    const mimarlikAmfisiPolygon = L.polygon(mimarlikAmfisi, {
        color: "#e67e22",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['mimarlikAmfisi'] = mimarlikAmfisiPolygon;

    // Mimarlık Yeni Bina koordinatları
    const mimarlikYeniBina: [number, number][] = [
        [39.89642564731287, 32.78105000973645],
        [39.89646931400941, 32.78141531082872],
        [39.89674481052464, 32.781355289686275],
        [39.89670193794092, 32.78099412798298]
    ];

    // Mimarlık Yeni Bina polygon'u oluştur
    const mimarlikYeniBinaPolygon = L.polygon(mimarlikYeniBina, {
        color: "#e67e22",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['mimarlikYeniBina'] = mimarlikYeniBinaPolygon;

    // Mimarlık Fakültesi koordinatları
    const mimarlikFakultesi: [number, number][] = [
        [39.89680562810412, 32.781250109431454],
        [39.896827096685115, 32.78142500319274],
        [39.89697200943229, 32.78139527125359],
        [39.89699347796113, 32.78161913526779],
        [39.89670633582867, 32.78166460764564],
        [39.89674256410791, 32.78201614410486],
        [39.897014946483296, 32.78196892279024],
        [39.89701092113597, 32.78192345041239],
        [39.897217555331366, 32.78188672272151],
        [39.89723097311486, 32.782028386668514],
        [39.89766704964347, 32.781949684476416],
        [39.89767375849121, 32.78200739941633],
        [39.897854897139325, 32.78197242066537],
        [39.89783342887969, 32.78176779496496],
        [39.89766973318265, 32.78179927584088],
        [39.89765497371525, 32.78166285870728],
        [39.897637530704344, 32.781666356582406],
        [39.89763350539363, 32.781633126768185],
        [39.897679125569, 32.781624382079656],
        [39.89768315087761, 32.781650616145214],
        [39.89797163068039, 32.781594650140505],
        [39.897931377757686, 32.781218628554],
        [39.89764826486564, 32.78126934774531],
        [39.89766302433452, 32.78146872663379],
        [39.8976053282108, 32.781475722384016],
        [39.89759191050064, 32.78138477762829],
        [39.89728196066767, 32.7814424925682],
        [39.89729537843792, 32.78156142032623],
        [39.897100820505216, 32.78159290120374],
        [39.89707801022885, 32.78135329675081],
        [39.897064592415404, 32.781335807375285],
        [39.897182669082355, 32.78131307118639],
        [39.89716120061274, 32.7811399263619],
        [39.89703373143473, 32.781162662550884],
        [39.89704044034508, 32.78123961580616],
        [39.897018971830306, 32.78124311368123],
        [39.89700152865754, 32.78106996885839],
        [39.89687271739794, 32.78109445398408],
        [39.89688345167846, 32.78123611793106]
    ];

    // Mimarlık Fakültesi polygon'u oluştur
    const mimarlikFakultesiPolygon = L.polygon(mimarlikFakultesi, {
        color: "#e67e22",
        weight: 3,
        fillColor: "#f5b041",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['mimarlikFakultesi'] = mimarlikFakultesiPolygon;

    // Modern Diller Bölümü koordinatları
    const modernDillerBolumu: [number, number][] = [
        [39.89417911589314, 32.78250008325642],
        [39.89419374640144, 32.78263020287346],
        [39.89417395218368, 32.78263244631506],
        [39.89417997651174, 32.782710966774175],
        [39.89420235258186, 32.78270423644932],
        [39.89421440123152, 32.78283772122927],
        [39.89458704772247, 32.78276929625787],
        [39.894549180734856, 32.78243951033019]
    ];

    // Modern Diller Bölümü polygon'u oluştur
    const modernDillerBolumuPolygon = L.polygon(modernDillerBolumu, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['modernDillerBolumu'] = modernDillerBolumuPolygon;

    // Beşeri Bilimler koordinatları
    const beseriBilimler: [number, number][] = [
        [39.895869214617306, 32.78190867278818],
        [39.895888804308214, 32.78210564652579],
        [39.89625167900385, 32.78204485216216],
        [39.896249813329206, 32.78200959143089],
        [39.89632817162487, 32.781997432558626],
        [39.8963179104245, 32.78190624101376],
        [39.89655764897651, 32.78186490084579],
        [39.89652686547382, 32.78156944023894],
        [39.89655018630992, 32.781564576690045],
        [39.89654085797662, 32.78148675990522],
        [39.89648208944544, 32.78149770289082],
        [39.89647369393674, 32.78144663562506],
        [39.89637014924634, 32.78146244215952],
        [39.896380410438894, 32.781582814998984],
        [39.896260074539754, 32.78160348508243],
        [39.8962684700746, 32.781687381305005],
        [39.89621623117523, 32.781695892515046],
        [39.89621343266134, 32.78166671122048],
        [39.89608470091261, 32.7816861654172],
        [39.89610708906034, 32.78190502512601],
        [39.896181716166154, 32.781891650365935],
        [39.89618451468053, 32.781918399886024],
        [39.896010073700296, 32.781948797067315],
        [39.896004476656344, 32.78189043447924]
    ];

    // Beşeri Bilimler polygon'u oluştur
    const beseriBilimlerPolygon = L.polygon(beseriBilimler, {
        color: "#9b59b6",
        weight: 3,
        fillColor: "#d2b4de",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['beseriBilimler'] = beseriBilimlerPolygon;

    // Fizik Üçlü Amfi koordinatları
    const fizikUcluAmfi: [number, number][] = [
        [39.894723169639605, 32.782418731515605],
        [39.89476067884809, 32.782438686419255],
        [39.894737714028935, 32.78251451505233],
        [39.89474536896927, 32.7825843572146],
        [39.89472163865108, 32.7826023166279],
        [39.89472852809939, 32.78265320163129],
        [39.894764506317415, 32.78267215878935],
        [39.89487779930698, 32.782656194867144],
        [39.89488162676912, 32.78271406408683],
        [39.89495817597603, 32.78270308888992],
        [39.89499721603897, 32.782783906249136],
        [39.895014056843536, 32.782768940071634],
        [39.89503702157006, 32.78281483634885],
        [39.89510821217374, 32.78271805506745],
        [39.895092136882795, 32.78270608212571],
        [39.89509749531308, 32.782688122712386],
        [39.89512046001167, 32.782696104673505],
        [39.89514648666136, 32.78257138652734],
        [39.89512199099195, 32.782566397801276],
        [39.8951235219715, 32.782548438388744],
        [39.895151845088066, 32.782547440643185],
        [39.8951441901925, 32.782423720241695],
        [39.89509443335277, 32.782447666125904],
        [39.89508524747106, 32.78242072700672],
        [39.89503242862483, 32.78244467289005],
        [39.89499338858266, 32.782363855531685],
        [39.89502783567997, 32.782314966017765],
        [39.894948990076045, 32.782251110327195],
        [39.8948556000195, 32.78224811709137],
        [39.89485406903398, 32.782280044937494],
        [39.894824214808125, 32.782271065230844],
        [39.89475914786041, 32.782306984056675],
        [39.894727762604845, 32.78236884425783],
        [39.8947208731565, 32.782390794650865]
    ];

    // Fizik Üçlü Amfi polygon'u oluştur
    const fizikUcluAmfiPolygon = L.polygon(fizikUcluAmfi, {
        color: "#ff7800",
        weight: 3,
        fillColor: "#ffcc99",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['fizikUcluAmfi'] = fizikUcluAmfiPolygon;

    // Temel İngilizce B-C Blok koordinatları
    const temelIngilizceBCblok: [number, number][] = [
        [39.900401443684586, 32.78120122107424],
        [39.90047939941664, 32.7813528121151],
        [39.90051646030713, 32.781317829566206],
        [39.900562466902215, 32.78139778967588],
        [39.90060719550675, 32.78139612384106],
        [39.90064042245109, 32.78146442310111],
        [39.90070432037578, 32.78140611885439],
        [39.90053690768636, 32.78108128090969]
    ];

    // Temel İngilizce B-C Blok polygon'u oluştur
    const temelIngilizceBCblokPolygon = L.polygon(temelIngilizceBCblok, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceBCblok'] = temelIngilizceBCblokPolygon;

    // Temel İngilizce A Blok koordinatları
    const temelIngilizceAblok: [number, number][] = [
        [39.900144572530905, 32.78098299660812],
        [39.900246809921384, 32.78117123603272],
        [39.9005087925386, 32.78092302652661],
        [39.90033882344218, 32.78060984942999],
        [39.90023914212205, 32.780704802060484],
        [39.900305596351586, 32.780838068909475]
    ];

    // Temel İngilizce A Blok polygon'u oluştur
    const temelIngilizceAblokPolygon = L.polygon(temelIngilizceAblok, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceAblok'] = temelIngilizceAblokPolygon;

    // Temel İngilizce E Blok koordinatları
    const temelIngilizceEblok: [number, number][] = [
        [39.90040399879308, 32.7802017200776],
        [39.900524127256375, 32.78042827372224],
        [39.90055224239845, 32.78039828868074],
        [39.90056885588595, 32.780429939557024],
        [39.9005407407507, 32.78045825876225],
        [39.900663424891576, 32.78069480742025],
        [39.90075160398271, 32.78061484731052],
        [39.900627642039865, 32.78037829865255],
        [39.90067620447712, 32.78033665276291],
        [39.90072604483737, 32.78030000437914],
        [39.90051518152674, 32.77990686717439],
        [39.9004653410131, 32.77995017890035],
        [39.90048067655965, 32.780135086653814]
    ];

    // Temel İngilizce E Blok polygon'u oluştur
    const temelIngilizceEblokPolygon = L.polygon(temelIngilizceEblok, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceEblok'] = temelIngilizceEblokPolygon;

    // Temel İngilizce D Blok koordinatları
    const temelIngilizceDblok: [number, number][] = [
        [39.89993913367684, 32.77991901282371],
        [39.899917769260014, 32.780034000155695],
        [39.90002596962435, 32.78007083203431],
        [39.900047334006814, 32.779977404827775],
        [39.90007765763582, 32.779988184891295],
        [39.90007214424992, 32.7800196267398],
        [39.900253396583764, 32.78008610379075],
        [39.900261666641114, 32.78005825529624],
        [39.90028440929299, 32.78006634034307],
        [39.90028165260841, 32.78009868052882],
        [39.900371933972934, 32.780129224039996],
        [39.900394676588206, 32.78000705000011],
        [39.900280963436956, 32.77996123473571],
        [39.90028440929299, 32.77993697959522],
        [39.90010591373235, 32.7798678075292],
        [39.90009833282946, 32.77989116433085],
        [39.90008110350203, 32.77988487596019],
        [39.900101778694705, 32.77977797367663],
        [39.89999426762441, 32.77974114179642],
        [39.899953606342166, 32.779923504516574]
    ];

    // Temel İngilizce D Blok polygon'u oluştur
    const temelIngilizceDblokPolygon = L.polygon(temelIngilizceDblok, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceDblok'] = temelIngilizceDblokPolygon;

    // Temel İngilizce Bireysel Çalışma Merkezi koordinatları
    const temelIngilizceBireyselCalismaMerkezi: [number, number][] = [
        [39.90010644548886, 32.77952559551403],
        [39.90007499051984, 32.7796851693696],
        [39.90041929412385, 32.779810390519884],
        [39.900450748934844, 32.77965081666434]
    ];

    // Temel İngilizce Bireysel Çalışma Merkezi polygon'u oluştur
    const temelIngilizceBireyselCalismaMerkeziPolygon = L.polygon(temelIngilizceBireyselCalismaMerkezi, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceBireyselCalismaMerkezi'] = temelIngilizceBireyselCalismaMerkeziPolygon;

    // Temel İngilizce G Blok koordinatları
    const temelIngilizceGblok: [number, number][] = [
        [39.90036835086113, 32.77850461228434],
        [39.90039636500771, 32.77907974955863],
        [39.900531182929, 32.779066055813445],
        [39.900501417956434, 32.77849548312159]
    ];

    // Temel İngilizce G Blok polygon'u oluştur
    const temelIngilizceGblokPolygon = L.polygon(temelIngilizceGblok, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceGblok'] = temelIngilizceGblokPolygon;

    // Temel İngilizce F Blok koordinatları
    const temelIngilizceFblok: [number, number][] = [
        [39.900068948952196, 32.77848863624948],
        [39.900093461438274, 32.77905464436],
        [39.90022827995551, 32.77904095061484],
        [39.900202016628924, 32.778479507085734]
    ];

    // Temel İngilizce F Blok polygon'u oluştur
    const temelIngilizceFblokPolygon = L.polygon(temelIngilizceFblok, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['temelIngilizceFblok'] = temelIngilizceFblokPolygon;

    // Kütüphane koordinatları
    const kutuphane: [number, number][] = [
        [39.895196792920416, 32.78300325035772],
        [39.89521429591471, 32.78323392081481],
        [39.895155952584275, 32.78325166469665],
        [39.89517734514391, 32.78349247451416],
        [39.89534848538656, 32.78346459127192],
        [39.89533681674763, 32.78333784926235],
        [39.89548850890384, 32.783312500860205],
        [39.89547878505809, 32.783213642092875],
        [39.895589636821484, 32.783193363372106],
        [39.89561491877757, 32.78342403382919],
        [39.89625668838639, 32.78332010538162],
        [39.89625474363828, 32.78329222213938],
        [39.89637531786741, 32.78326940857738],
        [39.89635003619182, 32.78301338971812],
        [39.896233351414935, 32.783033668440055],
        [39.89622557242214, 32.782993110997324],
        [39.8960836056595, 32.78301338971812],
        [39.89606804763983, 32.782919600630976],
        [39.89601553929856, 32.782934809672724],
        [39.896025263068225, 32.78302352907966],
        [39.89570048840554, 32.78308183040312],
        [39.89569270935314, 32.78299818067754],
        [39.89563631119478, 32.78300071551763],
        [39.895644090253626, 32.78309196976463],
        [39.895568244389665, 32.78309957428496],
        [39.895562410089155, 32.783015924558214],
        [39.89547295074908, 32.783033668440055],
        [39.89547684028793, 32.78308183040312],
        [39.89532514810588, 32.78310464396512],
        [39.89531542423694, 32.78298550647588]
    ];

    // Kütüphane polygon'u oluştur
    const kutuphanePolygon = L.polygon(kutuphane, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['kutuphane'] = kutuphanePolygon;

    // Yabancı Diller Eğitimi koordinatları
    const yabanciDillerEgitimi: [number, number][] = [
        [39.90181329888108, 32.773192213055694],
        [39.90186837229004, 32.77332121095242],
        [39.90200433457974, 32.77322586468074],
        [39.90200175302027, 32.77321128230989],
        [39.90203187121301, 32.77318996961415],
        [39.90204563952585, 32.773220256076286],
        [39.9021213651952, 32.773160804872305],
        [39.9020929680795, 32.77309350162119],
        [39.902116202084216, 32.77307331064674],
        [39.90214115711825, 32.77312939668883],
        [39.902198811816646, 32.7730878930177],
        [39.902208277508805, 32.7731103274337],
        [39.90207747873811, 32.77320903886826],
        [39.90215148333613, 32.77336944494843],
        [39.90228916609678, 32.77326400318901],
        [39.902311539519275, 32.77330887202311],
        [39.90235284428016, 32.77327634211838],
        [39.90233477345066, 32.77323371672688],
        [39.90237177562071, 32.77320006510189],
        [39.90230121332556, 32.77304414590489],
        [39.90231584209991, 32.77302956353398],
        [39.90234509964009, 32.77309462334247],
        [39.902409638286, 32.77304526762521],
        [39.90239500953163, 32.773012737721444],
        [39.902419103949086, 32.772989181583114],
        [39.90231842364835, 32.772754741928054],
        [39.90217901991099, 32.77286242712799],
        [39.90220483543922, 32.77292748693753],
        [39.90214373867249, 32.772966747166095],
        [39.90213599400877, 32.77295665167938],
        [39.90198196105695, 32.773069945483826],
        [39.90199056625934, 32.773092379900845],
        [39.9019501218003, 32.77311705775952],
        [39.9019423771139, 32.773097988505384]
    ];

    // Yabancı Diller Eğitimi polygon'u oluştur
    const yabanciDillerEgitimiPolygon = L.polygon(yabanciDillerEgitimi, {
        color: "#3498db",
        weight: 3,
        fillColor: "#aed6f1",
        fillOpacity: 0.4
    }).addTo(map);
    polygons['yabanciDillerEgitimi'] = yabanciDillerEgitimiPolygon;

    // Polygon click event'lerini ekle
    Object.entries(polygons).forEach(([id, polygon]: [string, LeafletPolygon]) => {
        polygon.on('click', () => {
            const building = buildings.find(b => b.bina_adi.toLowerCase().includes(id));
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

    // Fizik Binası polygon'unu oluştur
    async function createPhysicsBuildingPolygon() {
        try {
            const building = await getBuildingById(1);
            console.log('Çekilen bina verisi:', building);
            
            if (!building || !building.polygon_koordinatları) {
                console.error('Bina verisi veya koordinatlar bulunamadı');
                return;
            }

            console.log('Ham koordinat verisi:', building.polygon_koordinatları);
            const coordinates = JSON.parse(building.polygon_koordinatları);
            console.log('Koordinat sayısı:', coordinates.length);
            console.log('İlk koordinat:', coordinates[0]);
            console.log('Son koordinat:', coordinates[coordinates.length - 1]);

            const polygon = L.polygon(coordinates, {
                color: 'blue',
                weight: 3,
                fillColor: 'blue',
                fillOpacity: 0.2
            }).addTo(map);

            polygons['fizik'] = polygon;
            console.log('Polygon oluşturuldu ve haritaya eklendi');
        } catch (error) {
            console.error('Polygon oluşturulurken hata:', error);
        }
    }

    // Bina bilgilerini göster
    function showBuildingInfo(building: Building) {
      const modal = document.getElementById('buildingModal');
      const modalTitle = document.getElementById('buildingTitle');
      const modalContent = document.getElementById('buildingContent');

      if (!modal || !modalTitle || !modalContent) {
        console.error('Modal elementleri bulunamadı');
        return;
      }

      modalTitle.textContent = building.bina_adi;
      modalContent.innerHTML = `
        <p><strong>Çalışma Salonları:</strong> ${building.calısma_salonlari}</p>
        <p><strong>Kapasiteler:</strong> ${building.calısma_salonlari_kapasiteler}</p>
        <p><strong>Bölüme Özel Alanlar:</strong> ${building.calısma_salonlari_bölüm_özel}</p>
        <p><strong>PC Durumu:</strong> ${building.calısma_salonlari_pc}</p>
        <p><strong>Asansör Sayısı:</strong> ${building.asansor_sayisi}</p>
        <p><strong>Rampa Sayısı:</strong> ${building.rampa_sayisi}</p>
        <p><strong>Erişilebilirlik Derecesi:</strong> ${building.erisilebilirlik_derecesi}</p>
        <p><strong>Geri Dönüşüm Kutuları:</strong> ${building.geri_dönüsüm_kutuları}</p>
        <p><strong>Kantin Menüsü:</strong> ${building.kantin_menu}</p>
        <p><strong>Otomat Sayısı:</strong> ${building.otomat_sayisi}</p>
      `;

      modal.style.display = 'block';
    }

    // Sayfa yüklendiğinde polygon'u oluştur
    createPhysicsBuildingPolygon();
}

// Sayfa yüklendiğinde haritayı başlat
window.addEventListener('DOMContentLoaded', initMap); 