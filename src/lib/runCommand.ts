import { spawn } from 'child_process';
import log from './log';

export interface CommandOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export default ( command, args, skipResult = false, skipOutput = false ): Promise<number | CommandOutput> => {
  return new Promise( ( resolve ) => {
    if ( !skipOutput ) {
      const printableCommand =
        `${ command } ${
          ( args || [] )
            .map( a => a.indexOf( ' ' ) > -1 ? `"${ a }"` : a )
            .join( ' ' )
        }`;
      log( printableCommand );
    }

    const child = spawn( command, args, {
      cwd: process.env.NODE_PATH ? process.env.NODE_PATH : process.cwd(),
    } );

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
