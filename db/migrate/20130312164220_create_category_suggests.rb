# encoding: utf-8

class CreateCategorySuggests < ActiveRecord::Migration
  def self.up
    create_table :category_suggests do |t|
      t.column :name, :string, :null=>false
      t.column :m_category_id, :integer, :null=>false
      t.timestamp
    end
    add_index :category_suggests, :name, :name=>:name_idx
    add_index :category_suggests, [:name, :m_category_id], :name=>:category_idx
  end

  def self.down
    drop_table :category_suggests
  end
end
