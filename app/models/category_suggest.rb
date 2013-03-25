class CategorySuggest < ActiveRecord::Base
	def self.reset_index
		destroy_all
		AccountBook.agrigation_all.enum_with_index.map do |i,idx|
			create( :id=>idx+1, :name => i.usecase, :m_category_id=>i.category )
		end
	end
	
	# 指定した用途に一致するカテゴリを探します
	def self.find_category(name)
		first( :conditions=>[' name=? ',name], :order=>:id )
	end
	
	# オートコンプリートの候補を取り出す
	def self.name_list
		all( :limit=>100 ).map{ |i| [ i.name ] };
	end
end
