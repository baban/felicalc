# encoding: utf-8

module AccountStatisticsHelper
  require "fusioncharts_helper"
  include FusionChartsHelper
  
  def statistic_formatter( xml_data )
    arr = [['',0],['食費',1],['日用品',2],['服飾費',3],['光熱費',4],['医療費',5],['衛生費',6],['交通通信費',7],['住居費',8],['備品',9],['交際費',10], ['教育費',11],['趣味',12],['社会保険料',13],['税金',14],['贈答',15],['その他',16]].map{ |v| a,b = *v; [b,a] }
    h = Hash[*arr.flatten]
  "<graph showNames='1' decimalPrecision='0' formatNumberScale='0' baseFontSize='10' numberPrefix='￥' width='600' formatNumber='1' nameTBDistance='20' animation='0' >"+
  xml_data.map{ |data| "<set name='#{h[data.category.to_i]}' value='#{data.money}' />" }.join('')+
  "</graph>"
  end

  def statistic_table( xml_data )
    arr = [['',0],['食費',1],['日用品',2],['服飾費',3],['光熱費',4],['医療費',5],['衛生費',6],['交通通信費',7],['住居費',8],['備品',9],['交際費',10], ['教育費',11],['趣味',12],['社会保険料',13],['税金',14],['贈答',15],['その他',16]].map{ |v| a,b = *v; [b,a] }
    h = Hash[*arr.flatten]
    sum = xml_data.map{ |data| data.money }.sum
    
    data = xml_data.enum_with_index.map do |data,idx|
      "<tr><th>#{idx+1}</th><th>#{h[data.category.to_i]}</th><td>#{data.money}</td><td>#{ sprintf('%.02f', data.money.to_f*100/sum.to_f)}</td></tr>"
    end.join("\n")
    
    table = <<-TABLE_TAG
    <table class='data' id='statistic-table'>
    <tr><th></th><th>科目</th><th>金額(円)</th><th>割合(%)</th></tr>
    #{data}
    </table>
    TABLE_TAG
    
    table
  end
end
