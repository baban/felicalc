class FalseClass
  # 
  def to_i
    0
  end

  def to_f
    0.0
  end

  # 
  def to_boolean
    self
  end
  alias :to_bool :to_boolean
end
