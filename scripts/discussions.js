//Author: Carson Streiff cdstreif@asu.edu
//Date: 5.23.2023

//fetches a single discussion given discussion ID
async function getDiscussion(discussionNum){

	//extract course number from current url
	courseNum = window.location.pathname.match("[0-9]+")[0];

	//request and return a discussion json
	const response = await fetch("https://asu.instructure.com/api/v1/courses/" + courseNum + "/discussion_topics/" + discussionNum,{method: 'GET',mode: 'no-cors'});
	return response.json();

}

//fetches a single group category given its group ID
async function getGroup(groupNum){

	//request and return a group category json
	const response = await fetch("https://asu.instructure.com/api/v1/group_categories/" + groupNum, {method: 'GET',mode:'no-cors'});
	return response.json();

}


//extracts discussion ID from passed html element, requests discussion and associated group, inserts their info into page html
function updateDiscussions(elt){

	//obtain discussion ID from element href
	pathName = elt.pathname;
	num = pathName.match("/discussion_topics/[0-9]+")[0].match("[0-9]+")[0];

	//request discussion using discussion ID
	discussion = getDiscussion(num);

	//asynchronous wait
	discussion.then((value1) => {
		
		//if a group ID exists, we have a group assignment
		if(value1['group_category_id']){

			//fetch group category info
			group = getGroup(value1['group_category_id']);

			//asynchronous wait
			group.then((value2) => {
				//insert info after title of assignment
				elt.after(" - Group Discussion - " + value2['name']);
			});
		}

	});

}



//scans for relevant html elements, then calls updateDiscussions
function begin(){

	//get all elements of class "fOyUs_bGBk fbyHH_bGBk fbyHH_vIby". These are the link elements

	let target = document.getElementsByClassName("fOyUs_bGBk fbyHH_bGBk fbyHH_vIby");
	
	//console.log(target);

	//iterate through relevant elements, update all of them
	for(elt of target){
		updateDiscussions(elt);
	}

}

//startup script checks if url is valid, waits 3sec before starting the main script
if(/^\/courses\/[0-9]+\/discussion_topics/.test(window.location.pathname)){
	console.log("GroupView loaded - Discussion page detected");
	window.onload=setTimeout(begin,3000);
}