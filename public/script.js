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
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();
        chatBox.innerHTML += `<div class="msg bot-msg" style="color: red;">Duh, otakku lagi loading.. coba lagi ya!</div>`;
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