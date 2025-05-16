import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';

// Initialize the WhatsApp client with LocalAuth for session persistence
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
        timeout: 60000 // optional: gives more time to load WhatsApp Web
    }
});

// Show QR code when needed
client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Confirm when client is ready
client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
});

// Handle authentication failure (optional but helpful)
client.on('auth_failure', (msg) => {
    console.error('❌ Auth failed:', msg);
});

// Handle disconnection (optional but recommended)
client.on('disconnected', (reason) => {
    console.log('⚠️ Client disconnected:', reason);
});

// Start the client
client.initialize();

export default client;
