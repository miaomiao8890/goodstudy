//remove disabled attr in input
function activeForm() {
  $(".input-wide:disbaled").prop("disbaled", false);
}

$(function() {
  $(".back-to-store-index").on('click', function(e) {
    window.open("{{ url_for('store.index') }}", '_self');
  });

  $(".back-to-index").on('click', function(e) {
    window.open("{{ url_for('index') }}", '_self');
  });

  $("#main").on("click", function (e) {
    e.stopPropagation();
    if($(".main-mask")) {
      $("#main").removeClass("main-mask")
      $("#redeem-panel").css("top", "100%");
      // $("body").css({overflow: "auto", background: "#FFFFFF"});
      $("body").removeAttr("style");
    }
  })

  $("#redeem-panel-size-list ul li").on("click", function(e) {
    e.stopPropagation();
    if($('.size-selected'))
      $('.size-selected').removeClass('size-selected');
    $(this).addClass("size-selected");
    $('#redeem-panel-button').removeClass('redeem-button-inactive');
    $('#redeem-panel-button').addClass('redeem-button-active');
  })
});
