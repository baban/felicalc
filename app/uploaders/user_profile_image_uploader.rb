# encoding: utf-8

class UserProfileImageUploader < BaseUploader
  process resize_to_fit: [180, 180]  
  version :thumb do
    process resize_to_limit: [180, 180]  
  end
  version :icon do
    process resize_to_limit: [32, 32]  
  end
  version :small_icon do
    process resize_to_limit: [22, 22]  
  end
end
