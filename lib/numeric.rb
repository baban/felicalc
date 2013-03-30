class Numeric
  # 
  def to_boolean
    (0==self)?false:true
  end
  alias :to_bool :to_boolean
end
