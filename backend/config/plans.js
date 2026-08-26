const PLANS = {
  Free:   { price: 0,    tweetLimit: 1 },
  Bronze: { price: 100,  tweetLimit: 3 },
  Silver: { price: 300,  tweetLimit: 5 },
  Gold:   { price: 1000, tweetLimit: Infinity },
};

module.exports = PLANS;