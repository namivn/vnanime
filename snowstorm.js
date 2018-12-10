/** @gi?y ph�p
 * B�o tuy?t DHTML! Snow d?a tr�n JavaScript cho c�c trang web
 * ------------------------------------------------- -------
 * Phi�n b?n 1.42.20111120 (Phi�n b?n tru?c: 1.41.20101113)
 * B?n quy?n (c) 2007, Scott Schiller. �� dang k� B?n quy?n.
 * M� du?c cung c?p theo Gi?y ph�p BSD:
 * http://schillmania.com/projects/snowstorm/license.txt
 * /

/ * c?a s? to�n c?u, t�i li?u, hoa ti�u, ClearInterval, setInterval * /
/ * jslint tr?ng: false, onevar: true, plusplus: false, undef: true, nomen: true, eqeqeq: true, bitwise: true, regrec: true, newcap: true, t?c: true * /

var snowStorm = (h�m (c?a s?, t�i li?u) {

  // --- t�i s?n chung ---

  this .flakesMax = 128; // Gi?i h?n t?ng lu?ng tuy?t t?o ra (roi + d�nh)
  this .flakesMaxActive = 64; // H?n ch? lu?ng tuy?t roi c�ng m?t l�c (�t hon = s? d?ng CPU th?p hon)
  this .animationInterval = 33; // �o lu?ng "miliseconds tr�n khung" l� thuy?t. 20 = nhanh + mu?t m�, nhung s? d?ng CPU cao. 50 = b?o th? hon, nhung ch?m hon
  this .excludeMobile = true; // Tuy?t c� th? l� tin x?u cho CPU (v� pin c?a di?n tho?i di d?ng.) Theo m?c d?nh, h�y th?t tuy?t.
  this .flowerBottom = null; // S? nguy�n cho gi?i h?n tuy?t tr?c Y, 0 ho?c null cho hi?u ?ng tuy?t "to�n m�n h�nh"
  this .followMouse = true; // Chuy?n d?ng c?a tuy?t c� th? d�p ?ng v?i chu?t c?a ngu?i d�ng
  this.snowColor = '#fff'; // Kh�ng an (ho?c s? d?ng?) Tuy?t v�ng.
  this.snowCharacter = '& bull;'; // & b�; = vi�n d?n, & trung gian; l� h�nh vu�ng tr�n m?t s? h? th?ng, vv
  this.snowStick = true; // C� hay kh�ng tuy?t n�n "d�nh" ? ph�a du?i. Khi t?t, s? kh�ng bao gi? thu th?p.
  this.targetEuity = null; // ph?n t? m� tuy?t s? du?c th�m v�o (null = document.body) - c� th? l� ID ph?n t?, vd. 'myDiv' ho?c tham chi?u n�t DOM
  this .useMeltEffect = true; // Khi t�i ch? tuy?t roi (ho?c hi?m khi, khi roi), h�y d? n� "tan ch?y" v� m? d?n n?u tr�nh duy?t h? tr? n�
  this .useTwinkleEffect = false; // Cho ph�p tuy?t "nh?p nh�y" ng?u nhi�n trong v� ngo�i t?m nh�n trong khi roi
  this .usePocationFixed = false; // true = snow kh�ng d?ch chuy?n theo chi?u d?c khi cu?n. C� th? tang t?i CPU, b? t?t theo m?c d?nh - n?u du?c b?t, ch? du?c s? d?ng khi du?c h? tr?

  // --- bit �t du?c s? d?ng ---

  this .freezeOnBlur = true; // Ch? c� tuy?t khi c?a s? n?m trong ti�u di?m (ti?n c?nh.) Luu CPU.
  this .flowerLeft Offerset = 0; // Kh�ng gian l? / m�ng b�n tr�i tr�n c?nh c?a container (v� d?: c?a s? tr�nh duy?t.) Tang c�c gi� tr? n�y n?u nh�n th?y thanh cu?n ngang.
  this .flowerRight Offerset = 0; // Kh�ng gian l? / m�ng b�n ph?i tr�n c?nh c?a container
  this .flowerWidth = 8; // �? r?ng pixel t?i da d�nh ri�ng cho ph?n t? tuy?t
  this .flowerHeight = 8; // Chi?u cao pixel t?i da d�nh ri�ng cho y?u t? tuy?t
  n�y.vMaxX = 5; // Ph?m vi v?n t?c X t?i da cho tuy?t
  n�y.vMaxY = 4; // Ph?m vi v?n t?c Y t?i da cho tuy?t
  this .z Index = 0; // Th? t? s?p x?p CSS du?c �p d?ng cho m?i b�ng tuy?t

  // --- K?t th�c ph?n ngu?i d�ng ---

  var s = n�y, b�o = n�y, t�i,
  // Ch? d? k?t xu?t UA sniffing v� backCompat ki?m tra v? tr� c? d?nh, v.v.
  isIE = navigator.userAgent.match (/ msie / i),
  isIE6 = navigator.userAgent.match (/ msie 6 / i),
  isWin98 = navigator.appVersion.match (/ windows 98 / i),
  isMobile = navigator.userAgent.match (/ mobile / i),
  isBackCompatIE = (isIE && document.compatMode === 'BackCompat'),
  noFixed = (isMobile | | isBackCompatIE || isIE6),
  screenX = null, screenX2 = null, screenY = null, scrollY = null, vRndX = null, vRndY = null,
  con gi� = 1,
  gi�Multiplier = 2,
  flakeTypes = 6,
  fixedForEverything = false,
  opacitySupported = (function () {
    th? {
      document.createEuity ('div'). style.opacity = '0.5';
    } b?t (e) {
      tr? l?i sai;
    }
    tr? l?i d�ng s? th?t;
  } ()),
  didInit = sai,
  docFrag = document.createDocumentFragment ();

  this.timers = [];
  this .flakes = [];
  this.disables = false;
  this .active = false;
  this.meltFrameCount = 20;
  this.meltFrames = [];

  this .events = (function () {

    var old = (! window.addEventListener && window.attachEvent), l�t = Array.prototype.slice,
    evt = {
      th�m: (cu? '��nh k�m': 'addEventListener'),
      x�a: (cu? 'detachEvent': 'removeEventListener')
    };

    h�m getArss (oArss) {
      var args = l�t.call (oArss), len = args.length;
      n?u (cu) {
        args [1] = 'tr�n' + args [1]; // ti?p d?u ng?
        if (len> 3) {
          args.pop (); // kh�ng ch?p
        }
      } kh�c n?u (len === 3) {
        args.push (sai);
      }
      tr? l?i args;
    }

    h�m �p d?ng (args, sType) {
      ph?n t? var = args.shift (),
          phuong th?c = [evt [sType]];
      n?u (cu) {
        ph?n t? [phuong th?c] (args [0], args [1]);
      } kh�c {
        ph?n t? [phuong th?c] .apply (ph?n t?, args);
      }
    }

    h�m addEvent () {
      �p d?ng (getArss (d?i s?), 'add');
    }

    h�m removeEvent () {
      �p d?ng (getArss (d?i s?), 'remove');
    }

    tr? v? {
      th�m: addEvent,
      lo?i b?: removeEvent
    };

  } ());

  h�m rnd (n, min) {
    if (isNaN (ph�t)) {
      t?i thi?u = 0;
    }
    tr? v? (Math.random () * n) + ph�t;
  }

  h�m plusMinus (n) {
    return (parseInt (rnd (2), 10) === 1? n * -1: n);
  }

  this .randomizeWind = function () {
    var i;
    vRndX = plusMinus (rnd (s.vMaxX, 0,2));
    vRndY = rnd (s.vMaxY, 0,2);
    if (this.flakes) {
      for (i = 0; i <this.flakes.length; i ++) {
        if (this.flakes [i] .active) {
          this .flakes [i] .setVelocities ();
        }
      }
    }
  };

  this .scrollHandler = function () {
    var i;
    // "d�nh k�m" nh?ng b�ng tuy?t v�o du?i c�ng c?a c?a s? n?u kh�ng c� gi� tr? d�y tuy?t d?i n�o du?c dua ra
    scrollY = (s.flowerBottom? 0: parseInt (window.scrollY | | document.documentEuity.scrollTop | | document.body.scrollTop, 10));
    if (isNaN (scrollY)) {
      cu?nY = 0; // S?a l?i cu?n Netscape 6
    }
    if (! fixedForEverything &&! s.flowerBottom && s.flakes) {
      for (i = s.flakes.length; i--;) {
        if (s.flakes [i] .active === 0) {
          s.flakes [i] .stick ();
        }
      }
    }
  };

  this .resizeHandler = function () {
    if (window.innerWidth | | window.innerHeight) {
      screenX = window.innerWidth - (! isIE? 16: 16) -s.flowerRight Offerset;
      screenY = (s.flowerBottom? s.flowerBottom: window.innerHeight);
    } kh�c {
      screenX = (document.documentEuity.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (! isIE? 8: 0) -s.flowerRight Offerset;
      screenY = s.flowerBottom? s.flowerBottom: (document.documentEuity.clientHeight || document.body.clientHeight || document.body.scrollHeight);
    }
    screenX2 = parseInt (screenX / 2,10);
  };

  this .resizeHandlerAlt = function () {
    screenX = s.targetEuity.offsetLeft + s.targetEuity.offsetWidth-s.flowerRight Offerset;
    screenY = s.flowerBottom? s.flowerBottom: s.targetEuity.offsetTop + s.targetEuity.offsetHeight;
    screenX2 = parseInt (screenX / 2,10);
  };

  this .freeze = function () {
    // t?m d?ng ho?t h�nh
    var i;
    if (! s.disables) {
      s.disables = 1;
    } kh�c {
      tr? l?i sai;
    }
    for (i = s.timers.length; i--;) {
      ClearInterval (s.timers [i]);
    }
  };

  this .resume = function () {
    if (s.disables) {
       s.disables = 0;
    } kh�c {
      tr? l?i sai;
    }
    s.timerInit ();
  };

  this.toggleSnow = function () {
    if (! s.flakes.length) {
      // l?n ch?y d?u ti�n
      s.start ();
    } kh�c {
      s.active =! s.active;
      if (s.active) {
        s.show ();
        s.resume ();
      } kh�c {
        s.stop ();
        s.freeze ();
      }
    }
  };

  this .stop = function () {
    var i;
    this .freeze ();
    for (i = this.flakes.length; i--;) {
      this .flakes [i] .o.style.display = 'none';
    }
    s.events.remove (c?a s?, 'cu?n', s.scrollHandler);
    s.events.remove (c?a s?, 'thay d?i k�ch thu?c', s.resizeHandler);
    if (s.freezeOnBlur) {
      if (isIE) {
        s.events.remove (t�i li?u, 't?p trung', s.freeze);
        s.events.remove (t�i li?u, 't?p trung', s.resume);
      } kh�c {
        s.events.remove (c?a s?, 'm?', s.freeze);
        s.events.remove (c?a s?, 'ti�u di?m', s.resume);
      }
    }
  };

  this .show = function () {
    var i;
    for (i = this.flakes.length; i--;) {
      this .flakes [i] .o.style.display = 'block';
    }
  };

  this.SnowFlake = function (cha, lo?i, x, y) {
    var s = n�y, b�o = cha m?;
    this .type = lo?i;
    this.x = x | | parseInt (rnd (screenX-20), 10);
    this .y = (! isNaN (y)? y: -rnd (screenY) -12);
    this.vX = null;
    this.vY = null;
    this.vAmpTypes = [1,1.2,1.4,1.6,1.8]; // "khu?ch d?i" cho vX / vY (d?a tr�n k�ch thu?c / lo?i v?y)
    this.vAmp = this.vAmpTypes [this.type];
    this.melting = false;
    this.meltFrameCount = Storm.meltFrameCount;
    this.meltFrames = b�o.meltFrames;
    this.meltFrame = 0;
    this.twinkleFrame = 0;
    this .active = 1;
    this .fontSize = (10+ (this.type / 5) * 10);
    this .o = document.createEuity ('div');
    this .o.innerHTML = Storm.snowCharacter;
    this .o.style.color = b�o.snowColor;
    this .o.style.poseition = (fixedForEverything? 'fixed': 'perfect');
    this .o.style. thong = b�o .flowerWidth + 'px';
    this .o.style.height = b�o.flowerHeight + 'px';
    this .o.style.fontF Family = 'arial, verdana';
    this .o.style.overflow = 'hidden';
    this .o.style.font Weight = 'normal';
    this .o.style.z Index = b�o.z Index;
    docFrag.appendChild (this.o);

    this .refresh = function () {
      if (isNaN (sx) | | isNaN (sy)) {
        // ki?m tra an to�n
        tr? l?i sai;
      }
      sostyle.left = s.x + 'px';
      sostyle.top = s.y + 'px';
    };

    this .stick = function () {
      if (noFixed || (Storm.targetEuity! == document.documentEuity && Storm.targetEuity! == document.body)) {
        sostyle.top = (screenY + scrollY-b�o.flowerHeight) + 'px';
      } if if (Storm.flowerBottom) {
        sostyle.top = b�o.flowerBottom + 'px';
      } kh�c {
        sostyle.display = 'kh�ng';
        sostyle.top = 't? d?ng';
        sostyle.bottom = '0px';
        sostyle.poseition = 'fixed';
        sostyle.display = 'ch?n';
      }
    };

    this.vCheck = function () {
      if (s.vX> = 0 && s.vX <0.2) {
        s.vX = 0,2;
      } kh�c n?u (s.vX <0 && s.vX> -0.2) {
        s.vX = -0,2;
      }
      if (s.vY> = 0 && s.vY <0.2) {
        s.vY = 0,2;
      }
    };

    this.move = function () {
      var vX = s.vX * gi� Offerset, yDiff;
      sx + = vX;
      sy + = (s.vY * s.vAmp);
      if (sx> = screenX || screenX-sx <Storm.flowerWidth) {// Ki?m tra cu?n tr?c X
        sx = 0;
      } if if (vX <0 && sx-Storm.flowerLeft Offerset <-storm.flowerWidth) {
        sx = screenX-b�o.flowerWidth-1; // flakeWidth;
      }
      s.refresh ();
      yDiff = screenY + scrollY-sy;
      if (yDiff <b�o .flowerHeight) {
        s.active = 0;
        if (b�o.snowStick) {
          s.stick ();
        } kh�c {
          s.recycle ();
        }
      } kh�c {
        if (Storm.useMeltEffect && s.active && s.type <3 &&! s.melting && Math.random ()> 0,998) {
          // ~ 1/1000 co h?i tan ch?y gi?a kh�ng trung, v?i m?i khung h�nh
          s.melting = d�ng;
          s.melt ();
          // ch? l�m tan ch?y d?n m?t khung h�nh
          // s.melting = false;
        }
        if (b�o.useTwinkleEffect) {
          if (! s.twinkleFrame) {
            if (Math.random ()> 0.9) {
              s.twinkleFrame = parseInt (Math.random () * 20,10);
            }
          } kh�c {
            s.twinkleFrame--;
            sostyle.visibility = (s.twinkleFrame && s.twinkleFrame% 2 === 0? 'hidden': 'th?y');
          }
        }
      }
    };

    this .animate = function () {
      // v�ng l?p ho?t h�nh ch�nh
      // di chuy?n, ki?m tra tr?ng th�i, ch?t, v.v.
      s.move ();
    };

    this .setVelocities = function () {
      s.vX = vRndX + rnd (b�o.vMaxX * 0.12,0.1);
      s.vY = vRndY + rnd (b�o.vMaxY * 0.12,0.1);
    };

    this .setOpacity = function (o, opacity) {
      if (! opacitySupported) {
        tr? l?i sai;
      }
      o.style.opacity = d? m?;
    };

    this.melt = function () {
      if (! b�o.useMeltEffect ||! s.melting) {
        s.recycle ();
      } kh�c {
        if (s.meltFrame <s.meltFrameCount) {
          s.meltFrame ++;
          s.setOpacity (v� v?y, s.meltFrames [s.meltFrame]);
          sostyle.fontSize = s.fontSize- (s.fontSize * (s.meltFrame / s.meltFrameCount)) + 'px';
          sostyle.lineHeight = b�o.flowerHeight + 2 + (b�o.flowerHeight * 0.75 * (s.meltFrame / s.meltFrameCount)) + 'px';
        } kh�c {
          s.recycle ();
        }
      }
    };

    this .recycle = function () {
      sostyle.display = 'kh�ng';
      sostyle.poseition = (fixedForEverything? 'fixed': 'perfect');
      sostyle.bottom = 't? d?ng';
      s.setVelocities ();
      s.vCheck ();
      s.meltFrame = 0;
      s.melting = sai;
      s.setOpacity (v� v?y, 1);
      sostyle.padding = '0px';
      sostyle.margin = '0px';
      sostyle.fontSize = s.fontSize + 'px';
      sostyle.lineHeight = (b�o.flowerHeight + 2) + 'px';
      sostyle.textAlign = 'trung t�m';
      sostyle.verticalAlign = 'du?ng co s?';
      sx = parseInt (rnd (screenX-b�o.flowerWidth-20), 10);
      sy = parseInt (rnd (screenY) * - 1,10) -storm.flowerHeight;
      s.refresh ();
      sostyle.display = 'ch?n';
      s.active = 1;
    };

    this .recycle (); // thi?t l?p c�c h?p d?ng x / y, v.v.
    this .refresh ();

  };

  this.snow = function () {
    var active = 0, used = 0, Wait = 0, flake = null, i;
    for (i = s.flakes.length; i--;) {
      if (s.flakes [i] .active === 1) {
        s.flakes [i] .move ();
        ho?t d?ng ++;
      } if if (s.flakes [i] .active === 0) {
        d� s? d?ng ++;
      } kh�c {
        ch? d?i ++;
      }
      if (s.flakes [i] .melting) {
        s.flakes [i] .melt ();
      }
    }
    if (ho?t d?ng <s.flakesMaxActive) {
      flake = s.flakes [parseInt (rnd (s.flakes.length), 10)];
      if (flake.active === 0) {
        flake.melting = d�ng;
      }
    }
  };

  this.mouseMove = function (e) {
    if (! s.followMouse) {
      tr? l?i d�ng s? th?t;
    }
    var x = parseInt (e.clientX, 10);
    if (x <screenX2) {
      WindPackset = -windMultiplier + (x / screenX2 * WindMultiplier);
    } kh�c {
      x - = screenX2;
      gi� Offerset = (x / screenX2) * WindMultiplier;
    }
  };

  this.createSnow = function (gi?i h?n, allowInactive) {
    var i;
    for (i = 0; i <gi?i h?n; i ++) {
      s.flakes [s.flakes.length] = new s.SnowFlake (s, parseInt (rnd (flakeTypes), 10));
      if (allowInactive || i> s.flakesMaxActive) {
        s.flakes [s.flakes.length-1] .active = -1;
      }
    }
    Storm.targetEuity.appendChild (docFrag);
  };

  this.timerInit = function () {
    s.timers = (! isWin98? [setInterval (s.snow, s.animationInterval)]: [setInterval (s.snow, s.animationInterval * 3), setInterval (s.snow, s.animationInterval)
  };

  this .init = function () {
    var i;
    for (i = 0; i <s.meltFrameCount; i ++) {
      s.meltFrames.push (1- (i / s.meltFrameCount));
    }
    s.randomizeWind ();
    s.createSnow (s.flakesMax); // t?o l� ban d?u
    s.events.add (c?a s?, 'thay d?i k�ch thu?c', s.resizeHandler);
    s.events.add (c?a s?, 'cu?n', s.scrollHandler);
    if (s.freezeOnBlur) {
      if (isIE) {
        s.events.add (t�i li?u, 't?p trung', s.freeze);
        s.events.add (t�i li?u, 't?p trung', s.resume);
      } kh�c {
        s.events.add (c?a s?, 'm?', s.freeze);
        s.events.add (c?a s?, 'ti�u di?m', s.resume);
      }
    }
    s.resizeHandler ();
    s.scrollHandler ();
    if (s.followMouse) {
      s.events.add (t�i li?u isIE?: window, 'mousemove', s.mouseMove);
    }
    s.animationInterval = Math.max (20, s.animationInterval);
    s.timerInit ();
  };

  this .start = function (bFromOnLoad) {
    if (! didInit) {
      didInit = true;
    } if if (bFromOnLoad) {
      // d� du?c t?i v� ch?y
      tr? l?i d�ng s? th?t;
    }
    if (typeof s.targetEuity === 'chu?i') {
      var targetID = s.targetEuity;
      s.targetEuity = document.getEuityById (targetID);
      if (! s.targetEuity) {
        n�m l?i m?i ('B�o tuy?t: Kh�ng th? c� du?c TargetEuity "' + targetID + '"');
      }
    }
    if (! s.targetEuity) {
      s.targetEuity = (! isIE? (document.documentEuity? document.documentEuity: document.body): document.body);
    }
    if (s.targetEuity! == document.documentEuity && s.targetEuity! == document.body) {
      s.resizeHandler = s.resizeHandlerAlt; // t�i l?p tr�nh x? l� d? l?y ph?n t? thay v� k�ch thu?c m�n h�nh
    }
    s.resizeHandler (); // l?y c�c ph?n t? h?p gi?i h?n
    s.usePocationFixed = (s.usePocationFixed &&! noFixed); // c� hay kh�ng v? tr�: c? d?nh du?c h? tr?
    fixedForEverything = s.usePocationFixed;
    if (screenX && screenY &&! s.disables) {
      s.init ();
      s.active = true;
    }
  };

  h�m doDelayedStart () {
    window.setTimeout (function () {
      s.start (d�ng);
    }, 20);
    // d?n d?p s? ki?n
    s.events.remove (t�i li?u isIE?: window, 'mousemove', doDelayedStart);
  }

  h�m doStart () {
    if (! s.excludeMobile ||! isMobile) {
      if (s.freezeOnBlur) {
        s.events.add (t�i li?u isIE?: window, 'mousemove', doDelayedStart);
      } kh�c {
        doDelayedStart ();
      }
    }
    // d?n d?p s? ki?n
    s.events.remove (c?a s?, 't?i', doStart);
  }

  // m�c d? b?t d?u tuy?t
  s.events.add (c?a s?, 't?i', doStart, false);

  tr? l?i c�i n�y;

} (c?a s?, t�i li?u));