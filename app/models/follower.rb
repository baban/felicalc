# encoding: utf-8

class Follower < ActiveRecord::Base
  acts_as_paranoid

  belongs_to :users

  def self.follow( from, to )
    self.create( user_id: from, follower_id: to )
  end

  def self.unfollow( from, to )
    self.where( user_id: from, follower_id: to ).first.delete
  end

  def follow?
    !!Follower.find_by_user_id_and_follower_id( self.follower_id, self.user_id )
  end

  def user
    User.find_by_id(self.user_id)
  end

  def follower
    User.find_by_id(self.follower_id)
  end

  def user_profile
    UserProfile.find_by_user_id(self.user_id)
  end

  def follower_profile
    UserProfile.find_by_user_id(self.follower_id)
  end
end
