'use strict';

$(document).ready(function() {

	/*============================================
	Page Preloader
	==============================================*/

	$(window).load(function(){
		$('#page-loader').fadeOut(500);
	});

	/*============================================
	Parallax Backgrounds
	==============================================*/
	$('.parallax-bg').each(function(){
		var bg = $(this).data('parallax-background');
		$(this).css({'background-image':'url('+bg+')'});

	});

	if((!Modernizr.touch) && ( $(window).width() > 1024) ){
		$(window).stellar({
			horizontalScrolling: false,
			responsive:true
		});
	}
	/*============================================
	Header
	==============================================*/

	$('.header-slider').flexslider({
		animation: "fade",
		directionNav: false,
		controlNav: false,
		slideshowSpeed: 6000,
		animationSpeed: 400,
		pauseOnHover:false,
		pauseOnAction:false,
		smoothHeight: false,
		slideshow:false
	});

	$(window).load(function(){
		$('.header-slider').flexslider('play');
	});
	/*============================================
	ScrollTo Links
	==============================================*/
	$('a.scrollto').click(function(e){
		$('html,body').scrollTo(this.hash, this.hash, {animation:  {easing: 'easeInOutCubic', duration: 1000}});
		e.preventDefault();

		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
	});

	$('#main-nav').waypoint('sticky');


	/*============================================
	Counters
	==============================================*/
	$('.counters').waypoint(function(){
		$('.counter').each(count);
	},{offset:'100%'});

	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	/*============================================
	Project thumbs - Masonry
	==============================================*/
	$(window).load(function(){

		$('#projects-container').css({visibility:'visible'});

		$('#projects-container').masonry({
			itemSelector: '.project-item:not(.filtered)',
			isFitWidth: false,
			isResizable: true,
			isAnimated: !Modernizr.csstransitions,
			gutterWidth: 0
		});

		scrollSpyRefresh();
		waypointsRefresh();
		stellarRefresh();

	});

	/*============================================
	Filter Projects
	==============================================*/
	$('#filter-works a').click(function(e){
		e.preventDefault();

		if($('#project-preview').hasClass('open')){
			closeProject();
		}

		$('#filter-works li').removeClass('active');
		$(this).parent('li').addClass('active');

		var category = $(this).attr('data-filter');

		$('.project-item').each(function(){
			if($(this).is(category)){
				$(this).removeClass('filtered');
			}
			else{
				$(this).addClass('filtered');
			}

			$('#projects-container').masonry('reload');
		});

		scrollSpyRefresh();
		waypointsRefresh();
		stellarRefresh();
	});

	/*============================================
	Project Preview
	==============================================*/
	$('.project-item').click(function(e){
		e.preventDefault();

		var elem = $(this);

		if($('#project-preview').hasClass('open')){
			$('#project-preview').animate({'opacity':0},300);

			setTimeout(function(){
				$('#project-slider').flexslider('destroy');
				buildProject(elem);
			},300);
		}else{
			buildProject(elem);
		}


	});

	function buildProject(elem){

		var	title = elem.find('.project-title').text(),
			descr = elem.find('.project-description').html(),
			slidesHtml = '<ul class="slides">',
			elemDataCont = elem.find('.project-description');

		var	slides = elem.find('.project-description').data('images').split(',');

		for (var i = 0; i < slides.length; ++i) {
			slidesHtml = slidesHtml + '<li><img src='+slides[i]+' alt=""></li>';
		}

		slidesHtml = slidesHtml + '</ul>';

		$('#project-title').text(title);
		$('#project-content').html(descr);
		$('#project-slider').html(slidesHtml);

		openProject();
	}

	function openProject(){

		$('#project-preview').addClass('open');

		setTimeout(function(){
			$('#project-preview').slideDown();

			$('html,body').scrollTo(0,'#filter-works',
				{
					gap:{y:-10},
					animation:{
						duration:400
					}
			});

			$('#project-slider').flexslider({
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>',
				animation: 'slide',
				slideshowSpeed: 3000,
				useCSS: true,
				controlNav: true,
				pauseOnAction: false,
				pauseOnHover: true,
				smoothHeight: false,
				start: function(){
					$(window).trigger('resize');
					$('#project-preview').animate({'opacity':1},300);
				}
			});

		},300);

	}

	function closeProject(){

		$('#project-preview').removeClass('open');
		$('#project-preview').animate({'opacity':0},300);

		setTimeout(function(){
			$('#project-preview').slideUp();

			$('#project-slider').flexslider('destroy');

			scrollSpyRefresh();
			waypointsRefresh();
			stellarRefresh();

		},300);

	}

	$('.close-preview').click(function(){
		closeProject();
	})

	/*============================================
	Testimonials Slider
	==============================================*/

		$('#testimonials-slider').flexslider({
			prevText: '<i class="fa fa-angle-left"></i>',
			nextText: '<i class="fa fa-angle-right"></i>',
			animation: 'fade',
			slideshowSpeed: 5000,
			animationSpeed: 400,
			useCSS: true,
			directionNav: false,
			pauseOnAction: false,
			pauseOnHover: true,
			smoothHeight: false
		});

	/*============================================
	Placeholder Detection
	==============================================*/
	if (!Modernizr.input.placeholder) {
		$('#contact-form').addClass('no-placeholder');
	}

	/*============================================
	Scrolling Animations
	==============================================*/
	$('.scrollimation').waypoint(function(){
		$(this).addClass('in');
	},{offset:'80%'});

	/*============================================
	Resize Functions
	==============================================*/
	$(window).resize(function(){

		$('#projects-container').masonry('reload');
		stellarRefresh();
		scrollSpyRefresh();
		waypointsRefresh();

	});

	/*============================================
	Refresh scrollSpy function
	==============================================*/
	function scrollSpyRefresh(){
		setTimeout(function(){
			$('body').scrollspy('refresh');
		},1000);

	}

	/*============================================
	Refresh waypoints function
	==============================================*/
	function waypointsRefresh(){
		setTimeout(function(){
			$.waypoints('refresh');
		},1000);
	}

	/*============================================
	Refresh Parallax Backgrounds
	==============================================*/
	function stellarRefresh(){
		setTimeout(function(){
			$(window).stellar('refresh');
		},1000);
	}

	$('#contact-form').submit(function() {

		if($('#contact-form').hasClass('clicked')){
			return false;
		}

		$('#contact-form').addClass('clicked');

		var buttonCopy = $('#contact-form button').html(),
			errorMessage = $('#contact-form button').data('error-message'),
			sendingMessage = $('#contact-form button').data('sending-message'),
			okMessage = $('#contact-form button').data('ok-message'),
			hasError = false;

		$('#contact-form .error-message').remove();

		$('.requiredField').each(function() {
			if($.trim($(this).val()) == '') {
				var errorText = $(this).data('error-empty');
				$(this).parents('.controls').append('<span class="error-message" style="display:none;">'+errorText+'.</span>').find('.error-message').fadeIn('fast');
				$(this).addClass('inputError');
				hasError = true;
			} else if($(this).is("input[type='email']") || $(this).attr('name')==='email') {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
					var invalidEmail = $(this).data('error-invalid');
					$(this).parents('.controls').append('<span class="error-message" style="display:none;">'+invalidEmail+'.</span>').find('.error-message').fadeIn('fast');
					$(this).addClass('inputError');
					hasError = true;
				}
			}
		});

		if(hasError) {
			$('#contact-form button').html('<i class="fa fa-times"></i>'+errorMessage);
			setTimeout(function(){
				$('#contact-form button').html(buttonCopy);
				$('#contact-form').removeClass('clicked');
			},2000);
		}
		else {
			$('#contact-form button').html('<i class="fa fa-spinner fa-spin"></i>'+sendingMessage);

			var formInput = $(this).serialize();
			$.post($(this).attr('action'),formInput, function(data){
				$('#contact-form button').html('<i class="fa fa-check"></i>'+okMessage);
				setTimeout(function(){
					$('#contact-form button').html(buttonCopy);
				$('#contact-form').removeClass('clicked');
				},2000);

				$('#contact-form')[0].reset();
			});
		}

		return false;
	});


	// Google Analytics Event Tracking
	$('#about-top-nav-button').on('click', function() {
		ga('send', 'event', 'button', 'click', 'about-top-nav-button');
	});
	$('#services-top-nav-button').on('click', function() {
		ga('send', 'event', 'button', 'click', 'services-top-nav-button');
	});
	$('#products-top-nav-button').on('click', function() {
		ga('send', 'event', 'button', 'click', 'products-top-nav-button');
	});
	$('#team-top-nav-button').on('click', function() {
		ga('send', 'event', 'button', 'click', 'team-top-nav-button');
	});
	$('#pricing-top-nav-button').on('click', function() {
		ga('send', 'event', 'button', 'click', 'pricing-top-nav-button');
	});
	$('#blog-top-nav-button').on('click', function() {
		ga('send', 'event', 'button', 'click', 'blog-top-nav-button');
	});
	$('#cta-reservation-button').on('click', function() {
		ga('send', 'event', 'cta', 'click', 'cta-reservation-button');
	});

	$('#about').waypoint(function(){
		ga('send', 'event', 'section', 'seen', 'about-section');
	});
	$('#services').waypoint(function(){
		ga('send', 'event', 'section', 'seen', 'services-section');
	});
	$('#products').waypoint(function(){
		ga('send', 'event', 'section', 'seen', 'products-section');
	});
	$('#team').waypoint(function(){
		ga('send', 'event', 'section', 'seen', 'team-section');
	});
	$('#pricing').waypoint(function(){
		ga('send', 'event', 'section', 'seen', 'team-section');
	});
});



// Create a function to log the response from the Mandrill API
function log(obj) {
		$('#response').text(JSON.stringify(obj));
}

// create a new instance of the Mandrill class with your API key
var m = new mandrill.Mandrill('EFP0TtWypDVL5ieuKLyQ2w');
// create a variable for the API call parameters
var params = {
		"key": "EFP0TtWypDVL5ieuKLyQ2w",
		"message": {
				"text": "",
				"subject": "Lulu Posh Website Inquiry",
				"from_email": "",
				"from_name": "",
				"to": [
					{
							"email": "reservations@luluposhhair.com",
							"name": "Margaret",
							"type": "to"
					}
				],
				"headers": {
						"Reply-To": "reservations@luluposhhair.com"
				},
				"important": false,
				"track_opens": null,
				"track_clicks": null,
				"auto_text": null,
				"auto_html": null,
				"inline_css": null,
				"url_strip_qs": null,
				"preserve_recipients": null,
				"view_content_link": null,
				"tracking_domain": null,
				"signing_domain": null,
				"return_path_domain": null,
				"merge": true,
				"tags": [
						"website-inquiry"
				],
				"metadata": {
						"website": "luluposhhair.com.com"
				},
				"images": [
						{
								"type": "image/png",
								"name": "IMAGECID",
								"content": "ZXhhbXBsZSBmaWxl"
						}
				]
		}
}

function sendTheMail(from_email, from_name, text) {
		console.log("From Email", from_email, "From Name", from_name, "Text", text);
		params.message.from_email = from_email;
		params.message.from_name = from_name;
		params.message.text = text + " " + from_email;
		m.messages.send(params, function(){
				$("#inquiry_form").append('<pre id=\"inquiry-response">Thanks for your email! We\'ll get right back to you ;)</pre>');
		}, function(){
				$("#inquiry_form").append('<pre id=\"inquiry-response">Looks like there was a problem sending an email to the stackrise team.</pre>');
		});
}
