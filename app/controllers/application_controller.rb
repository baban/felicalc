# encoding: utf-8

class ApplicationController < ActionController::Base
  include ::SslRequirement
  include FormHelper

  before_filter :sidebar_filter

  protect_from_forgery

  helper_method :my_recipe?, :current_omniuser, :login?

  def auth
    @user = current_user
  end

  private
  def my_recipe?
    @recipe and (@recipe.user_id == current_user.id)
  end

  # Omniauthでのログイン状況確認
  def current_omniuser
    @current_omniuser ||= Omniuser.find_by_id(session[:user_id]) if session[:user_id]
  end

  def login?
    !!current_user
  end

  def sidebar_filter
    # get advartisement banner image and description
    @sidebar_advertisement = RecipeAdvertisement.choice
    @newsfeeds = Newsfeed.topics
    @streams = Stream.topics
    @recipes = Recipe.list( params, @order_mode ).page( params[:page] || 1 ).per(5)
    @food_genre = RecipeFoodGenre.choice(params)
  end
end
