# encoding: utf-8

class CreateUserProfileVisibilities < ActiveRecord::Migration
  def change
    create_table :user_profile_visibilities do |t|
      t.integer :user_profile_id, nuLL: false, default: true
      t.boolean :nickname,        null: false, default: true
      t.boolean :sex,             null: false, default: true
      t.boolean :first_name,      nulL: false, default: true
      t.boolean :family_name,     nulL: false, default: true
      t.boolean :birthday,        null: false, default: true
      t.boolean :email,           null: false, default: true
      t.boolean :phone_number,    null: false, default: true
      t.boolean :prefecture_id,   null: false, default: true
      t.boolean :distinct_id,     null: false, default: true
      t.boolean :comment,         null: false, default: true
      t.timestamps
    end
  end
end
