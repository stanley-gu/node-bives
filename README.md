node-bives
==========

# Installation

`npm install node-bives`

# Example Usage



```javascript
var bives = require('node-bives');

bives.getDiff({
  first: stringOfFirstSbml,
  second: stringOfFirstSbml,
  callback: function(err, results) {
    if (err) {
      console.log('ERROR: ' + err);
    } else {
      console.log(JSON.stringify(results, undefined, 2));
    }
  }
});

```

For more details, check out [the test file](test/test-bives.js).
