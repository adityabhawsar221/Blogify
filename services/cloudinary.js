const cloudinary = require('cloudinary').v2;

function initCloudinary(){
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if(!cloudName || !apiKey || !apiSecret) { 
    throw new Error('Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    }

    // Configuration
    cloudinary.config({ 
        cloud_name: cloudName, 
        api_key: apiKey, 
        api_secret: apiSecret // Click 'View API Keys' above to copy your API secret
    });
}

function uploadBufferToCloudinary(buffer , option = {}){
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(option, (error, result) => {
        if(error) return reject(error);
        resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { initCloudinary, uploadBufferToCloudinary, cloudinary };