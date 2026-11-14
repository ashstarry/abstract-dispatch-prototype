export const CHARS = [
 {id:'tim',name:'缇姆',title:'画面先行',color:'#6bc8d1',stats:{force:1,tech:3,talk:1,obs:4},skill:'极限测试',desc:'设备任务观察 +2；放飞路线省1拍，但额外花1预算。',quip:'别动，这个逆光！',tags:['摄影','检测']},
 {id:'wang',name:'王字如',title:'独立评测',color:'#c6da77',stats:{force:1,tech:3,talk:3,obs:3},skill:'现场对质',desc:'验收任务观察 +2。和罗咏皓搭档，技术 +2，但先吵1拍。',quip:'先把测试条件说清楚。',tags:['评测','抬杠']},
 {id:'luo',name:'罗咏皓',title:'售后兜底',color:'#ea937b',stats:{force:3,tech:2,talk:4,obs:1},skill:'先行赔付',desc:'失败损失少2预算；和王字如同队，技术 +2，但先吵1拍。',quip:'先干，售后我来！',tags:['嘴炮','兜底']},
 {id:'dong',name:'董语晖',title:'米袋诗人',color:'#e4ae69',stats:{force:2,tech:1,talk:4,obs:2},skill:'故乡的风',desc:'人群任务口才 +2；稳妥路线多1拍，大家得先听完。',quip:'这袋米，让我想起……',tags:['安抚','叙事']},
 {id:'he',name:'何彤学',title:'教程加载中',color:'#96b3dc',stats:{force:1,tech:5,talk:1,obs:3},skill:'快速改装',desc:'设备任务省1拍，额外花1预算补材料；至少用1拍。',quip:'会修，等他广告播完。',tags:['技术','改装']},
 {id:'da',name:'大思码',title:'这波不亏',color:'#b0bf88',stats:{force:2,tech:1,talk:2,obs:4},skill:'先看一眼',desc:'稳妥路线观察 +3，但多1拍；赶时间的时候尤其别急。',quip:'别急，还有操作空间。',tags:['预判','嘴硬']},
 {id:'geng',name:'首工耿',title:'功能过剩',color:'#e1c368',stats:{force:4,tech:4,talk:1,obs:1},skill:'全都给你拆了',desc:'放飞路线力气 +2、技术 +1；成功后设备损失多1预算。',quip:'汽油的，劲儿大。',tags:['拆除','发明']},
 {id:'li',name:'李加棋',title:'报价鬼才',color:'#dc8f9c',stats:{force:1,tech:1,talk:5,obs:2},skill:'等一个活动',desc:'出勤费用少1预算；人群任务口才 +1。',quip:'你还想等满减啊？',tags:['采购','议价']}
];
export const STATS={force:'力气',tech:'技术',talk:'口才',obs:'观察'};
const route=(name,req,duration,fee,damage)=>({name,req,duration,fee,damage});
export const SHIFTS=[
 {name:'今晚谁背锅',subtitle:'抽象区 · 第一夜',brief:'电梯卡了，奶茶店着了，外卖还在催。先救人，再考虑节目效果。',budget:12,jobs:[
  {id:'lift',title:'电梯不想上班',where:'摸鱼大厦',type:'lift',tags:['设备'],desc:'6个人卡在三楼。物业说“马上”，已经说了两小时。',deadline:4,pay:5,point:[33,33],safe:route('修好门锁',{tech:6},2,1,0),chaos:route('整个轿厢拽出来',{force:7},1,2,3)},
  {id:'fire',title:'奶茶三分糖，十分火',where:'吨吨奶茶',type:'fire',tags:['设备'],desc:'后厨起火，店长说别碰收银机——里面还有今天的营业额。',deadline:3,pay:5,point:[70,29],safe:route('断电后灭火',{tech:4,obs:4},2,1,0),chaos:route('开墙直接灌水',{force:6},1,2,2)},
  {id:'queue',title:'全城都来领鸡蛋',where:'便民广场',type:'crowd',tags:['人群'],desc:'免费鸡蛋只剩两盒，排队的人能绕地球半圈。场面即将失控。',deadline:5,pay:4,point:[65,70],safe:route('分批登记领蛋',{talk:6},2,0,0),chaos:route('拿喇叭喊到没脾气',{talk:7,force:2},1,1,1)},
  {id:'drone',title:'外卖飞到树上了',where:'老登公园',type:'drone',tags:['设备','验收'],desc:'无人机挂树，下面顾客的备注是：别敲门，孩子睡了。',deadline:6,pay:4,point:[25,75],safe:route('定位后遥控返航',{tech:4,obs:5},2,1,0),chaos:route('树给它摇下来',{force:6},1,1,2)}
 ]},
 {name:'全是技术与狠活',subtitle:'抽象区 · 第二夜',brief:'今晚的设备都有自己的想法。谨慎搭配，别把预算全赔给商场。',budget:13,jobs:[
  {id:'screen',title:'大屏正在公开处刑',where:'南门商场',type:'screen',tags:['设备','验收'],desc:'LED大屏循环播放店长练舞，员工说这是“企业文化”。',deadline:3,pay:5,point:[32,31],safe:route('排查信号源',{tech:5,obs:4},2,1,0),chaos:route('总闸先给它扬了',{force:5},1,1,3)},
  {id:'bridge',title:'网红桥拒绝承重',where:'上头步道',type:'bridge',tags:['设备'],desc:'桥上有乘客，桥下有水。景区说设计师正在输入中。',deadline:4,pay:6,point:[72,28],safe:route('支撑加固后疏散',{tech:5,force:4},2,2,0),chaos:route('整段桥吊上岸',{force:7},1,2,3)},
  {id:'market',title:'直播间货比人少',where:'优惠仓库',type:'crowd',tags:['人群','验收'],desc:'直播间说现货秒发，仓库里只剩一个塑料板凳。',deadline:5,pay:5,point:[64,74],safe:route('核库存并安抚',{talk:5,obs:5},2,0,0),chaos:route('先补货，再讲故事',{talk:6,tech:2},1,2,1)},
  {id:'cat',title:'猫上去了，人也上去了',where:'老登公园',type:'drone',tags:['人群'],desc:'救猫的困在树上，救人的也困在树上。现在树上比树下热闹。',deadline:6,pay:4,point:[25,73],safe:route('固定绳索逐个下树',{force:5,obs:4},2,1,0),chaos:route('树枝打包一起下来',{force:6},1,1,2)}
 ]},
 {name:'这班真的能下吗',subtitle:'抽象区 · 第三夜',brief:'最后一班。会的未必靠谱，靠谱的可能已经被你派出去了。',budget:14,jobs:[
  {id:'stage',title:'演出开始，舞台先走',where:'便民广场',type:'stage',tags:['设备'],desc:'升降台卡在半空，歌手还在唱。音响比承重结构敬业。',deadline:3,pay:6,point:[64,70],safe:route('检修液压再降台',{tech:6,force:3},2,1,0),chaos:route('抬着舞台去地面',{force:7},1,2,3)},
  {id:'jam',title:'车没动，喇叭没停',where:'摸鱼路口',type:'crowd',tags:['人群'],desc:'路口堵成一锅粥。每辆车都觉得是别人不会开。',deadline:4,pay:5,point:[42,47],safe:route('分流引导车队',{talk:5,obs:5},2,0,0),chaos:route('车挪走，路就有了',{force:6,talk:2},1,2,2)},
  {id:'power',title:'全区断电，只有加班灯亮',where:'加班变电站',type:'screen',tags:['设备','验收'],desc:'工位灯还亮着，城市已经黑了。老板说这说明公司有韧性。',deadline:5,pay:6,point:[75,30],safe:route('检测线路恢复供电',{tech:6,obs:4},2,2,0),chaos:route('临时巨型电池顶上',{tech:5,force:4},1,3,2)},
  {id:'finale',title:'客户说想要一点惊喜',where:'南门商场',type:'stage',tags:['人群','验收'],desc:'活动要开场了。甲方只说了五个字：你们自由发挥。',deadline:6,pay:5,point:[28,28],safe:route('确认需求再排流程',{talk:6,obs:4},2,1,0),chaos:route('全员整活，后果再说',{talk:5,tech:3},1,2,2)}
 ]}
];
export const BANTER={
 lift:[['dispatch','人出来没？'],['geng','出来了，电梯也一块儿救了。'],['dispatch','不是，停车场多那铁箱子算谁的？']],
 fire:[['dispatch','哥，别拍了，火烧我腚了！'],['tim','卧槽，这个逆光！'],['dispatch','逆你大爷，先灭火啊！']],
 queue:[['dong','这枚鸡蛋，让我想起故乡的清晨……'],['dispatch','先发！大爷都开始掏平底锅了！']],
 drone:[['da','别急，还有操作空间。'],['dispatch','它掉下来了！'],['da','这波我的，外卖没亏。']],
 screen:[['he','会修，等他广告播完。'],['dispatch','你看的教程正在商场大屏上播呢！']],
 bridge:[['geng','整个拿走，省得修了。'],['dispatch','哥，这桥不是外卖，不能打包。']],
 market:[['li','嫌贵等活动。'],['dispatch','人家都等你等到仓库长蘑菇了！']],
 cat:[['da','他急了。'],['dispatch','废话！树上现在六个了！']],
 stage:[['dispatch','台子下来没？'],['geng','下来了，带着半个舞台。'],['dispatch','歌手怎么还在唱？加班费挺到位啊。']],
 jam:[['dong','故乡的路……'],['dispatch','现在先看导航，别看故乡！']],
 power:[['he','通了！'],['dispatch','路灯呢？'],['he','还没通，教程通了。']],
 finale:[['wang','这个方案不严谨。'],['luo','你先把报告拿出来。'],['dispatch','客户都下班了！你俩还在上早会？！']]
};
export const SAFE_LINES={
 lift:['门开了，6个人都出来了。','那人怎么还不走？','等公司打卡呢，今天扣不起。'],
 fire:['灭了，一点没剩。','人呢？！','说火呢！人好好的！'],
 queue:['分完了，没打起来。','那平底锅是干啥的？','大爷自带的，现场验货。'],
 drone:['外卖拿下来了。','凉了没？','备注写的少冰，没说不能凉。'],
 screen:['切掉了。','大屏？','视频！别老盼着我拆楼！'],
 bridge:['人都下桥了。','桥呢？','还在！咱也不是每次都打包。'],
 market:['货补上了。','那你怎么还在讲？','他们问售后，我讲到童年了。'],
 cat:['全下来了。','猫呢？','它早下来了，看我们救人呢。'],
 stage:['台子落地了。','人呢？','还在唱，钱真没白给。'],
 jam:['通了。','你站路中间干啥？','指挥交通啊，不是碰瓷！'],
 power:['灯亮了。','还剩啥事？','客户说正好接着加班。'],
 finale:['流程确认好了。','客户满意？','他满意了，又加两页需求。']
};
export const PAIR_LINES=[
 {ids:['tim','he'],lines:[['tim','你修，我拍。'],['he','等下，我看个教程。'],['dispatch','好家伙，教学相长是吧？']]},
 {ids:['tim','geng'],lines:[['geng','别凑太近，可能炸。'],['tim','炸之前喊一声。'],['dispatch','喊你跑！不是喊你开机！']]},
 {ids:['he','geng'],lines:[['he','你这接线图呢？'],['geng','没有，凭感觉。'],['dispatch','咱这感觉还保修吗？']]},
 {ids:['dong','li'],lines:[['dong','这个东西承载了……'],['li','79。'],['dong','我还没说完。'],['li','说完就89了。']]},
 {ids:['da','luo'],lines:[['da','这波不亏。'],['luo','真不亏？'],['da','你都说包售后了，能亏吗？']]},
 {ids:['da','geng'],lines:[['geng','要不直接拆？'],['da','别急，我在等时机。'],['dispatch','时机都下班了，你俩快点！']]},
 {ids:['wang','he'],lines:[['wang','这个结果你确定？'],['he','测过了。'],['wang','控制变量了吗？'],['dispatch','控制一下你们嘴行吗？']]}
];
