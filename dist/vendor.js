/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.2.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.2.0'

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.2.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.2.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    $el[val](data[state] == null ? this.options[state] : data[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    Plugin.call($btn, 'toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.2.0'

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.2.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.2.0'

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      Plugin.call(actives, 'hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var href
    var $this   = $(this)
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.2.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.2.0'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.trigger('focus')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.2.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.2.0'

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.$body.removeClass('modal-open')

    this.resetScrollbar()
    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(150) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth) return
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.2.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.2.0'

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(document.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $parent      = this.$element.parent()
        var parentDim    = this.getPosition($parent)

        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    this.$element.removeAttr('aria-describedby')

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element
    var el     = $element[0]
    var isBody = el.tagName == 'BODY'
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width:  isBody ? $(window).width()  : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? { top: 0, left: 0 } : $element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.2.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.2.0'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.2.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.2.0'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.2.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.2.0'

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.2.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.2.0'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin != null) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - this.$element.height() - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/**
 * jQuery Masonry v2.1.07
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */

/*jshint browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        $event[ dispatchMethod ].apply( context, args );

      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Masonry ===============================


  // our "Widget" object constructor
  $.Mason = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };

  $.Mason.settings = {
    isResizable: true,
    isAnimated: false,
    animationOptions: {
      queue: false,
      duration: 500
    },
    gutterWidth: 0,
    isRTL: false,
    isFitWidth: false,
    containerStyle: {
      position: 'relative'
    }
  };

  $.Mason.prototype = {

    _filterFindBricks: function( $elems ) {
      var selector = this.options.itemSelector;
      // if there is a selector
      // filter/find appropriate item elements
      return !selector ? $elems : $elems.filter( selector ).add( $elems.find( selector ) );
    },

    _getBricks: function( $elems ) {
      var $bricks = this._filterFindBricks( $elems )
        .css({ position: 'absolute' })
        .addClass('masonry-brick');
      return $bricks;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, {}, $.Mason.settings, options );
      this.styleQueue = [];

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {
        // get height
        height: elemStyle.height || ''
      };
      // get other styles that will be overwritten
      var containerStyle = this.options.containerStyle;
      for ( var prop in containerStyle ) {
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }

      this.element.css( containerStyle );

      this.horizontalDirection = this.options.isRTL ? 'right' : 'left';

      var x = this.element.css( 'padding-' + this.horizontalDirection );
      var y = this.element.css( 'padding-top' );
      this.offset = {
        x: x ? parseInt( x, 10 ) : 0,
        y: y ? parseInt( y, 10 ) : 0
      };
      
      this.isFluid = this.options.columnWidth && typeof this.options.columnWidth === 'function';

      // add masonry class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass('masonry');
      }, 0 );
      
      // bind resize method
      if ( this.options.isResizable ) {
        $(window).bind( 'smartresize.masonry', function() { 
          instance.resize();
        });
      }


      // need to get bricks
      this.reloadItems();

    },
  
    // _init fires when instance is first created
    // and when instance is triggered again -> $el.masonry();
    _init : function( callback ) {
      this._getColumns();
      this._reLayout( callback );
    },

    option: function( key, value ){
      // set options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
      } 
    },
    
    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $bricks, callback ) {

      // place each brick
      for (var i=0, len = $bricks.length; i < len; i++) {
        this._placeBrick( $bricks[i] );
      }
      
      // set the size of the container
      var containerSize = {};
      containerSize.height = Math.max.apply( Math, this.colYs );
      if ( this.options.isFitWidth ) {
        var unusedCols = 0;
        i = this.cols;
        // count unused columns
        while ( --i ) {
          if ( this.colYs[i] !== 0 ) {
            break;
          }
          unusedCols++;
        }
        // fit container to columns that have been used;
        containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.options.gutterWidth;
      }
      this.styleQueue.push({ $el: this.element, style: containerSize });

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.options.isAnimated ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

      // process styleQueue
      var obj;
      for (i=0, len = this.styleQueue.length; i < len; i++) {
        obj = this.styleQueue[i];
        obj.$el[ styleFn ]( obj.style, animOpts );
      }

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $bricks );
      }
      
      this.isLaidOut = true;
    },
    
    // calculates number of columns
    // i.e. this.columnWidth = 200
    _getColumns : function() {
      var container = this.options.isFitWidth ? this.element.parent() : this.element,
          containerWidth = container.width();

                         // use fluid columnWidth function if there
      this.columnWidth = this.isFluid ? this.options.columnWidth( containerWidth ) :
                    // if not, how about the explicitly set option?
                    this.options.columnWidth ||
                    // or use the size of the first item
                    this.$bricks.outerWidth(true) ||
                    // if there's no items, use size of container
                    containerWidth;

      this.columnWidth += this.options.gutterWidth;

      this.cols = Math.floor( ( containerWidth + this.options.gutterWidth ) / this.columnWidth );
      this.cols = Math.max( this.cols, 1 );

    },

    // layout logic
    _placeBrick: function( brick ) {
      var $brick = $(brick),
          colSpan, groupCount, groupY, groupColY, j;

      //how many columns does this brick span
      colSpan = Math.ceil( $brick.outerWidth(true) / this.columnWidth );
      colSpan = Math.min( colSpan, this.cols );

      if ( colSpan === 1 ) {
        // if brick spans only one column, just like singleMode
        groupY = this.colYs;
      } else {
        // brick spans more than one column
        // how many different places could this brick fit horizontally
        groupCount = this.cols + 1 - colSpan;
        groupY = [];

        // for each group potential horizontal position
        for ( j=0; j < groupCount; j++ ) {
          // make an array of colY values for that one group
          groupColY = this.colYs.slice( j, j+colSpan );
          // and get the max value of the array
          groupY[j] = Math.max.apply( Math, groupColY );
        }

      }

      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, groupY ),
          shortCol = 0;
      
      // Find index of short column, the first from the left
      for (var i=0, len = groupY.length; i < len; i++) {
        if ( groupY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var position = {
        top: minimumY + this.offset.y
      };
      // position.left or position.right
      position[ this.horizontalDirection ] = this.columnWidth * shortCol + this.offset.x;
      this.styleQueue.push({ $el: $brick, style: position });

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.colYs[ shortCol + i ] = setHeight;
      }

    },
    
    
    resize: function() {
      var prevColCount = this.cols;
      // get updated colCount
      this._getColumns();
      if ( this.isFluid || this.cols !== prevColCount ) {
        // if column count has changed, trigger new layout
        this._reLayout();
      }
    },
    
    
    _reLayout : function( callback ) {
      // reset columns
      var i = this.cols;
      this.colYs = [];
      while (i--) {
        this.colYs.push( 0 );
      }
      // apply layout logic to all bricks
      this.layout( this.$bricks, callback );
    },
    
    // ====================== Convenience methods ======================
    
    // goes through all children again and gets bricks in proper order
    reloadItems : function() {
      this.$bricks = this._getBricks( this.element.children() );
    },
    
    
    reload : function( callback ) {
      this.reloadItems();
      this._init( callback );
    },
    

    // convienence method for working with Infinite Scroll
    appended : function( $content, isAnimatedFromBottom, callback ) {
      if ( isAnimatedFromBottom ) {
        // set new stuff to the bottom
        this._filterFindBricks( $content ).css({ top: this.element.height() });
        var instance = this;
        setTimeout( function(){
          instance._appended( $content, callback );
        }, 1 );
      } else {
        this._appended( $content, callback );
      }
    },
    
    _appended : function( $content, callback ) {
      var $newBricks = this._getBricks( $content );
      // add new bricks to brick pool
      this.$bricks = this.$bricks.add( $newBricks );
      this.layout( $newBricks, callback );
    },
    
    // removes elements from Masonry widget
    remove : function( $content ) {
      this.$bricks = this.$bricks.not( $content );
      $content.remove();
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      this.$bricks
        .removeClass('masonry-brick')
        .each(function(){
          this.style.position = '';
          this.style.top = '';
          this.style.left = '';
        });
      
      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.masonry')
        .removeClass('masonry')
        .removeData('masonry');
      
      $(window).unbind('.masonry');

    }
    
  };
  
  
  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };
  
  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Mason constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel 
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.masonry = function( options ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'masonry' );
        if ( !instance ) {
          logError( "cannot call methods on masonry prior to initialization; " +
            "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for masonry instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'masonry' );
        if ( instance ) {
          // apply options & init
          instance.option( options || {} );
          instance._init();
        } else {
          // initialize new instance
          $.data( this, 'masonry', new $.Mason( options, this ) );
        }
      });
    }
    return this;
  };

})( window, jQuery );

// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.3
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/


(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define('waypoints', ['jquery'], function($) {
        return factory($, root);
      });
    } else {
      return factory(root.jQuery, root);
    }
  })(this, function($, window) {
    var $w, Context, Waypoint, allWaypoints, contextCounter, contextKey, contexts, isTouch, jQMethods, methods, resizeEvent, scrollEvent, waypointCounter, waypointKey, wp, wps;

    $w = $(window);
    isTouch = __indexOf.call(window, 'ontouchstart') >= 0;
    allWaypoints = {
      horizontal: {},
      vertical: {}
    };
    contextCounter = 1;
    contexts = {};
    contextKey = 'waypoints-context-id';
    resizeEvent = 'resize.waypoints';
    scrollEvent = 'scroll.waypoints';
    waypointCounter = 1;
    waypointKey = 'waypoints-waypoint-ids';
    wp = 'waypoint';
    wps = 'waypoints';
    Context = (function() {
      function Context($element) {
        var _this = this;

        this.$element = $element;
        this.element = $element[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = 'context' + contextCounter++;
        this.oldScroll = {
          x: $element.scrollLeft(),
          y: $element.scrollTop()
        };
        this.waypoints = {
          horizontal: {},
          vertical: {}
        };
        $element.data(contextKey, this.id);
        contexts[this.id] = this;
        $element.bind(scrollEvent, function() {
          var scrollHandler;

          if (!(_this.didScroll || isTouch)) {
            _this.didScroll = true;
            scrollHandler = function() {
              _this.doScroll();
              return _this.didScroll = false;
            };
            return window.setTimeout(scrollHandler, $[wps].settings.scrollThrottle);
          }
        });
        $element.bind(resizeEvent, function() {
          var resizeHandler;

          if (!_this.didResize) {
            _this.didResize = true;
            resizeHandler = function() {
              $[wps]('refresh');
              return _this.didResize = false;
            };
            return window.setTimeout(resizeHandler, $[wps].settings.resizeThrottle);
          }
        });
      }

      Context.prototype.doScroll = function() {
        var axes,
          _this = this;

        axes = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: 'right',
            backward: 'left'
          },
          vertical: {
            newScroll: this.$element.scrollTop(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up'
          }
        };
        if (isTouch && (!axes.vertical.oldScroll || !axes.vertical.newScroll)) {
          $[wps]('refresh');
        }
        $.each(axes, function(aKey, axis) {
          var direction, isForward, triggered;

          triggered = [];
          isForward = axis.newScroll > axis.oldScroll;
          direction = isForward ? axis.forward : axis.backward;
          $.each(_this.waypoints[aKey], function(wKey, waypoint) {
            var _ref, _ref1;

            if ((axis.oldScroll < (_ref = waypoint.offset) && _ref <= axis.newScroll)) {
              return triggered.push(waypoint);
            } else if ((axis.newScroll < (_ref1 = waypoint.offset) && _ref1 <= axis.oldScroll)) {
              return triggered.push(waypoint);
            }
          });
          triggered.sort(function(a, b) {
            return a.offset - b.offset;
          });
          if (!isForward) {
            triggered.reverse();
          }
          return $.each(triggered, function(i, waypoint) {
            if (waypoint.options.continuous || i === triggered.length - 1) {
              return waypoint.trigger([direction]);
            }
          });
        });
        return this.oldScroll = {
          x: axes.horizontal.newScroll,
          y: axes.vertical.newScroll
        };
      };

      Context.prototype.refresh = function() {
        var axes, cOffset, isWin,
          _this = this;

        isWin = $.isWindow(this.element);
        cOffset = this.$element.offset();
        this.doScroll();
        axes = {
          horizontal: {
            contextOffset: isWin ? 0 : cOffset.left,
            contextScroll: isWin ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: 'right',
            backward: 'left',
            offsetProp: 'left'
          },
          vertical: {
            contextOffset: isWin ? 0 : cOffset.top,
            contextScroll: isWin ? 0 : this.oldScroll.y,
            contextDimension: isWin ? $[wps]('viewportHeight') : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up',
            offsetProp: 'top'
          }
        };
        return $.each(axes, function(aKey, axis) {
          return $.each(_this.waypoints[aKey], function(i, waypoint) {
            var adjustment, elementOffset, oldOffset, _ref, _ref1;

            adjustment = waypoint.options.offset;
            oldOffset = waypoint.offset;
            elementOffset = $.isWindow(waypoint.element) ? 0 : waypoint.$element.offset()[axis.offsetProp];
            if ($.isFunction(adjustment)) {
              adjustment = adjustment.apply(waypoint.element);
            } else if (typeof adjustment === 'string') {
              adjustment = parseFloat(adjustment);
              if (waypoint.options.offset.indexOf('%') > -1) {
                adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
              }
            }
            waypoint.offset = elementOffset - axis.contextOffset + axis.contextScroll - adjustment;
            if ((waypoint.options.onlyOnScroll && (oldOffset != null)) || !waypoint.enabled) {
              return;
            }
            if (oldOffset !== null && (oldOffset < (_ref = axis.oldScroll) && _ref <= waypoint.offset)) {
              return waypoint.trigger([axis.backward]);
            } else if (oldOffset !== null && (oldOffset > (_ref1 = axis.oldScroll) && _ref1 >= waypoint.offset)) {
              return waypoint.trigger([axis.forward]);
            } else if (oldOffset === null && axis.oldScroll >= waypoint.offset) {
              return waypoint.trigger([axis.forward]);
            }
          });
        });
      };

      Context.prototype.checkEmpty = function() {
        if ($.isEmptyObject(this.waypoints.horizontal) && $.isEmptyObject(this.waypoints.vertical)) {
          this.$element.unbind([resizeEvent, scrollEvent].join(' '));
          return delete contexts[this.id];
        }
      };

      return Context;

    })();
    Waypoint = (function() {
      function Waypoint($element, context, options) {
        var idList, _ref;

        options = $.extend({}, $.fn[wp].defaults, options);
        if (options.offset === 'bottom-in-view') {
          options.offset = function() {
            var contextHeight;

            contextHeight = $[wps]('viewportHeight');
            if (!$.isWindow(context.element)) {
              contextHeight = context.$element.height();
            }
            return contextHeight - $(this).outerHeight();
          };
        }
        this.$element = $element;
        this.element = $element[0];
        this.axis = options.horizontal ? 'horizontal' : 'vertical';
        this.callback = options.handler;
        this.context = context;
        this.enabled = options.enabled;
        this.id = 'waypoints' + waypointCounter++;
        this.offset = null;
        this.options = options;
        context.waypoints[this.axis][this.id] = this;
        allWaypoints[this.axis][this.id] = this;
        idList = (_ref = $element.data(waypointKey)) != null ? _ref : [];
        idList.push(this.id);
        $element.data(waypointKey, idList);
      }

      Waypoint.prototype.trigger = function(args) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, args);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };

      Waypoint.prototype.disable = function() {
        return this.enabled = false;
      };

      Waypoint.prototype.enable = function() {
        this.context.refresh();
        return this.enabled = true;
      };

      Waypoint.prototype.destroy = function() {
        delete allWaypoints[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };

      Waypoint.getWaypointsByElement = function(element) {
        var all, ids;

        ids = $(element).data(waypointKey);
        if (!ids) {
          return [];
        }
        all = $.extend({}, allWaypoints.horizontal, allWaypoints.vertical);
        return $.map(ids, function(id) {
          return all[id];
        });
      };

      return Waypoint;

    })();
    methods = {
      init: function(f, options) {
        var _ref;

        if (options == null) {
          options = {};
        }
        if ((_ref = options.handler) == null) {
          options.handler = f;
        }
        this.each(function() {
          var $this, context, contextElement, _ref1;

          $this = $(this);
          contextElement = (_ref1 = options.context) != null ? _ref1 : $.fn[wp].defaults.context;
          if (!$.isWindow(contextElement)) {
            contextElement = $this.closest(contextElement);
          }
          contextElement = $(contextElement);
          context = contexts[contextElement.data(contextKey)];
          if (!context) {
            context = new Context(contextElement);
          }
          return new Waypoint($this, context, options);
        });
        $[wps]('refresh');
        return this;
      },
      disable: function() {
        return methods._invoke(this, 'disable');
      },
      enable: function() {
        return methods._invoke(this, 'enable');
      },
      destroy: function() {
        return methods._invoke(this, 'destroy');
      },
      prev: function(axis, selector) {
        return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
          if (index > 0) {
            return stack.push(waypoints[index - 1]);
          }
        });
      },
      next: function(axis, selector) {
        return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
          if (index < waypoints.length - 1) {
            return stack.push(waypoints[index + 1]);
          }
        });
      },
      _traverse: function(axis, selector, push) {
        var stack, waypoints;

        if (axis == null) {
          axis = 'vertical';
        }
        if (selector == null) {
          selector = window;
        }
        waypoints = jQMethods.aggregate(selector);
        stack = [];
        this.each(function() {
          var index;

          index = $.inArray(this, waypoints[axis]);
          return push(stack, index, waypoints[axis]);
        });
        return this.pushStack(stack);
      },
      _invoke: function($elements, method) {
        $elements.each(function() {
          var waypoints;

          waypoints = Waypoint.getWaypointsByElement(this);
          return $.each(waypoints, function(i, waypoint) {
            waypoint[method]();
            return true;
          });
        });
        return this;
      }
    };
    $.fn[wp] = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (methods[method]) {
        return methods[method].apply(this, args);
      } else if ($.isFunction(method)) {
        return methods.init.apply(this, arguments);
      } else if ($.isPlainObject(method)) {
        return methods.init.apply(this, [null, method]);
      } else if (!method) {
        return $.error("jQuery Waypoints needs a callback function or handler option.");
      } else {
        return $.error("The " + method + " method does not exist in jQuery Waypoints.");
      }
    };
    $.fn[wp].defaults = {
      context: window,
      continuous: true,
      enabled: true,
      horizontal: false,
      offset: 0,
      triggerOnce: false
    };
    jQMethods = {
      refresh: function() {
        return $.each(contexts, function(i, context) {
          return context.refresh();
        });
      },
      viewportHeight: function() {
        var _ref;

        return (_ref = window.innerHeight) != null ? _ref : $w.height();
      },
      aggregate: function(contextSelector) {
        var collection, waypoints, _ref;

        collection = allWaypoints;
        if (contextSelector) {
          collection = (_ref = contexts[$(contextSelector).data(contextKey)]) != null ? _ref.waypoints : void 0;
        }
        if (!collection) {
          return [];
        }
        waypoints = {
          horizontal: [],
          vertical: []
        };
        $.each(waypoints, function(axis, arr) {
          $.each(collection[axis], function(key, waypoint) {
            return arr.push(waypoint);
          });
          arr.sort(function(a, b) {
            return a.offset - b.offset;
          });
          waypoints[axis] = $.map(arr, function(waypoint) {
            return waypoint.element;
          });
          return waypoints[axis] = $.unique(waypoints[axis]);
        });
        return waypoints;
      },
      above: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
          return waypoint.offset <= context.oldScroll.y;
        });
      },
      below: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
          return waypoint.offset > context.oldScroll.y;
        });
      },
      left: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
          return waypoint.offset <= context.oldScroll.x;
        });
      },
      right: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
          return waypoint.offset > context.oldScroll.x;
        });
      },
      enable: function() {
        return jQMethods._invoke('enable');
      },
      disable: function() {
        return jQMethods._invoke('disable');
      },
      destroy: function() {
        return jQMethods._invoke('destroy');
      },
      extendFn: function(methodName, f) {
        return methods[methodName] = f;
      },
      _invoke: function(method) {
        var waypoints;

        waypoints = $.extend({}, allWaypoints.vertical, allWaypoints.horizontal);
        return $.each(waypoints, function(key, waypoint) {
          waypoint[method]();
          return true;
        });
      },
      _filter: function(selector, axis, test) {
        var context, waypoints;

        context = contexts[$(selector).data(contextKey)];
        if (!context) {
          return [];
        }
        waypoints = [];
        $.each(context.waypoints[axis], function(i, waypoint) {
          if (test(context, waypoint)) {
            return waypoints.push(waypoint);
          }
        });
        waypoints.sort(function(a, b) {
          return a.offset - b.offset;
        });
        return $.map(waypoints, function(waypoint) {
          return waypoint.element;
        });
      }
    };
    $[wps] = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (jQMethods[method]) {
        return jQMethods[method].apply(null, args);
      } else {
        return jQMethods.aggregate.call(null, method);
      }
    };
    $[wps].settings = {
      resizeThrottle: 100,
      scrollThrottle: 30
    };
    return $w.load(function() {
      return $[wps]('refresh');
    });
  });

}).call(this);

// Generated by CoffeeScript 1.6.2
/*
Sticky Elements Shortcut for jQuery Waypoints - v2.0.5
Copyright (c) 2011-2014 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/


(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery', 'waypoints'], factory);
    } else {
      return factory(root.jQuery);
    }
  })(window, function($) {
    var defaults, wrap;

    defaults = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: 'stuck',
      direction: 'down right'
    };
    wrap = function($elements, options) {
      var $parent;

      $elements.wrap(options.wrapper);
      $parent = $elements.parent();
      return $parent.data('isWaypointStickyWrapper', true);
    };
    $.waypoints('extendFn', 'sticky', function(opt) {
      var $wrap, options, originalHandler;

      options = $.extend({}, $.fn.waypoint.defaults, defaults, opt);
      $wrap = wrap(this, options);
      originalHandler = options.handler;
      options.handler = function(direction) {
        var $sticky, shouldBeStuck;

        $sticky = $(this).children(':first');
        shouldBeStuck = options.direction.indexOf(direction) !== -1;
        $sticky.toggleClass(options.stuckClass, shouldBeStuck);
        $wrap.height(shouldBeStuck ? $sticky.outerHeight() : '');
        if (originalHandler != null) {
          return originalHandler.call(this, direction);
        }
      };
      $wrap.waypoint(options);
      return this.data('stuckClass', options.stuckClass);
    });
    return $.waypoints('extendFn', 'unsticky', function() {
      var $parent;

      $parent = this.parent();
      if (!$parent.data('isWaypointStickyWrapper')) {
        return this;
      }
      $parent.waypoint('destroy');
      this.unwrap();
      return this.removeClass(this.data('stuckClass'));
    });
  });

}).call(this);

(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};

		return $(this).each(function () {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),
				to:              $(this).data('to'),
				speed:           $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals:        $(this).data('decimals')
			}, options);

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// initialize the element with the starting value
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.text(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));

// Generated by CoffeeScript 1.3.3
(function() {
  var ROOT, STATE_DESC, m;

  m = {};

  ROOT = 'https://mandrillapp.com/api/1.0/';

  STATE_DESC = {
    1: 'OPENED',
    2: 'HEADERS_RECEIVED',
    3: 'LOADING',
    4: 'DONE'
  };

  m.Mandrill = (function() {

    function Mandrill(apikey, debug) {
      this.apikey = apikey;
      this.debug = debug != null ? debug : false;
      this.templates = new m.Templates(this);
      this.exports = new m.Exports(this);
      this.users = new m.Users(this);
      this.rejects = new m.Rejects(this);
      this.inbound = new m.Inbound(this);
      this.tags = new m.Tags(this);
      this.messages = new m.Messages(this);
      this.whitelists = new m.Whitelists(this);
      this.ips = new m.Ips(this);
      this.internal = new m.Internal(this);
      this.subaccounts = new m.Subaccounts(this);
      this.urls = new m.Urls(this);
      this.webhooks = new m.Webhooks(this);
      this.senders = new m.Senders(this);
      this.metadata = new m.Metadata(this);
    }

    Mandrill.prototype.call = function(uri, params, onresult, onerror) {
      var req,
        _this = this;
      if (params == null) {
        params = {};
      }
      params.key = this.apikey;
      params = JSON.stringify(params);
      req = new XMLHttpRequest();
      req.open('POST', "" + ROOT + uri + ".json");
      req.setRequestHeader('Content-Type', 'application/json');
      if (this.debug) {
        console.log("Mandrill: Opening request to " + ROOT + uri + ".json");
      }
      req.onreadystatechange = function() {
        var res;
        if (_this.debug) {
          console.log("Mandrill: Request state " + STATE_DESC[req.readyState]);
        }
        if (req.readyState !== 4) {
          return;
        }
        res = JSON.parse(req.responseText);
        if (res == null) {
          res = {
            status: 'error',
            name: 'GeneralError',
            message: 'An unexpected error occurred'
          };
        }
        if (req.status !== 200) {
          if (onerror) {
            return onerror(res);
          } else {
            return _this.onerror(res);
          }
        } else {
          if (onresult) {
            return onresult(res);
          }
        }
      };
      return req.send(params);
    };

    Mandrill.prototype.onerror = function(err) {
      throw {
        name: err.name,
        message: err.message,
        toString: function() {
          return "" + err.name + ": " + err.message;
        }
      };
    };

    return Mandrill;

  })();

  m.Templates = (function() {

    function Templates(master) {
      this.master = master;
    }

    /*
        Add a new template
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the name for the new template - must be unique
        @option params {String} from_email a default sending address for emails sent using this template
        @option params {String} from_name a default from name to be used
        @option params {String} subject a default subject line to be used
        @option params {String} code the HTML code for the template with mc:edit attributes for the editable elements
        @option params {String} text a default text part to be used when sending with this template
        @option params {Boolean} publish set to false to add a draft template without publishing
        @option params {Array} labels an optional array of up to 10 labels to use for filtering templates
             - labels[] {String} a single label
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.add = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["from_email"]) == null) {
        params["from_email"] = null;
      }
      if ((_ref1 = params["from_name"]) == null) {
        params["from_name"] = null;
      }
      if ((_ref2 = params["subject"]) == null) {
        params["subject"] = null;
      }
      if ((_ref3 = params["code"]) == null) {
        params["code"] = null;
      }
      if ((_ref4 = params["text"]) == null) {
        params["text"] = null;
      }
      if ((_ref5 = params["publish"]) == null) {
        params["publish"] = true;
      }
      if ((_ref6 = params["labels"]) == null) {
        params["labels"] = [];
      }
      return this.master.call('templates/add', params, onsuccess, onerror);
    };

    /*
        Get the information for an existing template
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the immutable name of an existing template
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('templates/info', params, onsuccess, onerror);
    };

    /*
        Update the code for an existing template. If null is provided for any fields, the values will remain unchanged.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the immutable name of an existing template
        @option params {String} from_email the new default sending address
        @option params {String} from_name the new default from name
        @option params {String} subject the new default subject line
        @option params {String} code the new code for the template
        @option params {String} text the new default text part to be used
        @option params {Boolean} publish set to false to update the draft version of the template without publishing
        @option params {Array} labels an optional array of up to 10 labels to use for filtering templates
             - labels[] {String} a single label
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.update = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["from_email"]) == null) {
        params["from_email"] = null;
      }
      if ((_ref1 = params["from_name"]) == null) {
        params["from_name"] = null;
      }
      if ((_ref2 = params["subject"]) == null) {
        params["subject"] = null;
      }
      if ((_ref3 = params["code"]) == null) {
        params["code"] = null;
      }
      if ((_ref4 = params["text"]) == null) {
        params["text"] = null;
      }
      if ((_ref5 = params["publish"]) == null) {
        params["publish"] = true;
      }
      if ((_ref6 = params["labels"]) == null) {
        params["labels"] = null;
      }
      return this.master.call('templates/update', params, onsuccess, onerror);
    };

    /*
        Publish the content for the template. Any new messages sent using this template will start using the content that was previously in draft.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the immutable name of an existing template
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.publish = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('templates/publish', params, onsuccess, onerror);
    };

    /*
        Delete a template
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the immutable name of an existing template
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('templates/delete', params, onsuccess, onerror);
    };

    /*
        Return a list of all the templates available to this user
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} label an optional label to filter the templates
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.list = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["label"]) == null) {
        params["label"] = null;
      }
      return this.master.call('templates/list', params, onsuccess, onerror);
    };

    /*
        Return the recent history (hourly stats for the last 30 days) for a template
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the name of an existing template
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.timeSeries = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('templates/time-series', params, onsuccess, onerror);
    };

    /*
        Inject content and optionally merge fields into a template, returning the HTML that results
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} template_name the immutable name of a template that exists in the user's account
        @option params {Array} template_content an array of template content to render.  Each item in the array should be a struct with two keys - name: the name of the content block to set the content for, and content: the actual content to put into the block
             - template_content[] {Object} the injection of a single piece of content into a single editable region
                 - name {String} the name of the mc:edit editable region to inject into
                 - content {String} the content to inject
        @option params {Array} merge_vars optional merge variables to use for injecting merge field content.  If this is not provided, no merge fields will be replaced.
             - merge_vars[] {Object} a single merge variable
                 - name {String} the merge variable's name. Merge variable names are case-insensitive and may not start with _
                 - content {String} the merge variable's content
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Templates.prototype.render = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["merge_vars"]) == null) {
        params["merge_vars"] = null;
      }
      return this.master.call('templates/render', params, onsuccess, onerror);
    };

    return Templates;

  })();

  m.Exports = (function() {

    function Exports(master) {
      this.master = master;
    }

    /*
        Returns information about an export job. If the export job's state is 'complete',
    the returned data will include a URL you can use to fetch the results. Every export
    job produces a zip archive, but the format of the archive is distinct for each job
    type. The api calls that initiate exports include more details about the output format
    for that job type.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id an export job identifier
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Exports.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('exports/info', params, onsuccess, onerror);
    };

    /*
        Returns a list of your exports.
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Exports.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('exports/list', params, onsuccess, onerror);
    };

    /*
        Begins an export of your rejection blacklist. The blacklist will be exported to a zip archive
    containing a single file named rejects.csv that includes the following fields: email,
    reason, detail, created_at, expires_at, last_event_at, expires_at.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} notify_email an optional email address to notify when the export job has finished.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Exports.prototype.rejects = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["notify_email"]) == null) {
        params["notify_email"] = null;
      }
      return this.master.call('exports/rejects', params, onsuccess, onerror);
    };

    /*
        Begins an export of your rejection whitelist. The whitelist will be exported to a zip archive
    containing a single file named whitelist.csv that includes the following fields:
    email, detail, created_at.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} notify_email an optional email address to notify when the export job has finished.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Exports.prototype.whitelist = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["notify_email"]) == null) {
        params["notify_email"] = null;
      }
      return this.master.call('exports/whitelist', params, onsuccess, onerror);
    };

    /*
        Begins an export of your activity history. The activity will be exported to a zip archive
    containing a single file named activity.csv in the same format as you would be able to export
    from your account's activity view. It includes the following fields: Date, Email Address,
    Sender, Subject, Status, Tags, Opens, Clicks, Bounce Detail. If you have configured any custom
    metadata fields, they will be included in the exported data.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} notify_email an optional email address to notify when the export job has finished
        @option params {String} date_from start date as a UTC string in YYYY-MM-DD HH:MM:SS format
        @option params {String} date_to end date as a UTC string in YYYY-MM-DD HH:MM:SS format
        @option params {Array} tags an array of tag names to narrow the export to; will match messages that contain ANY of the tags
             - tags[] {String} a tag name
        @option params {Array} senders an array of senders to narrow the export to
             - senders[] {String} a sender address
        @option params {Array} states an array of states to narrow the export to; messages with ANY of the states will be included
             - states[] {String} a message state
        @option params {Array} api_keys an array of api keys to narrow the export to; messsagse sent with ANY of the keys will be included
             - api_keys[] {String} an API key associated with your account
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Exports.prototype.activity = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["notify_email"]) == null) {
        params["notify_email"] = null;
      }
      if ((_ref1 = params["date_from"]) == null) {
        params["date_from"] = null;
      }
      if ((_ref2 = params["date_to"]) == null) {
        params["date_to"] = null;
      }
      if ((_ref3 = params["tags"]) == null) {
        params["tags"] = null;
      }
      if ((_ref4 = params["senders"]) == null) {
        params["senders"] = null;
      }
      if ((_ref5 = params["states"]) == null) {
        params["states"] = null;
      }
      if ((_ref6 = params["api_keys"]) == null) {
        params["api_keys"] = null;
      }
      return this.master.call('exports/activity', params, onsuccess, onerror);
    };

    return Exports;

  })();

  m.Users = (function() {

    function Users(master) {
      this.master = master;
    }

    /*
        Return the information about the API-connected user
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Users.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('users/info', params, onsuccess, onerror);
    };

    /*
        Validate an API key and respond to a ping
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Users.prototype.ping = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('users/ping', params, onsuccess, onerror);
    };

    /*
        Validate an API key and respond to a ping (anal JSON parser version)
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Users.prototype.ping2 = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('users/ping2', params, onsuccess, onerror);
    };

    /*
        Return the senders that have tried to use this account, both verified and unverified
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Users.prototype.senders = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('users/senders', params, onsuccess, onerror);
    };

    return Users;

  })();

  m.Rejects = (function() {

    function Rejects(master) {
      this.master = master;
    }

    /*
        Adds an email to your email rejection blacklist. Addresses that you
    add manually will never expire and there is no reputation penalty
    for removing them from your blacklist. Attempting to blacklist an
    address that has been whitelisted will have no effect.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} email an email address to block
        @option params {String} comment an optional comment describing the rejection
        @option params {String} subaccount an optional unique identifier for the subaccount to limit the blacklist entry
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Rejects.prototype.add = function(params, onsuccess, onerror) {
      var _ref, _ref1;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["comment"]) == null) {
        params["comment"] = null;
      }
      if ((_ref1 = params["subaccount"]) == null) {
        params["subaccount"] = null;
      }
      return this.master.call('rejects/add', params, onsuccess, onerror);
    };

    /*
        Retrieves your email rejection blacklist. You can provide an email
    address to limit the results. Returns up to 1000 results. By default,
    entries that have expired are excluded from the results; set
    include_expired to true to include them.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} email an optional email address to search by
        @option params {Boolean} include_expired whether to include rejections that have already expired.
        @option params {String} subaccount an optional unique identifier for the subaccount to limit the blacklist
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Rejects.prototype.list = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["email"]) == null) {
        params["email"] = null;
      }
      if ((_ref1 = params["include_expired"]) == null) {
        params["include_expired"] = false;
      }
      if ((_ref2 = params["subaccount"]) == null) {
        params["subaccount"] = null;
      }
      return this.master.call('rejects/list', params, onsuccess, onerror);
    };

    /*
        Deletes an email rejection. There is no limit to how many rejections
    you can remove from your blacklist, but keep in mind that each deletion
    has an affect on your reputation.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} email an email address
        @option params {String} subaccount an optional unique identifier for the subaccount to limit the blacklist deletion
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Rejects.prototype["delete"] = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["subaccount"]) == null) {
        params["subaccount"] = null;
      }
      return this.master.call('rejects/delete', params, onsuccess, onerror);
    };

    return Rejects;

  })();

  m.Inbound = (function() {

    function Inbound(master) {
      this.master = master;
    }

    /*
        List the domains that have been configured for inbound delivery
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.domains = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/domains', params, onsuccess, onerror);
    };

    /*
        Add an inbound domain to your account
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain a domain name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.addDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/add-domain', params, onsuccess, onerror);
    };

    /*
        Check the MX settings for an inbound domain. The domain must have already been added with the add-domain call
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain an existing inbound domain
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.checkDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/check-domain', params, onsuccess, onerror);
    };

    /*
        Delete an inbound domain from the account. All mail will stop routing for this domain immediately.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain an existing inbound domain
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.deleteDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/delete-domain', params, onsuccess, onerror);
    };

    /*
        List the mailbox routes defined for an inbound domain
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain the domain to check
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.routes = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/routes', params, onsuccess, onerror);
    };

    /*
        Add a new mailbox route to an inbound domain
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain an existing inbound domain
        @option params {String} pattern the search pattern that the mailbox name should match
        @option params {String} url the webhook URL where the inbound messages will be published
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.addRoute = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/add-route', params, onsuccess, onerror);
    };

    /*
        Update the pattern or webhook of an existing inbound mailbox route. If null is provided for any fields, the values will remain unchanged.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of an existing mailbox route
        @option params {String} pattern the search pattern that the mailbox name should match
        @option params {String} url the webhook URL where the inbound messages will be published
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.updateRoute = function(params, onsuccess, onerror) {
      var _ref, _ref1;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["pattern"]) == null) {
        params["pattern"] = null;
      }
      if ((_ref1 = params["url"]) == null) {
        params["url"] = null;
      }
      return this.master.call('inbound/update-route', params, onsuccess, onerror);
    };

    /*
        Delete an existing inbound mailbox route
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of an existing route
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.deleteRoute = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('inbound/delete-route', params, onsuccess, onerror);
    };

    /*
        Take a raw MIME document destined for a domain with inbound domains set up, and send it to the inbound hook exactly as if it had been sent over SMTP
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} raw_message the full MIME document of an email message
        @option params {Array|null} to optionally define the recipients to receive the message - otherwise we'll use the To, Cc, and Bcc headers provided in the document
             - to[] {String} the email address of the recipient
        @option params {String} mail_from the address specified in the MAIL FROM stage of the SMTP conversation. Required for the SPF check.
        @option params {String} helo the identification provided by the client mta in the MTA state of the SMTP conversation. Required for the SPF check.
        @option params {String} client_address the remote MTA's ip address. Optional; required for the SPF check.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Inbound.prototype.sendRaw = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["to"]) == null) {
        params["to"] = null;
      }
      if ((_ref1 = params["mail_from"]) == null) {
        params["mail_from"] = null;
      }
      if ((_ref2 = params["helo"]) == null) {
        params["helo"] = null;
      }
      if ((_ref3 = params["client_address"]) == null) {
        params["client_address"] = null;
      }
      return this.master.call('inbound/send-raw', params, onsuccess, onerror);
    };

    return Inbound;

  })();

  m.Tags = (function() {

    function Tags(master) {
      this.master = master;
    }

    /*
        Return all of the user-defined tag information
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Tags.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('tags/list', params, onsuccess, onerror);
    };

    /*
        Deletes a tag permanently. Deleting a tag removes the tag from any messages
    that have been sent, and also deletes the tag's stats. There is no way to
    undo this operation, so use it carefully.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} tag a tag name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Tags.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('tags/delete', params, onsuccess, onerror);
    };

    /*
        Return more detailed information about a single tag, including aggregates of recent stats
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} tag an existing tag name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Tags.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('tags/info', params, onsuccess, onerror);
    };

    /*
        Return the recent history (hourly stats for the last 30 days) for a tag
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} tag an existing tag name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Tags.prototype.timeSeries = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('tags/time-series', params, onsuccess, onerror);
    };

    /*
        Return the recent history (hourly stats for the last 30 days) for all tags
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Tags.prototype.allTimeSeries = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('tags/all-time-series', params, onsuccess, onerror);
    };

    return Tags;

  })();

  m.Messages = (function() {

    function Messages(master) {
      this.master = master;
    }

    /*
        Send a new transactional message through Mandrill
        @param {Object} params the hash of the parameters to pass to the request
        @option params {Struct} message the information on the message to send
             - html {String} the full HTML content to be sent
             - text {String} optional full text content to be sent
             - subject {String} the message subject
             - from_email {String} the sender email address.
             - from_name {String} optional from name to be used
             - to {Array} an array of recipient information.
                 - to[] {Object} a single recipient's information.
                     - email {String} the email address of the recipient
                     - name {String} the optional display name to use for the recipient
                     - type {String} the header type to use for the recipient, defaults to "to" if not provided
             - headers {Object} optional extra headers to add to the message (most headers are allowed)
             - important {Boolean} whether or not this message is important, and should be delivered ahead of non-important messages
             - track_opens {Boolean} whether or not to turn on open tracking for the message
             - track_clicks {Boolean} whether or not to turn on click tracking for the message
             - auto_text {Boolean} whether or not to automatically generate a text part for messages that are not given text
             - auto_html {Boolean} whether or not to automatically generate an HTML part for messages that are not given HTML
             - inline_css {Boolean} whether or not to automatically inline all CSS styles provided in the message HTML - only for HTML documents less than 256KB in size
             - url_strip_qs {Boolean} whether or not to strip the query string from URLs when aggregating tracked URL data
             - preserve_recipients {Boolean} whether or not to expose all recipients in to "To" header for each email
             - view_content_link {Boolean} set to false to remove content logging for sensitive emails
             - bcc_address {String} an optional address to receive an exact copy of each recipient's email
             - tracking_domain {String} a custom domain to use for tracking opens and clicks instead of mandrillapp.com
             - signing_domain {String} a custom domain to use for SPF/DKIM signing instead of mandrill (for "via" or "on behalf of" in email clients)
             - return_path_domain {String} a custom domain to use for the messages's return-path
             - merge {Boolean} whether to evaluate merge tags in the message. Will automatically be set to true if either merge_vars or global_merge_vars are provided.
             - global_merge_vars {Array} global merge variables to use for all recipients. You can override these per recipient.
                 - global_merge_vars[] {Object} a single global merge variable
                     - name {String} the global merge variable's name. Merge variable names are case-insensitive and may not start with _
                     - content {String} the global merge variable's content
             - merge_vars {Array} per-recipient merge variables, which override global merge variables with the same name.
                 - merge_vars[] {Object} per-recipient merge variables
                     - rcpt {String} the email address of the recipient that the merge variables should apply to
                     - vars {Array} the recipient's merge variables
                         - vars[] {Object} a single merge variable
                             - name {String} the merge variable's name. Merge variable names are case-insensitive and may not start with _
                             - content {String} the merge variable's content
             - tags {Array} an array of string to tag the message with.  Stats are accumulated using tags, though we only store the first 100 we see, so this should not be unique or change frequently.  Tags should be 50 characters or less.  Any tags starting with an underscore are reserved for internal use and will cause errors.
                 - tags[] {String} a single tag - must not start with an underscore
             - subaccount {String} the unique id of a subaccount for this message - must already exist or will fail with an error
             - google_analytics_domains {Array} an array of strings indicating for which any matching URLs will automatically have Google Analytics parameters appended to their query string automatically.
             - google_analytics_campaign {Array|string} optional string indicating the value to set for the utm_campaign tracking parameter. If this isn't provided the email's from address will be used instead.
             - metadata {Array} metadata an associative array of user metadata. Mandrill will store this metadata and make it available for retrieval. In addition, you can select up to 10 metadata fields to index and make searchable using the Mandrill search api.
             - recipient_metadata {Array} Per-recipient metadata that will override the global values specified in the metadata parameter.
                 - recipient_metadata[] {Object} metadata for a single recipient
                     - rcpt {String} the email address of the recipient that the metadata is associated with
                     - values {Array} an associated array containing the recipient's unique metadata. If a key exists in both the per-recipient metadata and the global metadata, the per-recipient metadata will be used.
             - attachments {Array} an array of supported attachments to add to the message
                 - attachments[] {Object} a single supported attachment
                     - type {String} the MIME type of the attachment
                     - name {String} the file name of the attachment
                     - content {String} the content of the attachment as a base64-encoded string
             - images {Array} an array of embedded images to add to the message
                 - images[] {Object} a single embedded image
                     - type {String} the MIME type of the image - must start with "image/"
                     - name {String} the Content ID of the image - use <img src="cid:THIS_VALUE"> to reference the image in your HTML content
                     - content {String} the content of the image as a base64-encoded string
        @option params {Boolean} async enable a background sending mode that is optimized for bulk sending. In async mode, messages/send will immediately return a status of "queued" for every recipient. To handle rejections when sending in async mode, set up a webhook for the 'reject' event. Defaults to false for messages with no more than 10 recipients; messages with more than 10 recipients are always sent asynchronously, regardless of the value of async.
        @option params {String} ip_pool the name of the dedicated ip pool that should be used to send the message. If you do not have any dedicated IPs, this parameter has no effect. If you specify a pool that does not exist, your default pool will be used instead.
        @option params {String} send_at when this message should be sent as a UTC timestamp in YYYY-MM-DD HH:MM:SS format. If you specify a time in the past, the message will be sent immediately. An additional fee applies for scheduled email, and this feature is only available to accounts with a positive balance.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.send = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["async"]) == null) {
        params["async"] = false;
      }
      if ((_ref1 = params["ip_pool"]) == null) {
        params["ip_pool"] = null;
      }
      if ((_ref2 = params["send_at"]) == null) {
        params["send_at"] = null;
      }
      return this.master.call('messages/send', params, onsuccess, onerror);
    };

    /*
        Send a new transactional message through Mandrill using a template
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} template_name the immutable name or slug of a template that exists in the user's account. For backwards-compatibility, the template name may also be used but the immutable slug is preferred.
        @option params {Array} template_content an array of template content to send.  Each item in the array should be a struct with two keys - name: the name of the content block to set the content for, and content: the actual content to put into the block
             - template_content[] {Object} the injection of a single piece of content into a single editable region
                 - name {String} the name of the mc:edit editable region to inject into
                 - content {String} the content to inject
        @option params {Struct} message the other information on the message to send - same as /messages/send, but without the html content
             - html {String} optional full HTML content to be sent if not in template
             - text {String} optional full text content to be sent
             - subject {String} the message subject
             - from_email {String} the sender email address.
             - from_name {String} optional from name to be used
             - to {Array} an array of recipient information.
                 - to[] {Object} a single recipient's information.
                     - email {String} the email address of the recipient
                     - name {String} the optional display name to use for the recipient
                     - type {String} the header type to use for the recipient, defaults to "to" if not provided
             - headers {Object} optional extra headers to add to the message (most headers are allowed)
             - important {Boolean} whether or not this message is important, and should be delivered ahead of non-important messages
             - track_opens {Boolean} whether or not to turn on open tracking for the message
             - track_clicks {Boolean} whether or not to turn on click tracking for the message
             - auto_text {Boolean} whether or not to automatically generate a text part for messages that are not given text
             - auto_html {Boolean} whether or not to automatically generate an HTML part for messages that are not given HTML
             - inline_css {Boolean} whether or not to automatically inline all CSS styles provided in the message HTML - only for HTML documents less than 256KB in size
             - url_strip_qs {Boolean} whether or not to strip the query string from URLs when aggregating tracked URL data
             - preserve_recipients {Boolean} whether or not to expose all recipients in to "To" header for each email
             - view_content_link {Boolean} set to false to remove content logging for sensitive emails
             - bcc_address {String} an optional address to receive an exact copy of each recipient's email
             - tracking_domain {String} a custom domain to use for tracking opens and clicks instead of mandrillapp.com
             - signing_domain {String} a custom domain to use for SPF/DKIM signing instead of mandrill (for "via" or "on behalf of" in email clients)
             - return_path_domain {String} a custom domain to use for the messages's return-path
             - merge {Boolean} whether to evaluate merge tags in the message. Will automatically be set to true if either merge_vars or global_merge_vars are provided.
             - global_merge_vars {Array} global merge variables to use for all recipients. You can override these per recipient.
                 - global_merge_vars[] {Object} a single global merge variable
                     - name {String} the global merge variable's name. Merge variable names are case-insensitive and may not start with _
                     - content {String} the global merge variable's content
             - merge_vars {Array} per-recipient merge variables, which override global merge variables with the same name.
                 - merge_vars[] {Object} per-recipient merge variables
                     - rcpt {String} the email address of the recipient that the merge variables should apply to
                     - vars {Array} the recipient's merge variables
                         - vars[] {Object} a single merge variable
                             - name {String} the merge variable's name. Merge variable names are case-insensitive and may not start with _
                             - content {String} the merge variable's content
             - tags {Array} an array of string to tag the message with.  Stats are accumulated using tags, though we only store the first 100 we see, so this should not be unique or change frequently.  Tags should be 50 characters or less.  Any tags starting with an underscore are reserved for internal use and will cause errors.
                 - tags[] {String} a single tag - must not start with an underscore
             - subaccount {String} the unique id of a subaccount for this message - must already exist or will fail with an error
             - google_analytics_domains {Array} an array of strings indicating for which any matching URLs will automatically have Google Analytics parameters appended to their query string automatically.
             - google_analytics_campaign {Array|string} optional string indicating the value to set for the utm_campaign tracking parameter. If this isn't provided the email's from address will be used instead.
             - metadata {Array} metadata an associative array of user metadata. Mandrill will store this metadata and make it available for retrieval. In addition, you can select up to 10 metadata fields to index and make searchable using the Mandrill search api.
             - recipient_metadata {Array} Per-recipient metadata that will override the global values specified in the metadata parameter.
                 - recipient_metadata[] {Object} metadata for a single recipient
                     - rcpt {String} the email address of the recipient that the metadata is associated with
                     - values {Array} an associated array containing the recipient's unique metadata. If a key exists in both the per-recipient metadata and the global metadata, the per-recipient metadata will be used.
             - attachments {Array} an array of supported attachments to add to the message
                 - attachments[] {Object} a single supported attachment
                     - type {String} the MIME type of the attachment
                     - name {String} the file name of the attachment
                     - content {String} the content of the attachment as a base64-encoded string
             - images {Array} an array of embedded images to add to the message
                 - images[] {Object} a single embedded image
                     - type {String} the MIME type of the image - must start with "image/"
                     - name {String} the Content ID of the image - use <img src="cid:THIS_VALUE"> to reference the image in your HTML content
                     - content {String} the content of the image as a base64-encoded string
        @option params {Boolean} async enable a background sending mode that is optimized for bulk sending. In async mode, messages/send will immediately return a status of "queued" for every recipient. To handle rejections when sending in async mode, set up a webhook for the 'reject' event. Defaults to false for messages with no more than 10 recipients; messages with more than 10 recipients are always sent asynchronously, regardless of the value of async.
        @option params {String} ip_pool the name of the dedicated ip pool that should be used to send the message. If you do not have any dedicated IPs, this parameter has no effect. If you specify a pool that does not exist, your default pool will be used instead.
        @option params {String} send_at when this message should be sent as a UTC timestamp in YYYY-MM-DD HH:MM:SS format. If you specify a time in the past, the message will be sent immediately. An additional fee applies for scheduled email, and this feature is only available to accounts with a positive balance.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.sendTemplate = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["async"]) == null) {
        params["async"] = false;
      }
      if ((_ref1 = params["ip_pool"]) == null) {
        params["ip_pool"] = null;
      }
      if ((_ref2 = params["send_at"]) == null) {
        params["send_at"] = null;
      }
      return this.master.call('messages/send-template', params, onsuccess, onerror);
    };

    /*
        Search recently sent messages and optionally narrow by date range, tags, senders, and API keys. If no date range is specified, results within the last 7 days are returned. This method may be called up to 20 times per minute. If you need the data more often, you can use <a href="/api/docs/messages.html#method=info">/messages/info.json</a> to get the information for a single message, or <a href="http://help.mandrill.com/entries/21738186-Introduction-to-Webhooks">webhooks</a> to push activity to your own application for querying.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} query <a href="http://help.mandrill.com/entries/22211902">search terms</a> to find matching messages
        @option params {String} date_from start date
        @option params {String} date_to end date
        @option params {Array} tags an array of tag names to narrow the search to, will return messages that contain ANY of the tags
        @option params {Array} senders an array of sender addresses to narrow the search to, will return messages sent by ANY of the senders
        @option params {Array} api_keys an array of API keys to narrow the search to, will return messages sent by ANY of the keys
        @option params {Integer} limit the maximum number of results to return, defaults to 100, 1000 is the maximum
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.search = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["query"]) == null) {
        params["query"] = '*';
      }
      if ((_ref1 = params["date_from"]) == null) {
        params["date_from"] = null;
      }
      if ((_ref2 = params["date_to"]) == null) {
        params["date_to"] = null;
      }
      if ((_ref3 = params["tags"]) == null) {
        params["tags"] = null;
      }
      if ((_ref4 = params["senders"]) == null) {
        params["senders"] = null;
      }
      if ((_ref5 = params["api_keys"]) == null) {
        params["api_keys"] = null;
      }
      if ((_ref6 = params["limit"]) == null) {
        params["limit"] = 100;
      }
      return this.master.call('messages/search', params, onsuccess, onerror);
    };

    /*
        Search the content of recently sent messages and return the aggregated hourly stats for matching messages
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} query the search terms to find matching messages for
        @option params {String} date_from start date
        @option params {String} date_to end date
        @option params {Array} tags an array of tag names to narrow the search to, will return messages that contain ANY of the tags
        @option params {Array} senders an array of sender addresses to narrow the search to, will return messages sent by ANY of the senders
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.searchTimeSeries = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3, _ref4;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["query"]) == null) {
        params["query"] = '*';
      }
      if ((_ref1 = params["date_from"]) == null) {
        params["date_from"] = null;
      }
      if ((_ref2 = params["date_to"]) == null) {
        params["date_to"] = null;
      }
      if ((_ref3 = params["tags"]) == null) {
        params["tags"] = null;
      }
      if ((_ref4 = params["senders"]) == null) {
        params["senders"] = null;
      }
      return this.master.call('messages/search-time-series', params, onsuccess, onerror);
    };

    /*
        Get the information for a single recently sent message
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique id of the message to get - passed as the "_id" field in webhooks, send calls, or search calls
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('messages/info', params, onsuccess, onerror);
    };

    /*
        Get the full content of a recently sent message
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique id of the message to get - passed as the "_id" field in webhooks, send calls, or search calls
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.content = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('messages/content', params, onsuccess, onerror);
    };

    /*
        Parse the full MIME document for an email message, returning the content of the message broken into its constituent pieces
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} raw_message the full MIME document of an email message
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.parse = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('messages/parse', params, onsuccess, onerror);
    };

    /*
        Take a raw MIME document for a message, and send it exactly as if it were sent through Mandrill's SMTP servers
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} raw_message the full MIME document of an email message
        @option params {String|null} from_email optionally define the sender address - otherwise we'll use the address found in the provided headers
        @option params {String|null} from_name optionally define the sender alias
        @option params {Array|null} to optionally define the recipients to receive the message - otherwise we'll use the To, Cc, and Bcc headers provided in the document
             - to[] {String} the email address of the recipient
        @option params {Boolean} async enable a background sending mode that is optimized for bulk sending. In async mode, messages/sendRaw will immediately return a status of "queued" for every recipient. To handle rejections when sending in async mode, set up a webhook for the 'reject' event. Defaults to false for messages with no more than 10 recipients; messages with more than 10 recipients are always sent asynchronously, regardless of the value of async.
        @option params {String} ip_pool the name of the dedicated ip pool that should be used to send the message. If you do not have any dedicated IPs, this parameter has no effect. If you specify a pool that does not exist, your default pool will be used instead.
        @option params {String} send_at when this message should be sent as a UTC timestamp in YYYY-MM-DD HH:MM:SS format. If you specify a time in the past, the message will be sent immediately.
        @option params {String} return_path_domain a custom domain to use for the messages's return-path
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.sendRaw = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["from_email"]) == null) {
        params["from_email"] = null;
      }
      if ((_ref1 = params["from_name"]) == null) {
        params["from_name"] = null;
      }
      if ((_ref2 = params["to"]) == null) {
        params["to"] = null;
      }
      if ((_ref3 = params["async"]) == null) {
        params["async"] = false;
      }
      if ((_ref4 = params["ip_pool"]) == null) {
        params["ip_pool"] = null;
      }
      if ((_ref5 = params["send_at"]) == null) {
        params["send_at"] = null;
      }
      if ((_ref6 = params["return_path_domain"]) == null) {
        params["return_path_domain"] = null;
      }
      return this.master.call('messages/send-raw', params, onsuccess, onerror);
    };

    /*
        Queries your scheduled emails by sender or recipient, or both.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} to an optional recipient address to restrict results to
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.listScheduled = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["to"]) == null) {
        params["to"] = null;
      }
      return this.master.call('messages/list-scheduled', params, onsuccess, onerror);
    };

    /*
        Cancels a scheduled email.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id a scheduled email id, as returned by any of the messages/send calls or messages/list-scheduled
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.cancelScheduled = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('messages/cancel-scheduled', params, onsuccess, onerror);
    };

    /*
        Reschedules a scheduled email.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id a scheduled email id, as returned by any of the messages/send calls or messages/list-scheduled
        @option params {String} send_at the new UTC timestamp when the message should sent. Mandrill can't time travel, so if you specify a time in past the message will be sent immediately
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Messages.prototype.reschedule = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('messages/reschedule', params, onsuccess, onerror);
    };

    return Messages;

  })();

  m.Whitelists = (function() {

    function Whitelists(master) {
      this.master = master;
    }

    /*
        Adds an email to your email rejection whitelist. If the address is
    currently on your blacklist, that blacklist entry will be removed
    automatically.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} email an email address to add to the whitelist
        @option params {String} comment an optional description of why the email was whitelisted
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Whitelists.prototype.add = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["comment"]) == null) {
        params["comment"] = null;
      }
      return this.master.call('whitelists/add', params, onsuccess, onerror);
    };

    /*
        Retrieves your email rejection whitelist. You can provide an email
    address or search prefix to limit the results. Returns up to 1000 results.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} email an optional email address or prefix to search by
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Whitelists.prototype.list = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["email"]) == null) {
        params["email"] = null;
      }
      return this.master.call('whitelists/list', params, onsuccess, onerror);
    };

    /*
        Removes an email address from the whitelist.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} email the email address to remove from the whitelist
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Whitelists.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('whitelists/delete', params, onsuccess, onerror);
    };

    return Whitelists;

  })();

  m.Ips = (function() {

    function Ips(master) {
      this.master = master;
    }

    /*
        Lists your dedicated IPs.
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/list', params, onsuccess, onerror);
    };

    /*
        Retrieves information about a single dedicated ip.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip a dedicated IP address
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/info', params, onsuccess, onerror);
    };

    /*
        Requests an additional dedicated IP for your account. Accounts may
    have one outstanding request at any time, and provisioning requests
    are processed within 24 hours.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {Boolean} warmup whether to enable warmup mode for the ip
        @option params {String} pool the id of the pool to add the dedicated ip to, or null to use your account's default pool
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.provision = function(params, onsuccess, onerror) {
      var _ref, _ref1;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["warmup"]) == null) {
        params["warmup"] = false;
      }
      if ((_ref1 = params["pool"]) == null) {
        params["pool"] = null;
      }
      return this.master.call('ips/provision', params, onsuccess, onerror);
    };

    /*
        Begins the warmup process for a dedicated IP. During the warmup process,
    Mandrill will gradually increase the percentage of your mail that is sent over
    the warming-up IP, over a period of roughly 30 days. The rest of your mail
    will be sent over shared IPs or other dedicated IPs in the same pool.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip a dedicated ip address
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.startWarmup = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/start-warmup', params, onsuccess, onerror);
    };

    /*
        Cancels the warmup process for a dedicated IP.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip a dedicated ip address
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.cancelWarmup = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/cancel-warmup', params, onsuccess, onerror);
    };

    /*
        Moves a dedicated IP to a different pool.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip a dedicated ip address
        @option params {String} pool the name of the new pool to add the dedicated ip to
        @option params {Boolean} create_pool whether to create the pool if it does not exist; if false and the pool does not exist, an Unknown_Pool will be thrown.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.setPool = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["create_pool"]) == null) {
        params["create_pool"] = false;
      }
      return this.master.call('ips/set-pool', params, onsuccess, onerror);
    };

    /*
        Deletes a dedicated IP. This is permanent and cannot be undone.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip the dedicated ip to remove from your account
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/delete', params, onsuccess, onerror);
    };

    /*
        Lists your dedicated IP pools.
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.listPools = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/list-pools', params, onsuccess, onerror);
    };

    /*
        Describes a single dedicated IP pool.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} pool a pool name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.poolInfo = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/pool-info', params, onsuccess, onerror);
    };

    /*
        Creates a pool and returns it. If a pool already exists with this
    name, no action will be performed.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} pool the name of a pool to create
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.createPool = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/create-pool', params, onsuccess, onerror);
    };

    /*
        Deletes a pool. A pool must be empty before you can delete it, and you cannot delete your default pool.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} pool the name of the pool to delete
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.deletePool = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/delete-pool', params, onsuccess, onerror);
    };

    /*
        Tests whether a domain name is valid for use as the custom reverse
    DNS for a dedicated IP.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip a dedicated ip address
        @option params {String} domain the domain name to test
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.checkCustomDns = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/check-custom-dns', params, onsuccess, onerror);
    };

    /*
        Configures the custom DNS name for a dedicated IP.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} ip a dedicated ip address
        @option params {String} domain a domain name to set as the dedicated IP's custom dns name.
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Ips.prototype.setCustomDns = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('ips/set-custom-dns', params, onsuccess, onerror);
    };

    return Ips;

  })();

  m.Internal = (function() {

    function Internal(master) {
      this.master = master;
    }

    return Internal;

  })();

  m.Subaccounts = (function() {

    function Subaccounts(master) {
      this.master = master;
    }

    /*
        Get the list of subaccounts defined for the account, optionally filtered by a prefix
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} q an optional prefix to filter the subaccounts' ids and names
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype.list = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["q"]) == null) {
        params["q"] = null;
      }
      return this.master.call('subaccounts/list', params, onsuccess, onerror);
    };

    /*
        Add a new subaccount
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id a unique identifier for the subaccount to be used in sending calls
        @option params {String} name an optional display name to further identify the subaccount
        @option params {String} notes optional extra text to associate with the subaccount
        @option params {Integer} custom_quota an optional manual hourly quota for the subaccount. If not specified, Mandrill will manage this based on reputation
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype.add = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["name"]) == null) {
        params["name"] = null;
      }
      if ((_ref1 = params["notes"]) == null) {
        params["notes"] = null;
      }
      if ((_ref2 = params["custom_quota"]) == null) {
        params["custom_quota"] = null;
      }
      return this.master.call('subaccounts/add', params, onsuccess, onerror);
    };

    /*
        Given the ID of an existing subaccount, return the data about it
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of the subaccount to query
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('subaccounts/info', params, onsuccess, onerror);
    };

    /*
        Update an existing subaccount
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of the subaccount to update
        @option params {String} name an optional display name to further identify the subaccount
        @option params {String} notes optional extra text to associate with the subaccount
        @option params {Integer} custom_quota an optional manual hourly quota for the subaccount. If not specified, Mandrill will manage this based on reputation
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype.update = function(params, onsuccess, onerror) {
      var _ref, _ref1, _ref2;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["name"]) == null) {
        params["name"] = null;
      }
      if ((_ref1 = params["notes"]) == null) {
        params["notes"] = null;
      }
      if ((_ref2 = params["custom_quota"]) == null) {
        params["custom_quota"] = null;
      }
      return this.master.call('subaccounts/update', params, onsuccess, onerror);
    };

    /*
        Delete an existing subaccount. Any email related to the subaccount will be saved, but stats will be removed and any future sending calls to this subaccount will fail.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of the subaccount to delete
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('subaccounts/delete', params, onsuccess, onerror);
    };

    /*
        Pause a subaccount's sending. Any future emails delivered to this subaccount will be queued for a maximum of 3 days until the subaccount is resumed.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of the subaccount to pause
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype.pause = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('subaccounts/pause', params, onsuccess, onerror);
    };

    /*
        Resume a paused subaccount's sending
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} id the unique identifier of the subaccount to resume
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Subaccounts.prototype.resume = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('subaccounts/resume', params, onsuccess, onerror);
    };

    return Subaccounts;

  })();

  m.Urls = (function() {

    function Urls(master) {
      this.master = master;
    }

    /*
        Get the 100 most clicked URLs
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Urls.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('urls/list', params, onsuccess, onerror);
    };

    /*
        Return the 100 most clicked URLs that match the search query given
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} q a search query
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Urls.prototype.search = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('urls/search', params, onsuccess, onerror);
    };

    /*
        Return the recent history (hourly stats for the last 30 days) for a url
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} url an existing URL
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Urls.prototype.timeSeries = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('urls/time-series', params, onsuccess, onerror);
    };

    /*
        Get the list of tracking domains set up for this account
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Urls.prototype.trackingDomains = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('urls/tracking-domains', params, onsuccess, onerror);
    };

    /*
        Add a tracking domain to your account
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain a domain name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Urls.prototype.addTrackingDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('urls/add-tracking-domain', params, onsuccess, onerror);
    };

    /*
        Checks the CNAME settings for a tracking domain. The domain must have been added already with the add-tracking-domain call
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain an existing tracking domain name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Urls.prototype.checkTrackingDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('urls/check-tracking-domain', params, onsuccess, onerror);
    };

    return Urls;

  })();

  m.Webhooks = (function() {

    function Webhooks(master) {
      this.master = master;
    }

    /*
        Get the list of all webhooks defined on the account
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Webhooks.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('webhooks/list', params, onsuccess, onerror);
    };

    /*
        Add a new webhook
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} url the URL to POST batches of events
        @option params {String} description an optional description of the webhook
        @option params {Array} events an optional list of events that will be posted to the webhook
             - events[] {String} the individual event to listen for
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Webhooks.prototype.add = function(params, onsuccess, onerror) {
      var _ref, _ref1;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["description"]) == null) {
        params["description"] = null;
      }
      if ((_ref1 = params["events"]) == null) {
        params["events"] = [];
      }
      return this.master.call('webhooks/add', params, onsuccess, onerror);
    };

    /*
        Given the ID of an existing webhook, return the data about it
        @param {Object} params the hash of the parameters to pass to the request
        @option params {Integer} id the unique identifier of a webhook belonging to this account
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Webhooks.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('webhooks/info', params, onsuccess, onerror);
    };

    /*
        Update an existing webhook
        @param {Object} params the hash of the parameters to pass to the request
        @option params {Integer} id the unique identifier of a webhook belonging to this account
        @option params {String} url the URL to POST batches of events
        @option params {String} description an optional description of the webhook
        @option params {Array} events an optional list of events that will be posted to the webhook
             - events[] {String} the individual event to listen for
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Webhooks.prototype.update = function(params, onsuccess, onerror) {
      var _ref, _ref1;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["description"]) == null) {
        params["description"] = null;
      }
      if ((_ref1 = params["events"]) == null) {
        params["events"] = [];
      }
      return this.master.call('webhooks/update', params, onsuccess, onerror);
    };

    /*
        Delete an existing webhook
        @param {Object} params the hash of the parameters to pass to the request
        @option params {Integer} id the unique identifier of a webhook belonging to this account
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Webhooks.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('webhooks/delete', params, onsuccess, onerror);
    };

    return Webhooks;

  })();

  m.Senders = (function() {

    function Senders(master) {
      this.master = master;
    }

    /*
        Return the senders that have tried to use this account.
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/list', params, onsuccess, onerror);
    };

    /*
        Returns the sender domains that have been added to this account.
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.domains = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/domains', params, onsuccess, onerror);
    };

    /*
        Adds a sender domain to your account. Sender domains are added automatically as you
    send, but you can use this call to add them ahead of time.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain a domain name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.addDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/add-domain', params, onsuccess, onerror);
    };

    /*
        Checks the SPF and DKIM settings for a domain. If you haven't already added this domain to your
    account, it will be added automatically.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain a domain name
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.checkDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/check-domain', params, onsuccess, onerror);
    };

    /*
        Sends a verification email in order to verify ownership of a domain.
    Domain verification is an optional step to confirm ownership of a domain. Once a
    domain has been verified in a Mandrill account, other accounts may not have their
    messages signed by that domain unless they also verify the domain. This prevents
    other Mandrill accounts from sending mail signed by your domain.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} domain a domain name at which you can receive email
        @option params {String} mailbox a mailbox at the domain where the verification email should be sent
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.verifyDomain = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/verify-domain', params, onsuccess, onerror);
    };

    /*
        Return more detailed information about a single sender, including aggregates of recent stats
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} address the email address of the sender
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.info = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/info', params, onsuccess, onerror);
    };

    /*
        Return the recent history (hourly stats for the last 30 days) for a sender
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} address the email address of the sender
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Senders.prototype.timeSeries = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('senders/time-series', params, onsuccess, onerror);
    };

    return Senders;

  })();

  m.Metadata = (function() {

    function Metadata(master) {
      this.master = master;
    }

    /*
        Get the list of custom metadata fields indexed for the account.
        @param {Object} params the hash of the parameters to pass to the request
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Metadata.prototype.list = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('metadata/list', params, onsuccess, onerror);
    };

    /*
        Add a new custom metadata field to be indexed for the account.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name a unique identifier for the metadata field
        @option params {String} view_template optional Mustache template to control how the metadata is rendered in your activity log
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Metadata.prototype.add = function(params, onsuccess, onerror) {
      var _ref;
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      if ((_ref = params["view_template"]) == null) {
        params["view_template"] = null;
      }
      return this.master.call('metadata/add', params, onsuccess, onerror);
    };

    /*
        Update an existing custom metadata field.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the unique identifier of the metadata field to update
        @option params {String} view_template optional Mustache template to control how the metadata is rendered in your activity log
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Metadata.prototype.update = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('metadata/update', params, onsuccess, onerror);
    };

    /*
        Delete an existing custom metadata field. Deletion isn't instataneous, and /metadata/list will continue to return the field until the asynchronous deletion process is complete.
        @param {Object} params the hash of the parameters to pass to the request
        @option params {String} name the unique identifier of the metadata field to update
        @param {Function} onsuccess an optional callback to execute when the API call is successfully made
        @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Metadata.prototype["delete"] = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('metadata/delete', params, onsuccess, onerror);
    };

    return Metadata;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).mandrill = m;

}).call(this);
/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
