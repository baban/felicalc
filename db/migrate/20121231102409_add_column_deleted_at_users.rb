# encoding: utf-8

class AddColumnDeletedAtUsers < ActiveRecord::Migration
  def up
    add_column    :users, :deleted_at, :datetime, null: true
    add_column    :users, :entry_flg,  :boolean,  null: false, default: true
  end

  def down
    remove_column :users, :deleted_at
    remove_column :users, :entry_flg
  end
end
