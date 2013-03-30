require "kconv"
require 'action_mailer'
=begin
class HogeMailer < ActionMailer::Base
  @@default_charset = 'iso-2022-jp'
  @@encode_subject  = false
  def hogeMessage(recipient, mySubject, myBody)
    from 'babanba.n@gmail.com'
    recipients recipient
    subject '=?ISO-2022-JP?B?' + Kconv.tojis(mySubject).split(//,1).pack('m').chomp + '?='
    body Kconv.tojis(myBody)
  end  
end
=end

class HogeMailer < ActionMailer::Base
    def hello(toAddress)
      from 'babanba.n@gmail.com'
      recipients toAddress
      subject 'hello mail' 
      body :recipient => toAddress
    end
end

