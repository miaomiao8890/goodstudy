function updateUserinfo() {
  $.get(
    '{{ url_for('apis.userinfo') }}', function(data) {
        var balance = parseInt(data.balance, 10);
        $('#user-balance').text(balance);
  });
}

function isClientSendingPing() {
    var _userinfo = OupengBrowser.getUserInfo();
    if (_userinfo) {
        var v = JSON.parse(_userinfo);
        return v.pending_credit ? true: false;
    }
    return false;
}

$(function(){
  {% if signable %}
  var signed = false;
  $("#sign_btn").click(function(){
    if (signed) {
        return;
    }

    signed = true;
    OupengBrowser.logEvt("USERCENTER_CHECK_IN",""); // 签到次数统计
    $.ajax({
      type: 'POST',
      data: { "_csrf_token": "{{ csrf_token() }}" },
      url: '{{ url_for('store.sign') }}',
      success: function(data) {
        if (data.success) {
          $('#credit-got-by-sign').text('+' + data.credit);
          showDiv();
          var credit = $('#user-balance').text();
          var new_balance = parseInt(data.new_balance, 10);
          $('#user-balance').text(new_balance);
          $('#sign-desc').html("已签到" + data.days + "天" + "<span>明日可领取" + data.credits + "积分</span>");
          $("#div_sign_btn").removeClass("signable-btn");
          $('#sign-icon').hide();
          signed = true;
        } else {
          signed = false;
          OupengBrowser.showToastMessage(data.reason);
        };
      },
      error: function(xhr, type) {
        signed = false;
        OupengBrowser.showToastMessage("签到失败");
      }
    });
  });

  function showDiv(){
    var coverDiv = $("#cover"),
      floatDiv = $(".credit-float"),
      floatDivWidth = floatDiv.width();
    var clientHeight = $(window).height();
    var documentHeight = $(document).height();
    var top = (clientHeight - floatDivWidth)>0 ? (clientHeight - floatDivWidth)/2:0;
    floatDiv.css({height:floatDivWidth+"px",top:top+"px",lineHeight:floatDivWidth+"px"}).addClass("zoomIn").show();
    setTimeout(function(){floatDiv.removeClass("zoomIn").addClass("zoomOut")},500);
    setTimeout(function(){floatDiv.hide();},2500);
  }
  {% endif %}

  /* 通用统计方法 */
  $(".statistics").click(function(){
      var key = this.getAttribute("key");
      OupengBrowser.logEvt(key, null);
  });

  //set avatar
  $("#avatar").click(function(){
    OupengBrowser.requestOpenPage('user-info-page', 0);
  });

  $("#name").click(function(){
      OupengBrowser.requestOpenPage('user-info-page', 0);
  });

  // bind phone
  $("#red-phone").click(function(){
      $.get("{{ url_for('apis.userinfo_clear') }}");
      OupengBrowser.requestOpenPage("infor-binding.html", 0);
  });

  // 红包分享
  $("#red-img").click(function(){
      {% set redp = config['REDPACKET_SHARE'] %}
      OupengBrowser.socialShare("{{ redp['title'] }}", "{{ redp['desc'] }}", "{{ redp['imgurl'] }}", "{{ redp['link'] }}");
      OupengBrowser.logEvt("USERCENTER_SHARE_CLICKED",""); // 分享统计
  });

  $("a.btn-login").click(function(){
    if (OupengBrowser.available) {
      OupengBrowser.requestOpenPage('login.html', 1);
    } else {
      window.location.href = 'oupeng://user/login';
    }
  });

  var credit = $("#pending_credit");//未登录时候的积分
  var _userinfo = OupengBrowser.getUserInfo();
  if (_userinfo) {
    var loginInfo = JSON.parse(_userinfo);
    credit.html(loginInfo.pending_credit);
  }

  // notify client to update user's avatar
  {% if g.user and g.user.avatar_url %}
  var obj = {};
  obj.avatar_url = "{{ g.user.avatar_url }}";
  OupengBrowser.updateUserInfoIfNeed(JSON.stringify(obj));
  {% endif %}

  var pingOk = false;
  for (var i=0;i<3;i++) {
    if (isClientSendingPing()) {
      setTimeout(function(){}, Math.pow(2, i) * 1000);
    } else {
      pingOk = true;
      break;
    }
  }
  if (pingOk) {
    updateUserinfo();
  }
});
