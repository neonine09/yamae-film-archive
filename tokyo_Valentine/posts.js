(() => {
  const raw = [
    {
      code: "2099839654883463252",
      date: "2026-09-15T12:36:01.000Z",
      title: "最凶の召喚獣の回避方法とは…？🎾🐺",
      caption: "最凶の召喚獣の回避方法とは…？🎾🐺\n\nMiniMax H3 Maxで制作しました！\n\nプロンプトはリプにあります。\nご自由にご利用ください。\n\nMade with\n@Hailuo_AI #minimaxH3",
      thumbnail: "https://pbs.twimg.com/amplify_video_thumb/2099835222145818624/img/h6U7L28IHaHWB_jP.jpg?format=jpg&name=large",
      video: "https://video.twimg.com/amplify_video/2099835222145818624/vid/avc1/1280x720/6haaEW6vcYhzpOcc.mp4?tag=29"
    },
    {
      code: "2099888564540756251",
      date: "2026-09-15T15:50:22.000Z",
      title: "終電ダッシュをGTA化したら以外なボスが🎮🚃",
      caption: "終電ダッシュをGTA化したら以外なボスが🎮🚃\nGTA風のゲーム演出を Seedance 2.5 で映像化しました！\n\nプロンプトはリプにあります。\nご自由にご利用ください。\n\nMade with\n@FramiaPro #Framia #FramiaPro",
      thumbnail: "https://pbs.twimg.com/amplify_video_thumb/2099887005664698368/img/MpufNt21-8eHPlVA.jpg?format=jpg&name=large",
      video: "https://video.twimg.com/amplify_video/2099887005664698368/vid/avc1/1280x720/JlFfSdUcmcsA7Kv4.mp4?tag=29"
    },
    {
      code: "2099986386162176004",
      date: "2026-09-15T22:19:04.000Z",
      title: "呪いの人形が◯◯に効く？？",
      caption: "呪いの人形が◯◯に効く？？\n🎬 MiniMax H3 Maxで生成しました！\n\nプロンプトはリプにあります。\nご自由にご利用ください。\n\nMade with\n@Hailuo_AI #minimaxH3",
      thumbnail: "https://pbs.twimg.com/amplify_video_thumb/2099985093540691968/img/jAWVpq0TQOLtKrIc.jpg?format=jpg&name=large",
      video: "https://video.twimg.com/amplify_video/2099985093540691968/vid/avc1/1280x720/Dxti6ylZhMk_jgN9.mp4?tag=29"
    },
    {
      code: "2100122332564267121",
      date: "2026-09-16T07:19:17.000Z",
      title: "必殺の斬撃、まさかの◯◯にされる🏄‍♀️⚔️",
      caption: "必殺の斬撃、まさかの◯◯にされる🏄‍♀️⚔️\nこういう「最強技の無駄遣い」好き。\n\nMiniMax H3 Maxで出力しました。\n\nプロンプトはリプにあります。\nご自由にご利用ください。\n\nMade with\n@Hailuo_AI #minimaxH3",
      thumbnail: "https://pbs.twimg.com/amplify_video_thumb/2100121373150773248/img/jLq6B-rlwyZ9B3K7.jpg?format=jpg&name=large",
      video: "https://video.twimg.com/amplify_video/2100121373150773248/vid/avc1/1280x720/xHCDhFo0mPQSbLem.mp4?tag=29"
    },
    {
      code: "2100189410646241626",
      date: "2026-09-16T11:45:49.000Z",
      title: "世界を滅ぼす隕石、指2本で……",
      caption: "世界を滅ぼす隕石、指2本で……\nMiniMax H3 Maxで制作しました🔥\n\nプロンプトはリプにあります。ご自由にご利用ください。\n\nアニメの表現とMiniMax H3の相性が最高ですね。\n\nMade with\n@Hailuo_AI #minimaxH3",
      thumbnail: "https://pbs.twimg.com/amplify_video_thumb/2100188209720508416/img/FsHBsN7V2CbfMEYk.jpg?format=jpg&name=large",
      video: "https://video.twimg.com/amplify_video/2100188209720508416/vid/avc1/1280x720/tIVWOVJXYwllQ5yd.mp4?tag=29"
    }
  ];

  window.TOKYO_VALENTINE_POSTS = raw.map((post, index) => ({
    ...post,
    number: index + 1,
    url: "https://x.com/tokyo_Valentine/status/" + post.code
  }));
})();
