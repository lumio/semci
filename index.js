#!/usr/bin/env node

const program = require( 'commander' );
const package = require( './package.json' );
const commands = require( './commands' );

const errorHandler = require( './lib/errorHandler' );

process.on( 'unhandledRejection', ( reason, promise ) => {
  errorHandler( () => {
    throw reason;
  } );
} );

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
    .command( 'checkout [branch|search]' )
    .option( '-b, --branch', 'Create branch if it does not exist' )
    .description( 'Checks out the given branch name or returns a list of branches' )
    .action( ( branch, cmdOptions ) => {
      checkIfVoid( commands.checkout( { branch, newBranch: cmdOptions.branch } ) );
    } );

  program
    .command( 'commit <issue|type|message> [issue|message] [message]' )
    .option( '-a, --all', 'Tell the command to automatically stage files that have been modified and deleted, but new files you have not told Git about are not affected.' )
    .description( 'Commit staged files using the branches issue number' )
    .action( ( arg1, arg2, arg3, cmdOptions ) => {
      const params = {
        issue: arg3 ? arg2 : null,
        type: arg3 || arg2 ? arg1 : null,
        message: arg3 || arg2 || arg1,
        all: cmdOptions.all,
      };

      checkIfVoid( commands.commit( params ) );
    } );

  program
    .command( 'push [remote]' )
    .description( 'Pushes the current branch to remote and sets an upstream' )
    .action( ( remote ) => {
      checkIfVoid( commands.push( { remote } ) );
    } );

  program.on( 'command:*', () => {
    console.error(
      'Invalid command: %s\nSee --help for a list of available commands.',
      program.args.join( ' ' )
    );
    process.exit( 1 );
  } )

  program
    .parse( argv );
};

if ( require.main === module ) {
  errorHandler( () => main( process.argv ) );
}
