const axios = require('axios');

const fetchImage = async () => {
  try {
    const res = await axios.get('https://picsum.photos/200', {
      maxRedirects: 0,
      validateStatus: null
    });
    return res.headers.location;
  } catch {
    return 'https://via.placeholder.com/200';
  }
};

module.exports = fetchImage;
