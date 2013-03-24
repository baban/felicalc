# encoding: utf-8

class ApplicationController < ActionController::Base
  include ::SslRequirement
  include FormHelper

  protect_from_forgery

  helper_method :current_omniuser, :login?

  def auth
    @user = current_user
  end

  private
  # Omniauthでのログイン状況確認
  def current_omniuser
    @current_omniuser ||= Omniuser.find_by_id(session[:user_id]) if session[:user_id]
  end

  def login?
    !!current_user
  end
end
