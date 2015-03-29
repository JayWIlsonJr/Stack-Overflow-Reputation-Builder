$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
    // zero out results if previous search has run
    $('.results').html('');
    // get the value of the tags the user submitted
    var tags = $(this).find("input[name='tags']").val();
    getUnanswered(tags);
  });


	// Get list of users who provide top answers by tag.
	$('.inspiration-getter').on('submit', function() {
		// Empty out the search-results div before adding new search results.
		$('.results').html('');
		// capture the value the user entering into the input field on the page.
		var answerers = $(this).find("input[name='answerers']").val();
		//Passes the value the user entered to the getAnswers function.
		getAnswerers(answerers);
	});
});


// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
  
  // clone our result template code
  var result = $('.templates .question').clone();
  
  // Set the question properties in result
  var questionElem = result.find('.question-text a');
  questionElem.attr('href', question.link);
  questionElem.text(question.title);

  // set the date asked property in result
  var asked = result.find('.asked-date');
  var date = new Date(1000*question.creation_date);
  asked.text(date.toString());

  // set the #views for question property in result
  var viewed = result.find('.viewed');
  viewed.text(question.view_count);

  // set some properties related to asker
  var asker = result.find('.asker');
  asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
                          question.owner.display_name +
                        '</a>' +
              '</p>' +
              '<p>Reputation: ' + question.owner.reputation + '</p>'
  );

  return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
  var results = resultNum + ' results for <strong>' + query;
  return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
  var errorElem = $('.templates .error').clone();
  var errorText = '<p>' + error + '</p>';
  errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
  
  // the parameters we need to pass in our request to StackOverflow's API
  var request = {tagged: tags,
                site: 'stackoverflow',
                order: 'desc',
                sort: 'creation'};
  
  var result = $.ajax({
    url: "http://api.stackexchange.com/2.2/questions/unanswered",
    data: request,
    dataType: "jsonp",
    type: "GET",
    })
  .done(function(result){
    var searchResults = showSearchResults(request.tagged, result.items.length);

    $('.search-results').html(searchResults);

    $.each(result.items, function(i, item) {
      var question = showQuestion(item);
      $('.results').append(question);
    });
  })
  .fail(function(jqXHR, error, errorThrown){
    var errorElem = showError(error);
    $('.search-results').append(errorElem);
  });
};





var showUser = function(userObject) {
	var result = $('.templates .reputation-dl').clone();

	var reputationElem = result.find('.reputation');
	reputationElem.text(userObject.reputation);

	var userNameElem = result.find('.display-name');
	userNameElem.text(userObject.display_name);

	var profileLinkElem = result.find('.profile-link a');
	profileLinkElem.attr('href', userObject.link);
	profileLinkElem.text(userObject.link);

	var userTypeElem = result.find('.user-type');
	userTypeElem.text(userObject.user_type);

	var profileImageElem = result.find('.profile-image img');
	profileImageElem.attr('src', userObject.profile_image);
	profileImageElem = result.find('.profile-image a');
	profileImageElem.attr('href', userObject.link);

	return result;
};

var showError = function(error) {
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// Takes a single tag as a param to be searched for on Stack Overflow
var getAnswerers = function(answerers) {

	var result = $.ajax({
		url: 'http://api.stackexchange.com/2.2/tags/' + answerers + '/top-answerers/all_time?site=stackoverflow', 
		dataType: 'jsonp',
		type: 'GET'
	})
	.done(function(result) {

		$.each(result.items, function(i, item) {
			var userResult = showUser(item.user);
			$('.results').append(userResult);
		});
	})
	.fail(function(jqXHR, error, errorThrown) {
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



