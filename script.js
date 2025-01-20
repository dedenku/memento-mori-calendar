const gridContainer = document.querySelector('.grid-container');
const dateContainer = document.querySelector('.date-container');
const btnGenerate = document.querySelector('.btn-generate ');
const dateOfBirth = document.querySelector('#dateofbirth');

// Konfigurasi umur
const startAge = 5;
let ages = startAge;
let userAge = 0; // Umur dalam minggu
const maxAge = 520; // Maksimum minggu yang ditampilkan
const weeksPerLine = maxAge; // Jumlah minggu per baris

dateOfBirth.addEventListener('input', () => {
    saveBirthDate(dateOfBirth.value);
    userAge = getAgeInWeeks(getSavedBirthDate());
})

// Konstanta untuk key localStorage
const BIRTH_DATE_KEY = 'mementoMori_birthDate';

// Fungsi untuk menyimpan tanggal ke localStorage
function saveBirthDate(date) {
    localStorage.setItem(BIRTH_DATE_KEY, date);
}

// Fungsi untuk mengambil tanggal dari localStorage
function getSavedBirthDate() {
    return localStorage.getItem(BIRTH_DATE_KEY);
}

// Fungsi untuk mendapatkan umur dalam minggu dari format YYYY-MM-DD
function getAgeInWeeks(dateString) {
    // Memastikan format date string adalah YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    const birth = new Date(year, month - 1, day); // month - 1 karena bulan dimulai dari 0
    const today = new Date();

    // Reset waktu ke midnight
    birth.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Hitung selisih hari
    const diffTime = today - birth;
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

    return Math.floor(diffDays / 7);
}

// Fungsi untuk menghitung total minggu yang telah berlalu
function getPassedWeeks(currentWeek, currentAge) {
    return currentWeek + (currentAge * weeksPerLine);
}

// Fungsi inisialisasi
function initializeDateInput() {
    // Cek apakah ada tanggal tersimpan
    const savedDate = getSavedBirthDate();

    if (savedDate) {
        // Set nilai input ke tanggal yang tersimpan
        dateOfBirth.value = savedDate;
        dateContainer.style.display = 'none';

        // Generate kalender berdasarkan data yang tersimpan
        userAge = getAgeInWeeks(getSavedBirthDate());
        generateCalendar();
    }
}
initializeDateInput();

function generateCalendar() {
    // Membuat grid kalender
    for (let i = 0; i < 7; i++) {
        // Membuat container untuk setiap baris
        const gridBox = document.createElement('div');
        gridBox.classList.add('grid-box');
        gridContainer.appendChild(gridBox);

        const midLine = document.createElement('span');
        midLine.innerText = '';
        midLine.classList.add('mid-space');
        gridBox.appendChild(midLine);

        // Membuat penanda umur
        const lineAges = document.createElement('div');
        lineAges.classList.add('ages');
        gridBox.appendChild(lineAges);

        // Menambahkan label umur kosong di awal
        const emptySpan = document.createElement('span');
        emptySpan.innerText = '';
        lineAges.appendChild(emptySpan);

        // Menambahkan label umur
        for (let j = 0; j < 2; j++) {
            const ageSpan = document.createElement('span');
            ageSpan.innerText = ages;
            ages += 5;
            lineAges.appendChild(ageSpan);
        }

        // Membuat dot untuk setiap minggu
        for (let week = 0; week < weeksPerLine; week++) {
            const lifedot = document.createElement('div');
            lifedot.classList.add('life-dot');

            // Menghitung total minggu yang telah berlalu
            const totalPassedWeeks = getPassedWeeks(week, i);

            // Mewarnai dot jika minggu tersebut telah terlewati
            if (totalPassedWeeks < userAge) {
                lifedot.classList.add('life-dot-filled');
            }

            gridBox.appendChild(lifedot);
        }
    }
}

btnGenerate.addEventListener('click', () => {
    if (!dateOfBirth.value) {
        return;
    } else {

        generateCalendar();
        dateContainer.style.display = "none";
    }


})

// QUOTES
const quoteContainer = document.querySelector('#quote-container');

// Ambil data quotes
let quotes = [];

fetch('./quotes.json')
    .then(res => res.json())
    .then(data => {
        quotes = data; // Pastikan `data` adalah array
        showRandomQuote(); // Panggil fungsi untuk menampilkan quote
    })
    .catch(err => console.error("Error fetching quotes:", err));

// Fungsi untuk menampilkan quote random
function showRandomQuote() {
    if (quotes.length === 0) {
        console.error("Quotes data is empty.");
        return;
    }
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteContainer.innerHTML = `
        <blockquote>${randomQuote.text}</blockquote>
        <cite>${randomQuote.author}</cite>
    `;
}

showRandomQuote();

const changeDate = document.querySelector('.btn-date');
changeDate.addEventListener('click', () => {
    dateContainer.style.display = "flex";
    gridContainer.innerHTML = '';
    ages = startAge;
})

document.querySelector('.btn-quote').addEventListener('click', () => showRandomQuote());

// export PDF
// Fungsi untuk export ke PDF
function exportToPDF() {
    const element = document.getElementById('calendar');
    const opt = {
        margin: [0, 0],
        filename: 'memento-mori-calendar.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        pagebreak: { mode: 'avoid-all', before: '#page2el' },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

document.querySelector('.btn-pdf').addEventListener('click', () => printCalendar());


// PRINT
// Fungsi untuk mencetak
function printCalendar() {
    // Simpan judul halaman asli
    // const originalTitle = document.title;

    // Set judul untuk hasil cetak
    // document.title = 'Memento Mori Calendar';

    // Jalankan fungsi print
    window.print();

    // Kembalikan judul asli
    // document.title = originalTitle;
}

// Tambahkan style khusus untuk print
const printStyle = document.createElement('style');
printStyle.textContent = `
    
    /* Style khusus untuk print */
    @media print {
        /* Sembunyikan elemen yang tidak perlu dicetak */
        #print-button,
        #birthDate,
        button {
            display: none !important;
        }
            #quote-container{
            display: none !important;
            }
            .menu{
            display: none !important;
            }

        /* Atur margin dan padding halaman */
        @page {
            margin: 15mm;
            size: A4 portrait;
        }

        /* Style untuk container utama */
        .grid-container {
            width: 100%;
            margin: 0 auto;
            page-break-inside: avoid;
        }

        /* Style untuk grid box */
        .grid-box {
            break-inside: avoid;
            margin-bottom: 10px;
        }

        /* Style untuk dots */
        .life-dot {
            border: 1px solid #000;
        }

        .life-dot-filled {
            background-color: #000;
        }


    }
`;
document.head.appendChild(printStyle);