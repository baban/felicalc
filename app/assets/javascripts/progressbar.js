/**
 * ロード進捗状況を記録するクラス
 * @constructor
 * @param {Integer} max 
 */
function Progressbar(){
	this.max=1;	// プログレスバーの最大値
	this.progress=0;	// 進捗状況
	this.progressbar = this.create();
}

Progressbar.prototype.create = function(){
	// 外枠
	var d_m = document.createElement( 'div' );
	d_m.className='progressbar-content';
	// 読み込み中表示アイコン
	var d_i2 = document.createElement( 'div' );
	d_i2.className='loading-icon';
	d_m.appendChild( d_i2 );
	// プログレスバー部分
	var d = document.createElement( 'div' );
	d.className='progressbar';
	d_m.appendChild( d );
	this.progressbar = d_m;
	// プログレスバーの内側
	var d_i = document.createElement( 'div' );
	d_i.className='progressbar-inner';
	d.appendChild( d_i );
	return d_m;
}

/**
 * 最大値の設定
 * @param {Integer} max 設定する最大値
 */
Progressbar.prototype.setMax = function( max ){
	if( 'number'!= typeof max ) return null;
	if( 0 >= max ) max=1;
	this.max=max;
}

/**
 * プログレスバーの進捗を行います
 * @param {Integer} n 
 * @return 
 */
Progressbar.prototype.inc = function( n ){
	if( 'number' != typeof n ) return this.progress++;
	this.progress += n;
	if( this.progress <= 0 ) this.progress=0;
	return this.progress;
}

/**
 *　メインのプログレスバーの進捗管理を行う
 */
Progressbar.prototype.start = function( o ){
	var len = this.max;
	var me = this;
	var pinr = me.progressbar.childNodes[1].firstChild;
	pinr.style.width='0%';
	// loading-iconを表示
	// 本当はｒｅｑｕｅｓｔメソッドで定義すべきだけどオーバーロード先で期されてる可能性があるので保険
	me.progressbar.firstChild.style.visibility='visible';	
	me.progress=0;
	var n=0;
	var proc = function(){
		var per=0;
		try{
			per=Math.floor(me.progress*100/len);
			pinr.style.width = per+'%';
			// 以下エラーチェック
			(per<0) && (per=0);
			(per>100) && (per=100);
		}catch(e){ per=100; }
		return per;
	};	// 初期化と処理
	this.start = function(){
		proc();
		//alert('progress:'+me.progress+' per:'+n);
		if( n++>=50 || proc()>=85 ){
			me.progressbar.firstChild.style.visibility='hidden';	// loading-iconを隠す
			return true;	// 処理の終了
		}
		window.setTimeout( function(){ me.start(); }, 100 );
	};
	window.setTimeout( function(){ me.start(); }, 0 );
}
/**
 * 
 */
Progressbar.prototype.reflesh = function(){
	this.progress=0;
	this.progressbar.firstChild.style.visibility='visible';	// loading-iconを隠す
	this.progressbar.childNodes[1].style.visibility='visible';
	var me=this;
	var pinr = me.progressbar.childNodes[1].firstChild;
	pinr.style.width='0%';
}

Progressbar.prototype.show = function(){
	this.progressbar.firstChild.style.visibility='visible';	
	this.progressbar.childNodes[1].style.visibility='visible';
	var pinr = this.progressbar.childNodes[1].firstChild;
	pinr.style.width='0%';
}

Progressbar.prototype.hidden = function(){
	this.progressbar.firstChild.style.visibility='hidden';	
	this.progressbar.childNodes[1].style.visibility='hidden';
	var pinr = this.progressbar.childNodes[1].firstChild;
	pinr.style.width='0%';
}
