semci
===

Git helper to create semver commits and name branches accordingly

Install
---

```
npm install -g git+ssh://<git clone url>
```

Usage
---

```bash
semci --help            # to find available commands
semci <command> --help  # to find further info about a given command
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
