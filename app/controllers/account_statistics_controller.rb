# encoding: utf-8

class AccountStatisticsController < ApplicationController
  before_filter :member_filter

  # グラフ表示
  require "fusioncharts_helper"
  include FusionChartsHelper
  
  def index
    @start_date, @end_date = DateTime.now.at_beginning_of_month, DateTime.now.at_end_of_month
    if params.key?(:id)
      all, start_date, end_date = params[:day].match(/(\d+)-(\d+)/).to_a
      @start_date, @end_date = DateTime.parse(start_date), DateTime.parse(end_date)
    end
    
    @xml_data = AccountBook.agrigation( current_user, @start_date, @end_date )
  end
end
