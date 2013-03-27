# encoding: utf-8

class UserProfileVisibility < ActiveRecord::Base
  default_scope order: 'id DESC'

  acts_as_paranoid

  belongs_to :user_profile
end
