# encoding: utf-8

class AccountBooksController < ApplicationController
  # コンテンツ
  def index
  end
  
  # １件表示
  def show
    @account_book = AccountBook.find(params[:id])
  end
  
  # 新規登録
  def new
    @account_book = AccountBook.new
  end
  
  # 編集
  def edit
    @account_book = AccountBook.find(params[:id])
  end
  
  # 作成
  def create
    @account_book = AccountBook.new(params[:account_book])
    
    respond_to do |format|
      if @account_book.save
        flash[:notice] = '1件登録完了!'
        format.html { redirect_to(@account_book) }
      else
        format.html { render :action => "new" }
      end
    end
  end
  
  # 更新
  def update
    @account_book = AccountBook.find(params[:id])
    respond_to do |format|
      if @account_book.update_attributes(params[:account_book])
        flash[:notice] = 'データ更新完了!'
        format.html { redirect_to(@account_book) }
      else
        format.html { render :action => "edit" }
      end
    end
  end
  
  # 破棄
  def destroy
    @account_book = AccountBook.find(params[:id])
    @account_book.destroy
    
    respond_to { |fmt| fmt.html { redirect_to(account_books_url) } }
  end
  
  # 指定された条件の列をすべて取り出して、jsonで返す
  def get_row
    @account_books = AccountBook.where( user_id: current_user.id ).where( params[:conditions] ).to_a
    
    respond_to { |fmt| fmt.json { render :json => @account_books } }
  end
  
  # 送られてきた列情報を該当するidの列に反映する
  def update_row
    tprms = params
    @account_book = AccountBook.update_row( current_user.id, tprms )
    logger.info @account_book.inspect
    respond_to {|fmt| fmt.json { render :json => @account_book } }
  end
  
  # 指定れた行の削除
  def delete_row
    uid = current_user.id
    return if !params[:id]
    @row = AccountBook.delete_row( uid, params[:id] )
    respond_to {|fmt| fmt.json { render :json => @row } }
  end
  
  # Excel、CSV 形式でエクスポート
  def export
    # 日付の解析
    now = DateTime.now
    all, start_date, end_date = params[:id].match(/(\d+)-(\d+)/).to_a
    start_date, end_date = DateTime.parse(start_date), DateTime.parse(end_date)
    
    h = {
      :uid => @u.id,
      :start => start_date.beginning_of_day,
      :end => end_date.end_of_day,
    } 
    @account_books =  AccountBook.all( 
      :conditions=> [ ' user_id = :uid and date between :start and :end ', h ] )
    
    respond_to { |fmt|
      cls = [:date,:money,:usecase,:memo,:cardtype,:category]
      fmt.csv { send_data @account_books.to_csv(:only=>cls) }
      fmt.xls { send_data @account_books.to_xls(:only=>cls) }
      fmt.ofx { @account_books }
    }
  end
  
  # オートコンプリートの候補を取得
  def suggest
    @suggest = CategorySuggest.name_list
    respond_to {|fmt| fmt.json { render :json => @suggest } }
  end
end
