// Fungsi utama untuk mengirim pesan
// Fungsi untuk mendapatkan waktu sekarang (HH:mm)
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim();

    if (!message) return;

    // Tambahkan pesan user dengan jam
    const time = getCurrentTime();
    chatBox.innerHTML += `
        <div class="msg user-msg">
            ${message}
            <span class="chat-time">${time}</span>
        </div>`;
    
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

// 2. Tampilkan indikator "Typing..."
    const typingId = 'typing-' + Date.now(); // Buat ID unik
    chatBox.innerHTML += `
        <div id="${typingId}" class="typing">
            Teman Ngobrol sedang mengetik
            <span></span><span></span><span></span>
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();

// 3. Hapus indikator "Typing..."
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();        
        
        // Tambahkan pesan bot dengan jam
        const botTime = getCurrentTime();
        chatBox.innerHTML += `
            <div class="msg bot-msg">
                ${data.reply}
                <span class="chat-time">${botTime}</span>
            </div>`;
        
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        // Hapus indikator mengetik jika masih ada
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();

        // Ambil pesan error dari server jika ada
        let errorMessage = "Duh, otakku lagi loading.. coba lagi ya!";
        
        // Menampilkan pesan error di chat box
        const botTime = getCurrentTime();
        chatBox.innerHTML += `
            <div class="msg bot-msg" style="border: 1px solid #ff000033; background-color: #fff5f5;">
                <span style="color: #d32f2f;"><b>Sistem:</b> Kuota gratis sudah habis atau server sibuk.</span>
                <span class="chat-time">${botTime}</span>
            </div>`;
        
        chatBox.scrollTop = chatBox.scrollHeight;n
    }
}

// Inisialisasi Emoji Picker
const pickerOptions = { 
    onEmojiSelect: (emoji) => {
        const input = document.getElementById('user-input');
        input.value += emoji.native; // Tambahkan emoji ke input
        input.focus();
    },
    theme: 'light',
    set: 'apple' // Gaya emoji ala iPhone/WhatsApp
};
const picker = new EmojiMart.Picker(pickerOptions);
const pickerContainer = document.getElementById('emoji-picker-container');
pickerContainer.appendChild(picker);

// Logika buka/tutup picker
document.getElementById('emoji-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = pickerContainer.style.display === 'block';
    pickerContainer.style.display = isVisible ? 'none' : 'block';
});

// Tutup picker jika klik di luar
document.addEventListener('click', () => {
    pickerContainer.style.display = 'none';
});

// Mencegah picker tertutup saat diklik di dalam picker itu sendiri
pickerContainer.addEventListener('click', (e) => e.stopPropagation());

//clear chat
function clearChat() {
    if (confirm("Kamu yakin mau menghapus semua percakapan?")) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = ''; // Mengosongkan semua pesan
        
        // Opsional: Berikan pesan sambutan kembali
        chatBox.innerHTML = `<div class="msg bot-msg">Chat telah dihapus. Ada yang bisa aku bantu lagi?<span class="chat-time">${getCurrentTime()}</span></div>`;
    }
}

// --- FITUR ENTER KEY ---
// Menambahkan event listener ke input field
document.getElementById('user-input').addEventListener('keypress', function(event) {
    // Mengecek apakah tombol yang ditekan adalah 'Enter' (keyCode 13)
    if (event.key === 'Enter') { // Menggunakan event.key lebih modern
        event.preventDefault(); // Mencegah form submit default (jika ada)
        sendMessage(); // Panggil fungsi sendMessage
    }
});