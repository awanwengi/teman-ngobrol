// Fungsi utama untuk mengirim pesan
async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim(); // Gunakan .trim() untuk menghilangkan spasi kosong di awal/akhir

    if (!message) return; // Jangan kirim pesan kosong

    // Tampilkan pesan user
    chatBox.innerHTML += `<div class="user"><b>Kamu:</b> ${message}</div>`;
    input.value = ''; // Kosongkan input field setelah pesan terkirim
    
    // --- FITUR AUTO-SCROLL (dipanggil setelah pesan user) ---
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        
        // Tampilkan jawaban bot
        chatBox.innerHTML += `<div class="bot"><b>Gemini:</b> ${data.reply}</div>`;
        
        // --- FITUR AUTO-SCROLL (dipanggil setelah pesan bot) ---
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.error("Error:", err);
        chatBox.innerHTML += `<div class="bot" style="color: red;"><b>Gemini:</b> Maaf, ada masalah koneksi. Coba lagi ya!</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
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