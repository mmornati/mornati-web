$(document).ready(function() {
	$("ul.tabs").tabs("div.panes > div");
	twitter();
	if(!GitHubList.initialized) {
		GitHubList.pull();
	}
	markeclaudioFlickrBox("10615322@N07");

});
function twitter() {
	var twitterJSON = document.createElement("script");
	twitterJSON.type = "text/javascript"
	//here's the search URL
	twitterJSON.src = "http://search.twitter.com/search.json?callback=twitterSearch&q=mornati"
	document.getElementsByTagName("head")[0].appendChild(twitterJSON);
	return false;
}

function twitterSearch(obj) {
	//this is the div I'm writing the content to
	var tDiv = document.getElementById("tweets");
	var user, bgcolor, tweet, postedAt, icon, userURL;
	//start the ul
	tDiv.innerHTML = "<ul>"
	var maxTweets = 7;
	if(obj.results.length < maxTweets) {
		maxTweets = obj.results.length;
	}
	for( i = 0; i < maxTweets; i++) {
		//Look at me use the JavaScript modulus operator to do even/odd rows.
		if(i % 2) {
			bgcolor = "#efefef"
		} else {
			bgcolor = "#ddd"
		}
		//we need to get some data out of the object
		//and populate some variables.
		//i could do this inline in the string below,
		//but this is way easier for you to read
		icon = obj.results[i].profile_image_url;
		user = obj.results[i].from_user;
		userURL = "http://twitter.com/" + user;
		tweet = obj.results[i].text;
		postedAt = obj.results[i].created_at;
		//and here I mash it all up into a fancy li
		tDiv.innerHTML += "<li style='background-color:" + bgcolor + "; background-image: url(" + icon + "); background-repeat:no-repeat;'><strong><a href='" + userURL + "'>" + user + "</a></strong>: " + tweet + " <span class='time'>(" + postedAt + " GMT)</span> </li>";
	}
	//and close the UL
	tDiv.innerHTML += "</ul>";
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
