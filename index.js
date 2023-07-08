const { nextISSTimesForMyLocation } = require('./iss');

/**
 * Input:
 *   Array of data objects defining the next fly-overs of the ISS.
 *   [ { risetime: <number>, duration: <number> }, ... ]
 * Returns:
 *   undefined
 * Sideffect:
 *   Console log messages to make that data more human readable.
 *   Example output:
 *   Next pass at Mon Jun 10 2019 20:11:44 GMT-0700 (Pacific Daylight Time) for 468 seconds!
 */

console.time('Execution time');

nextISSTimesForMyLocation((error, passes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  for (const pass of passes) {
    const date = new Date(pass.risetime * 1000);
    console.log(`Next pass at ${date} for ${pass.duration} seconds!`);
  }

});

console.timeEnd('Execution time');