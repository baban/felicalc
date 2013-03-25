class AccountBook < ActiveRecord::Base
  
  # 検索条件を示したパラメーターの値をチェックする
  # [params] 検索条件を示したハッシュ
  # [return] クリーンアップした検索パラメーター
  def self.params_check( params )
    params
  end
  
  # ハッシュを元に検索を行う
  # [user_id] ユーザーID
  # [params] 検索パラメーター
  # [return]
  def self.search_only_hash( user_id, params )
    params[:user_id] = user_id
    AccountBook.find(:all, :conditions=> params )
  end
  def self.search(*args) self.search_only_hash(*args) end
  
  # 与えられた行のパラメータを元にデータを追加
  # [user_id] ユーザーID
  # [params] 更新するデータを含んだハッシュ
  # [return] 行を更新する
  def self.update_row( user_id, params, mode = :update )
    mode = (mode != :update) ? :add : :update
    
    params['user_id'] = user_id
    params['date'] = DateTime.now if :add == mode
    
    # カテゴリ未指定の場合は出来るだけ自動補完
    category = CategorySuggest.find_category(params['usecase']) if !params['category'] or params['category'].to_i == 0
    params['category'] = category.m_category_id if category
    
    o = AccountBook.first( :conditions=>['id = ? and user_id = ?', params['id'], user_id ] )
    params.delete(:id)
    if !o
      o = AccountBook.create( params )
    else
      o.update_attributes(params)
    end
    o
  rescue => e
    Rails.logger.error "update_row data insert error"
  end
  
  # 指定された行を削除する
  # 本人と一致するIDのユーザーしか実行できない
  # 
  # [+user_id+] ユーザーID
  # [+row_id+] 行番号
  # [+return+] 削除された行数
  def self.delete_row( user_id, row_id )
    return if !row_id
    AccountBook.destroy_all(['id = ? and user_id=?', row_id, user_id ]).first
  end
  
  # 月初めから終わりまでの統計データを作成
  # 
  # [+user+] Userオブジェクト
  #
  # [+return+] 集約済データ
  def self.agrigation( user, start_date = DateTime.now.at_beginning_of_month, end_date = DateTime.now.at_end_of_month )
    self.all( :select => 'category, sum(money) as money', 
      :conditions => [ "category!=0 and usecase!='' and user_id = :uid and date between :start and :end ", 
        { :uid => user.id, :start => start_date, :end => end_date } ] ,
      :group => "category", :order => "money desc" )
  end
  
  # 用途ごとに使用回数をカウント
  # [return] 登録回数のおおいものから順番に並べたリスト
  def self.agrigation_all
    self.all( :select => 'usecase, count(usecase) as money, category', 
      :conditions => [ "category!=0 and usecase!=''" ] ,
      :group => "usecase", :order => "money desc" )
  end
  
end

