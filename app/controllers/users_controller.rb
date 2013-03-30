# encoding: utf-8

class UsersController < ApplicationController
  before_filter :authenticate_user!

  def stop_confirm
  end

  # user account is exist, but all recipes, profiles is unpubliced
  def stop
    current_user.stop
    EntretLog.stop( current_user.id )

    redirect_to action:"stoped"
  end

  def stoped
  end

  def recover_confirm
  end

  def recover
    current_user.user_recover
    EntretLog.reentry( current_user.id )

    redirect_to action:"recovered"
  end

  def recovered
  end

  def registrated
  end
end
