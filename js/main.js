$(document).ready(function() {
	$("ul.tabs").tabs("div.panes > div");
	twitter_jquery();
	if(!GitHubList.initialized) {
		GitHubList.pull();
	}
	markeclaudioFlickrBox("10615322@N07");

	$('.typeimage').click(function() {
		$("#bsod").show();
		$("#bsod").click(function() {
			$('#bsod').hide();
		});
	});
});
function twitter_jquery() {
	var twitter_api_url = 'http://search.twitter.com/search.json';

	// Enable caching
	$.ajaxSetup({
		cache : true
	});

	// Send JSON request
	// The returned JSON object will have a property called "results" where we find
	// a list of the tweets matching our request query
	$.getJSON(twitter_api_url + '?callback=?&q=mornati', function(data) {
		var user, bgcolor, tweet, postedAt, icon, userURL;
		$('#tweets').empty();
		$('#tweets').append("<ul>");
		$.each(data.results, function(i, tweet) {
			// Uncomment line below to show tweet data in Fire Bug console
			// Very helpful to find out what is available in the tweet objects
			console.log(tweet);

			// Before we continue we check that we got data
			if(tweet.text != undefined) {

				// Build the html string for the current tweet
				var tweet_html
				if(i % 2) {
					bgcolor = "#efefef"
				} else {
					bgcolor = "#ddd"
				}
				icon = tweet.profile_image_url;
				user = tweet.from_user;
				userURL = "http://twitter.com/" + user;
				tweet_text = tweet.text;
				postedAt = tweet.created_at;
				//and here I mash it all up into a fancy li
				tweet_html = "<li style='background-color:" + bgcolor + "; background-image: url(" + icon + "); background-repeat:no-repeat;'><strong><a href='" + userURL + "'>" + user + "</a></strong>: " + tweet_text + " <span class='time'>(" + postedAt + " GMT)</span> </li>";

				// Append html string to tweet_container div
				$('#tweets').append(tweet_html);
			}
			
		});
		$('#tweets').append("</ul>");
	});
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
