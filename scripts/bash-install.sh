#!/bin/bash -eu
set -o pipefail
url="git@github.com:adiktofsugar/broccoli-react-skeleton.git"
project_location=
usage="
bash-install [-h][-u <url>][project-location]
  -h - help
  -u <url> - where the broccoli-react-skeleton is located. will git clone whatever url is passed (defaults to $url)
  project-location - where your project is. defaults to the current directory
Downloads the git repo and runs the install in the current directory
"

while getopts ":hu:" opt; do
    case "$opt" in
        h) echo "$usage"; exit;;
        u) url="$OPTARG";;
    esac
done
shift $((OPTIND-1))
if [[ -n "${1:-}" ]]; then
    project_location="$1"
fi
if [[ -z "$project_location" ]]; then
    project_location="$PWD"
fi

if ! [[ -e "$project_location/package.json" ]]; then
    echo "$project_location/package.json not found." >&2
    exit 1
fi

echo "url for repo is $url"
download_path="$HOME/.broccoli-react-skeleton"
if [[ -d "$download_path" ]]; then
    echo "..removing existing repo"
    rm -rf "$download_path"
fi
{ pushd .; } >/dev/null
git clone "$url" "$download_path"
cd "$download_path"
npm install --production
{ popd; } >/dev/null
cd "$project_location"
$download_path/scripts/install.js
rm -rf "$download_path"
echo "Now npm install and bower install on this project and you should be ready to go!"
