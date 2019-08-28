const runCommand = require( './runCommand' );

function git( ...args ) {
  return runCommand( 'git', args, true );
}
git.withOutput = ( ...args ) => runCommand( 'git', args, false, true );
git.getBranchName = async () => {
  const branchResult = await git.withOutput( 'rev-parse', '--abbrev-ref', 'HEAD' );
  const branchName = branchResult.stdout.trim();
  if ( branchName === 'HEAD' ) {
    throw new Error( 'not on a branch' );
  }

  return branchName;
};

module.exports = git;
