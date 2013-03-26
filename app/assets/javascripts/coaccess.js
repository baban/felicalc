/**
 * テキストを区切り文字で区切って、行列に変換します
 * つまり
 * aaa\tbbb\n
 * ccc\tddd\n
 * を
 * [['aaa','bbb'],['ccc','ddd']]
 * と変換します
 */
String.prototype._matrix = 
String.prototype.to_matrix = 
String.prototype.toMatrix = function(){
	var s = this;
	var lines = s.replace( /\n+/g, '\n' ).split(/\n/);
	var matrix = lines.map(function(line){ return line.split('\t'); });
	
	if( matrix.last().length==1 && matrix.last()[0]=='' ) matrix.pop(); // \nだけの最終行は無視
	
	return matrix;
}

/**
 * オブジェクトをJSON 形式の文字列に変換します
 * 本来はMozilla内部にtoSourceという便利なメソッドがあるのですが、日本語文字列を問答無用で\u30FC等のコード番号のASCIIに変換するので、日本語を含む場合の回避策が必要だったので
 * @param {hash} o 変換するJavaScriptオブジェクト
 * @return {string} 変換されたJSON文字列
 */
function unEval( o ){
	var arr=[], idx=0;
	for( var i in o ){
		if( undefined==o[i] || null==o[i] ) return o[i];
		var to=o[i];  // テンポラリオブジェクト
		if( 'object'==typeof o[i] ) to=this( o[i] );
		if( 'string'==typeof o[i] ) to='"'+o[i].replace(/\"/g, "'")+'"';
		arr[idx++] = (o instanceof Array)?to : i+' : '+to;
	}
	return (o instanceof Array)?'[ '+arr.join(' , ')+' ]':'{ '+arr.join(' , ')+' }';
}

/**
 * HTMLのタグの作成を簡略化するためのヘルパークラス
 * @constructor
 */
var AccessHtmlHelper = new Object();
AccessHtmlHelper.helpers = {
	/**
	 * showは、表示だけで編集を禁止する場合の処理
	 * @param {Hash} row 編集列全体
	 * @param {Hash} colInfo カラム情報
	 */
	show:{ 
		create:function( row, colInfo ){
			var div = document.createElement( 'div' );
			div.className='cell';
			setted = div.innerHTML = row[colInfo.name];
			return div;
		},
		/**
		 * @param {string} d 日付を数字化した文字列
		 * @return {string} d 日付を数字化した文字列
		 */
		get:function( d ) { return d; },
		/**
		 * 
		 * @param {DOMElement} el 要素
		 * @param {string} d 日付
		 * @return {undefined} undefindを返して値を入力させない
		 */
		set:function( el, d ){ return undefined; }
	},
	/**
	 * 文字列を表示する場合の処理
	 */
	text:{
		/**
		 * @param {hash} row 
		 * @param {hash} colInfo 
		 * @param {this} me 
		 * @param {DOMElement} td 
		 * @return {DOMElement} 代入すべきDOM要素
		 */
		create:function( row, colInfo, self ){
			var inp = document.createElement( 'input' );
			inp.type="text";
			inp.className="text-inner";
			inp.value=row[colInfo.name];
			// 各イベント時の動作を定義
			inp.onclick=function(e){ inp.focus(); }
			inp.onkeydown=function(e){
				var p=self.selectPoint;
				self.table[p.y-1][self.tableHeader[p.x].name] = inp.value; 
			}
			return inp;
		},
		/**
		 * @param {string} d 
		 */
		get:function( d ) {
			if( null==d || undefined==d ) return '';
			return d.toString();
		},
		set:function( el, d ){ return; }
	},
	/**
	 * 数値型のデータを扱うときの処理
	 */
	number:{
		create:function( row, colInfo, self ){
			var inp = document.createElement( 'input' );
			inp.type="text";
			inp.className="text-inner";
			inp.value=row[colInfo.name];
			inp.onclick=function(e){ inp.focus(); }
			inp.onkeydown=function(e){ 
				var p=self.selectPoint;
				self.table[p.y-1][self.tableHeader[p.x].name] = inp.value; 
			}
			return inp;
		},
		/**
		 * @param {string} d 
		 */
		get:function( d ) {
			if( null==d || undefined==d ) return 0;
			return parseFloat(d);
		},
		set:function( el, d ){ return el.value = d; }
	},
	/**
	 * 真偽値型のデータを扱うときの処理
	 * 基本的にチェックボックスを表示して、そちらに処理を依存します
	 */
	bool:function() {
		return {
			/**
			 * @param {object} row 1列分のハッシュ
			 * @param {object} colInfo ハッシュから列の情報を取り出すための参考情報
			 */
			create : function( row, colInfo ){
				var inp = document.createElement( 'input' );
				inp.type = 'checkbox';
				inp.checked = row[colInfo.name];
				return inp;
			},
			get : function( d ){
				if( 'string' == typeof d ) d = d.replace( /\W/g, '' );	// \nや\t等を全消去
				if( 'false'==d || 'null'==d || 'undefined'==d || ''==d  || '0'==d ) d = false;
				if( 'true'==d ) d = true;
				d = new Boolean( d );
				return d.valueOf();
			},
			set : function( el, d ){ return el.checked = d; }
		};
	},
	/**
	 * 日付型を処理して、文字列で返す
	 */
	datetime:function(){ 
		var me = this;
		/**
		 * 日付の文字列をパースしてできる限りDate型のデータにして返す
		 * @param {String} d  日付文字列
		 * @return {Date} パース結果の日付データ
		 */
		function parse( d ){
			var r, flg=0, dt = new Date();
			dt.setHours( 0, 0, 0, 0 );
			// YYYY-MM-DDやYYYY-MM-DD hh:mm:ss系のフォーマットの解析
			if( r = d.match(/([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2}))?/) ){
				dt.setHours( Number(r[1]), Number(r[2]), (r[3] ? Number(r[3]) : 0) );
				flg=1;
			}
			// MM/DD系のフォーマットの解析
			if( r = d.match(/(([0-9]{2,4})\/)?([0-9]{1,2})\/([0-9]{1,2})/) ){
				dt.setFullYear( r[2] ? r[2] : new Date().getFullYear() );	// 年
				dt.setMonth( (Number(r[3])>1) ? (Number(r[3])-1) : 0 );	// 月
				dt.setDate( r[4] ? Number(r[4]) : 0 );	// 日
				flg=1;
			}
			if( r = d.match(/([0-9]{2,4})-([0-9]{1,2})-([0-9]{1,2})/) ){
				dt.setFullYear( Number(r[1]), Number(r[2])-1, Number(r[3]) );
				flg=1;
			}
			
			// YYYY.MM.DD(ヨーロッパで普及)形式の解析
			if( r = d.match(/([0-9]{2,4})\.([0-9]{1,2})\.([0-9]{1,2})/) ){
				dt.setFullYear( Number(r[1]), Number(r[2])-1, Number(r[3]) );
				flg=1;
			}
			
			// YYYY年MM年DD日やYYYY年MM月DD日 hh時mm分ss秒系のフォーマットの解析
			if( r = d.match(/([0-9]{1,2})時([0-9]{1,2})分(?:([0-9]{1,2})秒)?/) ){
				dt.setHours( Number(r[1]) , Number(r[2])-1, (r[3] ? Number(r[3]) : 0), 0 );
				flg=1;
			}
			if( r = d.match(/(?:([0-9]{2,4})年)?(?:([0-9]{1,2})月)?([0-9]{1,2})日/) ){
				dt.setFullYear( r[1] ? Number(r[1]) : 0 );
				dt.setMonth( r[2] ? Number(r[2])-1 : 0 );
				dt.setDate( Number(r[3]) );
				flg=1;
			}
			
			if( flg ) return dt;
			return null;
		}
		
		function inget( d, op ){
			if( null==d || undefined==d ) return '';
			var fmt = "Y-m-d H:i:s";	// フォーマット
			if( undefined!=op && null != op && op.hasOwnProperty('format') ) fmt = op.format;
			
			var ret, dt = new Date();
			if( ret=parse( d ) ) return ret.toString( fmt );
			return '';
		}
		
		return {
			/**
			 * @param object 1列分のハッシュ
			 * @param object ハッシュから列の情報を取り出すための参考情報
			 */
			create:function( row, colInfo, self ){
				var inp = document.createElement( 'input' );
				inp.type="text";
				inp.className="text-inner";
				inp.value = inget( row[colInfo.name], colInfo.option );
				inp.onclick=function(e){ inp.focus(); }
				inp.onkeydown=function(e){ 
					var p=self.selectPoint;
					self.table[p.y-1][self.tableHeader[p.x].name] = inp.value; 
				}
				return inp;
			},
			/**
			 * @param {String} d 日付データの文字列
			 * @param {Object} op オプションを指定した連想配列
			 * @return {String} フォーマットに沿って整形した日付文字列
			 */
			get:function( d, op ) {
				if( 'string' != typeof d ){
					if( !(d instanceof Date) ) return null;
					d=d.toString();	// 日付型なら普通に処理
				}
				return inget(d, op);
			},
			/**
			 * @param {DOMElement} el 
			 * @param {string} d 
			 */
			set:function( el, d ){
				el.value = d;
				return d;
			}
		};
	},
	/**
	 * 文字列を表示する場合の処理
	 */
	select:function( option ){
		var slct = document.createElement( 'select' );
		slct.className='select-inner';
		var a = option.values;
		
		for( var i=0; i<a.length; i++ ){
			var op = document.createElement( 'option' );
			op.value = a[i][1];
			op.appendChild( document.createTextNode(a[i][0]) );
			slct.appendChild( op );
		}
		return {
			/**
			 * @param {hash} row 
			 * @param {hash} colInfo 
			 * @param {this} me 
			 * @param {DOMElement} td 
			 * @return {DOMElement} 代入すべきDOM要素
			 */
			create:function( row, colInfo, self ){
				var sl = slct.cloneNode(true);
				// キーキャンセルを行って、選択可能にする
				sl.onmousedown=function(e){
					self.guicancel( !self.canceller );
				}
				// Enterキーで選択した要素のデータ送信
				sl.onkeydown=function(e){
					// key cancelに指定されたキーコードがあれば実行
					if( 13==e.keyCode ) (function( p, e ){
						self.guicancel( false );
						var v = self.table[p.y-1][self.tableHeader[p.x].name] = sl.selectedIndex; 
						self.update( p.y );
					})(self.selectPoint, e);
				}
				// キーキャンセルを解除
				sl.onchange=function(e){
					self.guicancel( false );
					// 選択位置のデータを変更
					var p = self.selectPoint;
					var v = self.table[p.y-1][self.tableHeader[p.x].name] = sl.selectedIndex; 
					self.update( p.y );
				}
				sl.selectedIndex = row[colInfo.name];
				return sl;
			},
			/**
			 * @param {string} d 
			 */
			get:function( d ) {
				if( null==d || undefined==d ) return 0;
				return d;
			},
			set:function( el, d ){
				el.selectedIndex = d;
				return;
			},
			focuscancell:true	// これを付けると自動でフォーカスが移らない
		}
	},
	/**
	 * @param {hash} op オプション
	 * @return {hash} 作成されたHTMLHelperオブジェクト
	 */
	func:function( op ){
		var o = {
			create:function( row, colInfo ){
				var div = document.createElement( 'div' );
				div.className='cell';
				div.innerHTML = row[colInfo.name];
				return div;
			},
			get:function( d ){ return d; },
			set:function( el, d ){ return undefined; }
		};
		// オプションで与えられた関数を適応する
		if( op && op.hasOwnProperty( 'funcs' ) )
			for( var i in op.funcs )
				if( o.hasOwnProperty( i ) )
					o[i] = op.funcs[i];
		
		return o;
	}
}

/**
 * html処理を適切に行うツールキットを返します
 * @param {String} type 作りたいセルのタイプ	
 * @param {Hash} option 作成したいデータのオプションを連想配列で与える
 * @return {object} ヘルパーツールキット
 */
AccessHtmlHelper.helper = function( type, option ){
	var h = this.helpers[type];
	if( 'function' == typeof h ) return h( option );
	return h;
}

/**
 * MS Access の様なインターフェースを再現するためのClass
 * @constructor
 * @param {String} id インターフェースを埋め込む、フォームタグのID
 * @param {Array} tableInfo 
 */
function coAccess( id, tableInfo ){
	var self = this;
	
	this.version= "0.5.1";	// ライブラリのバージョン
	/**
	 * @default
	 */
	this.selectPoint = { x:0, y:0 };
	this.lockPoint = undefined;
	this.selection = [];
	this.tableHeader = tableInfo ? tableInfo : [];
	this.table = [];
	this.formIns = $(id);
	this.sort = [];
	this.search = [];
	
	// 絞込み、ソート条件を表示するブロックを格納する
	var d = document.createElement( 'div' );
	d.className = 'format-view container';
	this.infomationBox = d;
	this.formIns.appendChild(d);
	
	// ソート条件表示テーブルの作成
	this.flushSortTable();
	
	// 絞込条件表示テーブルの作成
	this.flushSerchTable();
	
	// プログレスバーの作成
	this.pgbar = new Progressbar();
	this.formIns.appendChild( this.pgbar.progressbar );
	
	// データ表示部分のテーブルの作成
	var tbl = document.createElement( 'table' );
	tbl.className='excel';
	this.tableIns = tbl;
	this.formAreaIns = document.createElement('div');	// テーブルを格納する領域
	this.formAreaIns.className ='excel-inner';
	this.formIns.appendChild(this.formAreaIns);
	this.formAreaIns.appendChild(this.tableIns);
	this.textareaIns = document.createElement( 'textarea' );
	this.textareaIns.className='clipper';
	
	this.formAreaIns.appendChild(this.textareaIns);
	
	// 標準のGUI動作をキャンセルするかどうかの変数、trueならキャンセル
	this.canceller = false;
	// GUI動作でthis.cancellerを変更したのかの値。
	// GUI動作完了毎にfalseを入れる
	this.cancelling = false;
	this.guicancel = function( v ){
		if( undefined==v ) this.cancelling=this.canceller=true;
		if( true==v ) this.cancelling=this.canceller=true;
		if( false==v ) this.cancelling=this.canceller=false;
		
		var p = this.selectPoint;
		try{
			var tr = this.tableIns.getElementsByTagName('tr')[p.y];
			var td = tr.getElementsByTagName('td')[p.x];
			td.style.borderStyle = this.canceller ? 'inset' : 'solid';
			td.style.borderColor = this.canceller ? 'blue' : 'red';
			td.style.backgroundColor = this.canceller ? '#eef' : '#ffa';
		}catch(e){}
		
		return this.canceller;
	}
}

/**
 * テーブルの最初の行の再描画
 * @param {Array} tbl 描画を行うテーブル
 * @return {Object} データの追加の終わったテーブル
 */
coAccess.prototype.createHeader = function( tbl ){
	this.tableHeader = this.tableHeader.collect(function(ifo){
		ifo.helper = AccessHtmlHelper.helper( ifo.type, ifo.option );
		return ifo;
	});
	
	var cells = this.tableHeader.collect(function(ifo){
		var th = document.createElement( 'th' );
		var div = document.createElement( 'div' );
		if( ifo.hasOwnProperty('className') ) th.className = ifo.className;
		div.innerHTML = ifo.hasOwnProperty('title') ? ifo.title : ifo.name;
		th.appendChild(div);
		return th;
	});
	var tr = document.createElement( 'tr' );
	cells.each(function(th){ tr.appendChild( th ) });
	tbl.appendChild(tr);
	return tbl;
}

/**
 * テーブルの最初の行の再描画
 * @param {Array} tbl 描画を行うテーブル
 * @return {Object} データの追加の終わったテーブル
 */
coAccess.prototype.createSetter = function( tbl ){
	var cells = this.tableHeader.collect(function(ifo){
		var th = document.createElement( 'th' );
		var div = document.createElement( 'div' );
		th.appendChild(div);
		if( ifo.hasOwnProperty('className') ) th.className = ifo.className;
		div.innerHTML = ('id'==ifo.name) ? '*' : '';
		return th;
	});
	var tr = document.createElement( 'tr' );
	cells.each(function(th){ tr.appendChild( th ) });
	tbl.appendChild(tr);
	return tbl;
}

/**
 * データベースからのデータ取得条件を表示するテーブルの再描画
 * @param {Array} data 取得したデータの配列
 */
coAccess.prototype.flushSerchTable = function( data ){
	if( data ) this.search = data;
	var self = this;
	var hdr = self.tableHeader;
	var tbl = document.createElement( 'table' );
	tbl.className='search-table';
	var rows=[];
	rows.push((function(){
		var th=document.createElement('th');
		th.appendChild(document.createTextNode('絞り込み条件'));
		return th;
	})());
	var i=0;	// インデックス
	var middle = this.search.collect(function( d ){
		var td=document.createElement('td');
		td.id='search-'+(i++);
		// セル名
		(function(){
			var select=document.createElement('select');
			select.onchange=function(e){
				var idx=(td.id.match(/search\-([0-9]+)/)[1]);
				self.search[idx].name = select.value;
			}
			var slct = hdr.collect(function( el ){
				var op=document.createElement('option');
				op.value=el.name;
				op.appendChild( document.createTextNode( el.hasOwnProperty( 'title' ) ? el.title : el.name ) );
				op.selected=(el.name==d['name']);
				return op;
			}).each(function(el){ select.appendChild(el); });
			td.appendChild(select);
		})();
		// オペレーター
		(function(){
			var select=document.createElement('select');
			var slct = (['=','<','>','<=','>=','<>']).collect(function( s ){
				var op=document.createElement('option');
				op.value=s;
				op.appendChild( document.createTextNode(s) );
				op.selected=(s==d['expression']);
				return op;
			}).each(function(el){ select.appendChild(el); });
			select.onchange=function(e){
				var idx=(td.id.match(/search\-([0-9]+)/)[1]);
				self.search[idx].expression = select.value;
			}
			td.appendChild(select);
		})();
		// 数値入力
		var h = AccessHtmlHelper.helper(d.type);
		var inp=document.createElement('input');
		inp.type='text';
		inp.value=h.get(d['value']);
		inp.onchange=function(e){ self.search[td.id.match(/search\-([0-9]+)/)[1]].value=inp.value; }
		td.appendChild(inp);
		(function(){
			var select=document.createElement('select');
			var slct = (['AND','OR']).collect(function( s ){
				var op=document.createElement('option');
				op.value=s;
				op.appendChild( document.createTextNode(s) );
				op.selected=(s==d['join']);
				return op;
			}).each(function(el){ select.appendChild(el); });
			select.onchange=function(e){
				var idx=(td.id.match(/search\-([0-9]+)/)[1]);
				self.search[idx].join = select.value;
			}
			td.appendChild(select);
		})();
		return td;
	});
	rows = rows.concat( middle );
	rows.push( (function(){
		var td=document.createElement('td');
		td.className='tooltable-bottom';
		var inp=document.createElement('input');
		inp.type='button';
		inp.value='追加';
		inp.onclick=function(e){
			var h = self.tableHeader[0];
			h && self.search.push({ name:h.name, type:h.type, value:'', expression:'>' });
			self.flushSerchTable(self.search);
		}
		td.appendChild(inp);
		var inp2=document.createElement('input');
		inp2.type='button';
		inp2.value='検索';
		inp2.onclick=function(e){
			self.flushSerchTable();
			self.request(self);
		}
		td.appendChild(inp2);
		return td;
	})() );
	
	rows.each(function( el ){ 
		var tr = document.createElement('tr');
		tr.appendChild(el);
		tbl.appendChild(tr);
	});
	if( !this.serchTable ){
		this.serchTable = tbl;
		this.infomationBox.appendChild( tbl );
		return;
	}
	
	this.infomationBox.replaceChild( tbl, this.serchTable );
	this.serchTable = tbl;
}

/**
 * 検索条件を表したテーブルを再描画します
 * @param {Array} data 取得したデータの配列
 */
coAccess.prototype.flushSortTable = function( data ){
	if( data ) this.sort = data;
	var self=this;
	var hdr = self.tableHeader;
	var tbl = document.createElement( 'table' );
	tbl.className='sort-table';
	var rows=[];
	// 内部のタイトル
	var th=document.createElement('th');
	th.appendChild( document.createTextNode('ソート条件') );
	rows.push(th);
	var i=0;	// インデックス
	var middle = this.sort.collect(function( d ){
		var td=document.createElement('td');
		td.id='sort-'+(i++);
		// セル名
		(function(){
			var select=document.createElement('select');
			select.onchange=function(e){
				var idx=(td.id.match(/sort\-([0-9]+)/)[1]);
				self.sort[idx].name = select.value;
			}
			var slct = hdr.collect(function( el ){
				var op=document.createElement('option');
				op.value=el.name;
				op.appendChild( document.createTextNode( el.hasOwnProperty( 'title' ) ? el.title : el.name ) );
				op.selected=(el.name==d['name']);
				return op;
			})
			slct.each(function(el){ select.appendChild(el); });
			td.appendChild(select);
		})();
		// オペレーター
		(function(){
			var select=document.createElement('select');
			var slct = ([['昇順','asc'],['降順','desc']]).collect(function( arr ){
				var s=arr[0], v=arr[1];
				var op=document.createElement('option');
				op.value = v;
				op.appendChild( document.createTextNode( s ) );
				op.selected = (v==d['order']);
				return op;
			}).each(function(el){ select.appendChild(el); });
			select.onchange=function(e){
				var idx=(td.id.match(/sort\-([0-9]+)/)[1]);
				self.sort[idx].order = select.value;
			}
			td.appendChild(select);
		})();
		return td;
	});
	
	rows = rows.concat( middle );
	rows.push( (function(){
		var td=document.createElement('td');
		td.className='tooltable-bottom';
		var inp2=document.createElement('input');
		inp2.type='button';
		inp2.value='ソート';
		inp2.onclick=function(e){
			self.flushSortTable();
			self.request(self);
		}
		var inp=document.createElement('input');
		inp.type='button';
		inp.value='追加';
		inp.onclick=function(e){
			var h = self.tableHeader[0];
			h && self.sort.push({ name:h.name, order:'desc' });
			self.flushSortTable(self.sort);
		}
		td.appendChild(inp2);
		td.appendChild(inp);
		return td;
	})() );
	
	rows.each(function(td){
		var tr=document.createElement('tr');
		tr.appendChild( td );
		tbl.appendChild( tr );
	});
	
	if( !this.sortTable ){
		this.sortTable = tbl;
		this.infomationBox.appendChild( tbl );
		return;
	}
	this.infomationBox.replaceChild( tbl, this.sortTable );
	this.sortTable = tbl;
}

/**
 * 行に一括でデータを挿入
 * 
 * @param {Array} arr データの一覧の配列
 * @param {Integer} x x座標
 * @param {Integer} y y座標
 */
coAccess.prototype.setRow = function( arr, x, y ){
	var self = this;
	var p = this.selectPoint;
	if( x==undefined ) x = p.x;
	if( y==undefined ) y = p.y;
	
	function setCell( x, y, data ){
		var d = self.tableHeader[x].helper.get( data );
		var trs = self.tableIns.getElementsByTagName('tr');
		var tds = trs[y].getElementsByTagName('td');
		var el = tds[x].firstChild;
		var r = self.tableHeader[x].helper.set( el, d );
		
		if( self.tableHeader[x].name!='id' )
			self.table[y-1][self.tableHeader[x].name] = d ? d :'';
		
		if( self.tableHeader[x].hasOwnProperty('fn') ) 
			self.tableHeader[x].fn( self.table[y-1] );
	}
	
	for( var i=0; x+i < this.tableHeader.length; i++ )
		setCell( x+i, y, arr[i] );
	
	return this.table[y-1];
}

/**
 * 行の雛形を作成
 * @return {Hash} 行の雛形
 */
coAccess.prototype.createRowData = function(){
	var row = {};
	for( var x=0; x<this.tableHeader.length; x++ )
		row[this.tableHeader[x].name] = this.tableHeader[x].helper.get( '' );
	return row;
}

/**
 * テキストボックスのGUIからの操作を定義します。
 */
coAccess.prototype.formActions = function(){
	var self = this;
	this.formAreaIns.onkeydown = function(e){
		e = e?e:window.event;
		var keycancel = {
			// F2: キーキャンセルを行って、テキスト編集を行えるようにする
			113:function( p, e ){
				self.cellect( p.x, p.y, 0, true );
				self.guicancel( !self.canceller );
			},
			// Enter: キーキャンセルを解除
			13:function( p, e ){ self.guicancel( false ); }
		};
		// key cancelに指定されたキーコードがあれば実行
		if( keycancel.hasOwnProperty(e.keyCode) ) keycancel[e.keyCode]( self.selectPoint, e );
		// 上下左右キーの操作でセルを移動する
		var keym = {
			// 左
			37:function( p, e ){ self.cellect( p.x-1, p.y, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey ); },
			// 上
			38:function( p, e ){ self.cellect( p.x, p.y-1, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey ); },
			// 右
			39:function( p, e ){ self.cellect( p.x+1, p.y, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey ); },
			// 下
			40:function( p, e ){ self.cellect( p.x, p.y+1, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey ); },
			// Enter
			13:function( p, e ){
				self.textareaIns.value='';
				var s = self.table[p.y-1][self.tableHeader[p.x].name];
				self.setCell( p.x, p.y, s );
				self.update( p.y );
				self.cellect( p.x, p.y, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey );
			},
			// Ctrl+C(クリップボードにコピー)
			67:function( p, e ){
				if(!e.ctrlKey) return;
				self.textareaIns.select();	// ここで選択＋Ctrl+Cキー発動してコピー
			},
			// Ctrl+V(ペースト)
			86:function( p, e ){
				if(!e.ctrlKey) return;
				self.textareaIns.value='';
				self.textareaIns.focus();
				var y=p.y;
				setTimeout(function(){
					var lines = (self.textareaIns.value).toMatrix();	// セルごとに分割
					self.textareaIns.value='';
					
					lines.each(function(line){
						var row = (y < self.table.length) ? self.table[y-1] : self.createRowData();
						if( self.table.length < y ) self.addTable([{account_book:row}]);
						var row = self.setRow( line, p.x, y );
						//self.flushRow( y, p, [{account_book:row}], ('*'==row.id) );
						self.update( y, true );
						y++;
					});
					self.textareaIns.value = lines[0][0];
					// 全てをリフレッシュ
					setTimeout( function(){ self.request(self); }, 500 );
				}, 100 );
			},
			// PageUp
			33:function(p,e){
				var y=p.y-20;
				if( 1 > y ) y=1;
				self.cellect( p.x, y, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey );
			},
			// PageDown
			34:function(p,e){
				var y=p.y+20;
				if( y > self.table.length ) y=self.table.length;
				self.cellect( p.x, y, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey );
			}
		};
		if( self.canceller ) return;
		if( !keym.hasOwnProperty(e.keyCode) ) return;	// 条件に合致しないときは処理しない
		keym[e.keyCode]( self.selectPoint, e );
	}
}

/**
 * テーブルの内容を1行分再構築する
 * @param {Number} y 行番号
 * @param {Object} pnt セルの選択位置
 * @param {Array} 追加する列のデータ
 * @param {Boolean} add 列の追加を行うかを指定
 */
coAccess.prototype.flushRow = function( y, pnt, o, add ){
	var self = this, tbl = this.tableIns, hdr = this.tableHeader;
	// 値をセットする領域の作成
	var setter={};
	for( var i=0; i < hdr.length; i++ )
		setter[hdr[i].name] = ('id'==hdr[i].name)?'*':'';
	this.table.push(setter);
	
	// データを1行ごとにフィルタにかけて選別
	var err=0, rows=[], o=(o instanceof Array)?o:[];
	for( var i=0; i < o.length; i++ )
		try{ rows.push( this.filter.call(this, o[i]) ); } catch(e){ err++; }
	
	var p=this.selectPoint;
	var y=p.y;
	tbl.replaceChild( self.createRow(rows[0]), tbl.getElementsByTagName('tr')[y] );
	// 行を作成して入れ替え
	if( add ) tbl.appendChild( self.createRow(this.table[y], y) );
	
	if( undefined==pnt ) return this.cellect( 1, 1 );
	this.cellect( p.x, p.y );
}

/**
 * 行のタグを生成する
 * @param {Hash} row
 * @return {HTMLElement} TRタグ
 */
coAccess.prototype.createRow = function( row, y ){
	var self = this, tbl = this.tableIns, hdr = this.tableHeader;
	
	var x = 0;
	var cells = hdr.collect(function(colInfo){
		var td = document.createElement( 'td' );
		td.id = 'd'+ x + '-' + y;
		// クリック時にセル選択
		Event.observe( td, 'click', function (e){
			var ids = td.id.match( /d([0-9]+)-([0-9]+)/ );
			var p = { x:Number(ids[1]), y:Number(ids[2]) }, tp = self.selectPoint;
			self.cellect( p.x, p.y, (e.altKey<<2) | (e.shiftKey<<1) | e.ctrlKey );
			// 選択セルが変化したときは、キーキャンセルを解除
			if( (tp.x != p.x || tp.y != p.y) && !self.cancelling ) self.guicancel( false );	// 既に要素側でイベントをおこした場合はここを実行しない
		});
		var el = colInfo.helper.create( row, colInfo, self, td );
		(el instanceof Array) ? el.each(function(el){ td.appendChild(el); }) : td.appendChild(el);
		
		++x;
		return td;
	});
	var tr = document.createElement( 'tr' );
	cells.each(function(el){ tr.appendChild( el ); });
	return tr;
}

/**
 * テーブルの内容を再構築する
 * データベースから新しくデータを取って来たとき等に使用する
 * @param {Hash} pnt テーブルの選択位置
 */
coAccess.prototype.flush = function( pnt ){
	var self = this;
	
	this.table.sort(function( a, b ){
		// ソート条件を順番に取り出して比較
		for( var i=0; i < self.sort.length; i++ ){
			var itm = self.sort[i];
			if( a[itm.name]==b[itm.name] ) continue;
			return (itm.order=='asc') ? 
				((a[itm.name] < b[itm.name]) ? -1 : 1):
				((a[itm.name] > b[itm.name]) ? -1 : 1);
		}
		return 0; // 全部でa[itm.name]==b[itm.name]なら0;
	});
	
	var tbl = document.createElement( 'table' );
	tbl.className='excel';
	
	function addcancelling(e){ self.cancelling=false; }
	Event.observe(tbl, 'click', addcancelling, false);
	Event.observe(tbl, 'dblclick', addcancelling, false);
	Event.observe(tbl, 'keydown', addcancelling, false);
	
	tbl = this.createHeader( tbl );
	// フォームの動作を追加
	this.formActions();
	
	var hdr = this.tableHeader;
	// 値をセットする領域の作成
	var setter={};
	for( var i=0; i < hdr.length; i++ )
		setter[hdr[i].name] = ('id'==hdr[i].name)?'*':'';
	this.table.push(setter);
	
	var y = 1;
	this.table.each(function( row ){ 
		tbl.appendChild( self.createRow(row, y++) );
	});
	
	this.formAreaIns.replaceChild( tbl, this.tableIns );
	this.tableIns = tbl;
	
	if( undefined==pnt ) return this.cellect( 1, 1 );
	
	var p=this.selectPoint;
	this.cellect( p.x, p.y );
}

/**
 * テーブルにデータをセット
 * @param {Array} o データ
 */
coAccess.prototype.setTable = function( o ){
	var rows = [], err=0;
	// データを1行ごとにフィルタにかけて選別
	var self=this;
	this.pgbar.setMax( o.length );
	this.pgbar.reflesh();
	this.pgbar.start();
	// プログレスバーを起動させるためにsetTimeoutと再起でコルーチン生成
	var idx=0;	// 配列の現在位置
	var loop = function(o){
		if( idx >= self.pgbar.max || 0==o.length ){
			self.pgbar.inc(100);
			self.table = rows;	// 変換後のデータをセット
			self.pgbar.hidden();
			return self.flush();
		}
		window.setTimeout(function(){
			for( var i=0; (idx<o.length && i<30); idx++, i++)
				try{
					self.pgbar.inc();
					rows.push( self.filter.call(self, o[idx]) );
				} catch(e){ err++; }
			// 30個ごとに区切って処理、それを超えるとsetTimeoutで一時停止⇒再帰
			loop( o );
		},10);
	}
	loop(o);
	return err;
}

/**
 * テーブルにデータを追加
 * @param {Array} o データ
 */
coAccess.prototype.addTable = function( o ){
	var rows=[], err=0;
	
	// 末尾のidが'*'のデータをまず取り除く
	if( '*' == this.table.last().id ) this.table.pop();
	
	// データを1行ごとにフィルタにかけて選別
	for( var i=0; i < o.length; i++ )
		try{ rows.push( this.filter.call(this, o[i]) ); } catch(e){ err++; }
	// フィルタリング後のデータを末尾に追加
	addition_row:
	for( var i=0; i < rows.length; i++ ){
		this.progress++;
		var row = rows[i];
		// idが同じデータがあった場合そこでデータを上書き
		for( var j=0; j < this.table.length; j++ ){
			if( row.id == this.table[j].id ){
				this.table[j] = row;
				break addition_row;
			}
		}
		// そうでないときは挿入
		this.table.push(row);
	}
	
	return err;
}

/**
 * 指定された位置のセルをアクティブ(選択)したことにする。
 * @param {int} x X位置
 * @param {int} y Y位置
 * @param {int} key AltやCtrl、Shiftキーを押したかのオプション
 * @param {boolean} force 強制上書きをかけるかを
 */
coAccess.prototype.cellect = function( x, y, key ){
	if( 0 > y-1 || this.table.length < y ) return;	// 高さチェック
	if( 0 > x || this.tableHeader.length-1 < x ) return;	// 幅チェック
	
	var focusforce = arguments[3];	// 強制フォーカスフラグ
	
	// 範囲選択や、現在の選択セルで色変更されている箇所のリセット
	for( var i=0; i<this.selection.length; i++ ) try{
			var p = this.selection[i];
			var tr = this.tableIns.getElementsByTagName('tr')[p.y];
			var td = tr.getElementsByTagName('td')[p.x];
			td.style.borderColor = 'black';
			td.style.borderWidth = '1px';
			td.style.padding = '1px';
			td.style.backgroundColor = 'white';
		}catch(e){}
	
	// Shiftキーを押したとき、その位置をlockPointに保存、そうでないときは解放
	if( !(key & 0x2) ) this.lockPoint = undefined; // Shiftキーを押していないとき
	if( !this.lockPoint && 0x02 == key ) this.lockPoint = this.selectPoint;
	var lpt = this.lockPoint ? this.lockPoint : this.selectPoint; // lock point

	this.selectPoint = { x:x, y:y };
	var o = {
		/**
		 * Ctrlキーを押しながら操作した場合、選択セルの追加
		 * @param {Array} slct 選択範囲
		 * @param {Object} slcp アクティブなセル
		 * @return {Selection} セルを追加追加された選択範囲
		 */
		0x1:function( slct, slcp ){
			if( slct.find( function( o ){ return o.x==slcp.x && o.y==slcp.y;  } ) ) return slct;
			slct.push(slcp);
			this.lockPoint = slcp;
			return slct;
		},
		0x2:function( slct, slcp, ppnt ){
			// shiftキーで範囲選択
			var p = [ ppnt, slcp ];
			p = p.collect( function( o ){ return { x:parseInt(o.x), y:parseInt(o.y) }; } );
			p = [
				{ x:p[((p[0].x<p[1].x)?0:1)].x, y:p[(p[0].y<p[1].y)?0:1].y },
				{ x:p[((p[0].x<p[1].x)?1:0)].x, y:p[(p[0].y<p[1].y)?1:0].y }
			];
			var arr=[];
			for( var y=p[0].y; y<=p[1].y; y++ )
				for( var x=p[0].x; x<=p[1].x; x++ )
					arr.push( { x:x, y:y } );
			for( var i=0; i<arr.length; i++ )
				if( !slct.find( function( o ){ return o.x==arr[i].x && o.y==arr[i].y; } ) )
					slct.push(arr[i]);
			return slct;
		}
	}
	this.selection = o.hasOwnProperty(key) ? o[key].call( this, this.selection, this.selectPoint, lpt ) : [this.selectPoint];
	
	// まずセルの物理的順番に沿って並び替え
	this.selection.sort( function( o1, o2 ){
		if( o1.y==o2.y ) return  o1.x > o2.x;	// 同じ行なら列位置比較
		return o1.y > o2.y;	// 行位置比較
	} );
	
	// 範囲選択や、現在選択のセルの位置を変える
	for( var i=0; i<this.selection.length; i++ ){
		var p = this.selection[i];
		var style = { borderColor:'black' };
		if( p.y==this.selectPoint.y && p.x==this.selectPoint.x ) style = { borderColor: this.canceller ? 'blue' : 'red' };	// アクティブなセルの表示設定
		try{
			var tr = this.tableIns.getElementsByTagName('tr')[p.y];
			var td = tr.getElementsByTagName('td')[p.x];
			td.style.borderColor = style['borderColor'];
			td.style.backgroundColor = '#ffa';
			td.style.borderStyle = 'solid';
		}catch(e){}
	}
	
	// 選択範囲通りにデータを取り出す。
	var arr = [[]], slct = bpnt = this.selection[0];
	arr[arr.length-1].push( this.getCell(slct.x, slct.y) );
	for( var i=1; i < this.selection.length; i++ ){
		slct = this.selection[i];
		if( bpnt.y != slct.y ){
			bpnt=slct;
			arr.push( [] );
		}
		arr[arr.length-1].push( this.getCell( slct.x, slct.y ) );
	}
	this.textareaIns.value = arr.collect(function (o){ return o.join('\t'); }).join('\n');
	if( this.canceller ) return;
	
	// フォーカスを移して編集モードにする
	this.textareaIns.focus();	// 選択不可能な要素は、テキストエリアにフォーカスさせて隠しておく
	var p = this.selectPoint;
	if(!focusforce)
		if( this.tableHeader[p.x].helper.hasOwnProperty('focuscancell') ) return; // 通常はフォーカスを移さない
	var cell = this.tableIns.getElementsByTagName('tr')[p.y].getElementsByTagName('td')[p.x];
	cell.firstChild.focus();
}

/**
 * 指定した位置のデータを取得する
 * @param {Integer} x X座標
 * @param {Integer} y Y座標
 * @return {Object} 適切な型に変換されたセルの値
 */
coAccess.prototype.getCell = function( x, y ){
	if( 0 > y-1 || this.table.length < y ) return;	// 高さチェック
	if( 0 > x || this.tableHeader.length-1 < x ) return;	// 幅チェック
	var d = '';
	try{ d = this.table[y-1][this.tableHeader[x].name]; }catch(e){}
	return this.tableHeader[x].helper.get( d );
}

/**
 * セル毎にデータを挿入する処理の連想配列
 * @param {Integer} x 挿入したいデータのあるセルのX座標
 * @param {Integer} y 挿入したいデータのあるセルのY座標
 * @param {Object} data データ、データは適切な型に"ある程度"自動で変換されます
 */
coAccess.prototype.setCell = function( x, y, data ){
	var d = this.tableHeader[x].helper.get( data );
	var trs = this.tableIns.getElementsByTagName('tr');
	var tds = trs[y].getElementsByTagName('td');
	var el = tds[x].firstChild;
	
	var r = this.tableHeader[x].helper.set( el, d );
	
	if( undefined==r ) return;	// 閲覧のみで編集不可の要素の場合、値を編集させない
	this.table[y-1][this.tableHeader[x].name] = r;
	
	if( this.tableHeader[x].hasOwnProperty('fn') ) this.tableHeader[x].fn( this.table[y-1] );
}

/**
 * 列ごとに、フィルターをかけて、表示に必要な情報のみを取り出す
 * @param {Hash} row １列分の情報
 * @return　{Hash} 列ごとの情報の連想配列
 */
coAccess.prototype.filter = function( row ){
	var r = row;
	var nrow = {};
	this.tableHeader.each( function(colInfo){
		var d = r.hasOwnProperty(colInfo.name) ? r[colInfo.name] : '';
		d = this.tableHeader[x].helper.get( d );
		nrow[colInfo.name] = d;
	} );
	return row;
}

/**
 * サーバーにデータを送信する前に、データを送信に適した形に直します
 * 基本的に、受け取ったときと同じ形式になると思われます。
 * @return {Hash} 列データ
 */
coAccess.prototype.unfilter = function( row ){ return row; }

/**
 * サーバー側に行データを送る処理をラッピングしたメソッドです
 * 通常は空処理なので、継承先で機能をオーバーライドする必要があります
 * @param {int} y 送信する行の配列中の行のインデックス
 * @param {Boolean} is_not_update 値を送信後、フォームの更新を行うかどうか。trueなら更新
 */
coAccess.prototype.update = function( y, is_not_update ){
	var row = this.table[y-1];
}
/**
 * リクエスト処理を行います
 */
coAccess.prototype.request = function(){}

/**
 *　メインのプログレスバーの進捗管理を行う
 * @param bool state 
 */
coAccess.prototype.mainProgress = function( state, o ){
	var len=o.length;
	var self=this;
	// loading-iconを表示
	// 本当はｒｅｑｕｅｓｔメソッドで定義すべきだけどオーバーロード先で期されてる可能性があるので保険
	self.progressbar.firstChild.style.visibility='visible';	
	self.progress=0;
	var n=0;
	var proc = function(){
		var per=0;
		try{
			per=Math.round(self.progress*100/len);
			// 以下エラーチェック
			per || (per=100);
			(per<0) && (per=0);
			(per>100) && (per=100);
		}catch(e){ per=100; }
		return per;
	};	// 初期化と処理
	this.mainProgress = function(){
		proc();
		if( n++>=200 || proc()>=85 ){
			self.progressbar.firstChild.style.visibility='hidden';	// loading-iconを隠す
			return true;	// 処理の終了
		}
		window.setTimeout( function(){ self.mainProgress(); }, 100 );
	};
	this();
}

/**
 * 指定した行を削除します
 * @param {int} y 行番号
 */
coAccess.prototype.deleteRow = function( y ){}

/**
 * TODO:指定した行を削除、現在作成中
 * @param {Integer} y 行番号
 */
coAccess.prototype.deleteTableRow = function( y, pnt ){
  var self = this;
  for( var i=0; i < self.table.length; i++ ){
    if(self.table[i].id != y ) continue;
    self.tableIns.deleteRow(i+1);
    self.table.splice(i);
    break;
  }
	var tbl = this.tableIns, hdr = this.tableHeader;
	
	alert( self.selectPoint.y );
	var p=this.selectPoint;
	if( undefined==pnt ) return this.cellect( 1, 1 );
	this.cellect( p.x, p.y );
}

