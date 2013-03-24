# encoding: utf-8

class UserProfileVisibility < ActiveRecord::Base
  # users table and user_profiles table are saved data to another database
  establish_connection "cook24_users" if [:staging,:production].include?(Rails.env.to_sym)
  default_scope order: 'id DESC'

  acts_as_paranoid

  belongs_to :user_profile
end
