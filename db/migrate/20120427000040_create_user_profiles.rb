# encoding: utf-8

class CreateUserProfiles < ActiveRecord::Migration
  def change
    create_table :user_profiles do |t|
      t.integer  :user_id,       nuLL: false
      t.string   :image,         null: true
      t.string   :nickname,      null: false, default:""
      t.integer  :sex,           null: true
      t.string   :first_name,    nulL: true,  default:""
      t.string   :family_name,   nulL: true,  default:""
      t.date     :birthday,      null: true
      t.string   :email,         null: true
      t.string   :phone_number,  null: true
      t.integer  :prefecture_id, null: false, default: 1
      t.integer  :distinct_id,   null: false, default: 1
      t.text     :comment,       null: false, default: ""
      t.integer  :recipe_count,  null: false, default: 0

      t.timestamps
    end
  end
end
