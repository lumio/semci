import runCommand, { CommandOutput } from './runCommand';

function git( ...args ) {
  return runCommand( 'git', args, true );
}
git.withOutput = ( ...args ): Promise<CommandOutput> => runCommand( 'git', args, false, true ) as Promise<CommandOutput>;
git.getBranchName = async () => {
  const branchResult = await git.withOutput( 'symbolic-ref', '--short', 'HEAD' );
  const branchName = branchResult.stdout.trim();
  if ( branchName === 'HEAD' ) {
    throw new Error( 'not on a branch' );
  }

  return branchName;
};
git.getAllBranches = async () => {
  const result = await git.withOutput( 'branch', '-a' );

  if ( result.exitCode !== 0 ) {
    throw new Error( 'failed loading branches' );
  }

  const listed = {};
  const branches = result.stdout
    .split( '\n' )
    .map( raw => {
      const tmpBranchName = raw.trim();
      if ( !tmpBranchName ) {
        return null;
      }

      let branchName = tmpBranchName;
      let active = false;

      if ( tmpBranchName.substring( 0, 2 ) === '* ' ) {
        active = true;
        branchName = tmpBranchName.substring( 2 ).trim();
      }

      const remoteMatch = branchName.match( /^remotes\/.+?\// )
      if ( remoteMatch ) {
        branchName = branchName.substring( remoteMatch[ 0 ].length );
      }

      if ( branchName.match( /^HEAD\s*/ ) ) {
        return null;
      }

      if ( listed[ branchName ] ) {
        return null;
      }

      listed[ branchName ] = true;
      return {
        active,
        name: branchName,
      };
    } )
    .filter( Boolean )
    .sort( ( a, b ) => {
      const valA = a?.name.toLowerCase() || '';
      const valB = b?.name.toLowerCase() || '';
      return String(valA).localeCompare(valB, undefined, { sensitivity: 'base', numeric: true })
    } );

  return branches;
};

export default git;
