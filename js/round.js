    function roundEuler(value, decimals) {
  	  if (value) {
  	     if (!decimals) {
  				 decimals = 10;
  	     }
  	     return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  	  } else {
  	     return 0;
  	  }
  	};


    function roundFactor(value, factor) {
      if (value && factor) {
         return Number(Math.round(value * factor) / factor);
      } else {
         return 0;
      }
    };
