/**
 * labs list
 *  
 */
define(function(require,exports){
	
	var temp = ['<li><div class="lab_item">',
		'<a class="lab_cover" href="/labs/<%=name %>" title="<%=title%>" target="_blank" style="background-image:url(<%=cover %>)"></a>',
		'<h4 class="lab_title">',
			'<a href="/labs/<%=name %>" title="<%=title %>" target="_blank"><%=title %></a>',
		'</h4>',
		'<div class="lab_info">',
			'<p><%=intro %></p>',
		'</div>',
	'</div></li>'].join('');
	
	var render = L.tplEngine(temp);
	var limit = 20,
		 skip = 0,
		 count = null,
		 dom;

	var insert = function(param){
		var this_html = $(param['html']),
			this_dom = param['dom'];
		this_dom.append(this_html);
	};
	var getData = function(callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/labs',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(data){
				count = data['count'];
				skip += limit;
				
				var list = data['list'];
				for(var i = 0,total = list.length;i<total;i++){
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];
				}
				callback&&callback(list);
			}
		});
	};
	var start = function(){
		
		$('.shareList').on('mouseenter','a',function(){
			$(this).find('strong').stop().animate({'bottom':0},200);
		}).on('mouseleave','a',function(){
			$(this).find('strong').stop().animate({'bottom':-100},200);
		});
	};
	return function(dom,param){
		skip = 0;
		getData(function(list){
			dom.html('<ul class="labsList"></ul>');
			var this_html = '',
				this_dom = dom.find('.labsList');
			for(var i=0,total=list.length;i<total;i++){
				this_html += render(list[i]);
			}
			insert({
				'end' : (skip>=count)?true:false,
				'html' : this_html,
				'dom' : this_dom
			});
			start();
		});
	};
});