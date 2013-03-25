class AccountStatistic
  # 円グラフを生成するために必要な条件を生成する
  #
  # [+user_id+] ユーザーID
  # [+params+] 検索条件
  #
  # [+return+] 振り分けとハッシュ
  def self.statistic( user, params )
    q = "select name, money from account_books group by name"
    AccountBooks.find_by_sql( q )
  end
end
