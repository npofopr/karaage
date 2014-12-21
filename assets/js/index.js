// Set `src` attribute based on the result of Modernizr.webp
// <img data-jpg="image.jpg" data-webp="image.webp" id="myimg" alt="My image">
//.webp .container { background-image: url('image.webp'); }
// .no-webp .container { background-image: url('image.jpg'); }
	/*Modernizr.on('webp', function (result) {
	  var img = document.getElementById('myimg');
	  if (result) {
	    img.src = img.getAttribute('data-webp');
	  }
	  else {
	    img.src = img.getAttribute('data-jpg');
	  }
	});*/

// квадратные блоки
$(document).ready(function () {
    updateContainer();
    $(window).resize(function() {
        updateContainer();
    });
});
function updateContainer() {
    var $containerWidth = $(window).width();
    if ($containerWidth <= 767) {
        var cw = $('.pair_box').width();
        $('.pair_box').css({
            'height': cw + 'px'
        });
    }
}

/*$(window).load(function() {
});*/

$(document).ready(function() {

	if(!Modernizr.svg) {
	  $('img[src*="svg"]').attr('src', function() {
	    return $(this).attr('src').replace('.svg', '.png');
	  });
	}

    /* Вешаем событие прокрутки на все якоря (#) на странице
    https://gist.github.com/Neolot/3964361 */
    $('.scroll_link[href^="#"]').bind('click.smoothscroll', function (e) {
        e.preventDefault();
        var target = this.hash,
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop':$target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    });

    /*$(".sidebar_menu .badge").width($(".badge").width());*/

});

/*$(window).resize(function(){

	if ($(window).width() <= 768){
		//
	} else {
		$('.table-hovered').columnHover({eachCell:true, hoverClass:'betterhover'});
	}

});*/
