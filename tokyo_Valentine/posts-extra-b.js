(() => {
  const extra = [
    ["2090279211600928966", "2026-08-20T03:26:14.000Z", "「文字」が液体金属になったら", "https://pbs.twimg.com/amplify_video_thumb/2090277510936498176/img/8f7tYzWAqDHClg6I.jpg", "https://video-s.twimg.com/amplify_video/2090277510936498176/vid/avc1/2560x1440/7xLXC3gkdD1kfNB4.mp4?tag=29"],
    ["2089805142027850013", "2026-08-18T20:02:27.000Z", "MiniMax H3は「文字」だけで、", "https://pbs.twimg.com/amplify_video_thumb/2089797983181373441/img/86_VHHDwwEQPIDIv.jpg", "https://video-s.twimg.com/amplify_video/2089797983181373441/vid/avc1/1920x1080/VZQzXXncHf3uX5cA.mp4?tag=29"],
    ["2089687861302108495", "2026-08-18T12:16:25.000Z", "FramiaでSeedance 2.0 Miniをはじめて使いました。", "https://pbs.twimg.com/amplify_video_thumb/2089687492752703488/img/5TN0rpajtPDukwzi.jpg", "https://video-s.twimg.com/amplify_video/2089687492752703488/vid/avc1/1920x1080/VlLbvT1t8G7tJv1A.mp4?tag=29"],
    ["2089317467135095037", "2026-08-17T11:44:36.000Z", "Seedance 2.0 / Seedance 2.5 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2089317034354155520/img/DzS8r0b4yp1a3cxA.jpg", "https://video-s.twimg.com/amplify_video/2089317034354155520/vid/avc1/2560x1440/wWZqwwER6T8z02w2.mp4?tag=29"],
    ["2089149677140885551", "2026-08-17T00:37:52.000Z", "赤いバイク。", "https://pbs.twimg.com/amplify_video_thumb/2089148924905091072/img/ORMfFXEctw7IPy_N.jpg", "https://video-s.twimg.com/amplify_video/2089148924905091072/vid/avc1/1920x1080/7dEnUWmGrzgBPXo4.mp4?tag=29"],
    ["2088931145651995096", "2026-08-16T10:09:30.000Z", "Seedance 2.0 Seedance 2.5 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2088929294030712832/img/w60Cu4iJhXJS5ng9.jpg", "https://video-s.twimg.com/amplify_video/2088929294030712832/vid/avc1/1280x720/U2baDumiGBY4XdXd.mp4?tag=29"],
    ["2088876131474903156", "2026-08-16T06:30:53.000Z", "Seedance 2.0 Seedance 2.5 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2088874880695750656/img/3wMOvsfGURvXsF_y.jpg", "https://video-s.twimg.com/amplify_video/2088874880695750656/vid/avc1/1280x720/JrvP-SsedblsYbWk.mp4?tag=29"],
    ["2087750930448138397", "2026-08-13T03:59:45.000Z", "AfterEffectsでNGシーンを編集してみました。", "https://pbs.twimg.com/amplify_video_thumb/2087750782385016832/img/-V0zr9zV5e2Jw1yr.jpg", "https://video-s.twimg.com/amplify_video/2087750782385016832/vid/avc1/1920x1080/z_xchbBwpxOFn4yg.mp4?tag=29"],
    ["2087491495758860300", "2026-08-12T10:48:50.000Z", "MiniMax H3バージョンもいい味出しています。 https://t.co/5arRMHefP6", "https://pbs.twimg.com/amplify_video_thumb/2087491287238995968/img/jGYAwW8z_wS8EVqI.jpg", "https://video-s.twimg.com/amplify_video/2087491287238995968/vid/avc1/2560x1440/d3sy7jhQih70dFpq.mp4?tag=29"],
    ["2087376505064263745", "2026-08-12T03:11:55.000Z", "MiniMax H3もMiniMax H3の良さがあるので", "https://pbs.twimg.com/amplify_video_thumb/2087375774244564992/img/u7aoPtsqLR59PytW.jpg", "https://video-s.twimg.com/amplify_video/2087375774244564992/vid/avc1/2560x1440/mDk0Ax2NGr5EAFHj.mp4?tag=29"],
    ["2087176787981963378", "2026-08-11T13:58:18.000Z", "金髪のゴスロリ少女が歌舞伎町で極道ヤクザと戦う", "https://pbs.twimg.com/amplify_video_thumb/2087175637715050496/img/ukM1-qHDNB8HCyWO.jpg", "https://video-s.twimg.com/amplify_video/2087175637715050496/vid/avc1/1920x1080/7dINGm3JZ5X1jKrw.mp4?tag=29"],
    ["2086334745210929623", "2026-08-09T06:12:20.000Z", "メキシコを舞台にした修道女のアクション映画の予告編を作ってみました。", "https://pbs.twimg.com/amplify_video_thumb/2086333868710445056/img/Vp_err8gWyFC7cyP.jpg", "https://video-s.twimg.com/amplify_video/2086333868710445056/vid/avc1/1280x720/wz00BqetMUmZF3Oj.mp4?tag=29"],
    ["2085680600070152216", "2026-08-07T10:52:59.000Z", "Seedance 2.5がもうRenoiseで使えます👀", "https://pbs.twimg.com/amplify_video_thumb/2085680381244887040/img/wzUH5oTJuDZWgdkY.jpg", "https://video-s.twimg.com/amplify_video/2085680381244887040/vid/avc1/1920x1080/H3i5mxZyG2chZTlc.mp4?tag=29"],
    ["2085199034508292409", "2026-08-06T02:59:25.000Z", "Short MV「Eat Sushi」🍣⚡️", "https://pbs.twimg.com/amplify_video_thumb/2085195928131284992/img/2sqSGDkeV4tmmloc.jpg", "https://video-s.twimg.com/amplify_video/2085195928131284992/vid/avc1/1280x720/aGcJzTe5iI0Afx22.mp4?tag=29"],
    ["2085199036735459768", "2026-08-06T02:59:26.000Z", "MiniMax H3版はこちら", "https://pbs.twimg.com/amplify_video_thumb/2085197447064961024/img/bUhESUCdRrvLkQAT.jpg", "https://video-s.twimg.com/amplify_video/2085197447064961024/vid/avc1/2560x1440/t24WoP9KIzLdeyUc.mp4?tag=29"],
    ["2084857020499509559", "2026-08-05T04:20:23.000Z", "Prompt:MiniMax H3 / Seedance 2.0", "https://pbs.twimg.com/amplify_video_thumb/2084856353370349568/img/I417L1QPUtYzZRWh.jpg", "https://video-s.twimg.com/amplify_video/2084856353370349568/vid/avc1/2944x1248/77MvBwfdIIZxu61d.mp4?tag=29"],
    ["2083928222098714709", "2026-08-02T14:49:40.000Z", "切り捨て御免3を作って居たらこんな時間です。", "https://pbs.twimg.com/amplify_video_thumb/2083926715601235969/img/v6o41HTyjagrXFCf.jpg", "https://video-s.twimg.com/amplify_video/2083926715601235969/vid/avc1/1920x1080/Ik5gRu-r1D_mEDi3.mp4?tag=29"],
    ["2083928224246211017", "2026-08-02T14:49:40.000Z", "完全に好みなんですが、Seedance 2.0の方がMiniMax H3より勝手に解釈して良い感じにしてくれる力が強いきがしました。", "https://pbs.twimg.com/amplify_video_thumb/2083927081633959936/img/NON-7EeNH_0oTDbP.jpg", "https://video-s.twimg.com/amplify_video/2083927081633959936/vid/avc1/2560x1440/pIvbLcShIqMBbEax.mp4?tag=29"],
    ["2083141655113482340", "2026-07-31T10:44:08.000Z", "KIZUNA//BLADE - キズナブレードが登場するMVは", "https://pbs.twimg.com/amplify_video_thumb/2083140285543174145/img/VHETfrH8d8gMDm6X.jpg", "https://video-s.twimg.com/amplify_video/2083140285543174145/vid/avc1/1280x720/PnHS4pybmTxlNQDl.mp4?tag=29"],
    ["2083033330359193852", "2026-07-31T03:33:41.000Z", "#FlovaBrandstorm", "https://pbs.twimg.com/amplify_video_thumb/2083031703929716736/img/2aplugr5kzokeiu_.jpg", "https://video-s.twimg.com/amplify_video/2083031703929716736/vid/avc1/1920x1080/prcYtcGnmBYbpgJC.mp4?tag=29"],
    ["2082667322096124147", "2026-07-30T03:19:18.000Z", "MiniMax H3 Early Access", "https://pbs.twimg.com/amplify_video_thumb/2082664104200925184/img/GYzlDKS1dB-PMuJA.jpg", "https://video-s.twimg.com/amplify_video/2082664104200925184/vid/avc1/2560x1440/r0DN5ZwdgoYHYg_s.mp4?tag=29"],
    ["2081322460226453879", "2026-07-26T10:15:18.000Z", "#AIFusionFes", "https://pbs.twimg.com/amplify_video_thumb/2081322331897819136/img/FZNIV1Fw7WaSmnk4.jpg", "https://video-s.twimg.com/amplify_video/2081322331897819136/vid/avc1/1280x720/ZctO4d-naMLqyXmB.mp4?tag=29"],
    ["2074115490444951811", "2026-07-06T12:57:22.000Z", "Seedance 2.0 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2074115000684474368/img/W7_NLrg-5zVnl49L.jpg", "https://video-s.twimg.com/amplify_video/2074115000684474368/vid/avc1/1920x1080/Rg6hKeKkP_wi1gSq.mp4?tag=28"],
    ["2073626140598816969", "2026-07-05T04:32:52.000Z", "Seedance 2.0 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2073623787988463616/img/12oSk8mtJpkolcUz.jpg", "https://video-s.twimg.com/amplify_video/2073623787988463616/vid/avc1/1280x720/Ol90q9d_9XA8gTF2.mp4?tag=28"],
    ["2073242423556473043", "2026-07-04T03:08:07.000Z", "@T_st_love_love 是非 4K ver でお楽しみください。", "https://pbs.twimg.com/amplify_video_thumb/2073241541846667264/img/R5rTyDlMnICf2PCs.jpg", "https://video-s.twimg.com/amplify_video/2073241541846667264/vid/avc1/1920x1080/RilWomL1nsuMFMx2.mp4?tag=28"],
    ["2073026367361556645", "2026-07-03T12:49:35.000Z", "@T_st_love_love イケオジの拳は最高です。", "https://pbs.twimg.com/amplify_video_thumb/2073026200059170816/img/B2A-C6ERlzdmD4vi.jpg", "https://video-s.twimg.com/amplify_video/2073026200059170816/vid/avc1/1920x1080/OcwW4Fe8MtQX0zte.mp4?tag=28"],
    ["2072878141220303026", "2026-07-03T03:00:35.000Z", "スタイル:フォトリアル。実写映画。", "https://pbs.twimg.com/amplify_video_thumb/2072876252156100608/img/S4lV7ql_K9dqZVRK.jpg", "https://video-s.twimg.com/amplify_video/2072876252156100608/vid/avc1/1280x720/2WV1Iu5lde_2_Fsa.mp4?tag=28"],
    ["2072520296507285747", "2026-07-02T03:18:38.000Z", "スタイル:フォトリアル。実写映画。グルメCMの技法を使った映像。", "https://pbs.twimg.com/amplify_video_thumb/2072520221018271744/img/a2KkTgrgI_08bWCQ.jpg", "https://video-s.twimg.com/amplify_video/2072520221018271744/vid/avc1/1280x720/g1Jfu15BY5cnhyAP.mp4?tag=28"],
    ["2071894816255045767", "2026-06-30T09:53:12.000Z", "こちらの動画も", "https://pbs.twimg.com/amplify_video_thumb/2071893491618131968/img/9-xghwFALuQ9OoAT.jpg", "https://video-s.twimg.com/amplify_video/2071893491618131968/vid/avc1/1280x720/gKzKoM9szd-fMC-5.mp4?tag=28"],
    ["2071061002070929625", "2026-06-28T02:39:56.000Z", "#AIFusionFes動画コンテスト", "https://pbs.twimg.com/amplify_video_thumb/2071060261558272000/img/3cCQ_Jtegi6roapO.jpg", "https://video-s.twimg.com/amplify_video/2071060261558272000/vid/avc1/1280x720/sCXuDGDGrecyoemK.mp4?tag=28"],
    ["2070375638834520303", "2026-06-26T05:16:32.000Z", "--ChatGPT プロンプト--", "https://pbs.twimg.com/amplify_video_thumb/2070375089896640512/img/PUiTA_ff_94kZ93U.jpg", "https://video-s.twimg.com/amplify_video/2070375089896640512/vid/avc1/1280x720/Af9Uc-MPHR9MjJkZ.mp4?tag=28"],
    ["2070342760771817816", "2026-06-26T03:05:53.000Z", "スタイル:日本の作画枚数の多いアニメ。アクション映画の技法を使ったアニメ映画。", "https://pbs.twimg.com/amplify_video_thumb/2070342177444765696/img/4h92HUWRnr2Lscmf.jpg", "https://video-s.twimg.com/amplify_video/2070342177444765696/vid/avc1/1280x720/tJatotNhNWSoC9M9.mp4?tag=28"],
    ["2070102589447066108", "2026-06-25T11:11:32.000Z", "RT @tokyo_Valentine: 必殺剣…漢字のエフェクトで", "https://pbs.twimg.com/amplify_video_thumb/2069979122340970496/img/BEDtBmwOQSlEYQmr.jpg", "https://video-s.twimg.com/amplify_video/2069979122340970496/vid/avc1/1280x720/hPS3weQ3Nphtvzlt.mp4?tag=28"],
    ["2069619175912550666", "2026-06-24T03:10:37.000Z", "Seedance 2.0 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2069618811939205120/img/eLsg6dQ_XJiZQG5Ve.jpg", "https://video-s.twimg.com/amplify_video/2069618811939205120/vid/avc1/1280x720/8zy-gjtYJrqmGo6Z.mp4?tag=28"],
    ["2069256693251547263", "2026-06-23T03:10:15.000Z", "Seedance 2.0 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2069256253399064576/img/yJnYqjZ9wPAYuJRH.jpg", "https://video-s.twimg.com/amplify_video/2069256253399064576/vid/avc1/1280x720/jsV4KS44VWr9dPTS.mp4?tag=28"],
    ["2068693040458539221", "2026-06-21T13:50:29.000Z", "Seedance 2.0 Prompt", "https://pbs.twimg.com/amplify_video_thumb/2068692496826421248/img/aIBqhGcEHp2YwYLc.jpg", "https://video-s.twimg.com/amplify_video/2068692496826421248/vid/avc1/1280x720/3_5sLOhJXQ1nUtMx.mp4?tag=28"],
    ["2067812442181390661", "2026-06-19T03:31:18.000Z", "宇宙空間でのドッグファイトの動画を作りました。", "https://pbs.twimg.com/amplify_video_thumb/2067811182950674432/img/dm3yuXjvUdddx7iJ.jpg", "https://video-s.twimg.com/amplify_video/2067811182950674432/vid/avc1/1280x720/E1HNkg4ZWQXQyZx2.mp4?tag=28"],
    ["2066834383374578043", "2026-06-16T10:44:51.000Z", "RT @aoki_tosh: 皆様今日もお疲れ様でした✨", "https://pbs.twimg.com/amplify_video_thumb/2066831609458995200/img/BrkTSVC7w3xoCImv.jpg", "https://video-s.twimg.com/amplify_video/2066831609458995200/vid/avc1/1280x720/q-c2now0t3RRpN2V.mp4?tag=28"],
    ["2066730813639864593", "2026-06-16T03:53:18.000Z", "高層ビルから飛び降りて逆さまに落下して", "https://pbs.twimg.com/amplify_video_thumb/2066730246003716096/img/1bRT-7q29zRXA7C5.jpg", "https://video-s.twimg.com/amplify_video/2066730246003716096/vid/avc1/1280x720/6iQ_cEcWHcB8IQ37.mp4?tag=28"],
    ["2066520597228912703", "2026-06-15T13:57:59.000Z", "RT @luxaios: 明後日、X対談スペースでお話しさせていただきます！楽しみです！", "https://pbs.twimg.com/amplify_video_thumb/2066510680442994688/img/8Lr_rFjpubVDuMqm.jpg", "https://video-s.twimg.com/amplify_video/2066510680442994688/vid/avc1/1280x720/SEM5Rmf8LaqPZkGw.mp4?tag=28"],
    ["2063919441319215152", "2026-06-08T09:41:55.000Z", "#AIFusionFes動画コンテスト", "https://pbs.twimg.com/amplify_video_thumb/2063918534825324544/img/0uiMSoKluH1KXz4T.jpg", "https://video-s.twimg.com/amplify_video/2063918534825324544/vid/avc1/1280x720/L6G8cXLcP7IIzIeA.mp4?tag=27"],
    ["2050053159805219252", "2026-05-01T03:22:16.000Z", "🍙💥おにぎりのCMのプロンプトを公開", "https://pbs.twimg.com/amplify_video_thumb/2050050977252937728/img/E3kzlK5D0LRyEmLQ.jpg", "https://video-s.twimg.com/amplify_video/2050050977252937728/vid/avc1/2560x1440/z8gHbOA-Svqg0sRz.mp4?tag=27"]
  ].map(([code, date, title, thumbnail, video]) => ({
    code,
    date,
    title,
    caption: title,
    thumbnail,
    video
  }));

  window.TOKYO_VALENTINE_EXTRA_POSTS = [
    ...(window.TOKYO_VALENTINE_EXTRA_POSTS || []),
    ...extra
  ];

  const combined = [
    ...(window.TOKYO_VALENTINE_EXTRA_POSTS || []),
    ...(window.TOKYO_VALENTINE_POSTS || [])
  ].sort((a, b) => {
    const byDate = new Date(a.date) - new Date(b.date);
    return byDate || String(a.code).localeCompare(String(b.code));
  });

  window.TOKYO_VALENTINE_POSTS = combined.map((post, index) => ({
    ...post,
    number: index + 1,
    url: "https://x.com/tokyo_Valentine/status/" + post.code
  }));
})();
