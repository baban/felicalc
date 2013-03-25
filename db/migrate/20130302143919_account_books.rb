class AccountBooks < ActiveRecord::Migration
  def self.up
    create_table :account_books do |t|
      t.column :user_id, :integer, :null=>false # ユーザーID
      t.column :date, :datetime, :null=>false # 使用日時
      t.column :money, :integer, :null=>false, :default => 0, :limit=>8 # 金額
      t.column :usecase, :string # 用途
      t.column :cardtype, :integer, :limit => 10, :default=>0 # カードの種類
      t.column :category, :integer, :default=>0 # 予算の用途をカテゴリ分けする
      t.column :memo, :text # 備考
      t.timestamp
    end
    add_index :account_books, :user_id
    add_index :account_books, :date
    add_timestamps :account_books
  end

  def self.down
    drop_table :account_books
  end
end
