1 配置IIS
2 将web工程拷贝到IIS配置目录
3 访问index.html

url配置：
orderApp\js\app.js文件的第4行、第7行、第10行和第13行（重要！！！）

orderApp.value('baseUrl',
'http://WJDCBUEO02/h5/emporder/api/v1/'		//		后台服务url
)
orderApp.value('baseAuthUrl',
'http://WJDCBUEO02/Authentication/api/'		//		auth url
)
orderApp.value('baseSysUrl2', 
'http://WJDCBUEO02/admin/Default.aspx'		//		系统管理的2折链接
)
orderApp.value('baseSysUrl6', 
'http://WJDCBUEO02/admin/employee-6/Default.aspx'// 	系统管理的6折链接
)

公告配置：
orderApp\cfg\notice.json文件
按json格式添加或修改
例如：需要在“订单说明”中添加一条：4、XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
把
		"Desc": [
				"1、为鼓励员工了解并使用公司产品，提升个人形象,员工每月可按优惠价购买常规产品，全价购买销售辅助产品，季度购买额度为零售价5000元整，同时，还可按六折价购买常规产品，全价购买销售辅助产品，季度购买额度为零售价2000元整，不享受公司对顾客和销售队伍的各类促销活动。",
				"2、为保护销售队伍利益，员工自行购买的公司产品，仅限员工本人使用，不得转卖给她人（包括公司员工在内）。",
				"3、为了让员工有更多机会试用公司优质产品，公司将不定期为员工订单发放产品试用。"
			]
改为
		"Desc": [
				"1、为鼓励员工了解并使用公司产品，提升个人形象,员工每月可按优惠价购买常规产品，全价购买销售辅助产品，季度购买额度为零售价5000元整，同时，还可按六折价购买常规产品，全价购买销售辅助产品，季度购买额度为零售价2000元整，不享受公司对顾客和销售队伍的各类促销活动。",
				"2、为保护销售队伍利益，员工自行购买的公司产品，仅限员工本人使用，不得转卖给她人（包括公司员工在内）。",
				"3、为了让员工有更多机会试用公司优质产品，公司将不定期为员工订单发放产品试用。",
				"4、XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
			]
注意用 "" 将文字包括起来，每一条之间用 , 隔开；"" 和 , 为英文字符。