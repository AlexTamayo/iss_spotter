const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = function(arr) {

  for (const e of arr) {
    const date = new Date(e.risetime * 1000);
    console.log(`Next pass at ${date} for ${e.duration} seconds!`);
  }

};

nextISSTimesForMyLocation()
  .then(passTime => printPassTimes(passTime));