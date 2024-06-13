const os = require('os');

const getIP = () => {
//   const interfaces = os.networkInterfaces();
//   for (const iface of Object.values(interfaces)) {
//     for (const config of iface) {
//       if (config.family === 'IPv4' && !config.internal) {
//         return config.address;
//       }
//     }
//   }
  return 'localhost'; // fallback to localhost if no external IP found
};


module.exports = getIP;