import git from '../lib/git';

export default async ( { remote } ) => {
  const remoteName = remote || 'origin';
  const branch = await git.getBranchName();

  return git( 'push', '-u', remoteName, branch );
};
