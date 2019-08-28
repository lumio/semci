const program = require( 'commander' );
const package = require( './package.json' );
const commands = require( './commands' );

const errorHandler = require( './lib/errorHandler' );
const checkIfVoid = async ( promisedResult ) => {
  const result = await promisedResult;
  let exitCode = 0;
  if ( result !== undefined && result !== 0 ) {
    exitCode = 1;
  }

  process.exit( exitCode );
};

const main = ( argv ) => {
  program
    .version( package.version );

  program
    .command( 'branch <new|rename> <type> <issue|description> [description...]' )
    .description( 'Creates a new branch' )
    .action( ( command, arg1, arg2, arg3 ) => {
      const params = {
        type: arg1,
        issue: ( arg3 && arg3.length && arg2 ) || undefined,
        description: ( arg3 || [] ).join( ' ' ) || arg2,
      };

      checkIfVoid( commands.branch[ command ]( params ) );
    } );

  program
    .command( 'commit <issue|type|message> [type|message] [message]' )
    .description( 'Commit staged files using the branches issue number' )
    .action( ( arg1, arg2, arg3 ) => {
      const params = {
        issue: arg3 && arg2 && arg1,
        type: arg2 && arg1,
        message: arg3 || arg2 || arg1,
      };

      checkIfVoid( commands.commit( params ) );
    } );

  program
    .command( 'push [remote]' )
    .description( 'Pushes the current branch to remote and sets an upstream' )
    .action( ( remote ) => {
      checkIfVoid( commands.push( { remote } ) );
    } );

  program
    .parse( argv );
};

if ( require.main === module ) {
  errorHandler( () => main( process.argv ) );
}
