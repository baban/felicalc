# encoding: utf-8

# http://npb.somewhatgood.com/blog/archives/752
# FacebookとOmniauthのログイン方法の実装は上のURLを参考にしました
class SessionsController < ApplicationController
  def callback
    # get omniauth.auth enviroment values
    auth = request.env["omniauth.auth"]
    # create omniuser
    omniuser = Omniuser.find_by_provider_and_uid(auth["provider"], auth["uid"])
    
    # Omniuserモデルに:providerと:uidが存在してる？
    if omniuser
      # Oauth is authorized
      user = User.find_by_omniuser_id(omniuser.id)
      if user
         # user is exist( devise authorise is success )
         if user.confirmed_at
           # mail confirm is ended
           # user is login
           session[:user_id] = omniuser.id
           sign_in(:user, user)
           redirect_to root_url, notice: "Đăng nhập"
         else
           redirect_to root_url, notice: "Hãy kiểm tra email."
         end
       else
         logger.info :auth
         logger.info auth.inspect
         flash[:nickname] = auth["info"] && auth["info"]["name"]
         flash[:email] = auth["info"] && auth["info"]["email"]
         flash[:image] = auth["info"] && auth["info"]["image"]
         flash[:sex] = auth["extra"] && auth["extra"]["raw_info"] && auth["extra"]["raw_info"]["gender"]
         flash[:birthday] = auth["extra"] && auth["extra"]["raw_info"] && auth["extra"]["raw_info"]["birthday"]
         flash[:facebook] = true
         logger.info :omniuser
         logger.info flash.inspect
         redirect_to new_user_registration_path, notice: "Nó đã được kết nối với tài khoản #{auth["provider"]} của ông #{auth["info"]["name"]}. Xin vui lòng nhập địa chỉ email của bạn và mật khẩu cần thiết để đăng ký thành viên."
       end
    else
      # Omniuserモデルに:providerと:uidが無い = OAuth認証がまだ
      # Omniuserモデルに:provider,:uidを保存する
      Omniuser.create_with_omniauth(auth)

      # Deviseユーザ登録の際、自分のOmniuser.idを外部キーとして保存させたい。
      # sessionにuid値を保存し、ユーザ登録のビューで使えるようにしておく。
      # sessionに保存した値を使ってOmniuserモデルを検索すれば、Omniuser.idを取得できる。
      logger.info :auth
      logger.info auth.inspect
      session[:tmp_uid] = auth["uid"]
      flash[:nickname] = auth["info"] && auth["info"]["name"]
      flash[:email] = auth["info"] && auth["info"]["email"]
      flash[:image] = auth["info"] && auth["info"]["image"]
      flash[:sex] = auth["extra"] && auth["extra"]["raw_info"] && auth["extra"]["raw_info"]["gender"]
      flash[:birthday] = auth["extra"] && auth["extra"]["raw_info"] && auth["extra"]["raw_info"]["birthday"]
      flash[:facebook] = true
      logger.info :omniuser
      logger.info flash.inspect
      redirect_to new_user_registration_path, notice: "Tôi đã được kết nối với tài khoản #{auth["provider"]} của ông #{auth["info"]["name"]}. Xin vui lòng nhập địa chỉ email của bạn và mật khẩu cần thiết để đăng ký thành viên. "
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: "Đã logout"
  end
end

