const git = require( '../lib/git' );

module.exports = async ( { remote } ) => {
  const remoteName = remote || 'origin';
  const branch = await git.getBranchName();

  return git( 'push', '-u', remoteName, branch );
};
