# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
	def flash_tag( filename )
		%Q{<object data="#{filename}.swf">
			
		</object>}
	end
end
