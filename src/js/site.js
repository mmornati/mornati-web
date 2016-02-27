var GitHubList = {
	initialized : false,
	latestCommit : false,
	pull : function() {
		GitHubList.initialized = true;
		$.get('https://api.github.com/users/mmornati/events', function(commits) {
			var code = $('#githubcommit');
			code.addClass('loading');
			var commitIndex = 0, fadeLength = 500;
			$.each(commits, function(i) {
				var date = Date.parse(this.created_at);
				if(this.type == 'PushEvent' && this.repo.id && (!GitHubList.latestCommit || GitHubList.latestCommit < date)) {
					// If it's a PushEvent, AND we haven't seen it before, add it to the list
					commitIndex += 1;
					var date = new Date(Date.parse(this.created_at));
					var codeItem = $('<div class="commit"><span class="repository">' + this.repo.name + '</span><div class="date">' + (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()) + '</div><div class="message" title="' + this.payload.commits[0].sha + '">' + this.payload.commits[0].sha + '</div></div>');
					var codeDescription = $('<div class="commit-description"></div>');
					codeDescription.append('<p>' + this.repo.name + '</p>');
					var repoUrl = this.repo.url.replace(/api.github.com\/repos/g, 'github.com');
					codeDescription.append('<p><a class="link" href="' + repoUrl + '">' + repoUrl + '</a></p>');
					var commitUrl = this.payload.commits[0].url.replace(/api.github.com\/repos/g, 'github.com');

					$.get(this.payload.commits[0].url, function(commContent) {
						$.each(commContent.files, function(i) {
							codeDescription.append('<p>' + this.filename + '</p><code>' + this.patch + '</code><p><a targ="_blank" href="' + this.blob_url + '">View Commit</a></p>');
						});
				  });
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
		});
	}
}


function getFeedNewsBlock() {
$.jQRSS('https://blog.mornati.net/feed/', { count: 3 }, function (newsFeed) {
    if (!newsFeed) return false;

    var nbc = $("#blogfeed").empty();
    for (var i = 0; i < newsFeed.entries.length; i++) {
        var entry = newsFeed.entries[i];

        var author = entry['author'] ? entry['author'] : "",
            categories = entry['categories'] ? entry['categories'] : new Array(),
            content = entry['content'] ? entry['content'] : "",
            contentSnippet = entry['contentSnippet'] ? entry['contentSnippet'] : "",
            link = entry['link'] ? entry['link'] : "",
            publishedDate = entry['publishedDate'] ? entry['publishedDate'] : "",
            title = entry['title'] ? entry['title'] : "";

        /*  author, categories, content, contentSnippet, link, publishedDate, title  */
	/*
	<article class="span4 post"> <img class="img-news" src="img/blog_img-01.jpg" alt="">
            <div class="inside">
              <p class="post-date"><i class="icon-calendar"></i> March 17, 2013</p>
              <h2>A girl running on a road</h2>
              <div class="entry-content">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. &hellip;</p>
                <a href="#" class="more-link">read more</a> </div>
            </div>
            <!-- /.inside -->
          </article>
	*/
	nbc.append("<article class='span4 post'>" +
        	"<div class='inside'>" +
		"<p class='post-date'><i class='icon-calendar'></i> " + publishedDate + "</p>" +
		"<h2>" + title +"</h2>" +
		"<div class='entry-content'>" +
		"<p>" + contentSnippet +"</p>" +
		"<a href='" + link + "' class='more-link'>read more</a> </div>" +
		"</div>" +
		"</article>");
    }
});
}
/*
$("#btnUpdateNewsBlock").on("click", function (e) {
    var bakUp = $(".news-block .content").html();
    $(".news-block .content").empty();
    setTimeout(function () { getFeedNewsBlock(); }, 1000);
    if ($(".news-block .content").children.length == 0) $(".news-block .content").html(bakUp);
});
*/
function getObjectLength(obj) {
    if (typeof obj != "object") return false;
    var i = 0;
    for (x in obj) i++;
    return i;
}

function createFeatures(targetParent) {
    var features = {};
    $.jQRSS('https://api.flickr.com/services/feeds/photos_public.gne?id=58792031@N04&lang=en-us&format=rss_200', { count: 6 }, function (newsFeed) {
        if (!newsFeed) return false;
        var entries;
        if (newsFeed["entries"]) { entries = newsFeed.entries } else { return false; }
        //console.log(newsFeed);
        for (x in entries) {
            var entry = entries[x];
            features[x] = {};
            features[x].title = entry.title;
            features[x].image = {
                alt: entry.contentSnippet,
                nfo: entry.mediaGroups[0].contents[0].credits[0].content + " "
            + entry.content.substr(
                entry.content.indexOf("(Photo by "),
                entry.content.substring(entry.content.indexOf("(Photo by ")).indexOf("</p>")
            ).replace("(", "").replace(")", ""),
                src: entry.mediaGroups[0].contents[0].url,
                title: entry.title
            };
            features[x].blurb = entry.mediaGroups[0].contents[0].description;
            features[x].links = {};
            features[x].links[0] = {
                src: entry.link,
                target: "_blank",
                text: "flickr"
            };
        }

        var ulIndex = $("<ul />").addClass("index");
        if (getObjectLength(features) > 0) {
            for (x in features) {
                var block = features[x],
                    liIndex = $("<li />").append($("<a />").prop("href", "javascript:void(0);")).appendTo(ulIndex);
                feature = $("<div />").addClass("feature").appendTo(targetParent);

                if (x == 0) {
                    feature.addClass("selected");
                    liIndex.addClass("selected");
                }

                if (block["title"]) {
                    $("<h2 />").addClass("title").text(block["title"]).prependTo(feature);
                }

                if (block["image"]) {
                    var image = $("<div />").addClass("image").appendTo(feature);
                    image.prepend($("<img />"));
                    image.append($("<p />"));
                    if (block["image"]["alt"]) {
                        image.children("img").prop("alt", block["image"]["alt"]);
                    }
                    if (block["image"]["nfo"]) {
                        image.children("p").text(block["image"]["nfo"]);
                    }
                    if (block["image"]["src"]) {
                        image.children("img").prop("src", block["image"]["src"]);
                    }
                    if (block["image"]["title"]) {
                        image.children("img").prop("title", block["image"]["title"]);
                    }
                }

                if (block["blurb"]) {
                    $("<p />").addClass("blurb").text(block["blurb"]).appendTo(feature);
                }

                if (block["links"]) {
                    if (block["links"][0]) {
                        var links = $("<ul />").addClass("links").appendTo(feature);
                        for (y in block["links"]) {
                            var link = block["links"][y],
                                li = $("<li />").append($("<a />")).appendTo(links);
                            if (link["src"]) {
                                li.children("a").prop("href", link["src"]);
                            }
                            if (link["target"]) {
                                li.children("a").prop("target", link["target"]);
                            }
                            if (link["text"]) {
                                li.children("a").text(link["text"]);
                            }
                        }
                    }
                }
            }
        }
        ulIndex.appendTo(targetParent);
    });
}

var tmrFeatures, subTmrFeatures;
function goToNextFeature() {
    var curFeature = $("#TopFeaturesBlock .feature.selected").removeClass("selected"),
        curIndex = $("#TopFeaturesBlock .index .selected").removeClass("selected"),
        nexFeature = (curFeature.nextAll('div').first().length) ? curFeature.nextAll('div').first() : $("#TopFeaturesBlock .feature").first(),
        nexIndex = $("#TopFeaturesBlock .index li").filter(function (i) { return i == nexFeature.index(); });

    nexFeature.addClass("selected");
    nexIndex.addClass("selected");

    curFeature.stop().fadeOut("slow");
    nexFeature.stop().fadeIn("slow");
};
function featureIndex_Click(e) {
    var $this = $(this),
        oldFeature = $("#TopFeaturesBlock .feature.selected").removeClass("selected"),
        newFeature = $("#TopFeaturesBlock .feature").filter(function (i) { return i == $this.parent().index(); }).addClass("selected");

    $("#TopFeaturesBlock .index li").removeClass("selected")
        .filter(function (i) { return i == $this.parent().index(); }).addClass("selected");
    oldFeature.stop().fadeOut("slow");
    newFeature.stop().fadeIn("slow");

    clearInterval(tmrFeatures);
    clearTimeout(subTmrFeatures);
    subTmrFeatures = setTimeout(function () { tmrFeatures = setInterval(function () { goToNextFeature(); }, 5000); }, 15000);
};



	jQuery(document).ready(function($) {

		    $("a[rel^='prettyPhoto']").prettyPhoto();

		    // Localscrolling
    		$('#nav-main, .brand').localScroll();
     		$('#profile, .container').localScroll();

		$("#flickrbox").empty();
    markeclaudioFlickrBox("10615322@N07");
		if(!GitHubList.initialized) {
			GitHubList.pull();
		}

		getFeedNewsBlock();

	});

//createFeatures($("#TopFeaturesBlock").empty());
//$("#TopFeaturesBlock .index a").on("click", featureIndex_Click);
//tmrFeatures = setInterval(function () { goToNextFeature(); }, 5000);
