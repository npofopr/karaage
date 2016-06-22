// Как обычно решается проблема со скроллом в картах (2gis, YaM, GMap) при прокрутке страницы, чтобы скролл не тормозил на карте?
//
// Стоит для начала попробовать pointer-events: none, наверное
//
// @alexey.m.ukolov: рахмет. сделал так (SO):
var body = document.body;
var timer;

window.addEventListener('scroll', function() {
	clearTimeout(timer);
	if (!body.classList.contains('_disable-hover')) {
		body.classList.add('_disable-hover');
	}

	timer = setTimeout(function() {
		body.classList.remove('_disable-hover');
	}, 300);
}, false);
