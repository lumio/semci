const kleur = require( 'kleur' );

module.exports = ( callback ) => {
  try {
    callback();
  } catch ( error ) {
    if ( error.stack ) {
      const stack = error.stack.toString().split( '\n' );
      stack.forEach( ( line, index ) => {
        if ( index === 0 ) {
          const [ errorClass, errorMessage ] = line.split( ':' );
          console.error( `${ kleur.red( errorClass + ':' ) }${ errorMessage }` );
          return;
        }

        console.error(
          kleur.gray(
            line.replace( /\(.+?\)$/, kleur.magenta( '$&' ) )
          )
        );
      } );
    }
    else {
      console.error( kleur.red( 'ERROR!' ) );
      console.error( error.message || error );
    }
  }
};
