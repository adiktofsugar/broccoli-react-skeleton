### boilerplate
mkdir myapp
cd myapp
npm init -y

### appengine
git init
git clone git@github.com:GoogleCloudPlatform/appengine-flask-skeleton.git appengine

#### app.yaml mods
```
- url: /media
  static_dir: media
```

### media
curl https://raw.githubusercontent.com/adiktofsugar/broccoli-react-skeleton/master/scripts/bash-install.sh | bash
npm install; bower install


### link appengine and media
cd appengine
ln -s ../media/dist media
