# encoding: utf-8

class AddColumnDeletedAtUserProfiles < ActiveRecord::Migration
  def up
    add_column    :user_profiles, :deleted_at, :datetime, null: true
  end

  def down
    remove_column :user_profiles, :deleted_at
  end
end
