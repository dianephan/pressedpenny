#to set up proj on new devices 
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
source ~/.zshrc
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make 
make test
brew install postgresql
brew services start postgresql
/usr/local/bin/createuser -s postgres
alias pg_start="launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist"
alias pg_stop="launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist"
pg_start
createdb
npm install express
/usr/local/bin/createuser -s postgres