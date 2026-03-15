// Minecraft 服务器审核系统 - Cloudflare Workers

// 基础选择题 (100道)
const BASIC_QUESTIONS = [
  {"question":"钻石矿石需要什么镐挖掘？","options":["木镐","石镐","铁镐","钻石镐"],"answer":2},
  {"question":"下界传送门用什么建造？","options":["黑曜石","基岩","下界砖","岩浆块"],"answer":0},
  {"question":"末影龙在哪个维度？","options":["主世界","下界","末地","虚空"],"answer":2},
  {"question":"烈焰棒从哪种怪物掉落？","options":["末影人","烈焰人","凋灵骷髅","恶魂"],"answer":1},
  {"question":"末影珍珠从哪种怪物掉落？","options":["末影人","末影龙","潜影贝","末影螨"],"answer":0},
  {"question":"一组物品最多堆叠多少个？","options":["16个","32个","64个","128个"],"answer":2},
  {"question":"铁傀儡会保护哪种生物？","options":["猪","村民","羊","牛"],"answer":1},
  {"question":"苦力怕爆炸后掉落什么？","options":["火药","煤炭","红石","无"],"answer":0},
  {"question":"蜘蛛在白天会怎样？","options":["攻击玩家","中立","逃跑","消失"],"answer":1},
  {"question":"僵尸在阳光下会怎样？","options":["变强","燃烧","消失","无变化"],"answer":1},
  {"question":"骷髅使用什么武器？","options":["剑","弓","斧头","三叉戟"],"answer":1},
  {"question":"恶魂在哪里生成？","options":["主世界","下界","末地","所有维度"],"answer":1},
  {"question":"凋灵需要几个骷髅头召唤？","options":["1个","2个","3个","4个"],"answer":2},
  {"question":"信标基座用什么方块？","options":["石头","铁/金/钻石/绿宝石块","木头","沙子"],"answer":1},
  {"question":"附魔台周围放什么提高等级？","options":["书架","工作台","箱子","熔炉"],"answer":0},
  {"question":"酿造台用什么制作？","options":["圆石+烈焰棒","铁锭+烈焰棒","钻石+烈焰棒","黑曜石+烈焰棒"],"answer":0},
  {"question":"末影箱有什么功能？","options":["容量大","跨维度共享","自动整理","防火"],"answer":1},
  {"question":"铁砧可以做什么？","options":["修复物品","修复和重命名","重命名","合成"],"answer":1},
  {"question":"红石信号最远传输多少格？","options":["8格","15格","16格","32格"],"answer":1},
  {"question":"活塞可以推动多少个方块？","options":["8个","12个","16个","无限"],"answer":1},
  {"question":"水在主世界流动多少格？","options":["4格","7格","8格","无限"],"answer":2},
  {"question":"床在下界会怎样？","options":["睡觉","爆炸","装饰","无法放置"],"answer":1},
  {"question":"玩家默认有多少颗心？","options":["5颗","10颗","15颗","20颗"],"answer":1},
  {"question":"饥饿值有多少格？","options":["5格","10格","15格","20格"],"answer":1},
  {"question":"玩家在水中呼吸多久？","options":["10秒","15秒","20秒","30秒"],"answer":1},
  {"question":"玩家可以跳多高？","options":["0.5格","1格","1.5格","2格"],"answer":1},
  {"question":"疾跑消耗什么？","options":["生命值","饥饿值","经验值","氧气"],"answer":1},
  {"question":"潜行时会发生什么？","options":["移动更快","不掉落方块边缘","隐身","无敌"],"answer":1},
  {"question":"三叉戟从哪种怪物掉落？","options":["溺尸","守卫者","远古守卫者","海豚"],"answer":0},
  {"question":"猫可以吓跑什么怪物？","options":["僵尸","骷髅","苦力怕","蜘蛛"],"answer":2},
  {"question":"狼驯服后用什么繁殖？","options":["骨头","腐肉","任何肉类","小麦"],"answer":2},
  {"question":"幻翼在什么条件下生成？","options":["3天没睡","夜晚","雷暴","下界"],"answer":0},
  {"question":"村民可以交易什么？","options":["食物","工具","附魔书","以上全部"],"answer":3},
  {"question":"工作台有几个合成格子？","options":["4个","6个","9个","12个"],"answer":2},
  {"question":"末影人怕什么？","options":["水","火","岩浆","阳光"],"answer":0},
  {"question":"末影龙有多少颗心？","options":["100颗","200颗","300颗","500颗"],"answer":1},
  {"question":"监守者在哪里生成？","options":["深暗之域","要塞","地牢","废弃矿井"],"answer":0},
  {"question":"古城在哪里生成？","options":["深暗之域","要塞","地牢","废弃矿井"],"answer":0},
  {"question":"要塞有多少个？","options":["1个","3个","128个","无限"],"answer":2},
  {"question":"末地传送门需要多少个末影之眼？","options":["8个","10个","12个","16个"],"answer":2},
  {"question":"烈焰人刷怪笼在哪里？","options":["下界要塞","堡垒遗迹","废弃传送门","任何下界地方"],"answer":0},
  {"question":"僵尸刷怪笼在哪里？","options":["地牢","废弃矿井","要塞","以上全部"],"answer":0},
  {"question":"洞穴蜘蛛刷怪笼在哪里？","options":["地牢","废弃矿井","要塞","以上全部"],"answer":1},
  {"question":"蠹虫刷怪笼在哪里？","options":["地牢","废弃矿井","要塞","以上全部"],"answer":2},
  {"question":"下界有多少种生物群系？","options":["3种","4种","5种","6种"],"answer":2},
  {"question":"废弃传送门在哪里生成？","options":["主世界","下界","主世界和下界","末地"],"answer":2},
  {"question":"林地府邸在哪里生成？","options":["黑森林","深色橡木林","针叶林","丛林"],"answer":0},
  {"question":"沙漠神殿在哪里生成？","options":["沙漠","恶地","热带草原","平顶山"],"answer":0},
  {"question":"丛林神庙在哪里生成？","options":["丛林","竹林","热带雨林","沼泽"],"answer":0},
  {"question":"沼泽小屋在哪里生成？","options":["沼泽","红树林沼泽","河流","海滩"],"answer":0},
  {"question":"制作工作台需要多少木板？","options":["2个","4个","6个","8个"],"answer":1},
  {"question":"制作熔炉需要多少圆石？","options":["6个","8个","9个","10个"],"answer":1},
  {"question":"制作铁桶需要多少铁锭？","options":["2个","3个","4个","5个"],"answer":1},
  {"question":"制作铁剑需要什么？","options":["1铁+1木棍","2铁+1木棍","3铁+1木棍","2铁+2木棍"],"answer":1},
  {"question":"制作钻石镐需要什么？","options":["2钻石+1木棍","3钻石+1木棍","3钻石+2木棍","2钻石+2木棍"],"answer":1},
  {"question":"制作弓需要什么？","options":["2木棍+1线","3木棍+2线","3木棍+3线","2木棍+3线"],"answer":2},
  {"question":"制作箭需要什么？","options":["木棍+燧石","木棍+羽毛","木棍+燧石+羽毛","木棍+铁锭"],"answer":2},
  {"question":"制作火把需要什么？","options":["木棍+煤炭","木棍+木炭","木棍+煤炭或木炭","木棍+红石"],"answer":2},
  {"question":"制作床需要什么？","options":["3木板+2羊毛","3木板+3羊毛","2木板+3羊毛","3木板+1羊毛"],"answer":1},
  {"question":"制作箱子需要多少木板？","options":["6个","8个","9个","10个"],"answer":1},
  {"question":"制作漏斗需要什么？","options":["铁锭+箱子","铁锭+木板","铁锭+圆石","铁锭+漏斗"],"answer":0},
  {"question":"制作活塞需要什么？","options":["木板+圆石+铁锭+红石","木板+圆石+铁锭","木板+圆石+红石","铁锭+红石"],"answer":0},
  {"question":"制作发射器需要什么？","options":["圆石+弓+红石","圆石+弓","圆石+红石","弓+红石"],"answer":0},
  {"question":"制作TNT需要什么？","options":["火药+沙子","火药+红石","火药+沙子或红沙","火药+圆石"],"answer":2},
  {"question":"制作玻璃需要什么？","options":["沙子+熔炉","沙子烧炼","沙子+木棍","沙子+水"],"answer":1},
  {"question":"制作纸需要什么？","options":["3个甘蔗","2个甘蔗","3个小麦","3个竹子"],"answer":0},
  {"question":"制作书需要什么？","options":["3纸+1皮革","3纸","2纸+1皮革","4纸"],"answer":0},
  {"question":"制作书架需要什么？","options":["6木板+3书","6木板+6书","8木板+3书","6木板+2书"],"answer":0},
  {"question":"制作铁块需要多少铁锭？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作金块需要多少金锭？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作钻石块需要多少钻石？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作铁门需要多少铁锭？","options":["4个","5个","6个","8个"],"answer":2},
  {"question":"制作铁栏杆需要多少铁锭？","options":["4个","5个","6个","8个"],"answer":2},
  {"question":"制作干草块需要多少小麦？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作骨块需要多少骨粉？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作粘液块需要多少粘液球？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作蜂蜜块需要多少蜂蜜瓶？","options":["2个","3个","4个","5个"],"answer":2},
  {"question":"制作雪块需要多少雪球？","options":["2个","3个","4个","5个"],"answer":2},
  {"question":"制作粘土块需要多少粘土球？","options":["2个","3个","4个","5个"],"answer":2},
  {"question":"制作砖块需要多少砖？","options":["2个","3个","4个","5个"],"answer":2},
  {"question":"制作下界砖块需要多少下界砖？","options":["2个","3个","4个","5个"],"answer":2},
  {"question":"制作紫珀块需要什么？","options":["紫珀芽","爆裂紫珀果","紫珀楼梯","紫珀台阶"],"answer":1},
  {"question":"制作石英块需要多少下界石英？","options":["2个","3个","4个","5个"],"answer":2},
  {"question":"制作红砂岩需要什么？","options":["4个红沙","4个沙子","4个红石","4个沙岩"],"answer":0},
  {"question":"制作砂岩需要什么？","options":["4个沙子","4个红沙","4个沙砾","4个圆石"],"answer":0},
  {"question":"制作磨制花岗岩需要什么？","options":["4个花岗岩","4个闪长岩","4个安山岩","4个圆石"],"answer":0},
  {"question":"制作磨制闪长岩需要什么？","options":["4个花岗岩","4个闪长岩","4个安山岩","4个圆石"],"answer":1},
  {"question":"制作磨制安山岩需要什么？","options":["4个花岗岩","4个闪长岩","4个安山岩","4个圆石"],"answer":2},
  {"question":"制作红石块需要多少红石？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作青金石块需要多少青金石？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作煤炭块需要多少煤炭？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作绿宝石块需要多少绿宝石？","options":["6个","8个","9个","10个"],"answer":2},
  {"question":"制作金胡萝卜需要什么？","options":["胡萝卜+8金粒","胡萝卜+金锭","胡萝卜+金块","胡萝卜+金苹果"],"answer":0},
  {"question":"制作金苹果需要什么？","options":["苹果+8金粒","苹果+金锭","苹果+金块","苹果+钻石"],"answer":1},
  {"question":"制作闪烁的西瓜需要什么？","options":["西瓜片+8金粒","西瓜片+金锭","西瓜片+金块","西瓜+金粒"],"answer":0},
  {"question":"制作发酵蛛眼需要什么？","options":["蜘蛛眼+糖+蘑菇","蜘蛛眼+糖","蜘蛛眼+蘑菇","蜘蛛眼+红石"],"answer":0},
  {"question":"制作岩浆膏需要什么？","options":["烈焰粉+粘液球","烈焰粉+岩浆","烈焰棒+粘液球","岩浆+粘液球"],"answer":0},
  {"question":"制作末影之眼需要什么？","options":["末影珍珠+烈焰粉","末影珍珠+烈焰棒","末影珍珠+岩浆膏","末影珍珠+火药"],"answer":0},
  {"question":"制作火焰弹需要什么？","options":["烈焰粉+煤炭","烈焰粉+火药+煤炭","烈焰棒+煤炭","烈焰粉+木炭"],"answer":1},
  {"question":"制作烟花火箭需要什么？","options":["火药+纸","火药+纸+火药球","纸+火药球","火药+木棍"],"answer":1}
];

// 规则理解与情景测试 (100道)
const RULE_QUESTIONS = [
  {"question":"在服务器中看到其他玩家的物品掉落，你应该？","options":["直接拿走","询问后等待回复再决定","偷偷拿走","无视"],"answer":1},
  {"question":"发现服务器有漏洞可以利用，你应该？","options":["立即利用","报告管理员","告诉朋友一起用","假装没看见"],"answer":1},
  {"question":"其他玩家在聊天中辱骂你，你应该？","options":["骂回去","截图举报","退出服务器","无视"],"answer":1},
  {"question":"你想在服务器建造大型建筑，应该？","options":["随便找个地方建","在指定区域或申请土地建","在别人家旁边建","在公共区域建"],"answer":1},
  {"question":"发现有人在作弊，你应该？","options":["一起作弊","举报该玩家","无视","学习作弊方法"],"answer":1},
  {"question":"服务器卡顿时，你应该？","options":["抱怨并辱骂服务器","耐心等待或报告问题","退出游戏","利用卡顿刷物品"],"answer":1},
  {"question":"不小心破坏了其他玩家的建筑，你应该？","options":["逃跑","主动道歉并修复","假装不知道","怪别人"],"answer":1},
  {"question":"服务器有明确的规则禁止红石时钟，你应该？","options":["偷偷做一个","遵守规则不建造","做一个隐蔽的","做一个小的"],"answer":1},
  {"question":"其他玩家向你索要密码或账号，你应该？","options":["告诉他","拒绝并举报","假装答应","无视"],"answer":1},
  {"question":"在服务器商店交易时，你应该？","options":["欺骗对方获得更多利益","诚实交易","利用漏洞刷钱","强迫对方降价"],"answer":1},
  {"question":"看到新玩家加入服务器，你应该？","options":["欺负新玩家","帮助新玩家了解服务器","无视","骗取新玩家物品"],"answer":1},
  {"question":"服务器举办活动时，你应该？","options":["积极参与","利用漏洞获胜","嘲笑其他玩家","无视活动"],"answer":0},
  {"question":"在PVP区域被击败后，你应该？","options":["辱骂对方","接受结果","举报对方作弊","要求返还物品"],"answer":1},
  {"question":"发现服务器有新规则更新，你应该？","options":["仔细阅读并遵守","无视规则","找漏洞绕过规则","抱怨规则"],"answer":0},
  {"question":"其他玩家请求帮助时，你应该？","options":["在能力范围内提供帮助","无视请求","嘲笑对方","索要报酬"],"answer":0},
  {"question":"在公共农场使用后，你应该？","options":["不补充资源","补充资源供他人使用","全部拿走","破坏农场"],"answer":1},
  {"question":"服务器有建筑高度限制，你应该？","options":["遵守限制","偷偷建更高","抱怨限制","建到限制边缘"],"answer":0},
  {"question":"其他玩家的宠物挡住了你的路，你应该？","options":["杀死宠物","绕路或礼貌请求移动","把宠物带走","抱怨"],"answer":1},
  {"question":"在服务器论坛看到争议帖子，你应该？","options":["理性讨论","煽风点火","辱骂他人","无视"],"answer":0},
  {"question":"服务器有禁止自动农场的规则，你应该？","options":["遵守规则","偷偷建造小型自动农场","抱怨规则","找替代方案"],"answer":0},
  {"question":"其他玩家不小心掉落贵重物品，你应该？","options":["归还物品","拿走物品","无视","要求报酬归还"],"answer":0},
  {"question":"服务器有禁止刷怪塔的规定，你应该？","options":["遵守规定","偷偷建造小型刷怪塔","抱怨规定","找其他方式获取资源"],"answer":0},
  {"question":"在服务器中看到不雅建筑，你应该？","options":["举报","加入建造","无视","拍照传播"],"answer":0},
  {"question":"其他玩家在聊天中发广告，你应该？","options":["举报","跟着发广告","无视","点击广告"],"answer":0},
  {"question":"服务器有禁止使用某些模组的规定，你应该？","options":["遵守规定","偷偷使用","抱怨规定","使用类似功能的合法方式"],"answer":0},
  {"question":"其他玩家请求与你交易，但价格不合理，你应该？","options":["礼貌拒绝并说明原因","辱骂对方","接受不公平交易","欺骗对方"],"answer":0},
  {"question":"在服务器中遇到Bug导致获得大量物品，你应该？","options":["报告并上交","偷偷保留","分给朋友","利用Bug继续刷"],"answer":0},
  {"question":"服务器有禁止在主世界挖矿的规定，你应该？","options":["遵守规定在指定区域挖矿","偷偷在主世界挖矿","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在公共区域建造了影响美观的建筑，你应该？","options":["向管理员反映","破坏该建筑","辱骂玩家","无视"],"answer":0},
  {"question":"服务器有禁止PVP区域进行PVP的规定，你应该？","options":["遵守规定","偷偷PVP","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在聊天中询问你的真实信息，你应该？","options":["拒绝透露","如实告知","编造假信息","反问对方"],"answer":0},
  {"question":"服务器有禁止使用某些指令的规定，你应该？","options":["遵守规定","尝试使用指令","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中遇到困难，你应该？","options":["在能力范围内提供帮助","嘲笑对方","无视","索要报酬"],"answer":0},
  {"question":"服务器有禁止在特定区域放置方块的规定，你应该？","options":["遵守规定","偷偷放置","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在公共农场过度采集，你应该？","options":["礼貌提醒或向管理员反映","一起过度采集","辱骂玩家","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中讨论敏感话题的规定，你应该？","options":["遵守规定","继续讨论","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中作弊，你应该？","options":["举报该玩家","一起作弊","学习作弊方法","无视"],"answer":0},
  {"question":"服务器有禁止在特定时间进行某些活动的规定，你应该？","options":["遵守规定","偷偷进行","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中骚扰你，你应该？","options":["截图举报","骂回去","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止使用某些物品的规定，你应该？","options":["遵守规定","偷偷使用","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中询问你的密码，你应该？","options":["拒绝并举报","告诉他","编造假密码","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行建筑的规定，你应该？","options":["遵守规定","偷偷建筑","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中故意破坏环境，你应该？","options":["举报该玩家","一起破坏","无视","拍照留证"],"answer":0},
  {"question":"服务器有禁止在聊天中发送链接的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行诈骗，你应该？","options":["举报该玩家","一起诈骗","学习诈骗方法","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行PVP的规定，你应该？","options":["遵守规定","偷偷PVP","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中使用外挂，你应该？","options":["举报该玩家","一起使用外挂","学习使用外挂","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中使用不当语言的规定，你应该？","options":["遵守规定","继续使用","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行人身攻击，你应该？","options":["截图举报","骂回去","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行挖矿的规定，你应该？","options":["遵守规定","偷偷挖矿","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意举报，你应该？","options":["向管理员说明情况","反举报","辱骂对方","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中刷屏的规定，你应该？","options":["遵守规定","继续刷屏","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意PK，你应该？","options":["举报该玩家","反击","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行砍树的规定，你应该？","options":["遵守规定","偷偷砍树","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意抢夺，你应该？","options":["举报该玩家","抢回来","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送广告的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意破坏，你应该？","options":["举报该玩家","一起破坏","无视","拍照留证"],"answer":0},
  {"question":"服务器有禁止在特定区域进行钓鱼的规定，你应该？","options":["遵守规定","偷偷钓鱼","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意交易，你应该？","options":["举报该玩家","接受交易","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送敏感图片的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意组队，你应该？","options":["向管理员反映","一起组队","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行养殖的规定，你应该？","options":["遵守规定","偷偷养殖","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意竞争，你应该？","options":["向管理员反映","一起竞争","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送政治内容的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意垄断，你应该？","options":["向管理员反映","一起垄断","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行种植的规定，你应该？","options":["遵守规定","偷偷种植","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意囤积，你应该？","options":["向管理员反映","一起囤积","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送宗教内容的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意炒作，你应该？","options":["向管理员反映","一起炒作","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行建造的规定，你应该？","options":["遵守规定","偷偷建造","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意传播谣言，你应该？","options":["向管理员反映","一起传播","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送色情内容的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意诽谤，你应该？","options":["向管理员反映","一起诽谤","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行交易的规定，你应该？","options":["遵守规定","偷偷交易","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意欺骗，你应该？","options":["举报该玩家","一起欺骗","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送暴力内容的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意威胁，你应该？","options":["截图举报","威胁回去","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行探索的规定，你应该？","options":["遵守规定","偷偷探索","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意跟踪，你应该？","options":["向管理员反映","跟踪回去","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送仇恨言论的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意骚扰，你应该？","options":["截图举报","骚扰回去","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行采集的规定，你应该？","options":["遵守规定","偷偷采集","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意干扰，你应该？","options":["向管理员反映","干扰回去","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送歧视言论的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意破坏他人体验，你应该？","options":["向管理员反映","一起破坏","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行战斗的规定，你应该？","options":["遵守规定","偷偷战斗","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意利用漏洞，你应该？","options":["举报该玩家","一起利用","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送虚假信息的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意破坏服务器平衡，你应该？","options":["向管理员反映","一起破坏","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行放置物品的规定，你应该？","options":["遵守规定","偷偷放置","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意影响他人游戏，你应该？","options":["向管理员反映","一起影响","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送恶意链接的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意破坏他人建筑，你应该？","options":["举报该玩家","一起破坏","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在特定区域进行使用物品的规定，你应该？","options":["遵守规定","偷偷使用","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意抢夺他人资源，你应该？","options":["举报该玩家","抢回来","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在聊天中发送恶意文件的规定，你应该？","options":["遵守规定","偷偷发送","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意破坏他人设施，你应该？","options":["举报该玩家","一起破坏","退出游戏","无视"],"answer":0}
];

const DEFAULT_CONFIG = {
  titles: ["Minecraft 服务器审核", "欢迎来到服务器", "证明你的实力"],
  password: "审核通过",
  quiz: { basicCount: 10, ruleCount: 10, passRate: 70, timeLimit: 600 },
  style: {
    background: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920",
    primaryColor: "#00ff88"
  }
};

function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateHTML(c) {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(c.titles[0])}</title><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Press Start 2P",monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;background:url("${c.style.background}") center/cover fixed;color:#fff;padding:20px}body::before{content:"";position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:-1}.container{background:rgba(0,0,0,0.85);border-radius:16px;padding:40px;max-width:800px;width:100%;box-shadow:0 0 30px ${c.style.primaryColor}40;border:2px solid ${c.style.primaryColor}}.title{text-align:center;margin-bottom:30px;font-size:14px;color:${c.style.primaryColor};text-shadow:0 0 10px ${c.style.primaryColor}}.typewriter{overflow:hidden;border-right:3px solid ${c.style.primaryColor};white-space:nowrap;animation:typing 2s steps(30,end),blink-caret .75s step-end infinite;display:inline-block}@keyframes typing{from{width:0}to{width:100%}}@keyframes blink-caret{from,to{border-color:transparent}50%{border-color:${c.style.primaryColor}}}.btn{width:100%;padding:15px;border:none;border-radius:8px;background:linear-gradient(135deg,${c.style.primaryColor},${c.style.primaryColor}aa);color:#1a1a2e;font-family:inherit;font-size:12px;cursor:pointer;transition:all .3s;margin-top:20px}.btn:hover{transform:translateY(-2px)}.btn:disabled{background:#333;color:#666;cursor:not-allowed}.hidden{display:none}.input-group{margin-bottom:20px}.input-group label{display:block;margin-bottom:8px;font-size:10px;color:#aaa}.input-group input,.input-group textarea{width:100%;padding:15px;border:2px solid #333;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px}.info-box{margin-top:30px;font-size:8px;color:#888;line-height:2}.progress-bar{background:#333;border-radius:10px;height:20px;margin-bottom:20px}.progress-fill{background:${c.style.primaryColor};height:100%;transition:width .3s;display:flex;align-items:center;justify-content:center;font-size:8px;color:#1a1a2e}.timer{text-align:center;font-size:20px;color:#ff6b6b;margin-bottom:20px}.timer.warning{animation:pulse .5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.question-box{background:rgba(255,255,255,.05);border-radius:12px;padding:20px;margin-bottom:20px}.question-num{font-size:10px;color:#888;margin-bottom:10px}.question-text{font-size:12px;line-height:1.8;margin-bottom:20px}.options{display:flex;flex-direction:column;gap:10px}.option{background:rgba(255,255,255,.1);border:2px solid #333;border-radius:8px;padding:15px;cursor:pointer;transition:all .2s;font-size:10px}.option:hover{border-color:${c.style.primaryColor}}.option.selected{border-color:${c.style.primaryColor};background:rgba(0,255,136,.2)}.result-box{text-align:center;padding:40px}.score{font-size:48px;color:${c.style.primaryColor};margin:20px 0}.score.failed{color:#ff6b6b}.password-display{font-size:18px;text-align:center;padding:20px;background:rgba(0,255,136,.1);border-radius:8px;margin:20px 0;letter-spacing:3px;color:${c.style.primaryColor}}.stats{font-size:10px;color:#888;margin-top:20px;line-height:2;text-align:left}.stats-row{margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #333}.stats-row:last-child{border-bottom:none}.promise-answer{background:rgba(0,255,136,.1);padding:15px;border-radius:8px;margin-top:10px;font-size:10px;color:#fff;word-break:break-all}</style></head><body><div class="container"><div id="startPage"><h1 class="title"><span class="typewriter" id="titleText">${esc(c.titles[0])}</span></h1><div class="input-group"><label>联系方式</label><input type="text" id="contact" placeholder="QQ/微信/邮箱"></div><div class="input-group"><label>游戏名</label><input type="text" id="gameName" placeholder="你的游戏ID"></div><button class="btn" onclick="startQuiz()">开始答题</button><div class="info-box"><p>基础选择题: ${c.quiz.basicCount} 道</p><p>规则理解题: ${c.quiz.ruleCount} 道</p><p>承诺题: 1 道 (不计分)</p><p>时间限制: ${Math.floor(c.quiz.timeLimit/60)} 分钟</p><p>通过分数: ${c.quiz.passRate}%</p></div></div><div id="quizPage" class="hidden"><h1 class="title">${esc(c.titles[0])}</h1><div class="timer" id="timer">${Math.floor(c.quiz.timeLimit/60)}:00</div><div class="progress-bar"><div class="progress-fill" id="progress" style="width:0%">0/${c.quiz.basicCount + c.quiz.ruleCount + 1}</div></div><div class="question-box"><div class="question-num" id="questionNum">第 1 题</div><div class="question-text" id="questionText">加载中...</div><div class="options" id="options"></div></div><button class="btn" id="nextBtn" onclick="nextQuestion()" disabled>下一题</button></div><div id="resultPage" class="hidden"><div class="result-box"><h1 class="title">答题结果</h1><div class="score" id="score">0%</div><div id="passwordBox" class="hidden"><div class="password-display" id="password"></div></div><div class="stats" id="stats"></div><button class="btn" onclick="location.reload()">重新答题</button></div></div></div><script>var CONFIG=${JSON.stringify(c)};var TITLES=${JSON.stringify(c.titles)};var titleIdx=0,Q=[],cur=0,corr=0,sel=null,TL=${c.quiz.timeLimit},tmr=null,startTime=null,endTime=null,contact="",gameName="",promiseAnswer="";setInterval(function(){titleIdx=(titleIdx+1)%TITLES.length;document.getElementById("titleText").textContent=TITLES[titleIdx]},3000);function startQuiz(){contact=document.getElementById("contact").value.trim()||"未填写";gameName=document.getElementById("gameName").value.trim()||"未填写";startTime=new Date();document.getElementById("startPage").classList.add("hidden");document.getElementById("quizPage").classList.remove("hidden");fetch("/api/quiz/start").then(r=>r.json()).then(d=>{Q=d.questions;showQuestion();startTimer()}).catch(e=>{alert("网络错误");location.reload()})}function showQuestion(){var q=Q[cur];var total=Q.length;document.getElementById("questionNum").textContent="第 "+(cur+1)+" 题 / 共 "+total+" 题"+(cur===total-1?" (承诺题)":"");document.getElementById("questionText").textContent=q.question;var opts=document.getElementById("options");opts.innerHTML="";if(q.type==="promise"){var ta=document.createElement("textarea");ta.id="promiseInput";ta.style.cssText="width:100%;height:120px;padding:15px;border:2px solid #333;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px;resize:vertical";ta.placeholder=q.placeholder||"请输入你的承诺...";ta.oninput=function(){promiseAnswer=this.value;document.getElementById("nextBtn").disabled=!this.value.trim()};opts.appendChild(ta);document.getElementById("nextBtn").textContent="提交";document.getElementById("nextBtn").disabled=true}else{q.options.forEach(function(o,i){var div=document.createElement("div");div.className="option";div.textContent=String.fromCharCode(65+i)+". "+o;div.onclick=function(){selectOption(i)};opts.appendChild(div)});document.getElementById("nextBtn").textContent=cur===total-2?"下一题 (承诺题)":"下一题";document.getElementById("nextBtn").disabled=true;sel=null}document.getElementById("progress").style.width=(cur/total*100)+"%";document.getElementById("progress").textContent=cur+"/"+total}function selectOption(idx){sel=idx;document.querySelectorAll(".option").forEach(function(el,i){el.classList.toggle("selected",i===idx)});document.getElementById("nextBtn").disabled=false}function nextQuestion(){if(sel===null&&Q[cur].type!=="promise")return;if(Q[cur].type!=="promise"&&sel===Q[cur].answer)corr++;cur++;if(cur>=Q.length){endQuiz();return}showQuestion()}function startTimer(){tmr=setInterval(function(){TL--;var m=Math.floor(TL/60),s=TL%60;document.getElementById("timer").textContent=m+":"+(s<10?"0":"")+s;if(TL<=60)document.getElementById("timer").classList.add("warning");if(TL<=0){clearInterval(tmr);endQuiz()}},1000)}function formatTime(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0")}function endQuiz(){clearInterval(tmr);endTime=new Date();document.getElementById("quizPage").classList.add("hidden");document.getElementById("resultPage").classList.remove("hidden");var total=Q.length-1;var score=Math.round(corr/total*100);var passed=corr>=Math.ceil(total*CONFIG.quiz.passRate/100);document.getElementById("score").textContent=score+"%";document.getElementById("score").classList.toggle("failed",!passed);if(passed){document.getElementById("passwordBox").classList.remove("hidden");document.getElementById("password").textContent=CONFIG.password}var duration=Math.floor((endTime-startTime)/1000);var min=Math.floor(duration/60),sec=duration%60;document.getElementById("stats").innerHTML='<div class="stats-row"><strong>联系方式:</strong> '+esc(contact)+'<br><strong>游戏名:</strong> '+esc(gameName)+'</div><div class="stats-row"><strong>正确率:</strong> '+score+'% ('+corr+'/'+total+')<br><strong>通过率:</strong> '+CONFIG.quiz.passRate+'%<br><strong>答题时间:</strong> '+min+'分'+sec+'秒<br><strong>结束时间:</strong> '+formatTime(endTime)+'</div><div class="stats-row"><strong>承诺题答案:</strong><div class="promise-answer">'+esc(promiseAnswer||"未填写")+'</div></div>'}</script></body></html>`;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const config = env.CONFIG ? JSON.parse(env.CONFIG) : DEFAULT_CONFIG;
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(generateHTML(config), { headers: { "Content-Type": "text/html; charset=utf-8" }});
    }
    
    if (url.pathname === "/api/quiz/start") {
      const basicShuffled = shuffle(BASIC_QUESTIONS);
      const ruleShuffled = shuffle(RULE_QUESTIONS);
      const selected = [
        ...basicShuffled.slice(0, config.quiz.basicCount),
        ...ruleShuffled.slice(0, config.quiz.ruleCount),
        {
          question: "请写下你对服务器的承诺（例如：我将遵守服务器规则，不进行任何作弊行为，尊重其他玩家等）",
          type: "promise",
          placeholder: "请认真写下你的承诺...",
          options: [],
          answer: 0
        }
      ];
      return Response.json({ questions: selected });
    }
    
    return new Response("Not Found", { status: 404 });
  }
};
