# encoding: utf-8

class UserProfile < ActiveRecord::Base
  # users table and user_profiles table are saved data to another database
  establish_connection "cook24_users" if [:staging,:production].include?(Rails.env.to_sym)
  default_scope order: 'id DESC'

  acts_as_paranoid

  has_one :user_profile_visibility
  alias :visibility :user_profile_visibility
  belongs_to :user
  accepts_nested_attributes_for :user

  validates :nickname,      presence: true
  validates :birthday,      presence: true
  validates :prefecture_id, presence: true
  validates :distinct_id,   presence: true

  mount_uploader :image, UserProfileImageUploader

  module MailStatus
    ERROR       = nil # this user cannot send mail
    NOT_RECEIVE = 0   # user is not need mail
    RECEIVE     = 1   # user will receive mail magazine (default)
  end

  def initialize(*args)
    super(*args)
    self.user_profile_visibility= UserProfileVisibility.new
  end
end

