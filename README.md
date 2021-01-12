semci
===

Git helper to create semver commits and name branches accordingly

Install
---

```
npm install -g semci
```

Usage
---

The best way to find all commands is to use the *--help* argument

```bash
semci --help            # View available commands
semci <command> --help  # View further info about a given command
```

### Examples

```bash
semci new feat FEAT-1 "some description"  # Will create a new feature branch
                                          # called feature/FEAT-1-some-description
semci checkout feat-1                     # Searches through available branches
```

Git configuration
---

```bash
git config --global alias.co "!semci checkout"    # Set alias for `git co` to map to `semci checkout`
git config --global alias.ci "!semci commit"      # and so on...
git config --global alias.p "!semci push"
git config --global alias.new "!semci branch new"
git config --global alias.fs "!semci branch new feat"
git config --global alias.bs "!semci branch new fix"
```
