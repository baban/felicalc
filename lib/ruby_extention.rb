# encoding: utf-8
#
module Kernel
  def ∞
    Float::INFINITY
  end
end

class Object
  def do(*args,&b)
    yield(self, *args)
  end

  def to_bool
    !!self
  end

  def method_hooking( name, &b )
    (method(name).to_proc * ->(*_){ b.call(*_) }).do { |p| define_method(name) &p }
  end

  def tap_info(*_)
    Rails.logger.info yield(*_) if block_given?
    self
  end

  def tap_error(*_)
    Rails.logger.error yield(*_) if block_given?
    self
  end
end

