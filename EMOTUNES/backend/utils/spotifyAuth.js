import axios from 'axios';
import { Buffer } from 'buffer'; // Use polyfilled Buffer

const getSpotifyToken = async () => {
  const clientId ='63f29f8a597a40bbb46fc34b5829709d';
  const clientSecret = "4ce23e366bbf44c1bcc8780cba05add2";

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify Client ID or Client Secret');
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error('Error fetching Spotify token:', error.message);
    throw new Error('Failed to fetch Spotify token');
  }
};

export default getSpotifyToken;
