/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

// const log = console.log;

const fetchMyIP = function(callback) {

  const URL = 'https://api.ipify.org?format=json';

  request(URL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);

    callback(null, data.ip);
  });


};

/**
 * https://ipwhois.io/documentation
 *
 * # Get details for 8.8.4.4
 * curl "http://ipwho.is/8.8.4.4"
 *
 * # Get details for your own IP address
 * curl "http://ipwho.is/"
 *
 *
 */

const fetchCoordsByIP = function(ip, callback) {

  const URL = 'http://ipwho.is/';

  request(URL + ip, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    // log(data);

    if (!data.success) {
      const msg = `It didn't work! Error: Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      // log(msg);
      callback(Error(msg), null);
      return;
    }

    const lonLat = Object.assign({}, { latitude: data.latitude, longitude: data.longitude });

    // log(lonLat);
    callback(null, lonLat);
  });

};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {
  // https://iss-flyover.herokuapp.com/json/?lat=YOUR_LAT_INPUT_HERE&lon=YOUR_LON_INPUT_HERE

  const URL = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(URL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);

    // log(data);
    // log(data.response);
    callback(null, data.response);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
        return;
      }

      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, passes);

      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };
