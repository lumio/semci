const { spawn } = require( 'child_process' );
const log = require( './log' );

module.exports = ( command, args, skipResult = false, skipOutput = false ) => {
  return new Promise( ( resolve ) => {
    if ( !skipOutput ) {
      log( `${ command } ${ ( args || [] ).map( a => a.indexOf( ' ' ) > -1 ? `"${ a }"` : a ).join( ' ' ) }` );
    }

    const child = spawn( command, args );

    const output = {
      stdout: [],
      stderr: [],
    };

    const redirectOutput = ( outputType ) => ( data ) => {
      if ( !skipResult ) {
        output[ outputType ].push( data.toString() );
      }
      if ( !skipOutput ) {
        process[ outputType ].write( data );
      }
    };

    child.stdout.on( 'data', redirectOutput( 'stdout' ) );
    child.stderr.on( 'data', redirectOutput( 'stderr' ) );
    child.on( 'close', ( exitCode ) => {
      if ( skipResult ) {
        return resolve( exitCode );
      }

      return resolve( {
        stdout: output.stdout.join( '' ),
        stderr: output.stderr.join( '' ),
        exitCode,
      } )
    } );
  } );
};
