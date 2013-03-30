# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130328213126) do

  create_table "account_books", :force => true do |t|
    t.integer  "user_id",                                :null => false
    t.datetime "date",                                   :null => false
    t.integer  "money",      :limit => 8, :default => 0, :null => false
    t.string   "usecase"
    t.integer  "cardtype",                :default => 0
    t.integer  "category",                :default => 0
    t.text     "memo"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "account_books", ["date"], :name => "index_account_books_on_date"
  add_index "account_books", ["user_id"], :name => "index_account_books_on_user_id"

  create_table "admin_users", :force => true do |t|
    t.string   "first_name",       :default => "",    :null => false
    t.string   "last_name",        :default => "",    :null => false
    t.string   "role",                                :null => false
    t.string   "email",                               :null => false
    t.boolean  "status",           :default => false
    t.string   "token",                               :null => false
    t.string   "salt",                                :null => false
    t.string   "crypted_password",                    :null => false
    t.string   "preferences"
    t.datetime "created_at",                          :null => false
    t.datetime "updated_at",                          :null => false
  end

  add_index "admin_users", ["email"], :name => "index_admin_users_on_email", :unique => true

  create_table "category_suggests", :force => true do |t|
    t.string  "name",          :null => false
    t.integer "m_category_id", :null => false
  end

  add_index "category_suggests", ["name", "m_category_id"], :name => "category_idx"
  add_index "category_suggests", ["name"], :name => "name_idx"

  create_table "omniusers", :force => true do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "user_profile_visibilities", :force => true do |t|
    t.integer  "user_profile_id", :default => 1
    t.boolean  "nickname",        :default => true, :null => false
    t.boolean  "sex",             :default => true, :null => false
    t.boolean  "first_name",      :default => true
    t.boolean  "family_name",     :default => true
    t.boolean  "birthday",        :default => true, :null => false
    t.boolean  "email",           :default => true, :null => false
    t.boolean  "phone_number",    :default => true, :null => false
    t.boolean  "prefecture_id",   :default => true, :null => false
    t.boolean  "distinct_id",     :default => true, :null => false
    t.boolean  "comment",         :default => true, :null => false
    t.datetime "created_at",                        :null => false
    t.datetime "updated_at",                        :null => false
    t.datetime "deleted_at"
  end

  add_index "user_profile_visibilities", ["user_profile_id"], :name => "index_user_profile_visibilities_on_user_profile_id"

  create_table "user_profiles", :force => true do |t|
    t.integer  "user_id"
    t.string   "image"
    t.string   "nickname",      :default => "", :null => false
    t.integer  "sex"
    t.string   "first_name",    :default => ""
    t.string   "family_name",   :default => ""
    t.date     "birthday"
    t.string   "email"
    t.string   "phone_number"
    t.integer  "prefecture_id", :default => 1,  :null => false
    t.integer  "distinct_id",   :default => 1,  :null => false
    t.text     "comment",                       :null => false
    t.integer  "recipe_count",  :default => 0,  :null => false
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.datetime "deleted_at"
  end

  add_index "user_profiles", ["user_id"], :name => "index_user_profiles_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "",   :null => false
    t.string   "encrypted_password",     :default => "",   :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.integer  "omniuser_id"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.datetime "created_at",                               :null => false
    t.datetime "updated_at",                               :null => false
    t.datetime "deleted_at"
    t.boolean  "entry_flg",              :default => true, :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
