# encoding: utf-8

class AddColumnDeletedAtUserProfileVisibilities < ActiveRecord::Migration
  def up
    add_column    :user_profile_visibilities, :deleted_at, :datetime, null: true
  end

  def down
    remove_column :user_profile_visibilities, :deleted_at
  end
end
