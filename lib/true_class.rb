class TrueClass
  # 
  def to_i
    1
  end

  def to_f
    1.0
  end

  # 
  def to_boolean
    self
  end
  alias :to_bool :to_boolean
end
