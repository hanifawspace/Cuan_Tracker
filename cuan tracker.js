let budget = 0;
let expenses = [];
const heroImages = [
    'keuangan 1.jpg',
    'keuangan 2.jpg',
    'keuangan 3.jpg'
];
let currentImageIndex = 0;

function changeHeroImage() {
    const heroSection = document.getElementById('hero');
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroSection.style.backgroundImage = `url('${heroImages[currentImageIndex]}')`;
}

setInterval(changeHeroImage, 3000);

function showBudget() {
    document.getElementById('content').style.display = 'block';
    let content = `
        <h2>Buat Anggaran</h2>
        <input type="text" id="budgetInput" placeholder="Masukkan anggaran" onkeyup="formatRupiah(this)" />
        <button class="pink-button" onclick="setBudget()">Tetapkan Anggaran</button>
    `;
    document.getElementById('content').innerHTML = content;
}

function setBudget() {
    const budgetInput = document.getElementById('budgetInput').value.replace(/\D/g, ''); 
    budget = parseFloat(budgetInput);
    alert(`Anggaran Anda ditetapkan sebesar: Rp ${budget.toLocaleString()}`);
    document.getElementById('budgetInput').value = '';
}

function formatRupiah(input) {
    let value = input.value.replace(/[^\d]/g, ''); 
    let formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value);
    input.value = formatted.replace(/^IDR\s*/, 'Rp '); 
}

function showExpenseTracker() {
    document.getElementById('content').style.display = 'block';
    let content = `
        <h2>Pelacakan Pengeluaran</h2>
        <input type="text" id="expenseDescription" placeholder="Deskripsi Pengeluaran" />
        <input type="text" id="expenseAmount" placeholder="Jumlah" onkeyup="formatRupiah(this)" />
        <select id="expenseCategory">
            <option value="">Pilih Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Hiburan">Hiburan</option>
            <option value="Tagihan">Tagihan</option>
        </select>
        <button onclick="addExpense()">Tambah Pengeluaran</button>
        <div id="expenseList"></div>
    `;
    document.getElementById('content').innerHTML = content;
    displayExpenses();
}

function addExpense() {
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value.replace(/\D/g, '')); 
    const category = document.getElementById('expenseCategory').value;

    if (description && amount && category) {
        expenses.push({ description, amount, category });
        alert('Pengeluaran berhasil ditambahkan!');
        document.getElementById('expenseDescription').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseCategory').value = '';
        displayExpenses();
    } else {
        alert('Silakan lengkapi deskripsi, jumlah, dan kategori pengeluaran.');
    }
}

function displayExpenses() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    if (expenses.length > 0) {
        expenses.forEach((expense, index) => {
            expenseList.innerHTML += `
                <div class="expense-item">
                    ${index + 1}. ${expense.description}: Rp ${expense.amount.toLocaleString()} (Kategori: ${expense.category})
                    <div class="expense-actions">
                        <button onclick="editExpense(${index})">Edit</button>
                        <button onclick="deleteExpense(${index})">Hapus</button>
                    </div>
                </div>
            `;
        });
    } else {
        expenseList.innerHTML = '<p>Tidak ada pengeluaran yang tercatat.</p>';
    }
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseCategory').value = expense.category;
    deleteExpense(index);
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    displayExpenses();
}

function showReport() {
    document.getElementById('content').style.display = 'block';
    let totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    let content = `<h2>Laporan Keuangan</h2>`;
    content += `<p>Anggaran Anda: Rp ${budget.toLocaleString()}</p>`;
    content += `<p>Total Pengeluaran: Rp ${totalExpenses.toLocaleString()}</p>`;
    content += `<p>Sisa Anggaran: Rp ${(budget - totalExpenses).toLocaleString()}</p>`;
    document.getElementById('content').innerHTML = content;
    showExpenseChart();
}

function showExpenseChart() {
    const ctx = document.createElement('canvas');
    document.getElementById('content').appendChild(ctx);

    const categories = {};
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pengeluaran per Kategori',
                data: data,
                backgroundColor: 'rgba(241, 105, 209, 0.2)',
                borderColor: 'rgba(241, 105, 209, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
