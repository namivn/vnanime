/** @gi?y phép
 * Bão tuy?t DHTML! Snow d?a trên JavaScript cho các trang web
 * ------------------------------------------------- -------
 * Phiên b?n 1.42.20111120 (Phiên b?n tru?c: 1.41.20101113)
 * B?n quy?n (c) 2007, Scott Schiller. Ðã dang ký B?n quy?n.
 * Mã du?c cung c?p theo Gi?y phép BSD:
 * http://schillmania.com/projects/snowstorm/license.txt
 * /

/ * c?a s? toàn c?u, tài li?u, hoa tiêu, ClearInterval, setInterval * /
/ * jslint tr?ng: false, onevar: true, plusplus: false, undef: true, nomen: true, eqeqeq: true, bitwise: true, regrec: true, newcap: true, t?c: true * /

var snowStorm = (hàm (c?a s?, tài li?u) {

  // --- tài s?n chung ---

  this .flakesMax = 128; // Gi?i h?n t?ng lu?ng tuy?t t?o ra (roi + dính)
  this .flakesMaxActive = 64; // H?n ch? lu?ng tuy?t roi cùng m?t lúc (ít hon = s? d?ng CPU th?p hon)
  this .animationInterval = 33; // Ðo lu?ng "miliseconds trên khung" lý thuy?t. 20 = nhanh + mu?t mà, nhung s? d?ng CPU cao. 50 = b?o th? hon, nhung ch?m hon
  this .excludeMobile = true; // Tuy?t có th? là tin x?u cho CPU (và pin c?a di?n tho?i di d?ng.) Theo m?c d?nh, hãy th?t tuy?t.
  this .flowerBottom = null; // S? nguyên cho gi?i h?n tuy?t tr?c Y, 0 ho?c null cho hi?u ?ng tuy?t "toàn màn hình"
  this .followMouse = true; // Chuy?n d?ng c?a tuy?t có th? dáp ?ng v?i chu?t c?a ngu?i dùng
  this.snowColor = '#fff'; // Không an (ho?c s? d?ng?) Tuy?t vàng.
  this.snowCharacter = '& bull;'; // & bò; = viên d?n, & trung gian; là hình vuông trên m?t s? h? th?ng, vv
  this.snowStick = true; // Có hay không tuy?t nên "dính" ? phía du?i. Khi t?t, s? không bao gi? thu th?p.
  this.targetEuity = null; // ph?n t? mà tuy?t s? du?c thêm vào (null = document.body) - có th? là ID ph?n t?, vd. 'myDiv' ho?c tham chi?u nút DOM
  this .useMeltEffect = true; // Khi tái ch? tuy?t roi (ho?c hi?m khi, khi roi), hãy d? nó "tan ch?y" và m? d?n n?u trình duy?t h? tr? nó
  this .useTwinkleEffect = false; // Cho phép tuy?t "nh?p nháy" ng?u nhiên trong và ngoài t?m nhìn trong khi roi
  this .usePocationFixed = false; // true = snow không d?ch chuy?n theo chi?u d?c khi cu?n. Có th? tang t?i CPU, b? t?t theo m?c d?nh - n?u du?c b?t, ch? du?c s? d?ng khi du?c h? tr?

  // --- bit ít du?c s? d?ng ---

  this .freezeOnBlur = true; // Ch? có tuy?t khi c?a s? n?m trong tiêu di?m (ti?n c?nh.) Luu CPU.
  this .flowerLeft Offerset = 0; // Không gian l? / máng bên trái trên c?nh c?a container (ví d?: c?a s? trình duy?t.) Tang các giá tr? này n?u nhìn th?y thanh cu?n ngang.
  this .flowerRight Offerset = 0; // Không gian l? / máng bên ph?i trên c?nh c?a container
  this .flowerWidth = 8; // Ð? r?ng pixel t?i da dành riêng cho ph?n t? tuy?t
  this .flowerHeight = 8; // Chi?u cao pixel t?i da dành riêng cho y?u t? tuy?t
  này.vMaxX = 5; // Ph?m vi v?n t?c X t?i da cho tuy?t
  này.vMaxY = 4; // Ph?m vi v?n t?c Y t?i da cho tuy?t
  this .z Index = 0; // Th? t? s?p x?p CSS du?c áp d?ng cho m?i bông tuy?t

  // --- K?t thúc ph?n ngu?i dùng ---

  var s = này, bão = này, tôi,
  // Ch? d? k?t xu?t UA sniffing và backCompat ki?m tra v? trí c? d?nh, v.v.
  isIE = navigator.userAgent.match (/ msie / i),
  isIE6 = navigator.userAgent.match (/ msie 6 / i),
  isWin98 = navigator.appVersion.match (/ windows 98 / i),
  isMobile = navigator.userAgent.match (/ mobile / i),
  isBackCompatIE = (isIE && document.compatMode === 'BackCompat'),
  noFixed = (isMobile | | isBackCompatIE || isIE6),
  screenX = null, screenX2 = null, screenY = null, scrollY = null, vRndX = null, vRndY = null,
  con gió = 1,
  gióMultiplier = 2,
  flakeTypes = 6,
  fixedForEverything = false,
  opacitySupported = (function () {
    th? {
      document.createEuity ('div'). style.opacity = '0.5';
    } b?t (e) {
      tr? l?i sai;
    }
    tr? l?i dúng s? th?t;
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

    var old = (! window.addEventListener && window.attachEvent), lát = Array.prototype.slice,
    evt = {
      thêm: (cu? 'Ðính kèm': 'addEventListener'),
      xóa: (cu? 'detachEvent': 'removeEventListener')
    };

    hàm getArss (oArss) {
      var args = lát.call (oArss), len = args.length;
      n?u (cu) {
        args [1] = 'trên' + args [1]; // ti?p d?u ng?
        if (len> 3) {
          args.pop (); // không ch?p
        }
      } khác n?u (len === 3) {
        args.push (sai);
      }
      tr? l?i args;
    }

    hàm áp d?ng (args, sType) {
      ph?n t? var = args.shift (),
          phuong th?c = [evt [sType]];
      n?u (cu) {
        ph?n t? [phuong th?c] (args [0], args [1]);
      } khác {
        ph?n t? [phuong th?c] .apply (ph?n t?, args);
      }
    }

    hàm addEvent () {
      áp d?ng (getArss (d?i s?), 'add');
    }

    hàm removeEvent () {
      áp d?ng (getArss (d?i s?), 'remove');
    }

    tr? v? {
      thêm: addEvent,
      lo?i b?: removeEvent
    };

  } ());

  hàm rnd (n, min) {
    if (isNaN (phút)) {
      t?i thi?u = 0;
    }
    tr? v? (Math.random () * n) + phút;
  }

  hàm plusMinus (n) {
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
    // "dính kèm" nh?ng bông tuy?t vào du?i cùng c?a c?a s? n?u không có giá tr? dáy tuy?t d?i nào du?c dua ra
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
    } khác {
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
    // t?m d?ng ho?t hình
    var i;
    if (! s.disables) {
      s.disables = 1;
    } khác {
      tr? l?i sai;
    }
    for (i = s.timers.length; i--;) {
      ClearInterval (s.timers [i]);
    }
  };

  this .resume = function () {
    if (s.disables) {
       s.disables = 0;
    } khác {
      tr? l?i sai;
    }
    s.timerInit ();
  };

  this.toggleSnow = function () {
    if (! s.flakes.length) {
      // l?n ch?y d?u tiên
      s.start ();
    } khác {
      s.active =! s.active;
      if (s.active) {
        s.show ();
        s.resume ();
      } khác {
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
    s.events.remove (c?a s?, 'thay d?i kích thu?c', s.resizeHandler);
    if (s.freezeOnBlur) {
      if (isIE) {
        s.events.remove (tài li?u, 't?p trung', s.freeze);
        s.events.remove (tài li?u, 't?p trung', s.resume);
      } khác {
        s.events.remove (c?a s?, 'm?', s.freeze);
        s.events.remove (c?a s?, 'tiêu di?m', s.resume);
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
    var s = này, bão = cha m?;
    this .type = lo?i;
    this.x = x | | parseInt (rnd (screenX-20), 10);
    this .y = (! isNaN (y)? y: -rnd (screenY) -12);
    this.vX = null;
    this.vY = null;
    this.vAmpTypes = [1,1.2,1.4,1.6,1.8]; // "khu?ch d?i" cho vX / vY (d?a trên kích thu?c / lo?i v?y)
    this.vAmp = this.vAmpTypes [this.type];
    this.melting = false;
    this.meltFrameCount = Storm.meltFrameCount;
    this.meltFrames = bão.meltFrames;
    this.meltFrame = 0;
    this.twinkleFrame = 0;
    this .active = 1;
    this .fontSize = (10+ (this.type / 5) * 10);
    this .o = document.createEuity ('div');
    this .o.innerHTML = Storm.snowCharacter;
    this .o.style.color = bão.snowColor;
    this .o.style.poseition = (fixedForEverything? 'fixed': 'perfect');
    this .o.style. thong = bão .flowerWidth + 'px';
    this .o.style.height = bão.flowerHeight + 'px';
    this .o.style.fontF Family = 'arial, verdana';
    this .o.style.overflow = 'hidden';
    this .o.style.font Weight = 'normal';
    this .o.style.z Index = bão.z Index;
    docFrag.appendChild (this.o);

    this .refresh = function () {
      if (isNaN (sx) | | isNaN (sy)) {
        // ki?m tra an toàn
        tr? l?i sai;
      }
      sostyle.left = s.x + 'px';
      sostyle.top = s.y + 'px';
    };

    this .stick = function () {
      if (noFixed || (Storm.targetEuity! == document.documentEuity && Storm.targetEuity! == document.body)) {
        sostyle.top = (screenY + scrollY-bão.flowerHeight) + 'px';
      } if if (Storm.flowerBottom) {
        sostyle.top = bão.flowerBottom + 'px';
      } khác {
        sostyle.display = 'không';
        sostyle.top = 't? d?ng';
        sostyle.bottom = '0px';
        sostyle.poseition = 'fixed';
        sostyle.display = 'ch?n';
      }
    };

    this.vCheck = function () {
      if (s.vX> = 0 && s.vX <0.2) {
        s.vX = 0,2;
      } khác n?u (s.vX <0 && s.vX> -0.2) {
        s.vX = -0,2;
      }
      if (s.vY> = 0 && s.vY <0.2) {
        s.vY = 0,2;
      }
    };

    this.move = function () {
      var vX = s.vX * gió Offerset, yDiff;
      sx + = vX;
      sy + = (s.vY * s.vAmp);
      if (sx> = screenX || screenX-sx <Storm.flowerWidth) {// Ki?m tra cu?n tr?c X
        sx = 0;
      } if if (vX <0 && sx-Storm.flowerLeft Offerset <-storm.flowerWidth) {
        sx = screenX-bão.flowerWidth-1; // flakeWidth;
      }
      s.refresh ();
      yDiff = screenY + scrollY-sy;
      if (yDiff <bão .flowerHeight) {
        s.active = 0;
        if (bão.snowStick) {
          s.stick ();
        } khác {
          s.recycle ();
        }
      } khác {
        if (Storm.useMeltEffect && s.active && s.type <3 &&! s.melting && Math.random ()> 0,998) {
          // ~ 1/1000 co h?i tan ch?y gi?a không trung, v?i m?i khung hình
          s.melting = dúng;
          s.melt ();
          // ch? làm tan ch?y d?n m?t khung hình
          // s.melting = false;
        }
        if (bão.useTwinkleEffect) {
          if (! s.twinkleFrame) {
            if (Math.random ()> 0.9) {
              s.twinkleFrame = parseInt (Math.random () * 20,10);
            }
          } khác {
            s.twinkleFrame--;
            sostyle.visibility = (s.twinkleFrame && s.twinkleFrame% 2 === 0? 'hidden': 'th?y');
          }
        }
      }
    };

    this .animate = function () {
      // vòng l?p ho?t hình chính
      // di chuy?n, ki?m tra tr?ng thái, ch?t, v.v.
      s.move ();
    };

    this .setVelocities = function () {
      s.vX = vRndX + rnd (bão.vMaxX * 0.12,0.1);
      s.vY = vRndY + rnd (bão.vMaxY * 0.12,0.1);
    };

    this .setOpacity = function (o, opacity) {
      if (! opacitySupported) {
        tr? l?i sai;
      }
      o.style.opacity = d? m?;
    };

    this.melt = function () {
      if (! bão.useMeltEffect ||! s.melting) {
        s.recycle ();
      } khác {
        if (s.meltFrame <s.meltFrameCount) {
          s.meltFrame ++;
          s.setOpacity (vì v?y, s.meltFrames [s.meltFrame]);
          sostyle.fontSize = s.fontSize- (s.fontSize * (s.meltFrame / s.meltFrameCount)) + 'px';
          sostyle.lineHeight = bão.flowerHeight + 2 + (bão.flowerHeight * 0.75 * (s.meltFrame / s.meltFrameCount)) + 'px';
        } khác {
          s.recycle ();
        }
      }
    };

    this .recycle = function () {
      sostyle.display = 'không';
      sostyle.poseition = (fixedForEverything? 'fixed': 'perfect');
      sostyle.bottom = 't? d?ng';
      s.setVelocities ();
      s.vCheck ();
      s.meltFrame = 0;
      s.melting = sai;
      s.setOpacity (vì v?y, 1);
      sostyle.padding = '0px';
      sostyle.margin = '0px';
      sostyle.fontSize = s.fontSize + 'px';
      sostyle.lineHeight = (bão.flowerHeight + 2) + 'px';
      sostyle.textAlign = 'trung tâm';
      sostyle.verticalAlign = 'du?ng co s?';
      sx = parseInt (rnd (screenX-bão.flowerWidth-20), 10);
      sy = parseInt (rnd (screenY) * - 1,10) -storm.flowerHeight;
      s.refresh ();
      sostyle.display = 'ch?n';
      s.active = 1;
    };

    this .recycle (); // thi?t l?p các h?p d?ng x / y, v.v.
    this .refresh ();

  };

  this.snow = function () {
    var active = 0, used = 0, Wait = 0, flake = null, i;
    for (i = s.flakes.length; i--;) {
      if (s.flakes [i] .active === 1) {
        s.flakes [i] .move ();
        ho?t d?ng ++;
      } if if (s.flakes [i] .active === 0) {
        dã s? d?ng ++;
      } khác {
        ch? d?i ++;
      }
      if (s.flakes [i] .melting) {
        s.flakes [i] .melt ();
      }
    }
    if (ho?t d?ng <s.flakesMaxActive) {
      flake = s.flakes [parseInt (rnd (s.flakes.length), 10)];
      if (flake.active === 0) {
        flake.melting = dúng;
      }
    }
  };

  this.mouseMove = function (e) {
    if (! s.followMouse) {
      tr? l?i dúng s? th?t;
    }
    var x = parseInt (e.clientX, 10);
    if (x <screenX2) {
      WindPackset = -windMultiplier + (x / screenX2 * WindMultiplier);
    } khác {
      x - = screenX2;
      gió Offerset = (x / screenX2) * WindMultiplier;
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
    s.createSnow (s.flakesMax); // t?o lô ban d?u
    s.events.add (c?a s?, 'thay d?i kích thu?c', s.resizeHandler);
    s.events.add (c?a s?, 'cu?n', s.scrollHandler);
    if (s.freezeOnBlur) {
      if (isIE) {
        s.events.add (tài li?u, 't?p trung', s.freeze);
        s.events.add (tài li?u, 't?p trung', s.resume);
      } khác {
        s.events.add (c?a s?, 'm?', s.freeze);
        s.events.add (c?a s?, 'tiêu di?m', s.resume);
      }
    }
    s.resizeHandler ();
    s.scrollHandler ();
    if (s.followMouse) {
      s.events.add (tài li?u isIE?: window, 'mousemove', s.mouseMove);
    }
    s.animationInterval = Math.max (20, s.animationInterval);
    s.timerInit ();
  };

  this .start = function (bFromOnLoad) {
    if (! didInit) {
      didInit = true;
    } if if (bFromOnLoad) {
      // dã du?c t?i và ch?y
      tr? l?i dúng s? th?t;
    }
    if (typeof s.targetEuity === 'chu?i') {
      var targetID = s.targetEuity;
      s.targetEuity = document.getEuityById (targetID);
      if (! s.targetEuity) {
        ném l?i m?i ('Bão tuy?t: Không th? có du?c TargetEuity "' + targetID + '"');
      }
    }
    if (! s.targetEuity) {
      s.targetEuity = (! isIE? (document.documentEuity? document.documentEuity: document.body): document.body);
    }
    if (s.targetEuity! == document.documentEuity && s.targetEuity! == document.body) {
      s.resizeHandler = s.resizeHandlerAlt; // tái l?p trình x? lý d? l?y ph?n t? thay vì kích thu?c màn hình
    }
    s.resizeHandler (); // l?y các ph?n t? h?p gi?i h?n
    s.usePocationFixed = (s.usePocationFixed &&! noFixed); // có hay không v? trí: c? d?nh du?c h? tr?
    fixedForEverything = s.usePocationFixed;
    if (screenX && screenY &&! s.disables) {
      s.init ();
      s.active = true;
    }
  };

  hàm doDelayedStart () {
    window.setTimeout (function () {
      s.start (dúng);
    }, 20);
    // d?n d?p s? ki?n
    s.events.remove (tài li?u isIE?: window, 'mousemove', doDelayedStart);
  }

  hàm doStart () {
    if (! s.excludeMobile ||! isMobile) {
      if (s.freezeOnBlur) {
        s.events.add (tài li?u isIE?: window, 'mousemove', doDelayedStart);
      } khác {
        doDelayedStart ();
      }
    }
    // d?n d?p s? ki?n
    s.events.remove (c?a s?, 't?i', doStart);
  }

  // móc d? b?t d?u tuy?t
  s.events.add (c?a s?, 't?i', doStart, false);

  tr? l?i cái này;

} (c?a s?, tài li?u));