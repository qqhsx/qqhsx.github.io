<!--崩溃欺骗-->
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         document.title = '(ˉ(∞)ˉ)主人,快回来呀~~';
         clearTimeout(titleTime);
     }
     else {
         document.title = '(๑>؂<๑)欢迎回来！' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });
