# encoding: utf-8

module ProfileHelper
  def select_sex( f, value=nil, options={} )
    f.select( :sex, { "----"=>nil, "Nam"=>1, "Nữ"=>2, "Other"=>0 }, {selected: 1}, options )
  end

  def select_mail_status( f, value=nil, options={} )
    f.select( :mail_status, {  "receive" => true, "not receive" => false }, { selected: 1 }, options )
  end

  def translate_sex( sex )
    case sex
    when 1; "Nam"
    when 2; "Nữ"
    when 3; "Other"
    else  ; "Unknown"
    end
  end

  def visibility_radios( visibility, attr_name )
    btn1 = radio_button( :user_profile_visibility, attr_name, 1, checked:  (visibility.send(attr_name) ? "checked" : nil) )
    btn2 = radio_button( :user_profile_visibility, attr_name, 0, checked: !(visibility.send(attr_name) ? "checked" : nil) )
    "Public#{btn1}Closed#{btn2}".html_safe
  end
end
