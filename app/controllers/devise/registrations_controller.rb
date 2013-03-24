# encoding: utf-8

# this source is copied /gems/devise-2.1.0/app/controllers/devise/registrations_controller.rb
# create action is chenged source

# if logic is changed by default
# those area is write
# =begin
# =end

#=begin
require 'chronic'
#=end

class Devise::RegistrationsController < DeviseController
  prepend_before_filter :require_no_authentication, :only => [:new, :create, :cancel]
  prepend_before_filter :authenticate_scope!, :only => [:edit, :update, :destroy]

  ssl_required(:new, :create) unless [:development,:test].include?(Rails.env.to_sym)

  # GET /resource/sign_up
  def new
    resource = build_resource({})
    @facebook = flash[:facebook];
    #=begin
    resource.email = flash[:email]
    resource.profile.nickname = flash[:nickname]
    resource.profile.sex = { "male" => 1, "female" => 2 }[flash[:sex]]
    resource.profile.birthday = Chronic.parse(flash[:birthday])
    logger.info :resource
    logger.info resource.inspect
    logger.info resource.profile.inspect
    #=end
    respond_with resource
  end

  # POST /resource
  def create
    build_resource
    #=begin
    # if user is created by facebook,twitter,google+.
    # confirmail mail is skipping
    resource.skip_confirmation! if params[:user] and params[:user][:omniuser_id]
    #=end
    if resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, "signed_up" if is_navigational_format?
        sign_in(resource_name, resource)
        logger.info resource.inspect
        logger.info resource_name.inspect
        Stream.push( Stream::ADD_USER, resource.id )
        respond_with resource, :location => after_sign_up_path_for(resource)
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_session_data_after_sign_in!
        #=begin
        Stream.push( Stream::ADD_USER, resource.id )
        EntretLog.entry( resource.id )
        if session[:__tracker]
          TrackerLog.entry( session[:__tracker], resource.id )
          TrackerLog.complete( resource.id )
        end
        return redirect_to "/users/registrated" # change redirect action
        #=end
      end
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

  # GET /resource/edit
  def edit
    render :edit
  end

  # PUT /resource
  # We need to use a copy of the resource because we don't want to change
  # the current user in place.
  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)

    if resource.update_with_password(resource_params)
      if is_navigational_format?
        if resource.respond_to?(:pending_reconfirmation?) && resource.pending_reconfirmation?
          flash_key = :update_needs_confirmation
        end
        set_flash_message :notice, flash_key || :updated
      end
      sign_in resource_name, resource, :bypass => true
      respond_with resource, :location => after_update_path_for(resource)
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

  # DELETE /resource
  def destroy
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    set_flash_message :notice, :destroyed if is_navigational_format?
    respond_with_navigational(resource){ redirect_to after_sign_out_path_for(resource_name) }
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  def cancel
    expire_session_data_after_sign_in!
    redirect_to new_registration_path(resource_name)
  end

  protected

  # Build a devise resource passing in the session. Useful to move
  # temporary session data to the newly created user.
  def build_resource(hash=nil)
    hash ||= resource_params || {}
    self.resource = resource_class.new_with_session(hash, session)
  end

  # The path used after sign up. You need to overwrite this method
  # in your own RegistrationsController.
  def after_sign_up_path_for(resource)
    after_sign_in_path_for(resource)
  end

  # The path used after sign up for inactive accounts. You need to overwrite
  # this method in your own RegistrationsController.
  def after_inactive_sign_up_path_for(resource)
    respond_to?(:root_path) ? root_path : "/"
  end

  # The default url to be used after updating a resource. You need to overwrite
  # this method in your own RegistrationsController.
  def after_update_path_for(resource)
    signed_in_root_path(resource)
  end

  # Authenticates the current scope and gets the current resource from the session.
  def authenticate_scope!
    send(:"authenticate_#{resource_name}!", :force => true)
    self.resource = send(:"current_#{resource_name}")
  end
end
