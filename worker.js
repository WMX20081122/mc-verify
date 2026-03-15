// Minecraft 服务器审核系统 - Cloudflare Workers

// 基础选择题 (100道) - 中等难度
const BASIC_QUESTIONS = [
  {"question":"钻石矿石在哪个Y轴高度最常见？","options":["Y=5-12","Y=11","Y=-64至-16","Y=0-16"],"answer":2},
  {"question":"下界传送门最小尺寸是多少？","options":["2x3","3x4","4x5","5x6"],"answer":1},
  {"question":"末影龙有多少血量？","options":["100","200","300","500"],"answer":1},
  {"question":"烈焰棒的主要用途是什么？","options":["酿造药水","制作末影之眼","制作烈焰粉","以上全部"],"answer":3},
  {"question":"末影珍珠有概率让玩家受到多少伤害？","options":["2颗心","3颗心","5颗心","不扣血"],"answer":2},
  {"question":"末影箱被破坏后会掉落什么？","options":["末影箱","黑曜石+末影之眼","8个黑曜石","不掉落"],"answer":2},
  {"question":"铁傀儡对玩家造成多少伤害？","options":["5颗心","7颗心","10颗心","12颗心"],"answer":2},
  {"question":"苦力怕被雷击中会变成什么？","options":["高压苦力怕","闪电苦力怕","带电苦力怕","以上都是同一种"],"answer":3},
  {"question":"蜘蛛骑士是什么组合？","options":["蜘蛛+骷髅","蜘蛛+僵尸","蜘蛛+末影人","蜘蛛+苦力怕"],"answer":0},
  {"question":"僵尸村民如何治愈？","options":["金苹果+虚弱药水","金苹果+治疗药水","金胡萝卜+虚弱药水","金苹果+隐身药水"],"answer":0},
  {"question":"骷髅在水中会怎样？","options":["下沉","漂浮","游泳","无变化"],"answer":0},
  {"question":"恶魂火球造成多少伤害？","options":["5颗心","7颗心","10颗心","12颗心"],"answer":2},
  {"question":"凋灵召唤后有多少血量？","options":["150","200","300","500"],"answer":2},
  {"question":"信标最高需要多少层基座？","options":["3层","4层","5层","6层"],"answer":1},
  {"question":"附魔台最高等级需要多少书架？","options":["10个","12个","15个","20个"],"answer":2},
  {"question":"酿造台一次可以酿造多少瓶药水？","options":["1瓶","2瓶","3瓶","4瓶"],"answer":2},
  {"question":"末影箱的容量是多少格？","options":["18格","27格","36格","54格"],"answer":1},
  {"question":"铁砧使用多少次会损坏？","options":["25次","26次","无限制","随机"],"answer":0},
  {"question":"红石比较器有几种模式？","options":["1种","2种","3种","4种"],"answer":1},
  {"question":"粘性活塞与普通活塞的区别？","options":["推动更多方块","可以拉回方块","推动速度更快","无区别"],"answer":1},
  {"question":"水在主世界流动速度是多少？","options":["每秒1格","每秒2格","每秒0.5格","不流动"],"answer":0},
  {"question":"床在末地会怎样？","options":["睡觉","爆炸","装饰","无法放置"],"answer":1},
  {"question":"玩家最大生命值是多少？","options":["10颗心","15颗心","20颗心","30颗心"],"answer":2},
  {"question":"饥饿值满时生命恢复速度？","options":["每秒0.5颗心","每4秒1颗心","每秒1颗心","不恢复"],"answer":1},
  {"question":"水下呼吸附魔最高等级？","options":["I","II","III","IV"],"answer":2},
  {"question":"玩家疾跑时跳跃距离？","options":["2格","3格","4格","5格"],"answer":2},
  {"question":"疾跑消耗饥饿值的速度？","options":["正常速度的5倍","正常速度的10倍","不消耗","正常速度"],"answer":1},
  {"question":"潜行时移动速度是正常的多少？","options":["30%","50%","70%","100%"],"answer":0},
  {"question":"三叉戟忠诚附魔最高等级？","options":["I","II","III","IV"],"answer":2},
  {"question":"猫可以免疫哪种伤害？","options":["摔落伤害","溺水伤害","苦力怕爆炸","末影珍珠伤害"],"answer":2},
  {"question":"狼驯服需要多少骨头？","options":["1-3个","1-10个","固定3个","固定5个"],"answer":1},
  {"question":"幻翼每次生成几只？","options":["1只","2只","1-3只","1-4只"],"answer":2},
  {"question":"村民交易刷新需要什么？","options":["等待时间","破坏工作台","让村民升级","以上全部"],"answer":2},
  {"question":"工作台合成格子的排列？","options":["2x2","2x3","3x3","4x4"],"answer":2},
  {"question":"末影人被水伤害多少？","options":["1颗心","2颗心","持续伤害","不伤害"],"answer":2},
  {"question":"末影龙被什么攻击最有效？","options":["剑","弓箭","床","三叉戟"],"answer":2},
  {"question":"监守者的攻击方式？","options":["近战","远程音波","两者都有","只有近战"],"answer":2},
  {"question":"古城中有什么特殊方块？","options":["幽匿感测体","幽匿尖啸体","幽匿脉络","以上全部"],"answer":3},
  {"question":"要塞中末地传送门框架有几个？","options":["8个","10个","12个","16个"],"answer":2},
  {"question":"末影之眼有多少概率损坏？","options":["10%","20%","50%","100%"],"answer":1},
  {"question":"烈焰人刷怪笼的光照等级限制？","options":["<11","<12","<15","任何等级"],"answer":0},
  {"question":"僵尸刷怪笼的光照等级限制？","options":["<7","<8","<11","<15"],"answer":0},
  {"question":"洞穴蜘蛛刷怪笼的光照等级限制？","options":["<7","<8","<11","<15"],"answer":0},
  {"question":"蠹虫刷怪笼在哪里？","options":["地牢","废弃矿井","要塞","以上全部"],"answer":2},
  {"question":"下界有几个生物群系？","options":["3个","4个","5个","6个以上"],"answer":3},
  {"question":"废弃传送门的箱子有什么特殊物品？","options":["金块","附魔金苹果","下界装备","以上全部"],"answer":3},
  {"question":"林地府邸有什么特殊敌人？","options":["灾厄村民","掠夺者","唤魔者","以上全部"],"answer":3},
  {"question":"沙漠神殿地下室有什么陷阱？","options":["岩浆","TNT","刷怪笼","无陷阱"],"answer":1},
  {"question":"丛林神庙的谜题需要什么？","options":["红石知识","拉杆组合","压力板","以上全部"],"answer":3},
  {"question":"沼泽小屋有什么特殊物品？","options":["酿造台","炼药锅","蘑菇","以上全部"],"answer":3},
  {"question":"制作工作台需要多少木板？","options":["2个","4个","6个","8个"],"answer":1},
  {"question":"熔炉烧炼一个物品需要多长时间？","options":["5秒","8秒","10秒","15秒"],"answer":2},
  {"question":"铁桶可以装什么液体？","options":["水","岩浆","水和岩浆","任何液体"],"answer":2},
  {"question":"钻石剑比铁剑多造成多少伤害？","options":["0.5颗心","1颗心","1.5颗心","2颗心"],"answer":1},
  {"question":"钻石镐的耐久度是多少？","options":["1000","1562","2500","5000"],"answer":1},
  {"question":"弓满蓄力造成多少伤害？","options":["5颗心","7颗心","9颗心","10颗心"],"answer":2},
  {"question":"箭可以穿透什么？","options":["玻璃","树叶","水","以上都不能"],"answer":1},
  {"question":"火把的光照等级是多少？","options":["12","13","14","15"],"answer":2},
  {"question":"床在雷暴天气可以睡觉吗？","options":["可以","不可以","只有晚上可以","取决于生物群系"],"answer":0},
  {"question":"箱子可以相邻放置吗？","options":["可以","不可以","需要陷阱箱","只有大箱子可以"],"answer":2},
  {"question":"漏斗传输物品的速度是多少？","options":["每秒1个","每秒2.5个","每4秒1个","每8秒1个"],"answer":2},
  {"question":"粘性活塞拉回方块需要多少刻？","options":["1刻","2刻","3刻","4刻"],"answer":1},
  {"question":"发射器可以发射什么？","options":["箭","烟花","TNT","以上全部"],"answer":3},
  {"question":"TNT爆炸威力是多少？","options":["3","4","5","6"],"answer":1},
  {"question":"玻璃用什么工具采集最快？","options":["任何工具","镐","剑","无工具"],"answer":3},
  {"question":"甘蔗可以长到多高？","options":["2格","3格","4格","无限"],"answer":1},
  {"question":"书架被破坏掉落什么？","options":["书架","书","木板","无"],"answer":1},
  {"question":"铁块需要什么镐挖掘？","options":["木镐","石镐","铁镐","钻石镐"],"answer":1},
  {"question":"铁门需要什么才能打开？","options":["按钮","拉杆","压力板","以上全部"],"answer":3},
  {"question":"铁栏杆连接规则是什么？","options":["连接相邻方块","只连接铁栏杆","不连接任何东西","随机连接"],"answer":0},
  {"question":"干草块有什么特殊用途？","options":["减少摔落伤害","加速马匹治疗","装饰","以上全部"],"answer":3},
  {"question":"骨粉可以催熟什么？","options":["小麦","树苗","花朵","以上全部"],"answer":3},
  {"question":"粘液块有什么特性？","options":["弹跳","粘住实体","不造成摔落伤害","以上全部"],"answer":3},
  {"question":"蜂蜜块有什么特性？","options":["减速","粘住实体","减少摔落伤害","以上全部"],"answer":3},
  {"question":"雪块需要什么工具采集？","options":["任何工具","铲子","镐","手"],"answer":1},
  {"question":"粘土块在哪里生成？","options":["河流","湖泊","沼泽","以上全部"],"answer":3},
  {"question":"砖块需要什么镐挖掘？","options":["木镐","石镐","铁镐","任何镐"],"answer":0},
  {"question":"下界砖块有什么特性？","options":["防火","防爆","不燃烧","以上全部"],"answer":3},
  {"question":"紫珀块在哪里获取？","options":["末地城市","末地船","末地岛屿","以上全部"],"answer":0},
  {"question":"石英块在哪里获取？","options":["下界","主世界","末地","以上全部"],"answer":0},
  {"question":"红砂岩在哪里生成？","options":["恶地","沙漠","下界","以上全部"],"answer":0},
  {"question":"砂岩有什么特性？","options":["受重力影响","防火","不燃烧","以上全部"],"answer":2},
  {"question":"磨制花岗岩需要什么制作？","options":["4个花岗岩","切石机","2个花岗岩","以上全部"],"answer":3},
  {"question":"磨制闪长岩需要什么制作？","options":["4个闪长岩","切石机","2个闪长岩","以上全部"],"answer":3},
  {"question":"磨制安山岩需要什么制作？","options":["4个安山岩","切石机","2个安山岩","以上全部"],"answer":3},
  {"question":"红石块有什么用途？","options":["红石信号源","装饰","存储红石","以上全部"],"answer":3},
  {"question":"青金石块有什么用途？","options":["装饰","存储青金石","染色","以上全部"],"answer":3},
  {"question":"煤炭块有什么用途？","options":["燃料","存储煤炭","装饰","以上全部"],"answer":3},
  {"question":"绿宝石块有什么用途？","options":["装饰","存储绿宝石","信标基座","以上全部"],"answer":3},
  {"question":"金胡萝卜恢复多少饥饿值？","options":["3格","4格","6格","8格"],"answer":2},
  {"question":"金苹果有什么效果？","options":["生命恢复","吸收伤害","以上都有","无效果"],"answer":2},
  {"question":"闪烁的西瓜有什么用途？","options":["治疗药水材料","食物","装饰","无用途"],"answer":0},
  {"question":"发酵蛛眼有什么用途？","options":["隐身药水","夜视药水","虚弱药水","以上全部"],"answer":3},
  {"question":"岩浆膏有什么用途？","options":["抗火药水","装饰","以上都有","无用途"],"answer":0},
  {"question":"末影之眼有什么用途？","options":["寻找要塞","激活传送门","以上都有","无用途"],"answer":2},
  {"question":"火焰弹有什么用途？","options":["点燃方块","点燃生物","以上都有","无用途"],"answer":2},
  {"question":"烟花火箭可以附加什么效果？","options":["爆炸颜色","爆炸形状","以上都有","无效果"],"answer":2},
  {"question":"附魔台最高可以附魔多少级？","options":["20级","30级","40级","50级"],"answer":1},
  {"question":"铁砧修复物品需要什么？","options":["相同材料","经验等级","以上都有","无"],"answer":2},
  {"question":"信标需要多少层才能显示所有效果？","options":["3层","4层","5层","6层"],"answer":1}
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
  {"question":"其他玩家在游戏中进行恶意破坏他人设施，你应该？","options":["举报该玩家","一起破坏","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止在公共区域放置大量方块的规定，你应该？","options":["遵守规定","偷偷放置","抱怨规定","无视规定"],"answer":0},
  {"question":"其他玩家在游戏中进行恶意刷屏，你应该？","options":["举报该玩家","一起刷屏","退出游戏","无视"],"answer":0},
  {"question":"服务器有禁止使用某些客户端的规定，你应该？","options":["遵守规定","偷偷使用","抱怨规定","无视规定"],"answer":0}
];

const DEFAULT_CONFIG = {
  titles: ["Minecraft 服务器审核", "欢迎来到服务器", "证明你的实力"],
  password: "审核通过",
  quiz: { basicCount: 20, ruleCount: 10, passRate: 70, timeLimit: 900 },
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
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(c.titles[0])}</title><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Press Start 2P",monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;background:url("${c.style.background}") center/cover fixed;color:#fff;padding:20px}body::before{content:"";position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:-1}.container{background:rgba(0,0,0,0.85);border-radius:16px;padding:40px;max-width:800px;width:100%;box-shadow:0 0 30px ${c.style.primaryColor}40;border:2px solid ${c.style.primaryColor}}.title{text-align:center;margin-bottom:30px;font-size:14px;color:${c.style.primaryColor};text-shadow:0 0 10px ${c.style.primaryColor};min-height:1.5em}.title-text{display:inline-block;transition:opacity 0.5s ease,transform 0.5s ease}.title-text.fade-out{opacity:0;transform:translateY(-10px)}.title-text.fade-in{opacity:1;transform:translateY(0)}.btn{width:100%;padding:15px;border:none;border-radius:8px;background:linear-gradient(135deg,${c.style.primaryColor},${c.style.primaryColor}aa);color:#1a1a2e;font-family:inherit;font-size:12px;cursor:pointer;transition:all .3s;margin-top:20px}.btn:hover{transform:translateY(-2px)}.btn:disabled{background:#333;color:#666;cursor:not-allowed}.hidden{display:none}.input-group{margin-bottom:20px}.input-group label{display:block;margin-bottom:8px;font-size:10px;color:#aaa}.input-group input,.input-group textarea{width:100%;padding:15px;border:2px solid #333;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px}.info-box{margin-top:30px;font-size:8px;color:#888;line-height:2}.progress-bar{background:#333;border-radius:10px;height:20px;margin-bottom:20px}.progress-fill{background:${c.style.primaryColor};height:100%;transition:width .3s;display:flex;align-items:center;justify-content:center;font-size:8px;color:#1a1a2e}.timer{text-align:center;font-size:20px;color:#ff6b6b;margin-bottom:20px}.timer.warning{animation:pulse .5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.question-box{background:rgba(255,255,255,.05);border-radius:12px;padding:20px;margin-bottom:20px}.question-num{font-size:10px;color:#888;margin-bottom:10px}.question-text{font-size:12px;line-height:1.8;margin-bottom:20px}.options{display:flex;flex-direction:column;gap:10px}.option{background:rgba(255,255,255,.1);border:2px solid #333;border-radius:8px;padding:15px;cursor:pointer;transition:all .2s;font-size:10px}.option:hover{border-color:${c.style.primaryColor}}.option.selected{border-color:${c.style.primaryColor};background:rgba(0,255,136,.2)}.result-box{text-align:center;padding:40px}.score{font-size:48px;color:${c.style.primaryColor};margin:20px 0}.score.failed{color:#ff6b6b}.password-display{font-size:18px;text-align:center;padding:20px;background:rgba(0,255,136,.1);border-radius:8px;margin:20px 0;letter-spacing:3px;color:${c.style.primaryColor}}.stats{font-size:10px;color:#888;margin-top:20px;line-height:2;text-align:left}.stats-row{margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #333}.stats-row:last-child{border-bottom:none}.promise-answer{background:rgba(0,255,136,.1);padding:15px;border-radius:8px;margin-top:10px;font-size:10px;color:#fff;word-break:break-all}</style></head><body><div class="container"><div id="startPage"><h1 class="title"><span class="title-text fade-in" id="titleText">${esc(c.titles[0])}</span></h1><div class="input-group"><label>联系方式</label><input type="text" id="contact" placeholder="QQ/微信/邮箱"></div><div class="input-group"><label>游戏名</label><input type="text" id="gameName" placeholder="你的游戏ID"></div><button class="btn" onclick="startQuiz()">开始答题</button><div class="info-box"><p>基础选择题: ${c.quiz.basicCount} 道</p><p>规则理解题: ${c.quiz.ruleCount} 道</p><p>承诺题: 1 道 (不计分)</p><p>时间限制: ${Math.floor(c.quiz.timeLimit/60)} 分钟</p><p>通过分数: ${c.quiz.passRate}%</p></div></div><div id="quizPage" class="hidden"><h1 class="title">${esc(c.titles[0])}</h1><div class="timer" id="timer">${Math.floor(c.quiz.timeLimit/60)}:00</div><div class="progress-bar"><div class="progress-fill" id="progress" style="width:0%">0/${c.quiz.basicCount + c.quiz.ruleCount + 1}</div></div><div class="question-box"><div class="question-num" id="questionNum">第 1 题</div><div class="question-text" id="questionText">加载中...</div><div class="options" id="options"></div></div><button class="btn" id="nextBtn" onclick="nextQuestion()" disabled>下一题</button></div><div id="resultPage" class="hidden"><div class="result-box"><h1 class="title">答题结果</h1><div class="score" id="score">0%</div><div id="passwordBox" class="hidden"><div class="password-display" id="password"></div></div><div class="stats" id="stats"></div><button class="btn" onclick="location.reload()">重新答题</button></div></div></div><script>function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}var CONFIG=${JSON.stringify(c)};var TITLES=${JSON.stringify(c.titles)};var titleIdx=0,Q=[],cur=0,corr=0,sel=null,TL=${c.quiz.timeLimit},tmr=null,startTime=null,endTime=null,contact="",gameName="",promiseAnswer="";setInterval(function(){var el=document.getElementById("titleText");el.classList.remove("fade-in");el.classList.add("fade-out");setTimeout(function(){titleIdx=(titleIdx+1)%TITLES.length;el.textContent=TITLES[titleIdx];el.classList.remove("fade-out");el.classList.add("fade-in")},500)},3000);function startQuiz(){contact=document.getElementById("contact").value.trim()||"未填写";gameName=document.getElementById("gameName").value.trim()||"未填写";startTime=new Date();document.getElementById("startPage").classList.add("hidden");document.getElementById("quizPage").classList.remove("hidden");fetch("/api/quiz/start").then(r=>r.json()).then(d=>{Q=d.questions;showQuestion();startTimer()}).catch(e=>{alert("网络错误");location.reload()})}function showQuestion(){var q=Q[cur];var total=Q.length;document.getElementById("questionNum").textContent="第 "+(cur+1)+" 题 / 共 "+total+" 题"+(cur===total-1?" (承诺题)":"");document.getElementById("questionText").textContent=q.question;var opts=document.getElementById("options");opts.innerHTML="";if(q.type==="promise"){var ta=document.createElement("textarea");ta.id="promiseInput";ta.style.cssText="width:100%;height:120px;padding:15px;border:2px solid #333;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px;resize:vertical";ta.placeholder=q.placeholder||"请输入你的承诺...";ta.oninput=function(){promiseAnswer=this.value;document.getElementById("nextBtn").disabled=!this.value.trim()};opts.appendChild(ta);document.getElementById("nextBtn").textContent="提交";document.getElementById("nextBtn").disabled=true}else{q.options.forEach(function(o,i){var div=document.createElement("div");div.className="option";div.textContent=String.fromCharCode(65+i)+". "+o;div.onclick=function(){selectOption(i)};opts.appendChild(div)});document.getElementById("nextBtn").textContent=cur===total-2?"下一题 (承诺题)":"下一题";document.getElementById("nextBtn").disabled=true;sel=null}document.getElementById("progress").style.width=(cur/total*100)+"%";document.getElementById("progress").textContent=cur+"/"+total}function selectOption(idx){sel=idx;document.querySelectorAll(".option").forEach(function(el,i){el.classList.toggle("selected",i===idx)});document.getElementById("nextBtn").disabled=false}function nextQuestion(){if(sel===null&&Q[cur].type!=="promise")return;if(Q[cur].type!=="promise"&&sel===Q[cur].answer)corr++;cur++;if(cur>=Q.length){endQuiz();return}showQuestion()}function startTimer(){tmr=setInterval(function(){TL--;var m=Math.floor(TL/60),s=TL%60;document.getElementById("timer").textContent=m+":"+(s<10?"0":"")+s;if(TL<=60)document.getElementById("timer").classList.add("warning");if(TL<=0){clearInterval(tmr);endQuiz()}},1000)}function formatTime(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0")}function endQuiz(){clearInterval(tmr);endTime=new Date();document.getElementById("quizPage").classList.add("hidden");document.getElementById("resultPage").classList.remove("hidden");var total=Q.length-1;var score=Math.round(corr/total*100);var passed=corr>=Math.ceil(total*CONFIG.quiz.passRate/100);document.getElementById("score").textContent=score+"%";document.getElementById("score").classList.toggle("failed",!passed);if(passed){document.getElementById("passwordBox").classList.remove("hidden");document.getElementById("password").textContent=CONFIG.password}var duration=Math.floor((endTime-startTime)/1000);var min=Math.floor(duration/60),sec=duration%60;document.getElementById("stats").innerHTML='<div class="stats-row"><strong>联系方式:</strong> '+esc(contact)+'<br><strong>游戏名:</strong> '+esc(gameName)+'</div><div class="stats-row"><strong>正确率:</strong> '+score+'% ('+corr+'/'+total+')<br><strong>通过率:</strong> '+CONFIG.quiz.passRate+'%<br><strong>答题时间:</strong> '+min+'分'+sec+'秒<br><strong>结束时间:</strong> '+formatTime(endTime)+'</div><div class="stats-row"><strong>承诺题答案:</strong><div class="promise-answer">'+esc(promiseAnswer||"未填写")+'</div></div>'}</script></body></html>`;
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
