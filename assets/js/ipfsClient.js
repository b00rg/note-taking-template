const IPFS = require('ipfs-http-client');
const ipfs = IPFS.create({ url: 'https://ipfs.infura.io:5001/api/v0' });

const uploadToIPFS = async (content) => {
    try {
        const result = await ipfs.add(content);
        return result.path; // IPFS CID for the file
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
    }
};

module.exports = { uploadToIPFS };
