export default class Common{

    constructor() {

        var ua = navigator.userAgent;
        if((ua.indexOf('iPad') > 0 || ua.indexOf('iPhone') > 0|| ua.indexOf('iPod') > 0) || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
            $('head').prepend('<meta name="viewport" content="width=device-width,initial-scale=1">');
        } else {
            $('head').prepend('<meta name="viewport" content="width=1080">');
        }
        this.setupEvents();
        this.inlineSVG();
        this.setCssVariables();
    }

    setCssVariables() {
        // スマホならtrue, PCならfalse
        const isSP = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent)

        // 端末の種類をもとにCSS変数を定義
        // 端末がスマホなら
        if(isSP){
            // CSS変数 --outer-height に outerHeight px を代入
            document.documentElement.style.setProperty(
                '--screen-height',
                `${window.innerHeight}px`
            )
        }

    }

    setupEvents() {

        const _this = this;
        $(window).on("scroll", function() {
            _this.onScrollHandler();
        });

        $('a[href^="#"]').on("click", function(){
            Common.scrollToElem($(this).attr("href"));
            return false;
        });

    }

    setupShareLinks() {
        /********************************
         * Facebookシェア
         *********************************/

        $(".facebook-share").on("click", function () {
            var shareUrl = $(this).data("share-url");
            var target = encodeURIComponent(shareUrl);
            var url = "http://www.facebook.com/share.php?u=" + target;
            window.open(url, 'FBwindow', 'width=650, height=450, menubar=no, toolbar=no, scrollbars=yes'); // ga('send', 'event', 'header', 'Click', 'btn_sns_FB');

            return false;
        });



        /********************************
         * Twitterシェア
         *********************************/
        $(".twitter-share").on("click", function () {
            var shareUrl = $(this).data("share-url");
            var target = encodeURIComponent(shareUrl);
            var shareText = $(this).data("share-text");
            shareText = shareText.replace(/<BR>/g, "＼n");
            shareText = encodeURIComponent(shareText);

            if (shareUrl != "") {
                var url = "http://twitter.com/share?text=" + shareText + "&url=" + target;
            } else {
                var url = "http://twitter.com/intent/tweet?text=" + shareText;
            }

            window.open(url, 'TWwindow', 'width=550, height=350, menubar=no, toolbar=no, scrollbars=yes'); // ga('send', 'event', 'header', 'Click', 'btn_sns_TW');

            return false;
        });

        /********************************
         * Lineシェア
         *********************************/
        $(".line-share").on("click", function() {
            var shareUrl = $(this).data("share-url");
            var target = encodeURIComponent(shareUrl);
            var url = "https://timeline.line.me/social-plugin/share?url=" + target;
            window.open(url, 'LINEwindow', 'width=800, height=550, menubar=no, toolbar=no, scrollbars=yes');
            // ga('send', 'event', 'header', 'Click', 'btn_sns_TW');
            return false;
        });
    }

    // ------------------------------
    // UA･OS別にbodyにクラス付与
    // ------------------------------
    addBodyClassFromUserAgent() {
        // UserAgent
        var ua = window.navigator.userAgent.toLowerCase();

        // OS 判定＆処理
        if (navigator.userAgent.toLowerCase().indexOf('win') != -1) {
            // Windowsでの処理
        } else if (navigator.userAgent.toLowerCase().indexOf('mac') != -1) {
            // Macでの処理
            $('body').addClass('mac');
        }

        // UA 判定＆処理
        $('body').removeClass('ie');
        $('body').removeClass('edge');
        $('body').removeClass('chrome');
        $('body').removeClass('safari');
        $('body').removeClass('firefox');
        $('body').removeClass('android');
        if (ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1) {
            // IE
            $('body').addClass('ie');
        } else if (ua.indexOf('edge') != -1) {
            // Edge
            $('body').addClass('edge');
        } else if (ua.indexOf('android') != -1 && ua.indexOf('mobile') != -1) {
            // Android
            $('body').addClass('android');
        } else if (ua.indexOf('chrome') != -1) {
            // Chrome
            $('body').addClass('chrome');
        } else if (ua.indexOf('safari') != -1) {
            // Safari
            $('body').addClass('safari');
        } else if (ua.indexOf('firefox') != -1) {
            // FireFox
            $('body').addClass('firefox');
        }
    }



    inlineSVG() {
        $('img.svg').each(function () {
            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            $.get(imgURL, function (data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
                if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
                }


                if($img.attr("width")) {
                    $svg.css("width", $img.attr("width"));
                }

                if($img.attr("height")) {
                    $svg.css("height", $img.attr("height"));
                }

                if($img.hasClass("pc")) {
                    $svg.addClass("pc");
                }
                if($img.hasClass("sp")) {
                    $svg.addClass("sp");
                }

                // Replace image with new SVG
                $img.replaceWith($svg);
                $svg.css("display", "inline");
            }, 'xml');
        });
    }


    onScrollHandler() {

        const scrollTop    = $(window).scrollTop();
        const scrollBottom = $(window).scrollTop() + $(window).height();

    }


}

Common.canUseLocalStorage = function() {
    // Determine is localstarege usable.
    try {
        window.localStorage.setItem("kubota_fes_testValue", "testValue");
    } catch(e) {
        console.log(e);
        return false;
    }

    return true;

}

Common.scrollToElem = function(href) {
    var speed = 500;
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $("html, body").animate({scrollTop:position}, speed, "swing");
}
