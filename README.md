# Gulp JS

sudo npm install -g

npm install

gulp для разработки

gulp clean для очистки папки ./build/

gulp build для сборки

npm i --save-dev autoprefixer-core bin-wrapper browser-sync css-mqpacker gulp gulp-bump gulp-copy gulp-filesize gulp-htmlhint gulp-imagemin gulp-jade gulp-newer gulp-notify gulp-postcss gulp-rename gulp-rev-append gulp-rigger gulp-sourcemaps gulp-uglify gulp-uncss gulp-update gulp-util gulp-watch imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-pngquant postcss postcss-center postcss-clearfix postcss-color-short postcss-discard-duplicates postcss-discard-empty postcss-focus postcss-minify-font-weight postcss-nested postcss-pxtorem postcss-short postcss-size postcss-svg-fallback precss rimraf

cssnano cssnext

### HTML&CSS

gulp-uncss — лучшее решение для оптимизации CSS файлов. Плагин анализирует HTML код и находит все неиспользуемые и продублированные стили.

gulp-csso — отличный CSS минификатор.

gulp-csslint — CSS линтер. 

gulp-htmlhint — HTML валидатор

### JavaScript

gulp-modernizr — помогает составить правильную архитектуру проекта на основе Modernizr.js в зависимости от возможностей браузера.

+gulp-uglify — JavaScript компрессор. 

+gulp-concat — конкатенация файлов.

### Графика

gulpicon — ценный плагин, который позволяет генерировать спрайты из SVG, переводить их в PNG, записывать все Data URI и подключать нужный формат в зависимости от возможностей браузера.

gulp-iconfont — великолепный плагин для работы с веб-шрифтами. Умеет создавать WOFF, WOFF2, EOT, TTF файлы из SVG.

gulp-responsive — простой способ сгенерировать адаптивные изображения под требуемые разрешения устройств с указанием соответствующих префиксов в наименовании.

gulp-sharp — самый быстрый модуль для работы с JPEG, PNG, WebP и TIFF изображениями. Плагин умеет изменять размер, ориентацию, фон, альфа-канал и многое другое.

gulp-spritesmith — автоматическая генерация спрайтов.

### Разное

+gulp-notify — выводит ошибки при сборке Gulp в виде системных сообщений, а главное то, что работает для разных операционных систем.

gulp-release — позволяет управлять версиями в вашем проекте.

gulp-bump — следит за репозиторием и обновляет package.json и 

gulp-update, который обновляет сами пакеты.

gulp-duration — отображает время выполнения тасков.

+gulp-newer — запускают таски только для изменившихся файлов.

gulp-zip — архивирует папки и файлы.

+gulp-copy — соответственно копируют указанные исходники.

+gulp-filesize — отображает размеры файлов в удобном для чтения формате.






{
  "name": "Gulp-frontend",
  "version": "3.0.0",
  "description": "Gulp boilerplate for html+js+css",
  "author": "Vladislav Altyncev",
  "repository": {
	"type": "git",
	"url": "https://github.com/npofopr/my-gulpfile"
  },
  "devDependencies": {
	"autoprefixer-core": "^5.2.1",
	"bin-wrapper": "^3.0.2",
	"browser-sync": "^2.8.2",
	"css-mqpacker": "^4.0.0",
	"cssnano": "^2.6.1",
	"cssnext": "^1.8.4",
	"gulp": "^3.9.0",
	"gulp-bump": "^0.3.1",
	"gulp-copy": "0.0.2",
	"gulp-csso": "^1.0.0",
	"gulp-filesize": "0.0.6",
	"gulp-htmlhint": "^0.3.0",
	"gulp-imagemin": "^2.3.0",
	"gulp-jade": "^1.1.0",
	"gulp-newer": "^0.5.1",
	"gulp-notify": "^2.2.0",
	"gulp-postcss": "^6.0.0",
	"gulp-rename": "^1.2.0",
	"gulp-rev-append": "^0.1.6",
	"gulp-rigger": "^0.5.8",
	"gulp-sourcemaps": "^1.5.2",
	"gulp-uglify": "^1.4.0",
	"gulp-uncss": "^1.0.1",
	"gulp-update": "0.0.2",
	"gulp-util": "^3.0.6",
	"gulp-watch": "^4.3.5",
	"imagemin-gifsicle": "^4.2.0",
	"imagemin-jpegtran": "^4.3.0",
	"imagemin-optipng": "^4.3.0",
	"imagemin-pngquant": "^4.2.0",
	"postcss": "^5.0.3",
	"postcss-at2x": "^1.2.0",
	"postcss-center": "^1.0.0",
	"postcss-clearfix": "^0.2.0",
	"postcss-color-short": "^0.2.0",
	"postcss-discard-comments": "^1.2.1",
	"postcss-discard-duplicates": "^1.1.5",
	"postcss-discard-empty": "^1.1.2",
	"postcss-focus": "^1.0.0",
	"postcss-import": "^5.2.2",
	"postcss-media-minmax": "^1.1.0",
	"postcss-merge-rules": "^1.2.2",
	"postcss-minify-font-weight": "^1.0.1",
	"postcss-mixins": "^0.1.1",
	"postcss-nested": "^1.0.0",
	"postcss-pxtorem": "^3.0.0",
	"postcss-short": "^0.3.0",
	"postcss-simple-vars": "^0.2.4",
	"postcss-size": "^1.0.0",
	"postcss-svg-fallback": "^1.0.2",
	"precss": "^0.3.0",
	"rimraf": "^2.4.3"
  }
}
