// var baseURL = '//192.168.74.166:8160/lotto';

// if(typeof process == 'undefined'){
//     var process = {env: {}};
// }
// if (process.env.NODE_ENV === 'production') {
//     // baseURL = '//192.168.74.173:8160/lotto';
//     baseURL = '//192.168.74.236:8160/lotto';
// }

let baseURL =
  location.port == "8080" ? "//192.168.74.166:8160" : "//" + location.host;

var URI = baseURL + "/lotto";
