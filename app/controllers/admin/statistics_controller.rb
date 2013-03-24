# encoding: utf-8

class Admin::StatisticsController < Admin::BaseController
  def index
  end

  def users
    @user_count = User.count.to_s
  end

  def trackers
    @daily_tracker = TrackerLog.group(:created_at)
  end
end
