(() => {
  const extra = [
    ["2099691973372457161", "2026-09-15T02:00:00.000Z", "HPバーって消しゴムで消えるの？", "https://pbs.twimg.com/amplify_video_thumb/2099689505204936704/img/liax1Z_1utiUEc5V.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2099689505204936704/vid/avc1/1920x1080/UQmFRes1Rss2XKKS.mp4?tag=29"],
    ["2099745981948674376", "2026-09-15T05:00:00.000Z", "「遅刻しただけなのに、登校がステルスゲームになった。」", "https://pbs.twimg.com/amplify_video_thumb/2099745337770659840/img/wSKZgcxDEKyua0PA.jpg?format=jpg&name=large", "https://video.twimg.com/amplify_video/2099745337770659840/vid/avc1/1920x1080/3tBusgiMMSxf4JwZ.mp4?tag=29"],
    ["2099804040175682027", "2026-09-15T09:30:00.000Z", "必殺技の雷がなんと…⚡️📱", "https://pbs.twimg.com/amplify_video_thumb/2099803118821388288/img/taJn8DLY6G1KZqjp.jpg?format=jpg&name=large", "https://video.twimg.com/amplify_video/2099803118821388288/vid/avc1/3840x2160/iU8lt_3-Y0KdnIgy.mp4?tag=29"],
    ["2099066184293552129", "2026-09-13T09:22:31.000Z", "その必殺技、針1本で終わります🪡", "https://pbs.twimg.com/amplify_video_thumb/2099065443650842624/img/nVk8LKo83qvDD-cM.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2099065443650842624/vid/avc1/1920x1080/V1PX7hYPpPB16yor.mp4?tag=29"],
    ["2098977958228812143", "2026-09-13T03:31:57.000Z", "覚醒したのに、掃除機に全部吸われた。", "https://pbs.twimg.com/amplify_video_thumb/2098977406833094656/img/Ug5K6OqQAZG4o66i.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2098977406833094656/vid/avc1/1920x1080/qImBslP0gUzvBGF1.mp4?tag=29"],
    ["2098638475381920056", "2026-09-12T05:02:58.000Z", "正直に言うと、", "https://pbs.twimg.com/amplify_video_thumb/2098638357173813248/img/gKY6o_RYPq7PTQOC.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2098638357173813248/vid/avc1/2560x1440/Xi20EsF3PGYYdydO.mp4?tag=29"],
    ["2097123773636059318", "2026-09-08T00:44:04.000Z", "MiniMax H3 MAX Prompt", "https://pbs.twimg.com/amplify_video_thumb/2097123356185415680/img/isZkwHXlasvSqr45.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2097123356185415680/vid/avc1/1920x1080/iSPW-5IJv8ZqBQEr.mp4?tag=29"],
    ["2097117662992351740", "2026-09-08T00:19:48.000Z", "この度、Kling様のECPに選出していただきました！🎉", "https://pbs.twimg.com/amplify_video_thumb/2097115847169056768/img/G74DZtcBarLH34Ue.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2097115847169056768/vid/avc1/1920x1080/TpzfF1JiSExWOLIr.mp4?tag=29"],
    ["2096249890896822402", "2026-09-05T14:51:35.000Z", "アニメ × Kawaii MONSTER、全開👾🌈", "https://pbs.twimg.com/amplify_video_thumb/2096248777384583169/img/moASTs-Yx9zGiIPz.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2096248777384583169/vid/avc1/1920x1080/In0sFabamKIVd0zL.mp4?tag=29"],
    ["2095707346941190544", "2026-09-04T02:55:42.000Z", "MiniMax H3で創る、", "https://pbs.twimg.com/amplify_video_thumb/2095706251657465856/img/BlFrMNNWLxiZcwNp.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2095706251657465856/vid/avc1/1920x1080/YuyG8CCKo-WAz8WQ.mp4?tag=29"],
    ["2095525725671653858", "2026-09-03T14:54:00.000Z", "「文字」が、幻想世界への入口になる。", "https://pbs.twimg.com/amplify_video_thumb/2095522117689450496/img/KOJ-_6dDNTzqHfLw.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2095522117689450496/vid/avc1/1920x1080/34K5_-uoVcyX1qnf.mp4?tag=29"],
    ["2095503319158714831", "2026-09-03T13:24:58.000Z", "MiniMax H3で創る", "https://pbs.twimg.com/amplify_video_thumb/2095502773072924672/img/PSfFgskea48ok-j2.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2095502773072924672/vid/avc1/1920x1080/ZE09xRwx8nTeZz33.mp4?tag=29"],
    ["2094802388637167642", "2026-09-01T14:59:43.000Z", "Seedance 2.5で", "https://pbs.twimg.com/amplify_video_thumb/2094801524820201473/img/FKnfUci3ofzwi3Rw.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2094801524820201473/vid/avc1/1920x1080/kxoLuGRWJ530mDVJ.mp4?tag=29"],
    ["2094761575299334503", "2026-09-01T12:17:32.000Z", "MiniMax H3で", "https://pbs.twimg.com/amplify_video_thumb/2094760475934519296/img/8_P7tQmIrGDJkkms.jpg?format=jpg&name=large", "https://video-s.twimg.com/amplify_video/2094760475934519296/vid/avc1/2560x1440/GfEoEKXmJwglZ_Dp.mp4?tag=29"]
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
})();
