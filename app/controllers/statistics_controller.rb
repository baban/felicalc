# encoding: utf-8

class StatisticsController < Admin::BaseController
  def index
  end

  def users
    @user_total = UserProfile.count

    @sex_rate_graph = create_profile_table
    @prefecture_table = create_prefecture_table
    @dicade_table = create_dicade_table
    @food_genre_table = create_recipe_food_genre_table
    @foodstuff_table = create_recipe_food_table
  end

  def profile
    @prefecture_amount_greph = UserProfile.group(:prefecture_id).count
    # @age_amount_greph = UserProfile.group(:prefecture_id).count
  end

  def entret
    @month = params[:month] ? Date.parse( params[:month] ) : Date.today
    @items = EntretResult.where( day: @month.beginning_of_month..@month.end_of_month ).order("day DESC")
  end 

  def tracker_logs
    @month = params[:month] ? Date.parse( params[:month] ) : Date.today
    @tracker_codes = TrackerResult.tracker_codes
    # @genres = TrackerResult.get_genres
    @tracker_code = params[:tracker_code] ||  @tracker_codes.first

    @items = TrackerResult.where( day: @month.beginning_of_month..@month.end_of_month ).where( tracker_code: @tracker_code ).order("day DESC")
  end

  private
  def create_profile_table
    sex_label = ["その他","男性","女性"]
    UserProfile.group(:sex).count.map{ |k,v| [sex_label[k.to_i],v] }
  end

  def create_prefecture_table
    h = Prefecture.all.inject({}){ |h,o| h[o.id]=o.name; h }
    profiles = UserProfile.group(:sex).count
    pref_names = profiles.keys.map{ |v| h[v].to_s }
    values = profiles.values

    [pref_names,values].transpose
  end

  def create_dicade_table
    profiles = UserProfile.find_by_sql(["select (t.birthday*10) as birthday, count(*) as sex from (select round(((curdate()+0)-(birthday + 0))/100000) as birthday from user_profiles) as t group by birthday;"])
    profiles.map { |o| [o.birthday.to_i, o.sex] }
  end

  def create_recipe_food_genre_table
    RecipeFoodGenre.all.map { |o| [o.name,o.amount] }
  end

  def create_recipe_food_table
    RecipeFoodstuff.group(:name).count.map{ |k,v| [k,v] }.sort { |a,b| b[1]<=>a[1] }[0..10]
  end
end

