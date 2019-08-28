const prompts = require( 'prompts' );
const escapeStringRegexp = require( 'escape-string-regexp' );
const git = require( '../lib/git' );
const log = require( '../lib/log' );

const selectBranch = async ( branches, pattern ) => {
  if ( branches.length === 1 && branches[ 0 ].name === pattern ) {
    return branches[ 0 ].name;
  }

  const { branch } = await prompts( [
    {
      type: 'select',
      name: 'branch',
      message: 'Select branch',
      choices: branches.map( branch => (
        {
          title: ( branch.active ? '* ' : '  ' ) + branch.name,
          value: branch.name,
        }
      ) ),
    },
  ] );

  return branch;
};

module.exports = async ( { branch } ) => {
  const branches = await git.getAllBranches();
  let possibleBranches = branches;

  if ( branch ) {
    const pattern = new RegExp( escapeStringRegexp( branch ) );
    possibleBranches = branches.filter( item => item.name.match( pattern ) );
  }

  if ( !possibleBranches.length ) {
    log.error( 'No branches found that match pattern!' );
    return 1;
  }

  const selectedBranch = await selectBranch( possibleBranches, branch );
  if ( !selectedBranch ) {
    return 1;
  }

  return git( 'checkout', selectedBranch );
};
