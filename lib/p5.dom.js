(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.dom', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {

  p5.prototype.select = function (e, p) {
    var res = null;
    var container = getContainer(p);
    if (e[0] === '.'){
      e = e.slice(1);
      res = container.getElementsByClassName(e);
      if (res.length) {
        res = res[0];
      } else {
        res = null;
      }
    }else if (e[0] === '#'){
      e = e.slice(1);
      res = container.getElementById(e);
    }else {
      res = container.getElementsByTagName(e);
      if (res.length) {
        res = res[0];
      } else {
        res = null;
      }
    }
    if (res) {
      return wrapElement(res);
    } else {
      return null;
    }
  };

  
  p5.prototype.selectAll = function (e, p) {
    var arr = [];
    var res;
    var container = getContainer(p);
    if (e[0] === '.'){
      e = e.slice(1);
      res = container.getElementsByClassName(e);
    } else {
      res = container.getElementsByTagName(e);
    }
    if (res) {
      for (var j = 0; j < res.length; j++) {
        var obj = wrapElement(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };

  
  function getContainer(p) {
    var container = document;
    if (typeof p === 'string' && p[0] === '#'){
      p = p.slice(1);
      container = document.getElementById(p) || document;
    } else if (p instanceof p5.Element){
      container = p.elt;
    } else if (p instanceof HTMLElement){
      container = p;
    }
    return container;
  }

  
  function wrapElement(elt) {
    if(elt.tagName === "INPUT" && elt.type === "checkbox") {
      var converted = new p5.Element(elt);
      converted.checked = function(){
      if (arguments.length === 0){
        return this.elt.checked;
      } else if(arguments[0]) {
        this.elt.checked = true;
      } else {
        this.elt.checked = false;
      }
      return this;
      };
      return converted;
    } else if (elt.tagName === "VIDEO" || elt.tagName === "AUDIO") {
      return new p5.MediaElement(elt);
    } else {
      return new p5.Element(elt);
    }
  }

 
  p5.prototype.removeElements = function (e) {
    for (var i=0; i<this._elements.length; i++) {
      if (!(this._elements[i].elt instanceof HTMLCanvasElement)) {
        this._elements[i].remove();
      }
    }
  };

 
  function addElement(elt, pInst, media) {
    var node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    var c = media ? new p5.MediaElement(elt) : new p5.Element(elt);
    pInst._elements.push(c);
    return c;
  }

 
  var tags = ['div', 'p', 'span'];
  tags.forEach(function(tag) {
    var method = 'create' + tag.charAt(0).toUpperCase() + tag.slice(1);
    p5.prototype[method] = function(html) {
      var elt = document.createElement(tag);
      elt.innerHTML = typeof html === undefined ? "" : html;
      return addElement(elt, this);
    }
  });

 
  p5.prototype.createImg = function() {
    var elt = document.createElement('img');
    var args = arguments;
    var self;
    var setAttrs = function(){
      self.width = elt.offsetWidth;
      self.height = elt.offsetHeight;
      if (args.length > 1 && typeof args[1] === 'function'){
        self.fn = args[1];
        self.fn();
      }else if (args.length > 1 && typeof args[2] === 'function'){
        self.fn = args[2];
        self.fn();
      }
    };
    elt.src = args[0];
    if (args.length > 1 && typeof args[1] === 'string'){
      elt.alt = args[1];
    }
    elt.onload = function(){
      setAttrs();
    }
    self = addElement(elt, this);
    return self;
  };

  
  p5.prototype.createA = function(href, html, target) {
    var elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    return addElement(elt, this);
  };

  /** INPUT **/


  
  p5.prototype.createSlider = function(min, max, value, step) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (step) elt.step = step;
    if (typeof(value) === "number") elt.value = value;
    return addElement(elt, this);
  };

 
  p5.prototype.createButton = function(label, value) {
    var elt = document.createElement('button');
    elt.innerHTML = label;
    elt.value = value;
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  
  p5.prototype.createCheckbox = function() {
    var elt = document.createElement('div');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    elt.appendChild(checkbox);
    //checkbox must be wrapped in p5.Element before label so that label appears after
    var self = addElement(elt, this);
    self.checked = function(){
      var cb = self.elt.getElementsByTagName('input')[0];
      if (cb) {
        if (arguments.length === 0){
          return cb.checked;
        }else if(arguments[0]){
          cb.checked = true;
        }else{
          cb.checked = false;
        }
      }
      return self;
    };
    this.value = function(val){
      self.value = val;
      return this;
    };
    if (arguments[0]){
      var ran = Math.random().toString(36).slice(2);
      var label = document.createElement('label');
      checkbox.setAttribute('id', ran);
      label.htmlFor = ran;
      self.value(arguments[0]);
      label.appendChild(document.createTextNode(arguments[0]));
      elt.appendChild(label);
    }
    if (arguments[1]){
      checkbox.checked = true;
    }
    return self;
  };

  
  p5.prototype.createSelect = function(mult) {
    var elt = document.createElement('select');
    if (mult){
      elt.setAttribute('multiple', 'true');
    }
    var self = addElement(elt, this);
    self.option = function(name, value){
      var opt = document.createElement('option');
      opt.innerHTML = name;
      if (arguments.length > 1)
        opt.value = value;
      else
        opt.value = name;
      elt.appendChild(opt);
    };
    self.selected = function(value){
      var arr = [];
      if (arguments.length > 0){
        for (var i = 0; i < this.elt.length; i++){
          if (value.toString() === this.elt[i].value){
            this.elt.selectedIndex = i;
          }
        }
        return this;
      }else{
        if (mult){
          for (var i = 0; i < this.elt.selectedOptions.length; i++){
            arr.push(this.elt.selectedOptions[i].value);
          }
          return arr;
        }else{
          return this.elt.value;
        }
      }
    };
    return self;
  };

 
  p5.prototype.createRadio = function() {
    var radios = document.querySelectorAll("input[type=radio]");
    var count = 0;
    if(radios.length > 1){
      console.log(radios,radios[0].name);
      var length = radios.length;
      var prev=radios[0].name;
      var current = radios[1].name;
      count=1;
      for(var i = 1; i < length; i++ ){
        current = radios[i].name;
        if(prev != current){
          count++;
        }
        prev = current;
      }
    }
    else if (radios.length == 1){
      count = 1;
    }
    var elt = document.createElement('div');
    var self = addElement(elt, this);
    var times = -1;
    self.option = function(name, value){
      var opt = document.createElement('input');
      opt.type = 'radio';
      opt.innerHTML = name;
      if (arguments.length > 1)
        opt.value = value;
      else
        opt.value = name;
      opt.setAttribute('name',"defaultradio"+count);
      elt.appendChild(opt);
      if (name){
        times++;
        var ran = Math.random().toString(36).slice(2);
        var label = document.createElement('label');
        opt.setAttribute('id', "defaultradio"+count+"-"+times);
        label.htmlFor = "defaultradio"+count+"-"+times;
        label.appendChild(document.createTextNode(name));
        elt.appendChild(label);
      }
      return opt;
    };
    self.selected = function(){
      var length = this.elt.childNodes.length;
      if(arguments[0]) {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].value == arguments[0])
            this.elt.childNodes[i].checked = true;
        }
        return this;
      } else {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].checked == true)
            return this.elt.childNodes[i].value;
        }
      }
    };
    self.value = function(){
      var length = this.elt.childNodes.length;
      if(arguments[0]) {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].value == arguments[0])
            this.elt.childNodes[i].checked = true;
        }
        return this;
      } else {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].checked == true)
            return this.elt.childNodes[i].value;
        }
        return "";
      }
    };
    return self
  };

  
  p5.prototype.createInput = function(value) {
    var elt = document.createElement('input');
    elt.type = 'text';
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  
  p5.prototype.createFileInput = function(callback, multiple) {

    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Yup, we're ok and make an input file selector
      var elt = document.createElement('input');
      elt.type = 'file';

      // If we get a second argument that evaluates to true
      // then we are looking for multiple files
      if (multiple) {
        // Anything gets the job done
        elt.multiple = 'multiple';
      }

    
      function handleFileSelect(evt) {
        // These are the files
        var files = evt.target.files;
        // Load each one and trigger a callback
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          var reader = new FileReader();
          function makeLoader(theFile) {
            // Making a p5.File object
            var p5file = new p5.File(theFile);
            return function(e) {
              p5file.data = e.target.result;
              callback(p5file);
            };
          };
          reader.onload = makeLoader(f);

          
          if (f.type.indexOf('text') > -1) {
            reader.readAsText(f);
          } else {
            reader.readAsDataURL(f);
          }
        }
      }

     
      elt.addEventListener('change', handleFileSelect, false);
      return addElement(elt, this);
    } else {
      console.log('The File APIs are not fully supported in this browser. Cannot create element.');
    }
  };


 

  function createMedia(pInst, type, src, callback) {
    var elt = document.createElement(type);

  
    var src = src || '';
    if (typeof src === 'string') {
      src = [src];
    }
    for (var i=0; i<src.length; i++) {
      var source = document.createElement('source');
      source.src = src[i];
      elt.appendChild(source);
    }
    if (typeof callback !== 'undefined') {
      var callbackHandler = function() {
        callback();
        elt.removeEventListener('canplaythrough', callbackHandler);
      }
      elt.addEventListener('canplaythrough', callbackHandler);
    }

    var c = addElement(elt, pInst, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      c.width = elt.videoWidth;
      c.height = elt.videoHeight;
      // set elt width and height if not set
      if (c.elt.width === 0) c.elt.width = elt.videoWidth;
      if (c.elt.height === 0) c.elt.height = elt.videoHeight;
      c.loadedmetadata = true;
    });

    return c;
  }
  
  p5.prototype.createVideo = function(src, callback) {
    return createMedia(this, 'video', src, callback);
  };

  
  p5.prototype.createAudio = function(src, callback) {
    return createMedia(this, 'audio', src, callback);
  };


  /** CAMERA STUFF **/

  p5.prototype.VIDEO = 'video';
  p5.prototype.AUDIO = 'audio';

  navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;


  p5.prototype.createCapture = function() {
    var useVideo = true;
    var useAudio = true;
    var constraints;
    var cb;
    for (var i=0; i<arguments.length; i++) {
      if (arguments[i] === p5.prototype.VIDEO) {
        useAudio = false;
      } else if (arguments[i] === p5.prototype.AUDIO) {
        useVideo = false;
      } else if (typeof arguments[i] === 'object') {
        constraints = arguments[i];
      } else if (typeof arguments[i] === 'function') {
        cb = arguments[i];
      }
    }

    if (navigator.getUserMedia) {
      var elt = document.createElement('video');

      if (!constraints) {
        constraints = {video: useVideo, audio: useAudio};
      }

      navigator.getUserMedia(constraints, function(stream) {
        elt.src = window.URL.createObjectURL(stream);
          if (cb) {
            cb(stream);
          }
      }, function(e) { console.log(e); });
    } else {
      throw 'getUserMedia not supported in this browser';
    }
    var c = addElement(elt, this, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      elt.play();
      c.width = elt.videoWidth = elt.width;
      c.height = elt.videoHeight = elt.height;
      c.loadedmetadata = true;
    });
    return c;
  };

  
  p5.prototype.createElement = function(tag, content) {
    var elt = document.createElement(tag);
    if (typeof content !== 'undefined') {
      elt.innerHTML = content;
    }
    return addElement(elt, this);
  };



  p5.Element.prototype.addClass = function(c) {
    if (this.elt.className) {
      // PEND don't add class more than once
      //var regex = new RegExp('[^a-zA-Z\d:]?'+c+'[^a-zA-Z\d:]?');
      //if (this.elt.className.search(/[^a-zA-Z\d:]?hi[^a-zA-Z\d:]?/) === -1) {
      this.elt.className = this.elt.className+' '+c;
      //}
    } else {
      this.elt.className = c;
    }
    return this;
  }


  p5.Element.prototype.removeClass = function(c) {
    var regex = new RegExp('(?:^|\\s)'+c+'(?!\\S)');
    this.elt.className = this.elt.className.replace(regex, '');
    this.elt.className = this.elt.className.replace(/^\s+|\s+$/g, ""); //prettify (optional)
    return this;
  }

  
  p5.Element.prototype.child = function(c) {
    if (c === null){
      return this.elt.childNodes
    }
    if (typeof c === 'string') {
      if (c[0] === '#') {
        c = c.substring(1);
      }
      c = document.getElementById(c);
    } else if (c instanceof p5.Element) {
      c = c.elt;
    }
    this.elt.appendChild(c);
    return this;
  };

  
  p5.Element.prototype.center = function(align) {
    var style = this.elt.style.display;
    var hidden = this.elt.style.display === 'none';
    var parentHidden = this.parent().style.display === 'none';
    var pos = { x : this.elt.offsetLeft, y : this.elt.offsetTop };

    if (hidden) this.show();

    this.elt.style.display = 'block';
    this.position(0,0);

    if (parentHidden) this.parent().style.display = 'block';

    var wOffset = Math.abs(this.parent().offsetWidth - this.elt.offsetWidth);
    var hOffset = Math.abs(this.parent().offsetHeight - this.elt.offsetHeight);
    var y = pos.y;
    var x = pos.x;

    if (align === 'both' || align === undefined){
      this.position(wOffset/2, hOffset/2);
    }else if (align === 'horizontal'){
      this.position(wOffset/2, y);
    }else if (align === 'vertical'){
      this.position(x, hOffset/2);
    }

    this.style('display', style);

    if (hidden) this.hide();

    if (parentHidden) this.parent().style.display = 'none';

    return this;
  };

  
  p5.Element.prototype.html = function(html) {
    if (typeof html !== 'undefined') {
      this.elt.innerHTML = html;
      return this;
    } else {
      return this.elt.innerHTML;
    }
  };

 
  p5.Element.prototype.position = function() {
    if (arguments.length === 0){
      return { 'x' : this.elt.offsetLeft , 'y' : this.elt.offsetTop };
    }else{
      this.elt.style.position = 'absolute';
      this.elt.style.left = arguments[0]+'px';
      this.elt.style.top = arguments[1]+'px';
      this.x = arguments[0];
      this.y = arguments[1];
      return this;
    }
  };

  /* Helper method called by p5.Element.style() */
  p5.Element.prototype._translate = function(){
    this.elt.style.position = 'absolute';
    // save out initial non-translate transform styling
    var transform = '';
    if (this.elt.style.transform) {
      transform = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      transform = transform.replace(/translate[X-Z]?\(.*\)/g, '');
    }
    if (arguments.length === 2) {
      this.elt.style.transform = 'translate('+arguments[0]+'px, '+arguments[1]+'px)';
    } else if (arguments.length > 2) {
      this.elt.style.transform = 'translate3d('+arguments[0]+'px,'+arguments[1]+'px,'+arguments[2]+'px)';
      if (arguments.length === 3) {
        this.elt.parentElement.style.perspective = '1000px';
      } else {
        this.elt.parentElement.style.perspective = arguments[3]+'px';
      }
    }
    // add any extra transform styling back on end
    this.elt.style.transform += transform;
    return this;
  };

  /* Helper method called by p5.Element.style() */
  p5.Element.prototype._rotate = function(){
    // save out initial non-rotate transform styling
    var transform = '';
    if (this.elt.style.transform) {
      var transform = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      transform = transform.replace(/rotate[X-Z]?\(.*\)/g, '');
    }

    if (arguments.length === 1){
      this.elt.style.transform = 'rotate('+arguments[0]+'deg)';
    }else if (arguments.length === 2){
      this.elt.style.transform = 'rotate('+arguments[0]+'deg, '+arguments[1]+'deg)';
    }else if (arguments.length === 3){
      this.elt.style.transform = 'rotateX('+arguments[0]+'deg)';
      this.elt.style.transform += 'rotateY('+arguments[1]+'deg)';
      this.elt.style.transform += 'rotateZ('+arguments[2]+'deg)';
    }
    // add remaining transform back on
    this.elt.style.transform += transform;
    return this;
  };

  
  p5.Element.prototype.style = function(prop, val) {
    var self = this;

    if (val instanceof p5.Color) {
      val = 'rgba(' + val.levels[0] + ',' + val.levels[1] + ',' + val.levels[2] + ',' + val.levels[3]/255 + ')'
    }

    if (typeof val === 'undefined') {
      if (prop.indexOf(':') === -1) {
        var styles = window.getComputedStyle(self.elt);
        var style = styles.getPropertyValue(prop);
        return style;
      } else {
        var attrs = prop.split(';');
        for (var i = 0; i < attrs.length; i++) {
          var parts = attrs[i].split(':');
          if (parts[0] && parts[1]) {
            this.elt.style[parts[0].trim()] = parts[1].trim();
          }
        }
      }
    } else {
      if (prop === 'rotate' || prop === 'translate' || prop === 'position'){
        var trans = Array.prototype.shift.apply(arguments);
        var f = this[trans] || this['_'+trans];
        f.apply(this, arguments);
      } else {
        this.elt.style[prop] = val;
        if (prop === 'width' || prop === 'height' || prop === 'left' || prop === 'top') {
          var numVal = val.replace(/\D+/g, '');
          this[prop] = parseInt(numVal, 10); // pend: is this necessary?
        }
      }
    }
    return this;
  };


  
  p5.Element.prototype.attribute = function(attr, value) {
    if (typeof value === 'undefined') {
      return this.elt.getAttribute(attr);
    } else {
      this.elt.setAttribute(attr, value);
      return this;
    }
  };


  
  p5.Element.prototype.value = function() {
    if (arguments.length > 0) {
      this.elt.value = arguments[0];
      return this;
    } else {
      if (this.elt.type === 'range') {
        return parseFloat(this.elt.value);
      }
      else return this.elt.value;
    }
  };

  
  p5.Element.prototype.show = function() {
    this.elt.style.display = 'block';
    return this;
  };

  
  p5.Element.prototype.hide = function() {
    this.elt.style.display = 'none';
    return this;
  };

  
  p5.Element.prototype.size = function(w, h) {
    if (arguments.length === 0){
      return { 'width' : this.elt.offsetWidth , 'height' : this.elt.offsetHeight };
    }else{
      var aW = w;
      var aH = h;
      var AUTO = p5.prototype.AUTO;
      if (aW !== AUTO || aH !== AUTO) {
        if (aW === AUTO) {
          aW = h * this.width / this.height;
        } else if (aH === AUTO) {
          aH = w * this.height / this.width;
        }
        // set diff for cnv vs normal div
        if (this.elt instanceof HTMLCanvasElement) {
          var j = {};
          var k  = this.elt.getContext('2d');
          for (var prop in k) {
            j[prop] = k[prop];
          }
          this.elt.setAttribute('width', aW * this._pInst._pixelDensity);
          this.elt.setAttribute('height', aH * this._pInst._pixelDensity);
          this.elt.setAttribute('style', 'width:' + aW + 'px; height:' + aH + 'px');
          this._pInst.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);
          for (var prop in j) {
            this.elt.getContext('2d')[prop] = j[prop];
          }
        } else {
          this.elt.style.width = aW+'px';
          this.elt.style.height = aH+'px';
          this.elt.width = aW;
          this.elt.height = aH;
          this.width = aW;
          this.height = aH;
        }

        this.width = this.elt.offsetWidth;
        this.height = this.elt.offsetHeight;

        if (this._pInst) { // main canvas associated with p5 instance
          if (this._pInst._curElement.elt === this.elt) {
            this._pInst._setProperty('width', this.elt.offsetWidth);
            this._pInst._setProperty('height', this.elt.offsetHeight);
          }
        }
      }
      return this;
    }
  };

  
  p5.Element.prototype.remove = function() {
    
    for (var ev in this._events) {
      this.elt.removeEventListener(ev, this._events[ev]);
    }
    if (this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
    delete(this);
  };




  p5.MediaElement = function(elt, pInst) {
    p5.Element.call(this, elt, pInst);

    var self = this;
    this.elt.crossOrigin = 'anonymous';

    this._prevTime = 0;
    this._cueIDCounter = 0;
    this._cues = [];
    this._pixelDensity = 1;

    
    Object.defineProperty(self, 'src', {
      get: function() {
        var firstChildSrc = self.elt.children[0].src;
        var srcVal = self.elt.src === window.location.href ? '' : self.elt.src;
        var ret = firstChildSrc === window.location.href ? srcVal : firstChildSrc;
        return ret;
      },
      set: function(newValue) {
        for (var i = 0; i < self.elt.children.length; i++) {
          self.elt.removeChild(self.elt.children[i]);
        }
        var source = document.createElement('source');
        source.src = newValue;
        elt.appendChild(source);
        self.elt.src = newValue;
      },
    });

   
    self._onended = function() {};
    self.elt.onended = function() {
      self._onended(self);
    }
  };
  p5.MediaElement.prototype = Object.create(p5.Element.prototype);

 
  p5.MediaElement.prototype.play = function() {
    if (this.elt.currentTime === this.elt.duration) {
      this.elt.currentTime = 0;
    }

    if (this.elt.readyState > 1) {
      this.elt.play();
    } else {
      
      this.elt.load();
      this.elt.play();
    }
    return this;
  };

 
  p5.MediaElement.prototype.stop = function() {
    this.elt.pause();
    this.elt.currentTime = 0;
    return this;
  };

 
  p5.MediaElement.prototype.pause = function() {
    this.elt.pause();
    return this;
  };

 
  p5.MediaElement.prototype.loop = function() {
    this.elt.setAttribute('loop', true);
    this.play();
    return this;
  };
  
  p5.MediaElement.prototype.noLoop = function() {
    this.elt.setAttribute('loop', false);
    return this;
  };


  
  p5.MediaElement.prototype.autoplay = function(val) {
    this.elt.setAttribute('autoplay', val);
    return this;
  };

 
  p5.MediaElement.prototype.volume = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.volume;
    } else {
      this.elt.volume = val;
    }
  };

  
  p5.MediaElement.prototype.speed = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.playbackRate;
    } else {
      this.elt.playbackRate = val;
    }
  };

 
  p5.MediaElement.prototype.time = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.currentTime;
    } else {
      this.elt.currentTime = val;
    }
  };

  
  p5.MediaElement.prototype.duration = function() {
    return this.elt.duration;
  };
  p5.MediaElement.prototype.pixels = [];
  p5.MediaElement.prototype.loadPixels = function() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.drawingContext = this.canvas.getContext('2d');
    }
    if (this.loadedmetadata) { // wait for metadata 
      if (this.canvas.width !== this.elt.width) {
        this.canvas.width = this.elt.width;
        this.canvas.height = this.elt.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
      }
      this.drawingContext.drawImage(this.elt, 0, 0, this.canvas.width, this.canvas.height);
      p5.Renderer2D.prototype.loadPixels.call(this);
    }
    return this;
  }
  p5.MediaElement.prototype.updatePixels =  function(x, y, w, h){
    if (this.loadedmetadata) { // wait for metadata
      p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
    }
    return this;
  }
  p5.MediaElement.prototype.get = function(x, y, w, h){
    if (this.loadedmetadata) { // wait for metadata
      return p5.Renderer2D.prototype.get.call(this, x, y, w, h);
    } else if (!x) {
      return new p5.Image(1, 1);
    } else {
      return [0, 0, 0, 255];
    }
  };
  p5.MediaElement.prototype.set = function(x, y, imgOrCol){
    if (this.loadedmetadata) { // wait for metadata
      p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
    }
  };
 
  p5.MediaElement.prototype.onended = function(callback) {
    this._onended = callback;
    return this;
  };


  
  p5.MediaElement.prototype.connect = function(obj) {
    var audioContext, masterOutput;

    
    if (typeof p5.prototype.getAudioContext === 'function') {
      audioContext = p5.prototype.getAudioContext();
      masterOutput = p5.soundOut.input;
    } else {
      try {
        audioContext = obj.context;
        masterOutput = audioContext.destination
      } catch(e) {
        throw 'connect() is meant to be used with Web Audio API or p5.sound.js'
      }
    }

 
    if (!this.audioSourceNode) {
      this.audioSourceNode = audioContext.createMediaElementSource(this.elt);

      
      this.audioSourceNode.connect(masterOutput);
    }

    
    if (obj) {
      if (obj.input) {
        this.audioSourceNode.connect(obj.input);
      } else {
        this.audioSourceNode.connect(obj);
      }
    }

  
    else {
      this.audioSourceNode.connect(masterOutput);
    }

  };

 
  p5.MediaElement.prototype.disconnect = function() {
    if (this.audioSourceNode) {
      this.audioSourceNode.disconnect();
    } else {
      throw 'nothing to disconnect';
    }
  };


  
  p5.MediaElement.prototype.showControls = function() {
    // must set style for the element to show on the page
    this.elt.style['text-align'] = 'inherit';
    this.elt.controls = true;
  };

  
  p5.MediaElement.prototype.hideControls = function() {
    this.elt.controls = false;
  };

 
  p5.MediaElement.prototype.addCue = function(time, callback, val) {
    var id = this._cueIDCounter++;

    var cue = new Cue(callback, time, id, val);
    this._cues.push(cue);

    if (!this.elt.ontimeupdate) {
      this.elt.ontimeupdate = this._onTimeUpdate.bind(this);
    }

    return id;
  };

 
  p5.MediaElement.prototype.removeCue = function(id) {
    for (var i = 0; i < this._cues.length; i++) {
      var cue = this._cues[i];
      if (cue.id === id) {
        this.cues.splice(i, 1);
      }
    }

    if (this._cues.length === 0) {
      this.elt.ontimeupdate = null
    }
  };

  
  p5.MediaElement.prototype.clearCues = function() {
    this._cues = [];
    this.elt.ontimeupdate = null;
  };

 
  p5.MediaElement.prototype._onTimeUpdate = function() {
    var playbackTime = this.time();

    for (var i = 0 ; i < this._cues.length; i++) {
      var callbackTime = this._cues[i].time;
      var val = this._cues[i].val;


      if (this._prevTime < callbackTime && callbackTime <= playbackTime) {

        
        this._cues[i].callback(val);
      }

    }

    this._prevTime = playbackTime;
  };



  var Cue = function(callback, time, id, val) {
    this.callback = callback;
    this.time = time;
    this.id = id;
    this.val = val;
  };


  p5.File = function(file, pInst) {
  
    this.file = file;

    this._pInst = pInst;

  
    var typeList = file.type.split('/');
   
    this.type = typeList[0];
    
    this.subtype = typeList[1];
    
    this.name = file.name;
   
    this.size = file.size;

   this.data = undefined;
  };

}));
