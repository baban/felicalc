class EmailMailer < ActionMailer::Base

  def change_email(email)
    setup_email(email)
    @recipients  = "#{email.email}" 
    @subject    += 'Request to change your email'
    @body[:url]  = "http://YOURSITE/activate_email/#{email.activation_code}" 
  end

  protected
    def setup_email(email)
      @recipients  = "#{email.email}"
      @from        = "ADMINEMAIL"
      @subject     = "[YOURSITE] "
      @sent_on     = Time.now
      @body[:email] = email
    end
end