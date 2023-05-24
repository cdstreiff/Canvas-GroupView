//Author: Carson Streiff cdstreif@asu.edu
//Date: 5.23.2023

//fetches a single assignment given its assignment ID
async function getAssignment(assignmentNum){

	//extract course number from current url
	courseNum = window.location.pathname.match("[0-9]+")[0];

	//request and return an assignment json
	const response = await fetch("https://asu.instructure.com/api/v1/courses/" + courseNum + "/assignments/" + assignmentNum,{method: 'GET',mode: 'no-cors'});
	return response.json();

}

//fetches a single group category given its group ID
async function getGroup(groupNum){

	//request and return a group category json
	const response = await fetch("https://asu.instructure.com/api/v1/group_categories/" + groupNum, {method: 'GET',mode:'no-cors'});
	return response.json();

}

//extracts assignment ID from passed html element, requests assignment and associated group, inserts their info into page html 
function updateAssignments(elt){
	
	//obtain assignment ID from element href
	pathName = elt.pathname;
	num = pathName.match("/assignments/[0-9]+")[0].match("[0-9]+")[0];
	
	//console.log(elt);
	//console.log(num);

	//request assignment using assignment ID
	assignment = getAssignment(num);

	//asynchronous wait
	assignment.then((value1) => {
		
		//check for existing group category ID, a valid value indicates that this is a group assignment (not a discussion or individual assignment)
		if(value1['group_category_id']){

			//request group category info
			group = getGroup(value1['group_category_id']);

			//asynchronous wait
			group.then((value2) => {
				
				//insert text and group info into html	
				elt.innerHTML = elt.text + " <span style=\"color: #f073e3\"> - Group Assignment - " + value2['name'] + " </span>";	
			});

		//check if submission type is a discussion
		} else if(value1['submission_types'][0] == 'discussion_topic'){

			//check if it is a group discussion
			if(value1['discussion_topic']['group_category_id']){

				//request group category info
				group = getGroup(value1['discussion_topic']['group_category_id']);

				//asynchronous wait
				group.then((value2) => {
						
					//insert text and group info into html				
					elt.innerHTML = elt.text + " <span style=\"color: #f073e3\"> - Group Discussion - " + value2['name'] + " </span>";
				});
			}
		}
	});	
}


//scans for relevant html elements, then calls updateAssignments
function begin(){

	//get all ig-title elements (these are the titles of the entries on the page)
	let target = document.getElementsByClassName("ig-title");
	console.log("Starting CarsonView");

	//console.log(target);

	//iterate through relevant elements, update all of them
	for(elt of target){
		updateAssignments(elt);
	}
}


//startup script checks if url is valid, waits 3sec before starting the main script
if(/^\/courses\/[0-9]+\/assignments/.test(window.location.pathname)){
	console.log("GroupView loaded - Assignment page detected");
	window.onload=setTimeout(begin,3000);
}

