$(document).ready(function() {
    addClickMenu();
	$("#profile").animate({ height: 'show', opacity: 'show' }, 'slow');
	changeImage('profile');

	$('#areaimage').click(function() {
		$("#content").hide();
		$("#navigation").hide();
		$("#bsod").show();
		$("#bsod").click(function() {
			$('#bsod').hide();
			$("#navigation").show();
			$("#content").show();
		});
	});
	
	$("#closeimage").click(function() {
		$("#content").hide();
		$("#credits").hide();
		$("#navigation").hide();
		$("#gameover").show();
		$("#gameover").click(function() {
			$("html").unbind();	
			$('#gameover').hide();
			$("#navigation").show();
			$('#content').show();
			$("#credits").show();
		});	
		$("html").keypress(function(e) {
  			var code = (e.keyCode ? e.keyCode : e.which);
  			if (code == 13) {
  				$("html").unbind();	
  				window.location.replace("games/MonkeyGame.html");	
  			} else {
  				alert("Wasn't the right key to play hidden game...");
  				$("html").unbind();	
  			}
  			
		});	
	});
	
	$('#navigation a').stop().animate({'marginLeft':'-85px'},1000);

    $('#navigation > li').hover(
     	function () {
        	$('a',$(this)).stop().animate({'marginLeft':'-2px'},200);
        },
        function () {
        	$('a',$(this)).stop().animate({'marginLeft':'-85px'},200);
        }
    );
    
});

function addClickMenu() {
    $("#profilelink").click(function() {
    	if ($("#tweetcontainer").is(":visible")) {
    		$("#tweetcontainer").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#flickrbox").is(":visible")) {
    		$("#flickrbox").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#code").is(":visible")) {
    		$("#code").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#networks").is(":visible")) {
            $("#networks").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        }
    	$("#profile").animate({ height: 'show', opacity: 'show' }, 'slow');
    	changeImage('profile');
    });

    $("#twitterlink").click(function() {
        if ($("#profile").is(":visible")) {
              $("#profile").animate({ height: 'hide', opacity: 'hide' }, 'slow');
          } else if ($("#networks").is(":visible")) {
    		$("#networks").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#flickrbox").is(":visible")) {
    		$("#flickrbox").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#code").is(":visible")) {
    		$("#code").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	}
    	$("#tweetcontainer").animate({ height: 'show', opacity: 'show' }, 'slow');
    	changeImage('twitter');
    });

    $("#gallerylink").click(function() {
    	if ($("#networks").is(":visible")) {
    		$("#networks").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#tweetcontainer").is(":visible")) {
    		$("#tweetcontainer").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#code").is(":visible")) {
    		$("#code").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#profile").is(":visible")) {
            $("#profile").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        }
    	$("#flickrbox").animate({ height: 'show', opacity: 'show' }, 'slow');
    	$("#flickrbox").empty();
    	markeclaudioFlickrBox("10615322@N07");
    	changeImage('flickr');
    });

    $("#codelink").click(function() {
    	if ($("#networks").is(":visible")) {
    		$("#networks").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#tweetcontainer").is(":visible")) {
    		$("#tweetcontainer").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#flickrbox").is(":visible")) {
    		$("#flickrbox").animate({ height: 'hide', opacity: 'hide' }, 'slow');
    	} else if ($("#profile").is(":visible")) {
            $("#profile").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        }
    	$("#code").animate({ height: 'show', opacity: 'show' }, 'slow');
    	changeImage('code');
    	if(!GitHubList.initialized) {
			GitHubList.pull();
		}
    });

    $("#networklink").click(function() {
        if ($("#profile").is(":visible")) {
            $("#profile").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        } else if ($("#tweetcontainer").is(":visible")) {
            $("#tweetcontainer").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        } else if ($("#flickrbox").is(":visible")) {
            $("#flickrbox").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        } else if ($("#code").is(":visible")) {
            $("#code").animate({ height: 'hide', opacity: 'hide' }, 'slow');
        }
        $("#networks").animate({ height: 'show', opacity: 'show' }, 'slow');
        changeImage('network');
    });
}

function loadLinkedinData() {
    IN.API.Profile("me").result(function(result) {
      $("#profile").html('<script type="IN/FullMemberProfile" data-id="' + result.values[0].id + '"></script>');
      IN.parse(document.getElementById("profile"))
   })
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
}

var GitHubList = {
	initialized : false,
	latestCommit : false,
	pull : function() {
		GitHubList.initialized = true;
		// TODO: Catch JSON parser errors - why doesn't jQuery offer something for this?
		$.getScript('http://github.com/mmornati.json?callback=GitHubList.parseData&' + (new Date() - 1.0), function() {

		});
	},
	parseData : function(commits) {
		var code = $('#code');
		code.addClass('loading');
		var commitIndex = 0, fadeLength = 500;
		$.each(commits, function(i) {
			var date = Date.parse(this.created_at);
			if(this.type == 'PushEvent' && this.repository && (!GitHubList.latestCommit || GitHubList.latestCommit < date)) {
				// If it's a PushEvent, AND we haven't seen it before, add it to the list
				commitIndex += 1;
				var date = new Date(Date.parse(this.created_at));
				var codeItem = $('<div class="commit"><span class="repository">' + this.repository.name + '</span><div class="date">' + (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()) + '</div><div class="message" title="' + this.payload.shas[0][2] + '">' + this.payload.shas[0][2] + '</div></div>');
				var codeDescription = $('<div class="commit-description"></div>');
				if(this.repository.description != '') {
					codeDescription.append('<p>' + this.repository.description + '</p>');
				} else {
					// codeDescription.append("<p>&lt;I'm apparently too lazy to add a description&gt;</p>");
				}
				codeDescription.append('<p><a class="link" href="' + this.repository.url + '">' + this.repository.url + '</a></p>');
				codeDescription.append('<p>' + this.payload.head + '</p><code>' + this.payload.shas[0][2] + '</code><p><a href="' + this.url + '">View Commit</a></p>');
				code.append(codeItem.hide());
				code.append(codeDescription.hide());
				codeItem.click(function(event) {
					event.preventDefault();
					if(codeItem.hasClass('active')) {
						codeItem.removeClass('active');
						codeDescription.slideUp();
					} else {
						codeItem.addClass('active');
						codeDescription.slideDown();
						code.scrollTo(codeItem, 200);
					}
				});
				var timeoutFunction = function() {
					codeItem.fadeIn(fadeLength);
				};
				setTimeout(timeoutFunction, commitIndex * (fadeLength / 5));
				this.latestCommit = this.id;
			}
		});
		setTimeout(function() {
			code.removeClass('loading');
		}, commitIndex * (fadeLength / 5));
		// Pull again in 20 minutes
		setTimeout(GitHubList.pull, 1200000);
	}
};

function changeImage(area) {
	if (area=='twitter') {
		$('#areaimage').attr('src', 'images/typeimages/twitter.png');
	} else if (area=='flickr') {
		$('#areaimage').attr('src', 'images/typeimages/gallery.png');	
	} else if (area=='code') {
		$('#areaimage').attr('src', 'images/typeimages/github.png');	
	} else if (area=='network') {
		$('#areaimage').attr('src', 'images/typeimages/network.png');	
	} else if (area=='profile') {
        $('#areaimage').attr('src', 'images/typeimages/profile.png');
    }
}
