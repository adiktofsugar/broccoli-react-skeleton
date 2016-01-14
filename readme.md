## Broccoli react skeleton
Skeleton for react project using broccoli.

### First make a project
```
mkdir my-new-project
cd my-new-project
npm init -y
```
You can use this in an existing project too, but it copies the Brocfile.js and app directories in this package, so you should back those up first.

### Run the script from this package
```
cd my-new-project
npm install -g broccoli-react-skeleton; broccoli-react-skeleton
```
Or if you're using mac, and maybe linux, use the bash install
```
cd my-new-project
curl https://raw.githubusercontent.com/adiktofsugar/broccoli-react-skeleton/master/scripts/bash-install.sh | bash
```
If you want to invoke the command without actually being in the directory, then
```
curl https://raw.githubusercontent.com/adiktofsugar/broccoli-react-skeleton/master/scripts/bash-install.sh | bash -s -- path/to/project
```

## Contribute
It would be awesome if you know of a better way to do this. I don't like globally installing things if I can help it and the local way isn't great.

## Todo
- Add r.js to package it for production
- Add uglifyJS to minify it for production
