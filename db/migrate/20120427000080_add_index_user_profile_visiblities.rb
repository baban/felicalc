# encoding: utf-8

class AddIndexUserProfileVisiblities < ActiveRecord::Migration
  def up
    add_index :user_profile_visibilities, :user_profile_id
  end

  def down
    remove_index :user_profile_visibilities, :user_profile_id
  end
end
