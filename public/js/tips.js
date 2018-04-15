 var tips = function(options){
    var cssHead = '<style id="jquery_tips_style" type="text/css">';
    var cssBody = `
    .tips-menu {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1000;
      display: none;
      float: left;
      min-width: 160px;
      padding: 5px 0;
      margin: 2px 0 0;
      font-size: 14px;
      text-align: left;
      list-style: none;
      background-color: #fff;
      -webkit-background-clip: padding-box;
              background-clip: padding-box;
      border: 1px solid #ccc;
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 4px;
      -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
              box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    }
    
    .tips-menu li a {
      display: block;
      padding: 6px 20px;
      clear: both;
      font-weight: normal;
      line-height: 1.42857143;
      color: #333;
      white-space: nowrap;
    }`;

    var cssFoot = '</style>';
        var defaults = {
            msg:'',
            time:2
        }
        var options = $.extend(defaults, options);
        if (!options.msg) {
            throw new Error('params error');
        }

        if (!$("#jquery_tips_style").length) {
            $(document.body).append(cssHead + cssBody + cssFoot);
        }

        console.log(cssHead + cssBody + cssFoot);
        console.log(options);

        if (!$("#tips").length) {

            var tipsDom = '<ul id="tips" class="tips-menu"><li><a>'+options.msg+'</a></li></ul>';

            $(document.body).append(tipsDom);
        }

        $("#tips").show();
        var timer = setTimeout(function () {
            $("#tips").hide();
            clearTimeout(timer);
        },options.time * 1000);
 };