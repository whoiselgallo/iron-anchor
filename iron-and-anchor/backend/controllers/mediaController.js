const { google } = require('googleapis');

// Configuración del cliente OAuth2
// IMPORTANTE: Estas credenciales DEBEN venir de Google Cloud Console
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/media/google/callback` // Endpoint de retorno
);

// 1. Iniciar flujo de autenticación
const getGoogleAuthUrl = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Para recibir un refresh token
        scope: ['https://www.googleapis.com/auth/drive.readonly'],
        prompt: 'consent' // Fuerza a pedir permisos siempre (para desarrollo)
    });
    res.json({ url });
};

// 2. Manejar el callback de Google
const googleAuthCallback = async (req, res) => {
    const { code } = req.query;
    try {
        if (!code) {
            return res.status(400).send("Código de autorización no encontrado");
        }

        // Intercambiar el código por tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // AQUÍ NORMALMENTE GUARDARÍAS EL REFRESH_TOKEN EN TU BASE DE DATOS PARA ESE USUARIO
        // await db.query("UPDATE config SET google_refresh_token = $1", [tokens.refresh_token]);

        // Redirigir de vuelta al frontend indicando éxito
        res.redirect(`${process.env.FRONTEND_URL}?sync=google-success`);
    } catch (error) {
        console.error('Error en OAuth Callback:', error);
        res.redirect(`${process.env.FRONTEND_URL}?sync=google-error`);
    }
};

// 3. Listar archivos de Google Drive
const getDriveFiles = async (req, res) => {
    try {
        // En un caso real, obtendrías el token del usuario desde la DB o sesión
        // Aquí asumimos que el oauth2Client ya tiene las credenciales en memoria (solo para pruebas)
        
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name, mimeType, webViewLink, thumbnailLink)',
            // Solo buscar imágenes y videos
            q: "mimeType contains 'video/' or mimeType contains 'image/'"
        });

        res.json({ files: response.data.files });
    } catch (error) {
        console.error('Error fetching drive files:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getGoogleAuthUrl,
    googleAuthCallback,
    getDriveFiles
};
