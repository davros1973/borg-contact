/// <reference path="typings/globals/three/index.d.ts" />

/*	Feburary 2017, David Bayliss
	Learning/relearning JavaScript, JQuery, three.js
	as I go along - apologies for bad code, and my 
	sticking to inefficient curly brace placement ...
	... and huge TAB indents etc. And also I tend towards 
	... err ... double quotes.  I know, I know.
	helps me read the code at the moment.

	See working at: https://blog.xarta.co.uk/about/contact/
	Also see: 	contactpagefooter.js
				contactpage.css
				contactdetails.php

	Looks for Divs in WordPress theme: entry-content & entry-title


	PURPOSE: fun YouTube video iframe +three.js (webGl) effects.
	Delay provision of contact details - act as deterrant to scrapers
	(automated and person)

	APOLOGIES re. accessibility ... need to take into account
*/

// some useful references / inspirations:
/*
	https://stemkoski.github.io/Three.js/Mesh-Movement.html
*/


/*	DEPENDENCY ON xarta-globals.js
	for: 	var extraDebug
			function clog
			function xarta-ajax
*/

/* DEPENDENCY ON my WordPress theme header/footer
    but just for a function to set the css background
    of elements with class .digit for the LED marquee
    to get round a cross-origin problem, and to use
    rel=preload
*/

/* DISCOVERED WordPress YouTube plugin breaks this */







var authenticationCode = null; 	// get a random code for the session via ajax
                        		// and use to obtain contact details later

// TODO: use promises / closures instead of globals
// TODO: more sophisticated code built over time


// set xartaUrl e.g. currently: https://blog.xarta.co.uk/xarta/
// ... for non-WordPress custom scripts/images etc.
var getUrl = window.location;
var arrayUrl = getUrl.pathname.split("/");
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + arrayUrl[0];
var xartaUrl = baseUrl + "xarta/";
var xprotectedUrl = xartaUrl + "xprotected/";
var projectUrl = xartaUrl + "projects-contactpage/";

// cloned from a five-year old thing I cloned in June 2016
// e.g. over ssh for Apache on Ubuntu (and after saving git credentials):
// sudo -u www-data git clone https://github.com/davros1973/tunnelgl.git
var threejstunnelUrl = projectUrl + "tunnelgl/"; 
                                                 

if(extraDebug>0)
{
	clog("baseUrl is:" + baseUrl, 1);
	
	for (urlPart = 0; urlPart < (arrayUrl.length - 1); urlPart++)
	{
		clog("getUrl.pathname.split(\"/\")["+urlPart+"] is "+arrayUrl[urlPart],1);
	}

	clog("ASSUMED xartaUrl="+xartaUrl, 1);
	clog("SET (not served) xprotectedUrl="+xprotectedUrl, 1);
	clog("SET projectUrl="+projectUrl, 1);
}



// just a precaution ... the way things have developed I might
// move everything into a document ready closure instead of separates
// ... EXCEPT for where the global scope YOUTUBE API looks for functions
jq2 = jQuery.noConflict();


jq2(function( $ ) 
{
	getSessionAuthentication(); // set authenticationCode global var
	                            // ajax (might take async time)

	// already seen video for 12 or more seconds? Shortcut:							
	if (typeof(Storage) !== "undefined") 
	{
		if (parseInt(localStorage.progress)>=12)
		{
			// allow for ajax time (no error handling yet)
			setTimeout(function() {
				if(authenticationCode)
				{
					jumpToTheEnd();
				}
			}, 2000);				
		}
	}
	// meanwhile, assume need to delay (scrapers), by seeing video
	// also, jumpToTheEnd() will require player-container div
	// --------------------------------------------------------------
	// append PLAYER-CONTAINER, PLAYER  divs here
	// ... player-cover blocks controls (need them on mobile devices)
	// ... so leave that until later, in initCover()
	// -------------------------------------------------------------- 
	$(".entry-content").hide("fast",function() 
	{
		$(".entry-content").html("<div id=\"player-container\"><div id=\"player\"></div></div>");
		$(".entry-content").show("fast",function()
		{
			// YOUTUBE IFRAME API
			// 2. continued from header: This code loads the IFrame Player API code asynchronously.
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		});
	});

});


// YOUTUBE IFRAME API (api looks for these handlers in global scope)
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() 
{
	clog("onYouTubeIframeAPIReady",1);

	player = new YT.Player("player", 
	{
  	  height: "1080", width: "688",
  	  videoId: "WH4fX3SlsVY",
  	  playerVars: 
	  {
	    "playlist": "WH4fX3SlsVY",
	    "loop": 1,
	    "autoplay": 0, 
	    "controls": 1,
	    "showinfo": 0,
        "rel": 0,
	    "wmode": "transparent"
  	  },
      events: 
	  {
	    "onReady": onPlayerReady,
	    "onStateChange": onPlayerStateChange
      }
    });

}

// YOUTUBE IFRAME API (this handler set in events JSON above)
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) 
{
jq2(function( $ ) 
{
	clog("onPlayerReady",1);
    player.origin = "https://blog.xarta.co.uk";

	$(".site-branding").hide("slow");
	clog("hiding site-branding",1);

	var isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) != null; //boolean check for iOS devices
	if (isiOS)
	{ // if iOS device
		event.target.cueVideoById("WH4fX3SlsVY");
	}
	else
	{ // non iOS devices, just try to play video
		event.target.playVideo();
		setTimeout(function() 
		{
			clog("Hmmm " + player.getPlayerState(),1);
			if ( (player.getPlayerState() != YT.PlayerState.PLAYING))
			{
				// e.g. Android, or just slow!
				$("#player").fadeIn("500", function()
				{
					redimension();
				});
			}
		}, 1000);
	}			
}); // end jq2
}

// tidy-up, ready for contact details
function jumpToTheEnd()
{
jq2(function( $ ) 
{
	clog("ENDED",1);
	// need to refactor code and do more of this sort of thing
	if (!(typeof borg ==="undefined" || borg ===null))
	{
		scene.remove(borg);
	}
	/* i.e. doing this for now - but maybe in future
		add new things to the scene? More sophisticated?
	*/
	$("#player-cover").remove;
	$("#player").fadeOut("fast", function()
	{
		player.destroy();
		$(".site-branding").show("slow", function()
		{
			$(".entry-title").html("Contact");
			coughUpDetails();
            redimension = function(){console.log("Ignoring resizing now");}
		});			
	});
});	// end jq2
}

// bind to RE-RUN VIDEO button ...
// need to remove localStorage item, so video not cut-Short next time
function refresh()
{
	if (typeof(Storage) !== "undefined") 
	{
		localStorage.removeItem("progress");
		window.location.reload();
	}
}

// YOUTUBE API
// 5. The API calls this function when the player's state changes.
var done = false;   // only start everything off once 
                    // e.g. in case multiple PLAYING events
var gEarthTime = 0; // YouTube video is of Google Earth flying
                    // YouTube api returns video time progress
var kickOff = 1.5;  // seconds offset for syncing video background to 
                    // three.js / WebGL animation
function onPlayerStateChange(event) 
{
jq2(function( $ ) 
{
	// typically cued if IOS, Android etc.
	// do this when ready (or other earlier timeout will anyway)
	if (event.data == YT.PlayerState.CUED)
	{
		clog("CUED",1);
		$("#player").fadeIn("slow", function() {});
	}
	else if (event.data == YT.PlayerState.PLAYING && !done) 
	{
		clog("PLAYING",1);
		// sequence animation etc. 
		// assumes uninterrupted for at least 1.1 seconds!
		setTimeout(initCover, 10);        // will also physically block controls
		setTimeout(initTHREEscene, 20);  
		setTimeout(startTunnel, 30);	  // warpdrive effect iframe
		setTimeout(action, kickOff*1000); // synced with point in video
		setTimeout(function() 
		{
			/* #player set in CSS to display: none
			   (unless faded-in by cued event or tardy timeout)
			   #player obscured anyway by warpdrive iframe
			   silently "show" when presumed obscured */
			$("#player").css("display", "block"); 
		}, 3000);
		
		done = true; // do (done) once only (single threaded)
	}
	else if (event.data == YT.PlayerState.ENDED)
	{
		// differet to "PAUSED"
		// now tidy-up and show contact details
		jumpToTheEnd();
	}
	
}); // end jQuery block
}

// not sure if I'll use this yet:
function stopVideo() 
{	
}


// --- END OF YOUTUBE API EVENT HANDLERS ---




/* not really "authentication" per se although does use
   POST over HTTPS.  Just a very basic mechanism for preventing
   release of contact details to automated/human scrapers
   (could really use the session id etc. but might expand this concept)
   (but need to think about accessibility options!!!) */
function getSessionAuthentication()
{
	clog("getSessionAuthentication()",1);
	var url = projectUrl+"contactdetails.php";
	var postString = "authentication=getcode";
	// global var authenticationCode
	function responseFunction(passthis)
	{
		clog("Received authenticationCode: "+passthis.responseText,1);
		authenticationCode = passthis.responseText;
	}
	xarta_ajax(url, responseFunction, postString); // function in site-footer.js
}




/* Before using this function,  
   first must set global authenticationCode
   with ajax call to same page, with
   "authentication=getcode" as POST data
   TODO: error check - see if variable set
*/
function coughUpDetails()
{
	clog("coughUpDetails",1);
jq2(function( $ ) 
{ 
	var url = projectUrl+"contactdetails.php";
	// $ becomes part of closure
	function responseFunction(passthis)
	{		
		$("#player-container").hide("slow", function()
		{
			// IMPORTANT BIT ----------------------------------
			$("#player-container").html(passthis.responseText);
			// ------------------------------------------------

			$("#player-container").css("margin","0");
			$("#player-container").css("margin-left","-20px");
			
			$("#player-container").css("perspective", "0");
			$("#player-container").css("width", "20em");  // review	
			$("#player-container").css("width", "110%");
			$("#player-container").show("slow", function()
			{
				// remove the 100vh max-height from before
				$(".entry-content").css("max-height", "");
				$(".entry-content").css("height", "auto");
				$("#player-container").css("height", "auto");
				
				$("html, body").animate({ scrollTop: $(".entry-title").offset().top}, "slow" );
			});			
		});

	}
	var postString = "authentication="+authenticationCode;
	
	xarta_ajax(url, responseFunction, postString);
}); // end jq2

}


// --- NOW ON TO THE ANIMATION STUFF ---


/* three.js tunnel effect
   iframe ... whole thing (in iframe) copied to my site from:
   http://learningthreejs.com/
   Relies on older three library I think ...
   ... and I need to refactor once I understand it better to cope
   ... with deprecations
   (I call it "warpdrive")
   NOTE: content does not appear in Internet Explorer - INVESTIGATE
*/
function startTunnel()
{
jq2(function( $ ) 
{
	clog("#warpdrive fadein",1);
	var newStuff = "<iframe id=\"warpdrive\" src=\""+threejstunnelUrl+"\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\" frameborder=\"0\"></iframe>";
	$("#player-container").append(newStuff);
	redimension();
	$("#warpdrive").fadeIn("slow", function() 
	{				
		// something
	}); 
}); // end jq2
}
function endTunnel()
{
jq2(function( $ ) 
{
	clog("#warpdrive fadeout",1);
	$("#warpdrive").fadeOut("fast", function(){
		$("#warpdrive").remove;
	});
}); // end jq2
}

// stack of absolute divs including iframes, over (relative) player-container
// player-cover used as the three.js renderer/camera container later

// ADDING:     #player-cover
//             #player-time
//               #player-timeindex
//               #player-countdown
//             #player-message  (also relative)
function initCover() 
{
jq2(function( $ ) 
{
    addLedGif();

	clog("initCover",1);
	// #player-cover will block YouTube controls, so left until here
	// ... after the video is playing, because autoplay doesn't work
	// ... on mobile devices.
	$("#player-container").append("<div id=\"player-cover\"></div>");
	$("#player-container").append("<div id=\"player-time\"></div>");
	$("#player-container").append("<div id=\"player-message\"></div>");
	
	// now player-time exists:
	if(extraDebug>0)
	{
		$("#player-time").append("<div id=\"player-timeindex\"></div>");
		$("#player-timeindex").html("Video time index");
	}

	$("#player-time").append("<div id=\"player-countdown\"></div>");
	$("#player-countdown").html("COUNTDOWN");

	if(extraDebug>1)
	{
		$("#player-container").css("border","solid 3px blue");
		$("#player-cover").css("border", "solid 3px red");
	}
	redimension();
}); // end jq2
}

// GLOBALS   :(   TODO: THIS BETTER!!! With closures or something.
var container;
// assuming WebGL support - not bothering right now with detection
// ... or switch to canvas renderer
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
var initscale = 3;
var camera;
var borg = null;
var clock = new THREE.Clock(); // handy independent of video time

// set-up a three.js scene positioned over the main YouTube video
function initTHREEscene() 
{
	clog("initTHREEscene",1);

	container = document.getElementById("player-cover");
	camera = new THREE.PerspectiveCamera( 75, container.offsetWidth/container.offsetHeight, 0.1, 1000 );
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );
    addLedGif(); // DARN ... introduced dependency on my theme because of preloading
                 // the ledmarquee.gif with link rel=preload ... so crossorigin issue
                 // ... so means can't use normal css background image ... have to use
                 // javascript to load image and then assign to css background as data
                 // uri ... BUT ... in this script (not sure where/why) the ledmarquee div
                 // digits lose the background again so I have to add the background again
}

function action()
{
	clog("action",1);

	// "do once" "flags" set during looping update()
	// TODO: custom events so that I can add/remove events
	// by time index ... abstraction/decoupling etc.
	var warpFadedOut = false;
	var warpShrink = false;
	var straightenedOut = false;
	var pausedOnce = false;
	var afterPause = false;
	var shownGoingToDavesPlace = false;
	var startInside = false;
	var makeBigCloserToEarth = false;

	// STILL GOT A TODO SECTION ... when Borg cube reaches
	// my street ...
	// used in other time calculations: set here:
	var pauseTime = 5000; 	// what to do during this time?
							// blow the house-up? Don't want to give
							// people ideas!

	// better let people know there is an end to the madness
	var countDown = 120 + (pauseTime/1000);

	redimension();
	startBorg(); // add Borg cube mesh to scene

	// attach a separate resize handler to resize 
	// the renderer and camera properly
	// NOW not using (added lines to my "redimension" function)
	//var winResize = new THREEx.WindowResize(renderer, camera)
	
	animate();
	function animate()
	{
		requestAnimationFrame( animate );     // Top of function!
		                                      // three.js efficiency

		gEarthTime = player.getCurrentTime(); 	// track video progress
												// for syncing and coping
												// with buffering etc.

		render();
		
		// only update() animation if not buffering / ended etc. etc.
		// might mean three.js clock delta will be big after buffering?

        // July 2017 ... this has been playing up - stuck in a playing state
        // ... never ending. So putting in the countdown test too.

		if ( ( (player.getPlayerState() == YT.PlayerState.PLAYING) ||
		     (player.getPlayerState() == YT.PlayerState.PAUSED) )  && countDown > -2) 
		{
			update();
		}
        else if (countDown < -1)
        {
            // shouldn't get to this ... only if problem with YouTube API
            player.stopVideo(); // this can cause problems too ... last resort
            jumpToTheEnd();
        }
	}

	function render() 
	{
		renderer.render(scene, camera);
	};

	// changes to the scene - sync with video progress
	// this will loop around at high FPS depending on machine performance
	// works ok (in CHROME! ONLY) on year-2009 Core 2 Duo laptop with 8GB Ram
	function update()
	{
		var delta = clock.getDelta(); // fractional seconds.	
		var progressTime = gEarthTime - kickOff;
		if(delta < 1)
		{
			// ignore extended buffering between update()'s
			// but will still count down even if video paused
			// (player-cover div blocks manual pause control)
			countDown  = countDown - delta;
		}
		

		jq2(function( $ ) 
		{
			if (extraDebug>0)
			{
				$("#player-timeindex").html(progressTime);
			}
			$("#player-countdown").html("PATIENCE: "+Math.round(countDown));				
		});

        if(countDown < 100 && progressTime < 10)
        {
            countDown = 0;
            player.stopVideo();
            jumpToTheEnd();
            alert("Apologies ... the YouTube API seems glitch - not responding properly: aborting");
        }

		// I'm "playing" with these values to try to make motion
		// proportional to video playback rather than computation power
		// - but off the cuff ... not studied/thought about it deeply yet
		var transformRate = 0.1;
		if (delta < 0.1)
		{
			transformRate = 2 * delta;
		}
		else if (delta < 1)
		{
			transformRate = delta;
		}
		else if (delta < 2)
		{
			transformRate = 1;
		}

		// lots of console.log so extraDebug level 3
		// nb: video time progress reflects delta
		// while video playing, shown in time-index div, anyway
		clog("update(): delta="+delta,3);  

		// --- OK: NOW SYNCING WITH VIDEO PLAYBACK PROGRESS ---

		// Borg cube appears (TODO make appear outside of video window)
		// large in foreground, and seems to move into tunnel
		if (progressTime < 1 && borg.scale.x > 1)
		{
			jq2(function( $ ) 
			{
				if(!startInside)
				{
					startInside = true;
					// notify the renderer of the size change
					var setWidth = $("#player-cover").width();
					var setHeight = $("#player-cover").height()+300;
					renderer.setSize( setWidth , setHeight );
					// update the camera
					camera.aspect	= setWidth / setHeight;
					camera.updateProjectionMatrix();
				}
			});

			borg.translateZ(-transformRate);
			borg.scale.x = borg.scale.x - transformRate;
			borg.scale.y = borg.scale.y - transformRate;
			borg.scale.z = borg.scale.z - transformRate;
		}

		// started with skew-whiff divs to force engagement
		// now straighten out to relieve tension and let 
		// narrative flow 
		if (!straightenedOut && progressTime > 1)
		{
			jq2(function( $ ) 
			{
				straightenedOut = true;
				clog("straightenedOut",1);

				var targetX = "0px";
				var targetY = "0px";
				$("#player-container").css("perspective", "0");
				// this doesn't work properly in Firefox TODO: WORK-AROUND
				// ... e.g. see what happens if check for some feature support ...
				// maybe not use JQuery at all?  But what about easing?  Will see.
				$("#player").css({transform: "rotate3d(0, 0, 0, 0deg) translateX("+targetX+") translateY("+targetY+")", transition: "all 0.8s ease-in"})
				$("#player-cover").css({transform: "rotate3d(0, 0, 0, 0deg) translateX("+targetX+") translateY("+targetY+")", transition: "all 0.9s ease-in"})
				$("#warpdrive").css({transform: "rotate3d(0, 0, 0, 0deg) translateX("+targetX+") translateY("+targetY+")", transition: "all 1s ease-in"})			
				redimension();
			});
		}

		/* TOO MANY PROBLEMS STILL
		   ... had problems making the "warpdrive" iframe fading out
		   ... (computationally heavy) ... so was looking at alternatives
		   ... but wasn't working out.  Leaving here for future reference

		if (!warpFadedOut && !warpShrink && progressTime > 10)
		{
			jq2(function( $ )
			{
				warpShrink = true;
				clog("#warpdrive shrink",1);

				$( "#warpdrive" ).animate(
				{

					opacity: 0.25,
					width: "-=400px",
					left: "+=200px",
					height: "-=800px",
					top: "+=400px"
				}, 500, 
					function() 
					{
						// Animation complete.
					});
			});
		}
		*/

		/* 	while in tunnel, tumble about
			translateZ will appear to move the cube (position)
			where the z axis changes with the tumbling
			over-all translation averages out
			AFTER 11 secs, try to fade out the "warpdrive" iframe */
		if (progressTime < 11)
		{			
			borg.translateZ(-transformRate);
			tumble(transformRate);
		}
		else if (!warpFadedOut)
		{
			warpFadedOut = true;
			endTunnel();
		}


		// reveals purpose of narrative "going to where I live"
		if (progressTime > 12 && !shownGoingToDavesPlace )
		{
			jq2(function( $ ) 
			{
				shownGoingToDavesPlace = true;

				var message="Ok: I'll show you where I live ...";
				$("#player-message").html(message);
				$("#player-message").show("fast", function()
				{
					setTimeout(function() 
					{
						$("#player-message").hide("fast", function(){});
					}, 2000);
				});
			});
			
			/* ok ... user seen at least 12-seconds of video
			   if viewer refreshes page now, or comes back to page
			   in the future, this key/pair should allow the visitor
			   to get the contact details nearly straight-away and 
			   not have to see the video again. */
			if (typeof(Storage) !== "undefined") 
			{
				if (!(parseInt(localStorage.progress)>=12))
				{
					localStorage.setItem("progress", "12");
				}
			}
		}

		/* reverse Borg cube, and move forward with camera
		   to appear like fast over-taking (as video POV is
		   moving fast toward earth at this point after a paused
		   - hovering) */
		if (progressTime > 24.5 && progressTime < 28)
		{
			clog("Camera overtaking",1);

			borg.position.z = borg.position.z +(2*transformRate);
			camera.position.z = camera.position.z -(2*transformRate);
			if (borg.scale.x < (initscale+1))
			{
				borg.scale.x = borg.scale.x + transformRate / 5;
				borg.scale.y = borg.scale.y + transformRate / 5;
				borg.scale.z = borg.scale.z + transformRate / 5;
			}
		}

		/* we only moved the Borg camera so-far behind our camera 
		   view; now we can move it forward again back into view
		   ... just reversing polarities of "motion" for same
		   ... time period as before */
		if (progressTime > 40 && progressTime < 43.5)
		{
			clog("Borg back in view",1);
			if (!makeBigCloserToEarth)
			{
				makeBigCloserToEarth = true;
				borg.scale.x = 6;
				borg.scale.y = 6;
				borg.scale.z = 6;
			}

			borg.position.z = borg.position.z -(2*transformRate);
			camera.position.z = camera.position.z +(2*transformRate);
		}

		/* originally when playing with Google Earth, I went down
		  to street view level, but my partner dissuaded me not to 
		  show the house.  The video just goes to the end of the street,
		  and then pulls out.  I feel like I need to do something more here,
		  so I've put in a pause, and a placeholder message ... TODO ...
		  IDEAS include key-binding (touch screen?) and giving the viewer
		  an option?  Could cut video short - even have another cued in a playlist? */
		if (progressTime > 101.3)
		{
			// TODO: something/choice maybe?

			if (!pausedOnce)
			{
				pausedOnce = true;
				player.pauseVideo();

				jq2(function( $ ) 
				{
					setTimeout(function() {
						$("#player-message").hide("fast", function(){});
						player.playVideo();
						afterPause = true;
					}, pauseTime);
					var message="TODO! This is a work in progress. And harder than expected!";
					$("#player-message").html(message);
					$("#player-message").show("fast", function(){});
				});
			}
		}

		/* as the video camera POV rushes back, after pausing the video
		   at the end of my street, I want the Borg cube to appear still
		   at the same vertical level (approx), and move it off to one side */
		if (progressTime > 101.3 && progressTime < 110 && afterPause)
		{
			borg.position.x = borg.position.x +((progressTime-101.3)*5*transformRate);
			camera.position.z = camera.position.z +(20*transformRate);
		}

		/* at the last moment, while we hover over the entirety of the uk
		   I want the Borg cube to appear from a vanishing-point, 
		   (remember we've been moving away from it fast for nearly
		   9 seconds ... and rush straight at us ... dramatic finale */
		if (progressTime > 117 && afterPause)
		{
			borg.position.set(-2,0,2);
			camera.position.z = camera.position.z -(100*transformRate);
		}
	}

	function tumble(transformRate)
	{
		clog("tumbling",3);
		borg.rotation.x += transformRate;
		borg.rotation.y += transformRate;
	}
} // end of action()


// relies on global vars e.g. initscale, borg, camera, scene
function startBorg() 
{
	clog("Starting the Borg cube",1);

	var textureLoader = new THREE.TextureLoader();
	var texture0 = textureLoader.load( projectUrl + "2014-me-at-work256.png" ); // right
	var texture1 = textureLoader.load( projectUrl + "borgcube256.png" ); // left
	var texture2 = textureLoader.load( projectUrl + "borgcube256.png" ); // top
	var texture3 = textureLoader.load( projectUrl + "borgcube256.png" ); // bottom
	var texture4 = textureLoader.load( projectUrl + "borgcube256.png" ); // back
	var texture5 = textureLoader.load( projectUrl + "borgcube256.png" ); // front

	var materials = [
		//new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
		new THREE.MeshBasicMaterial( { map: texture0 } ),
		new THREE.MeshBasicMaterial( { map: texture1 } ),
		new THREE.MeshBasicMaterial( { map: texture2 } ),
		new THREE.MeshBasicMaterial( { map: texture3 } ),
		new THREE.MeshBasicMaterial( { map: texture4 } ),
		new THREE.MeshBasicMaterial( { map: texture5 } )
	];
	var multiMaterial = new THREE.MultiMaterial( materials );
	
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	borg = new THREE.Mesh( geometry, multiMaterial );
	borg.scale.set(initscale,initscale,initscale);

	scene.add( borg );
	camera.position.z = 5;
}


// limit pace of handling resizing
// Also, interested in: https://github.com/marcj/css-element-queries
var resizeTimeout;
var oldHeight = 0;
var oldWidth = 0;	
function resizeHandler()
{
	var w = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

	var h = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

	if (w < (0.95*oldWidth) || w > (1.05*oldWidth) ||
	    h < (0.95*oldHeight) || h > (1.05*oldHeight))
	{
		oldWidth = w;
		oldHeight = h;
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function()
		{
			redimension();
		}, 1000);
	}
}

/* this "redimension" I've done  (like this whole script lol) 
   is very ...hackish !!! (And probably pointless / unneccessary).
   need to refactor / rethink ... using viewport vh and trying
   to allow for mobile phone re-orientation ... but has to be a
   powerful phone to run this stuff anyway (and Chrome)

   SOMETHING FUNNY HAPPENING WITH THREE.JS ... 
   seems to do its own resize event even without the helper ...
   I set borders to go on player-container, and play-cover with
   extraDebug set to 2 or more.  I notice resizing is active with
   player-cover (which is the three.js container) no matter what I set
   the resizeHandler Timeout too.  Might have to revisit using
   the THREEx (three.js extension) for resize and work around it?

   Want to resize player-container and player-cover and player etc.
   AT THE SAME TIME ... computationally expensive ... so ... hmmm */

function redimension()
{
	clog("redimension",1);
jq2(function( $ ) 
{
	if($("#player-container").length)
	{
		clog("resizing",1);

		$("div.entry-content").css("height", "50%");
		$("div.entry-content").css("max-height", "100vh"); // more assumptions (supported)

		// clog("window height is " + $(window).height(),2);

		$("#player-container").css("width",688);
		$("#player-container").height(0.95* $(window).height());


		var actualHeight = $("#player-container").height();
		if(actualHeight < 1080)
		{
			$("#player-container").width((actualHeight/1080)*688);
		}
		else
		{
			$("#player-container").height(1080);
		}

		// check again in case changing the width changed height
		// or if the height got set to 1080
		actualHeight = $("#player-container").height();
		var actualWidth = $("#player-container").width();
		if(actualWidth < 688)
		{
			var potentialHeight = (actualWidth/688)*1080;
			if(potentialHeight < actualHeight)
			{
				actualHeight = potentialHeight;
				$("#player-container").height(actualHeight);
				
			}
		}

		// these elements might be separately removed/"destroyed"
		if ($("#player-cover").length)
		{
			$("#player-cover").height(actualHeight);
			$("#player-cover").width(actualWidth);

			if (!(typeof camera ==="undefined" || camera ===null))
			{
				// notify the renderer of the size change
				renderer.setSize( actualWidth, actualHeight );
				// update the camera
				camera.aspect	= actualWidth / actualHeight;
				camera.updateProjectionMatrix();
			}
		}
	
		if ($("#player").length)
		{
			$("#player").height(actualHeight);
			$("#player").width(actualWidth);
		}
		
		if ($("#warpdrive").length)
		{
			$("#warpdrive").height(actualHeight);
			$("#warpdrive").width(actualWidth);
		}

		if( $("#player-time").length)
		{
			$("html, body").animate({ scrollTop: $("#player-time").offset().top}, "slow" );
		}
		else
		{
			$("html, body").animate({ scrollTop: $("#player-container").offset().top}, "slow" );
		}
		
	}

	

}); // end jq2(function( $ ) ...
}   // end redimension

jq2(function( $ ) 
{
	$( window ).resize(resizeHandler).resize();
}); // end jq2(function( $ ) ..


