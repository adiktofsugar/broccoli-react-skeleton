#!/bin/bash -eu
set -o pipefail

url="git://github.com/adiktofsugar/broccoli-react-skeleton.git"
usage="
bash-install [-h][-f][<url-to-project>]
  -h - help
  <url-to-project> - git clone whatever url is passed (defaults to $url)
Downloads the git repo and runs the install in the current directory
"

while getopts ":h" opt; do
    case "$opt" in
        h) echo "$usage"; exit;;
    esac
done
shift $((OPTIND-1))
if [[ -n "${1:-}" ]]; then
    url="$1"
fi

echo "url is $url"

download_path="$HOME/.broccoli-react-skeleton"
if [[ -d "$download_path" ]]; then
    echo "..removing existing repo"
    rm -rf "$download_path"
fi
git clone "$url" "$download_path"
cd "$download_path"
npm install --production
$download_path/scripts/install.js

