(function() {
'use strict';
angular.module('ngCropper', ['ng'])
.directive('ngCropper', ['$q', '$parse', function($q, $parse) {
  return {
    restrict: 'A',
    scope: {
      options: '=ngCropperOptions',
      proxy: '=ngCropperProxy', // Optional.
      showEvent: '=ngCropperShow',
      hideEvent: '=ngCropperHide'
    },
    link: function(scope, element, atts) {
      var shown = false;
      scope.$on(scope.showEvent, function() {
        if (shown) return;
        shown = true;
        preprocess(scope.options, element[0])
          .then(function(options) {
            setProxy(element);
            element.cropper(options);
          })
      });
      function setProxy(element) {
        if (!scope.proxy) return;
        var setter = $parse(scope.proxy).assign;
        setter(scope.$parent, element.cropper.bind(element));
      }
      scope.$on(scope.hideEvent, function() {
        if (!shown) return;
        shown = false;
        element.cropper('destroy');
      });
      scope.$watch('options.disabled', function(disabled) {
        if (!shown) return;
        if (disabled) element.cropper('disable');
        if (!disabled) element.cropper('enable');
      });
    }
  };
  function preprocess(options, img) {
    options = options || {};
    var result = $q.when(options); // No changes.
    if (options.maximize) {
      result = maximizeSelection(options, img);
    }
    return result;
  }
  function maximizeSelection(options, img) {
    return getRealSize(img).then(function(size) {
      options.data = size;
      return options;
    });
  }
  function getRealSize(img) {
    var defer = $q.defer();
    var size = {height: null, width: null};
    var image = new Image();
    image.onload = function() {
      defer.resolve({width: image.width, height: image.height});
    }
    image.src = img.src;
    return defer.promise;
  }
}])
.service('Cropper', ['$q', function($q) {
	var ex = 0;
  this.encode = function(blob) {
    var defer = $q.defer();
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(e) {
			var exifTMP = new Image()
			exifTMP.onload = function(e){
				EXIF.getData(e.target,function(){
					ex =  EXIF.getTag(this,'Orientation');
					defer.resolve(exifTMP.src);
				});
			}
			exifTMP.src = e.target.result;
    };
    return defer.promise;
  };
  this.decode = function(dataUrl) {
    var meta = dataUrl.split(';')[0];
    var type = meta.split(':')[1];
    var binary = atob(dataUrl.split(',')[1]);
    var array = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], {type: type});
  };
  this.crop = function(file, data) {
    var defer = $q.defer();
    this.encode(file).then(_createImage).then(function(image) {
      var canvasDATA = {width: 750,height: 750}
      var canvasIMG = createCanvas(canvasDATA);
      var contextIMG = canvasIMG.getContext('2d');
      var compressDATA = {height: canvasDATA.height/2, width: canvasDATA.width/2};
      // 分割截取部分图片为四份，分别处理，扩展处理图片上限为 2M * 2M 像素
      var imageTMP = []
			var dataTMP = 0;
			// 获取图像实际宽高
			var imageW=$('.cropper-container img')[0].width;
			var imageH=$('.cropper-container img')[0].height;
			// 根据旋转数据处理截图坐标系
			if(ex===6){
				dataTMP = imageH-data.width-data.x;
				data.x = data.y;
				data.y = dataTMP;
				dataTMP = data.width;
				data.width = data.height;
				data.height = dataTMP;
			}else if(ex===8){
				dataTMP = imageW-data.height-data.y;
				data.y = data.x;
				data.x = dataTMP;
				dataTMP = data.width;
				data.width = data.height;
				data.height = dataTMP;
			}else if(ex===3){
				data.x = imageW-data.width-data.x;
				data.y = imageH-data.height-data.y;
			}
			// 分割成四份分别截取对应部分
      for (var i=0; i<4; i++){
        var canvasTMP = createCanvas(compressDATA);
        var contextTMP = canvasTMP.getContext('2d');
        var cropX = data.x + (i%2)*data.width/2;
        var cropY = (i<2)?(data.y):(data.y+data.height/2);
				contextTMP.drawImage(
          image, cropX, cropY, data.width/2, data.height/2,
          0, 0, compressDATA.width, compressDATA.height
        );
        imageTMP[i] = canvasTMP.toDataURL(file.type, 1.0);
        removeElement(canvasTMP);
      }
      // 合并切割部分为整体
      _createImage(imageTMP[0]).then(function(img){
        contextIMG.drawImage(img,0,0);
        _createImage(imageTMP[1]).then(function(img){
          contextIMG.drawImage(img,compressDATA.width,0);
          _createImage(imageTMP[2]).then(function(img){
            contextIMG.drawImage(img,0,compressDATA.height);
            _createImage(imageTMP[3]).then(function(img){
              contextIMG.drawImage(img,compressDATA.width,compressDATA.height);
							// 整体旋转到正确的角度
              _createImage(canvasIMG.toDataURL(file.type, 0.8)).then(function(img){
								removeElement(canvasIMG);
								var canvasROTATE = createCanvas(canvasDATA);
								var contextROTATE = canvasROTATE.getContext('2d');
								contextROTATE.fillStyle = '#ffffff';
								contextROTATE.fillRect(0,0,canvasDATA.width,canvasDATA.height);
								switch (ex) {
                  case 3:
                    contextROTATE.rotate(180 * Math.PI / 180);
                    contextROTATE.drawImage(img, -canvasDATA.width, -canvasDATA.height, canvasDATA.width, canvasDATA.height);
                    break;
                  case 6:
                    contextROTATE.rotate(90 * Math.PI / 180);
                    contextROTATE.drawImage(img, 0, -canvasDATA.width, canvasDATA.height, canvasDATA.width);
                    break;
                  case 8:
                    contextROTATE.rotate(270 * Math.PI / 180);
                    contextROTATE.drawImage(img, -canvasDATA.height, 0, canvasDATA.height, canvasDATA.width);
                    break;

                  case 2:
                    contextROTATE.translate(canvasDATA.width, 0);
                    contextROTATE.scale(-1, 1);
                    contextROTATE.drawImage(img, 0, 0, canvasDATA.width, canvasDATA.height);
                    break;
                  case 4:
                    contextROTATE.translate(canvasDATA.width, 0);
                    contextROTATE.scale(-1, 1);
                    contextROTATE.rotate(180 * Math.PI / 180);
                    contextROTATE.drawImage(img, -canvasDATA.width, -canvasDATA.height, canvasDATA.width, canvasDATA.height);
                    break;
                  case 5:
                    contextROTATE.translate(canvasDATA.width, 0);
                    contextROTATE.scale(-1, 1);
                    contextROTATE.rotate(90 * Math.PI / 180);
                    contextROTATE.drawImage(img, 0, -canvasDATA.width, canvasDATA.height, canvasDATA.width);
                    break;
                  case 7:
                    contextROTATE.translate(canvasDATA.width, 0);
                    contextROTATE.scale(-1, 1);
                    contextROTATE.rotate(270 * Math.PI / 180);
                    contextROTATE.drawImage(img, -canvasDATA.height, 0, canvasDATA.height, canvasDATA.width);
                    break;
                  default:
                    contextROTATE.drawImage(img, 0, 0, canvasDATA.width, canvasDATA.height);
                }
								var RES = canvasROTATE.toDataURL(file.type, 0.8);
								defer.resolve(RES);
							});
            })
          })
        })
      })
    });
    return defer.promise;
  };
  function _createImage(source) {
    var defer = $q.defer();
    var image = new Image();
    image.onload = function(e) { defer.resolve(e.target); };
    image.src = source;
    return defer.promise;
  }
  function createCanvas(data) {
    var canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    return canvas;
  }
  function removeElement(el) {
    el.parentElement.removeChild(el);
  }
}]);
})();
