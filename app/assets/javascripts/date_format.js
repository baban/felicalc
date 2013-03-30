/**
 * 1日の開始時間にする
 * @return {Date} 日の初め
 */
Date.prototype.beginningOfDay = function(){
	var d = this;
	d.setHours(0, 0, 0, 0);
	return d;
}
/**
 * 指定した月の最初に移動
 * @return {Date} 月初め
 */
Date.prototype.beginningOfMonth = function(){
	var d = this;
	d.setDate(1);
	d.setHours(0, 0, 0, 0);
	return d;
}
/**
 * 年の初めにする
 * @return {Date} 年の初め
 */
Date.prototype.beginningOfYear = function(){
	var d = this;
	d.setMonth(0);
	d.setDate(1);
	d.setHours(0, 0, 0, 0);
	return d;
}
/**
 * その日の終わりに設定する
 * @return {Date} 日の終り
 */
Date.prototype.endOfDay = function(){
	var d = this;
	d.setHours(23, 59, 59, 0);
	return d;
}
/**
 * 月の終わりに設定する
 * @return {Date} 月の終わり
 */
Date.prototype.endOfMonth = function(){
	var d = this;
	var lastday = {1:31,2:(d.isLeap()?29:28),3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};
	
	d.setDate( lastday[d.getMonth()+1] );
	
	d.setHours(23, 59, 59, 0);
	return d;
}
/**
 * 年の終わりに設定する
 * @return {Date} 年の終わり
 */
Date.prototype.endOfYear = function(){
	return this;
}
/**
 * 閏年かどうかを判定する
 * @return {Boolean} 閏年ならtrue、それ以外ならfalse
 */
Date.prototype.isLeap = function(){
	var year = this.getFullYear();
	return (year%4 == 0 && year%100 != 0 || year%400 == 0);
}
/**
 * 先月に移動
 * @return {Date} 先月
 */
Date.prototype.prevMonth = 
Date.prototype.lastMonth = function(){
	var d = this;
	var lastday = {1:31,2:(d.isLeap()?29:28),3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};
	
	// 3/31 => 2月(28日まで)などの場合は、小さい方の日付に合わせる
	var prev_month = (0==d.getMonth()) ? 12 : d.getMonth(); // 年始処理
	if( lastday[prev_month] < d.getDate() ) d.setDate( lastday[prev_month] );
	
	d.setMonth(d.getMonth()-1);
	return d;
}
/**
 * 来月に移動
 * @return {Date} 来月
 */
Date.prototype.nextMonth = function(){
	var d = this;
	var lastday = {1:31,2:(d.isLeap()?29:28),3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};
	
	// 1/31 => 2月(28日まで)などの場合は、小さい方の日付に合わせる
	var next_month = (d.getMonth()+1) % 12
	if( lastday[next_month+1] < d.getDate() ) d.setDate( lastday[next_month+1] );
	
	d.setMonth(d.getMonth()+1);
	return d;
}

//曜日、月名の定義をprototypeに登録。フォーマット用文字列はエスケープ済み
Date.prototype.month_long  = [
	'Ja#nuar#y','#Februar#y','#March','Apr#i#l','#Ma#y','Ju#ne','Ju#l#y','Auga#st','Septe#mber','October','Nove#mber','#Dece#mber'
];

Date.prototype.month_short = [
	'Ja#n','#Feb','#Mar','Apr','#Ma#y','Ju#n','Ju#l','Aug','Sep','Oct','Nov','#Dec'
];

Date.prototype.youbi_long  = [
	'Su#n#da#y','#Mo#n#da#y','Tue#s#da#y','We#d#ne#s#da#y','Thur#s#da#y','#Fr#i#da#y','Satur#da#y'
];

Date.prototype.youbi_short = [
	'Su#n','#Mo#n','Tue','We#d','Thu','#Fr#i','Sat'
];

//Dateオブジェクトのprototypeに無名関数への参照を登録する。
/**
 * 指定したフォーマットで日付を出力する
 * @param {String} 日付フォーマット
 * 
 * j - mday
 * n - month
 * Y - ４桁表示の西暦
 * y - ２桁表示の西暦
 * w - youbi
 * G - hour
 * i - ２桁表示の分
 * s - ２桁表示の秒
 * d - ２桁表示の日
 * m - ２桁表示の月
 * H - ２桁表示の時間
 * M - this.month_short[mon]
 * F - this.month_long[mon]
 * D - this.youbi_short[youbi]
 * l - this.youbi_long[youbi]
 * 
 * @return {String} フォーマットされた日付
 */
Date.prototype.toString = function(format){
		//フォーマットが指定されていない場合、とりあえずGMT形式で返す
	  if(format==null)return this.toGMTString();

	  //時刻データを取得
	  var mday = this.getDate(),     dayZ=mday.toString();
	  var youbi= this.getDay();
	  var year = this.getFullYear(), year2=this.getYear();
	  var hour = this.getHours(),    houZ =hour.toString();
	  var min  = this.getMinutes(),  minZ =min.toString();
	  var mon  = this.getMonth(),    month=mon+1, monZ=month.toString();
	  var sec  = this.getSeconds(),  secZ =sec.toString();

	  //一桁の場合ゼロを付加
	  dayZ = (dayZ.length==1)?"0"+dayZ:dayZ;
	  monZ = (monZ.length==1)?"0"+monZ:monZ;
	  houZ = (houZ.length==1)?"0"+houZ:houZ;
	  minZ = (minZ.length==1)?"0"+minZ:minZ;
	  secZ = (secZ.length==1)?"0"+secZ:secZ;

	  var RegChars = {
			"j":mday,
			"n":month,
			"Y":year,
			"y":year2,
			"w":youbi,
			"G":hour,
			"i":minZ,
			"s":secZ,
			"d":dayZ,
			"m":monZ,
			"H":houZ,
			"M":this.month_short[mon],
			"F":this.month_long[mon],
			"D":this.youbi_short[youbi],
			"l":this.youbi_long[youbi]
	  }

	  //以下置換処理
	  var reg, regT;

	  for(var reg_char in RegChars){
		//「直前の文字が#でない」場合置換
		reg  = eval('/([^#])'+reg_char+'/g;');
		//先頭の場合も「直前の文字が#でない」ので、個別に置換
		regT = eval('/^'+reg_char+'/g;');

		format = format.replace(reg, '$1\\'+RegChars[reg_char]);	//諸事情により\をかませる
		format = format.replace(regT, RegChars[reg_char]);		//先頭は別処理
  }

  //#を削除。但し直前が#ならば助ける
  format = format.replace(/([^#])#/g, "$1");
  format = format.replace(/^#/g, "");
  //かませておいた\を削除
  format = format.replace(/\\/g, "");

  return format;
}
