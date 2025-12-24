window.addEventListener('load', function () {

    var mess_box = document.getElementById('textbox');
    var mess_text = document.getElementById('text');
    var mswin_flg = true;
    var stop_flg = false;
    var end_flg = false;
    var scene_cnt = 0;
    var line_cnt = 0;
    const interval = 30;
    var select_num1 = 0;
    var select_num2 = 0;
    var select_num3 = 0;
    var select1 = document.getElementById('select1');
    var select2 = document.getElementById('select2');
    var select3 = document.getElementById('select3');
    var select4 = document.getElementById('select4');
    var select5 = document.getElementById('select5');
    var select6 = document.getElementById('select6');
    var select_text1 = document.getElementById('selectText1');
    var select_text2 = document.getElementById('selectText2');
    var select_text3 = document.getElementById('selectText3');
    var select_text4 = document.getElementById('selectText4');
    var select_text5 = document.getElementById('selectText5');
    var select_text6 = document.getElementById('selectText6');

    /*下はシナリオ*/



    var text = []

    text[0] = [
        "クリックでスタートします",
        "<TAITORUU img/TAITOORRUU.png>",
        "<bgimg img/hirunokyousitu.jpg>",
        "",
        "「今日はここまで！今単元の最終課題は規定範囲内で使役したいモノを召喚する術式を調べて提出、媒体及び述法は問わん！」",
        "(とある地方にある国立魔導学院の第2学年。7つある学級の中で、学級単位での成績が最も良い学級。それが自分の所属するクラス・アスガル。)",
        "(学級の是として【成績さえ良ければなんだっていい】を掲げようと第1学年の時に20人の内から誰かが言い始め、全員が賛成するまで数分程度。)",
        "(それを掲げたまま第2学年となり、第1学年時から1人も欠けていない19人で今日も授業を受けている。)",
        "「きりーつ、れーい。ありぁとござっあしたー！」",
        "(クラス委員の号令に合わせて先生に挨拶し、授業が終わる。)",
        "「「「「「「「「「「「「『「「「「「「「「「「「あっしたー！」」」」」」」」」」』」」」」」」」」」」」」",
        "「課題は週末の授業で出せよー、ここまで言って出さねェ奴は落単させっからなー！主にペータス、ヴァカラ、トロパ！」",
        "「あーい。」「うーっす。」「へーい！」",
        "(アスガルの問題児トリオとして学年に知られている3人が先生に名指しされる。けれど、3人は雑な返事を返すだけ。)",
        "(これも、いつもの光景だ。)",
        "「なんか面白いことない？」",
        "「出たー、ぺぺの無茶振り！」",
        "「ふっふっふ、今日はあるんだなぁ、これが！！」",
        "(驚いた。一年と少しの付き合いだが、ヴァカラさんがぺータスさんの無茶振りに「あるよ！」で返すのは初めて見る。)",
        "(ちょっと気になって来たな…)",
        "(あまり良くないのは知っているが、)",
        "<selectBox><select1 1><select2 2><text1 立てる><text2 立てない>(聞き耳を…)",
    ];

    text[1] = [
        "",
        "(少し気になるな、聞き耳でも立てておこう…)",
        "「ここの七不思議って知ってます？」",
        "「さぁ？」",
        "「知らなーい。」",
        "「んじゃ、ちょうどいいね。七不思議の正体割りに行かない？ってハナシ。」",
        "「「面白そう、乗った！！」」",
        "(驚いた。この学院に七不思議なんてものがあるとは……。)",
        "「一つ目、【旧講堂の透明楽団】。",
        "    大講堂あんじゃん、普段は入れない旧い方。」",
        "「あるねー。」「ねー。」",
        "(校舎から離れたところにあった旧大講堂。かなり前に事故か何かで廃墟になったらしい。)",
        "(一度だけ見たことがあるが、割れたステンドグラスや崩れた石壁が神秘的な雰囲気を漂わせていた場所だ。)",
        "「そこから、誰もいないのに音楽が聞こえるんだって。」",
        "「ツクモとかバオアクみたいな透明系が原因とか？」",
        "「いや、看破系のミルちゃんいんじゃん？」",
        "「あー、星学科の？」",
        "「そうそう。今年から筆頭やってる我らがミルちゃん。ミルちゃんが行っても解らなかったんだって。」",
        "「「マジでぇ！？！？」」",
        "「あの隠密破りのミルちゃんが！？」",
        "「教師かくれんぼダービー出禁のミルちゃんでも不明！？」",
        "「ザ・七不思議って感じがしたでしょ？」",
        "「するする、めっちゃ気になるじゃん！！」",
        "「で、他は？」", 
        "「それは行く直前のお楽しみ、ってことで！」",
        "「人数は三人で良い？人数の条件とかあったりする？」",
        "「実は四人以上で行く必要があるやつがあってさ…」",
        "「じゃ、あと一人いれば足りるよね。…………ね、話聞いてたよね？今日の放課後、どう？」",
        "(聞き耳を立てていたのはばれていたらしい。)",
        "(誘いに乗って探索に行こうか、誘いに乗らずに下校してしまうか……)", 
        "<selectBox><select1 3><select2 4><text1 誘いに乗らない><text2 誘いに乗る>どうしようかな…",
    ];


    text[2] = [
        "",
        "(何が出てくるのか気になるが、無粋な真似はしたくない。それに、もう昼食の時間だ。)",
        "(早めに食べて、午後の予習でもしよう。)",
        "",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/hirunokyousitu.jpg>",
        "「今日はここまで！今単元の最終課題は規定範囲内で使役したいモノを召喚する術式を調べて提出、媒体及び述法は問わん！」",
        "「きりーつ、れーい。ありぁとござっあしたー！」",
        "「「「「「「「「「「「「「「「『「「「「「「「「あっしたー！」」」」」」」」」」』」」」」」」」」」」」」",
        "何の変哲もない日常が続く。続く。",
        "<bgimg img/yuugata.jpg>",
        "<bgimg img/hirunokyousitu.jpg>",
        "<bgimg img/yuugata.jpg>",
        "<bgimg img/hirunokyousitu.jpg>",
        "「なんか面白いことない？」",
        "「出たー、ぺぺの無茶振り！」",
        "「ふっふっふ、今日はあるんだなぁ、これが！！」",
        "(ぺータスさんの無茶ぶりに応えているのを見るのは初めてだ。)",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/hirunokyousitu.jpg>",
        "",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/yorukyo.png>",
        "(内容が気になるけれど、無粋な真似はしたくない。それに、もう昼食の時間だ。)",
        "(早めに食べて、午後の予習でもしよう。)",
        "何の変哲もない日常が続く。続く。",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/yorukyo.png>",
        "",
        "「課題は週末の授業で出せよー、ここまで言って出さねェ奴は落単させっからなー！主にペータス、ヴァカラ、トロパ！」",
        "",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/hirunokyousitu.jpg>",
        "『この日常に、終わりはない。』",
        "        END1     終わらない日常      ",
        "<bgimg img/EENNDD.png>",


    ];

    text[3] = [
        "",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/yorunorouka.jpg>",
        "部活に、委員会。やることを終わらせたら、外が真っ暗になる時間になっていた。",
        "学校の敷地はかなり広いので、真っ暗になってもいいようにと街灯が設置されている。",
        "(何かが、聞こえたような？)",
        "-縺ｪ縺ｿ縺ｭ縺阪ｉ繧ゅ＞縺ｿ縺ｿ縺?〓縺ｬ縺ｬ!!!!!-",
        "-縺ｮ繧峨☆繧峨→縺?°縺｡繝ｻ縺ｨ縺ｫ縺ｿ縺ｿ縺励■繝ｻ-",
        "『あ……ぇ………？？？』",
        "胸に走る、鋭い痛み。思わず見た胸元には、深紅に染まりてらてらと輝く銀が生えていた。",
        "『な…………で……あ、が……』",
        "「b@/y,」「とらほすにほ,」「6j5kpe!!!!」",
        "「しちもいしちかかちみみしちのちすちとにのちかちみちにしいとんら・」",
        "「c4q@, :s@:@b4d94q-4t@ ,」",
        "「みにきちとちみちにねみにきちとなもらみらのちる」",
        "「とちんらみちすにる」",
        "<bgimg img/yuugata.jpg>",
        "",
        "<bgimg img/yorunorouka.jpg>",
        "",
        "<bgimg img/gekoukinsi.png>",
        "『下校時刻でも、帰れはしない。』",
        "      END2  下校禁止      ",

    ];

    text[4] = [
        "",
        "「ありがとね。じゃ、放課後にこの教室で。」",
        "「よっろしくぅ！」「ちゃんと来いよ～？」",
        "<bgimg img/yuugata.jpg>",
        "その日の放課後、クラスメイトが軒並み帰った後。",
        "4人以外の誰も居ない教室の隅で、顔を突き合わせて話し合う。",
        "まあ、話し合うとは言ったものの。三人の会話には口をはさむ間もないけれど。",
        "",
        "「1個目は【旧講堂の透明楽団】」",
        "「昼に言ってたヤツ？」",
        "「そ。もう説明したから飛ばして次行くよ。」",
        "",
        "「2個目は【鏡の学校】」",
        "「鏡の中には別の学院があるんだって。」",
        "「じゃ、なんで”学校”って読んでるの？」",
        "「さぁね。伝承に近いからどっかでなんかあったんじゃない？」",
        "「あー、”学校”自体がキーワードの可能性もあるのか。」",
        "「ここまで、次行くよ。」",
        "",
        "「3個目は【増減する廊下と階段】」",
        "「廊下が伸びたり階段が減ったり…」",
        "「おっと、人間の無断転移は禁術では？」",
        "「だ・か・ら・、七不思議なんだよね。じゃ次。」",
        "",
        "「4個目は【図書館の幽霊】」",
        "「図書館にはユーレイが出るって噂。ゴースト系ではない、マジモンのユーレイ。」",
        "「ニルフィ司書なら祓えるんじゃ？」",
        "「あ、れか！？や、たぶんそれ司書には認識できてない。」",
        "「「怖い！！！！」」",
        "「もう七不思議じゃなくて怪談になってるよぅ！！次、次をお願い！！」",
        "",
        "「5個目は【彷徨う書類】」",
        "「配布物に始まり、提出物や謎の本。古代魔術のスクロールや札術の木札が廊下を固まって彷徨ってる。」",
        "「こっわいなそれ！？」",
        "「デショ。誰かが突っついて呪われたってウワサもあるよ。」",
        "「つ、次は？」",
        "",
        "「6個目は【歩くぬいぐるみ】」",
        "「大きいぬいぐるみが歩いていたかと思えば、小さなぬいぐるみになっていたって。」",
        "「純粋にホラーなの持ってくるのはナシでしょうが！」",
        "",
        "「これで最後。7個目は【呪いの墓場】」",
        "「学校のどこかに呪われた古代の墓があるとか…」",
        "「お宝のニオイがしますねぇ………」",
        "",
        "「うーし、大体わかった！」",
        "「どれから行く？」",
        "「【鏡の学校】希望しまーす。」",
        "「了解！」「さんせーい！」",
        "<bgimg img/yorunorouka.jpg>",
        "廊下を4人で歩く。階段に差し掛かったころ、今一番聞きたくない声が聞こえた。",
        "どうやら、私たちは見回り担当の先生と鉢合わせる寸前のようだ。",
        "<bgimg img/yorukaidan.png>",
        "「お～い、誰かいるんですかぁ？下校時間とっくに過ぎてんですよぉ、今すぐ帰りなさーい！」",
       "<selectBox><select1 5><select2 6><text1 急いで目的地へ向かう><text2 階段の陰に隠れる>急いで決めないと…！",
    ];


    text[5] = [
        "",
        "<bgimg img/yorukaidan.png>",
        "急いで目的の場所へ向かおう、と三人に合図する。",
        "「(了解。階段、急いで上がるよ！)」",
        "「誰か居るんですねェ……逃がさないんだなぁ、これが！」",
        "階下で先生の声が響くとともに、緑色のつるが手足に巻き付いた。",
        "「な！？」「きゃ！？」「っ！！」『…！』",
        "「悪ィけど、校則破りは見逃せないですねぇ。」",
        "かつかつと足音を響かせて先生が現れる。",
        "「手荒にしちゃって申し訳ないけど、校則違反はだめですねぇ。」",
        "『それは、まあそうだよね……』",
        "<bgimg img/sipai.png>     END3      隠密失敗 ",              
    ];


    text[6] = [
        "",
        "「ねぇ………ここ、どこ？」",
        "<bgimg img/kagaminogakou.png>               【七不思議    鏡の学校】                        ",
        "いつの間にか、三人の姿はなくなっていた。",
        "",
        "先行体験版はここまでです。 Thank You for Playing!!!!",
        "正式リリースをお待ちください。 プレイ、ありがとうございました！",
         "<bgimg img/thank you.png>",
      

       
    ];





    /*以上シナリオ*/

    function main() {
        var tmp = split_chars.shift();
        if (tmp == '<') {
            let tagget_str = '';
            tmp = split_chars.shift();
            while (tmp != '>') {
                tagget_str += tmp;
                tmp = split_chars.shift();
            }
            tagget_str = tagget_str.split(/\s/);
            switch (tagget_str[0]) {
                case 'stop':
                    stop_flg = true;
                    break;
                case 'bgimg':
                    $('#bgimg').attr('src', tagget_str[1]);
                    break;
                case 'selectBox':
                    $('.selectBox').removeClass('none');
                    $('.selectBox').addClass('show');
                    $('.select').addClass('none');
                    break;
                case 'text1':
                    select_text1.innerHTML = tagget_str[1];
                    break;
                case 'text2':
                    select_text2.innerHTML = tagget_str[1];
                    break;
                case 'text3':
                    select_text3.innerHTML = tagget_str[1];
                    break;
                case 'select1':
                    if (tagget_str[1] === "none") {
                        
                    } else {
                        $('#select1').removeClass('none');
                        select_num1 = tagget_str[1];
                        select1.addEventListener('click', function () {
                            scene_cnt = select_num1;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            $('.selectBox').addClass('none');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'select2':
                    if (tagget_str[1] === "none") {

                    } else {
                        $('#select2').removeClass('none');
                        select_num2 = tagget_str[1];
                        select2.addEventListener('click', function () {
                            scene_cnt = select_num2;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            $('.selectBox').addClass('none');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'select3':
                    if (tagget_str[1] === "none") {

                    } else {
                        $('#select3').removeClass('none');
                        select_num3 = tagget_str[1];
                        select3.addEventListener('click', function () {
                            scene_cnt = select_num3;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                case 'select4':
                    if (tagget_str[1] === "none") {

                    } else {
                        $('#select4').removeClass('none');
                        select_num4 = tagget_str[1];
                        select4.addEventListener('click', function () {
                            scene_cnt = select_num4;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'select5':
                    if (tagget_str[1] === "none") {

                    } else {
                        $('#select5').removeClass('none');
                        select_num5 = tagget_str[1];
                        select5.addEventListener('click', function () {
                            scene_cnt = select_num5;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'select6':
                    if (tagget_str[1] === "none") {

                    } else {
                        $('#select6').removeClass('none');
                        select_num6 = tagget_str[1];
                        select6.addEventListener('click', function () {
                            scene_cnt = select_num6;
                            line_cnt = -1;
                            $('.selectBox').removeClass('show');
                            selectNoneRemove();
                            textClick();
                        });
                    }
                    break;
                case 'break':
                    mess_text.innerHTML += '<br>';
                    break;
                case 'skip':
                    scene_cnt = tagget_str[1];
                    line_cnt = -1;
                    break;
            }
        }
        if (!stop_flg) {
            if (tmp) {
                if (tmp != '>') mess_text.innerHTML += tmp;
                setTimeout(main, interval);
            }
        } else {
            mess_text.innerHTML += '<span class="blink-text"></span>';
        }
    }

    mess_box.addEventListener('click', function () {
        console.log(scene_cnt);
        console.log(line_cnt);
        if (end_flg) return;
        if (mswin_flg) {
            if (!stop_flg) {
                line_cnt++;
                if (line_cnt >= text[scene_cnt].length) {
                    line_cnt = text[scene_cnt].length - 1;
                }
            } else if (scene_cnt >= text.length) {
                end_flg = true;
                return;
            }
            split_chars = text[scene_cnt][line_cnt].split('');
            mess_text.innerHTML = '';
            main();
        }
    });

    function textClick() {
        $('#textbox').trigger('click');
    }

    function selectNoneRemove() {
        $('#select1').removeClass('none');
        $('#select2').removeClass('none');
        $('#select3').removeClass('none');
        $('#select4').removeClass('none');
        $('#select5').removeClass('none');
        $('#select6').removeClass('none');
    }
});



