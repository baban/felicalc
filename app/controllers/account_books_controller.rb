# encoding: utf-8

class AccountBooksController < ApplicationController
  # コンテンツ
  def index
  end
    
  # 指定された条件の列をすべて取り出して、jsonで返す
  def get_row
    logger.info :current_user
    logger.info current_user.inspect
    @account_books = AccountBook.where( user_id: current_user.id ).where( params[:conditions] ).to_a
    logger.info @account_books.inspect
    respond_to { |fmt| fmt.json { render :json => @account_books } }
  end
  
  # 送られてきた列情報を該当するidの列に反映する
  def update_row
    tprms = params
    @account_book = AccountBook.update_row( current_user.id, tprms )
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
    ori, start_date, end_date = params[:id].match(/(\d+)-(\d+)/).to_a
    start_date, end_date = DateTime.parse(start_date), DateTime.parse(end_date)
    
    @account_books = AccountBook.where( user_id: current_user.id ).where( date: start_date.beginning_of_day..end_date.end_of_day )
    
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
