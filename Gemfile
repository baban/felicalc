
source 'https://rubygems.org'

gem 'rails', '3.2.11'

gem "mysql2", "0.3.11"
gem "memcache-client", "1.8.5" # user memcashed
gem "dalli", "2.1.0"           # memcached hig-perfirmance settinged gem
gem "bartt-ssl_requirement", "1.4.2", require: "ssl_requirement"
gem "libv8", "3.3.10.4"
gem "faraday"

# view urilities
gem "jquery-rails", "2.1.3"

gem "devise", "2.1.0" # add login, logout 
gem "typus", "3.1.10" # generte administration functions
gem "formtastic", "2.1.0" # form helper(use in typus)
gem "omniauth", "1.1.0"
gem "omniauth-twitter", "0.0.9" # twitter login
gem "omniauth-facebook", "1.4.0" # facebook login
gem "omniauth-google-oauth2", "0.1.10" # google+ login

# controller, model tools
gem 'jbuilder', "0.8.2"
gem 'bcrypt-ruby', '~> 3.0.0'
gem "mini_magick", "3.4"
gem "carrierwave", "0.6.2"

# ruby extentions
gem 'i18n_generators', "1.2.1" # gemerate multiple language message file
gem "ruby-openid", "2.1.8" # openid
gem "rails3_acts_as_paranoid", "0.2.4" # DB delete method changed logical delete
gem "ipaddress", '0.8.0' # ip addres check
gem "yard" # document generator like javadoc

gem 'fb_graph', "2.5.8"

# test utilities
gem 'flextures', "2.1.0" # add rake command for dump and load fixtures
gem "kaminari", "0.14.1" # paginate view
gem "whenever", '0.7.2', require:false # cron settiing automation 
gem "acts_as_readonlyable", '0.0.9' # sharding slave databases
gem 'syslogger', '1.3.0' # loggerを標準から変更

# deploy settings
gem "capistrano", "2.9.0"
gem "capistrano_colors", "0.5.5"
gem "capistrano-ext", "1.2.1"

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  gem 'therubyracer', "0.10.2"

  gem 'uglifier', '>= 1.0.3'
end

group :test, :development do
  gem 'rspec' # unit test utilities
  gem 'rspec-rails'
  gem 'faker' # generate fake data for test
  gem 'faker-japanese' # generate fake japanese names for test
  gem 'turn', '0.8.2', require:false # Pretty printed test output
  gem "spork", "0.9.1" # rspec
  #gem "simplecov", "0.5.4", require:false # test covarage files generate
  #gem "simplecov-rcov", "0.2.3", require:false
  gem "capybara" # test driver
end

group :development, :test do
  gem "pry", "0.9.10" # add commands [rails colsole]
  gem "pry-doc", "0.4.4"
  gem "pry-rails", "0.2.2"
  # gem 'plymouth', require: false
  #gem 'pry-exception_explorer'
  # TODO: pry-developper に変更
  gem 'pry-nav'
end

